import { useState, useEffect, useRef } from 'react';
import type { ITeacher, IDegree } from '@mern/shared';
import { useCreateTeacher, useUpdateTeacher } from '../hooks/useTeachers.js';
import { useActivePositions } from '../hooks/useTeacherPositions.js';
import './TeacherFormModal.css';

interface Props {
  teacher: ITeacher | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
}

const DEGREE_TYPES = ['Tiến sĩ', 'Thạc sĩ', 'Cử nhân', 'Cao đẳng', 'Trung cấp'];

const emptyDegree = () => ({
  type: 'Cử nhân',
  school: '',
  major: '',
  year: new Date().getFullYear(),
  isGraduated: true,
});

export const TeacherFormModal: React.FC<Props> = ({ teacher, mode, onClose, onSuccess }) => {
  const { create, loading: creating, error: createError } = useCreateTeacher();
  const { update, loading: updating, error: updateError } = useUpdateTeacher();
  const { positions, loading: loadingPositions } = useActivePositions();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    identity: '',
    dob: '',
    positions: [] as string[],
    degrees: [] as IDegree[],
    isActive: true,
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDegreeForm, setShowDegreeForm] = useState(false);
  const [degreeForm, setDegreeForm] = useState(emptyDegree());
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'edit' && teacher) {
      setForm({
        name: teacher.name,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        address: teacher.address,
        identity: teacher.identity,
        dob: teacher.createdAt
          ? new Date(teacher.createdAt).toISOString().split('T')[0]
          : '',
        positions: teacher.positions.map((p: any) =>
          typeof p === 'string' ? p : p._id,
        ),
        degrees: teacher.degrees || [],
        isActive: teacher.isActive,
        startDate: teacher.startDate
          ? new Date(teacher.startDate).toISOString().split('T')[0]
          : '',
        endDate: teacher.endDate
          ? new Date(teacher.endDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [teacher, mode]);

  const setField = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Bắt buộc';
    if (!form.email.trim()) e.email = 'Bắt buộc';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Bắt buộc';
    if (!form.address.trim()) e.address = 'Bắt buộc';
    if (!form.identity.trim()) e.identity = 'Bắt buộc';
    if (!form.dob) e.dob = 'Bắt buộc';
    if (!form.startDate) e.startDate = 'Bắt buộc';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = {
        ...form,
        dob: new Date(form.dob),
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
      };
      if (mode === 'create') await create(payload);
      else if (teacher) await update(teacher._id, payload);
      onSuccess();
    } catch {}
  };

  const addDegree = () => {
    if (!degreeForm.school.trim() || !degreeForm.major.trim()) return;
    setField('degrees', [...form.degrees, { ...degreeForm }]);
    setDegreeForm(emptyDegree());
    setShowDegreeForm(false);
  };

  const removeDegree = (i: number) =>
    setField(
      'degrees',
      form.degrees.filter((_, idx) => idx !== i),
    );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formError = createError || updateError;
  const isBusy = creating || updating;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <button className="drawer-close" onClick={onClose}>
            ×
          </button>
          <span className="drawer-title">
            {mode === 'create' ? 'Tạo thông tin giáo viên' : 'Cập nhật giáo viên'}
          </span>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          {formError && <div className="form-error-banner">{formError}</div>}

          {/* Avatar + Personal Info */}
          <div className="section-avatar-row">
            <div className="avatar-col">
              <div className="avatar-preview" onClick={() => fileRef.current?.click()}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder-lg">
                    {form.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="upload-btn" onClick={() => fileRef.current?.click()}>
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 13V4M10 4l-3 3M10 4l3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 16h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Upload file</span>
                <strong>Chọn ảnh</strong>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </div>

            <div className="personal-info-col">
              <div className="section-divider">
                <span>Thông tin cá nhân</span>
              </div>

              <div className="form-grid-2">
                <div className="fg">
                  <label>* Họ và tên</label>
                  <input
                    value={form.name}
                    placeholder="VD: Nguyễn Văn A"
                    onChange={(e) => setField('name', e.target.value)}
                    className={errors.name ? 'err' : ''}
                  />
                  {errors.name && <span className="err-msg">{errors.name}</span>}
                </div>
                <div className="fg">
                  <label>* Ngày sinh</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setField('dob', e.target.value)}
                    className={errors.dob ? 'err' : ''}
                    placeholder="Chọn ngày sinh"
                  />
                  {errors.dob && <span className="err-msg">{errors.dob}</span>}
                </div>
                <div className="fg">
                  <label>* Số điện thoại</label>
                  <input
                    value={form.phoneNumber}
                    placeholder="Nhập số điện thoại"
                    onChange={(e) => setField('phoneNumber', e.target.value)}
                    className={errors.phoneNumber ? 'err' : ''}
                  />
                  {errors.phoneNumber && (
                    <span className="err-msg">{errors.phoneNumber}</span>
                  )}
                </div>
                <div className="fg">
                  <label>* Email</label>
                  <input
                    type="email"
                    value={form.email}
                    placeholder="example@school.edu.vn"
                    onChange={(e) => setField('email', e.target.value)}
                    className={errors.email ? 'err' : ''}
                  />
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </div>
                <div className="fg">
                  <label>* Số CCCD</label>
                  <input
                    value={form.identity}
                    placeholder="Nhập số CCCD"
                    onChange={(e) => setField('identity', e.target.value)}
                    className={errors.identity ? 'err' : ''}
                  />
                  {errors.identity && (
                    <span className="err-msg">{errors.identity}</span>
                  )}
                </div>
                <div className="fg">
                  <label>* Địa chỉ</label>
                  <input
                    value={form.address}
                    placeholder="Địa chỉ thường trú"
                    onChange={(e) => setField('address', e.target.value)}
                    className={errors.address ? 'err' : ''}
                  />
                  {errors.address && (
                    <span className="err-msg">{errors.address}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="form-section">
            <div className="section-divider">
              <span>Thông tin công tác</span>
            </div>
            <div className="fg">
              <label>* Vị trí công tác</label>
              <div className="position-select-wrap">
                <select
                  className="position-select"
                  disabled={loadingPositions}
                  value={form.positions[0] || ''}
                  onChange={(e) =>
                    setField('positions', e.target.value ? [e.target.value] : [])
                  }
                >
                  <option value="">Chọn các vị trí công tác</option>
                  {positions.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <svg className="select-caret" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Degrees */}
          <div className="form-section">
            <div className="section-divider-row">
              <div className="section-divider">
                <span>Học vị</span>
              </div>
              <button
                type="button"
                className="btn-them"
                onClick={() => setShowDegreeForm(true)}
              >
                Thêm
              </button>
            </div>

            {showDegreeForm && (
              <div className="degree-form">
                <div className="form-grid-3">
                  <div className="fg">
                    <label>Bậc</label>
                    <select
                      value={degreeForm.type}
                      onChange={(e) =>
                        setDegreeForm((d) => ({ ...d, type: e.target.value }))
                      }
                    >
                      {DEGREE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="fg">
                    <label>Trường</label>
                    <input
                      value={degreeForm.school}
                      placeholder="Tên trường"
                      onChange={(e) =>
                        setDegreeForm((d) => ({ ...d, school: e.target.value }))
                      }
                    />
                  </div>
                  <div className="fg">
                    <label>Chuyên ngành</label>
                    <input
                      value={degreeForm.major}
                      placeholder="Ngành học"
                      onChange={(e) =>
                        setDegreeForm((d) => ({ ...d, major: e.target.value }))
                      }
                    />
                  </div>
                  <div className="fg">
                    <label>Năm tốt nghiệp</label>
                    <input
                      type="number"
                      value={degreeForm.year}
                      onChange={(e) =>
                        setDegreeForm((d) => ({
                          ...d,
                          year: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="fg">
                    <label>Trạng thái</label>
                    <select
                      value={degreeForm.isGraduated ? '1' : '0'}
                      onChange={(e) =>
                        setDegreeForm((d) => ({
                          ...d,
                          isGraduated: e.target.value === '1',
                        }))
                      }
                    >
                      <option value="1">Đã tốt nghiệp</option>
                      <option value="0">Đang học</option>
                    </select>
                  </div>
                </div>
                <div className="degree-form-actions">
                  <button
                    type="button"
                    className="btn-cancel-sm"
                    onClick={() => {
                      setShowDegreeForm(false);
                      setDegreeForm(emptyDegree());
                    }}
                  >
                    Hủy
                  </button>
                  <button type="button" className="btn-add-degree" onClick={addDegree}>
                    + Thêm
                  </button>
                </div>
              </div>
            )}

            <table className="degree-table">
              <thead>
                <tr>
                  <th>Bậc</th>
                  <th>Trường</th>
                  <th>Chuyên ngành</th>
                  <th>Trạng thái</th>
                  <th>Tốt nghiệp</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.degrees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="degree-empty">
                      <svg viewBox="0 0 48 48" fill="none">
                        <rect
                          x="6"
                          y="10"
                          width="36"
                          height="28"
                          rx="2"
                          stroke="#d1d5db"
                          strokeWidth="2"
                        />
                        <path d="M6 18h36" stroke="#d1d5db" strokeWidth="2" />
                        <path
                          d="M14 14h4M30 14h4"
                          stroke="#d1d5db"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Trống</span>
                    </td>
                  </tr>
                ) : (
                  form.degrees.map((deg, i) => (
                    <tr key={i}>
                      <td>{deg.type}</td>
                      <td>{deg.school}</td>
                      <td>{deg.major}</td>
                      <td>{deg.isGraduated ? 'Đã tốt nghiệp' : 'Đang học'}</td>
                      <td>{deg.year}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-remove-deg"
                          onClick={() => removeDegree(i)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="drawer-footer">
            <button type="submit" className="btn-save" disabled={isBusy}>
              <svg viewBox="0 0 20 20" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 3v5h6V3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 13h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {isBusy ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
