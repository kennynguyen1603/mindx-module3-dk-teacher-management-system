import { useState, useEffect, useRef } from 'react';
import type { ITeacher, IDegree } from '@mern/shared';

import { useCreateTeacher, useUpdateTeacher } from '../hooks/useTeachers.js';
import { useActivePositions } from '../hooks/useTeacherPositions.js';
import { TeacherDegreeTable } from './TeacherDegreeTable.js';
import { TeacherDegreeForm } from './TeacherDegreeForm.js';
import { toHtmlDate, getInitials } from '../utils/formatters.js';
import './TeacherFormModal.css';

interface Props {
  teacher: ITeacher | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
}

const emptyDegree = (): IDegree => ({
  type: 'Cử nhân',
  school: '',
  major: '',
  year: new Date().getFullYear(),
  isGraduated: true,
});

export const TeacherFormModal: React.FC<Props> = ({
  teacher,
  mode,
  onClose,
  onSuccess,
}) => {
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
        dob: toHtmlDate(teacher.dob),
        positions: (teacher.positions || []).map((p: string | { _id: string }) =>
          typeof p === 'string' ? p : p._id,
        ),

        degrees: teacher.degrees || [],
        isActive: teacher.isActive,
        startDate: toHtmlDate(teacher.startDate),
        endDate: toHtmlDate(teacher.endDate),
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
        // Send date strings directly to let backend handle coercion
        dob: form.dob,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
      };

      if (mode === 'create') {
        await create(payload);
      } else if (teacher) {
        await update(teacher._id, payload);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      if (error.response?.data?.error?.details) {
        const backendErrors: Record<string, string> = {};
        error.response.data.error.details.forEach((d: { field: string; message: string }) => {
          backendErrors[d.field || 'unknown'] = d.message;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      }
    }
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
        <div className="drawer-header">
          <button className="drawer-close" onClick={onClose}>
            ×
          </button>
          <span className="drawer-title">
            {mode === 'create'
              ? 'Tạo thông tin giáo viên'
              : 'Cập nhật giáo viên'}
          </span>
        </div>

        <form className="drawer-body" onSubmit={handleSubmit}>
          {formError && <div className="form-error-banner">{formError}</div>}

          {/* Avatar + Personal Info */}
          <div className="section-avatar-row">
            <div className="avatar-col">
              <div
                className="avatar-preview"
                onClick={() => fileRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder-lg">
                    {getInitials(form.name)}
                  </div>
                )}
              </div>
              <div
                className="upload-btn"
                onClick={() => fileRef.current?.click()}
              >
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
                  {errors.name && (
                    <span className="err-msg">{errors.name}</span>
                  )}
                </div>
                <div className="fg">
                  <label>* Ngày sinh</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setField('dob', e.target.value)}
                    className={errors.dob ? 'err' : ''}
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
                  {errors.email && (
                    <span className="err-msg">{errors.email}</span>
                  )}
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
            <div className="form-grid-2">
              <div className="fg">
                <label>* Vị trí công tác</label>
                <div className="position-select-wrap">
                  <select
                    className="position-select"
                    disabled={loadingPositions}
                    value={form.positions[0] || ''}
                    onChange={(e) =>
                      setField(
                        'positions',
                        e.target.value ? [e.target.value] : [],
                      )
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
              <div className="fg">
                <label>* Ngày bắt đầu</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setField('startDate', e.target.value)}
                  className={errors.startDate ? 'err' : ''}
                />
                {errors.startDate && (
                  <span className="err-msg">{errors.startDate}</span>
                )}
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
              <TeacherDegreeForm
                degree={degreeForm}
                onChange={(data) => setDegreeForm((d) => ({ ...d, ...data }))}
                onAdd={addDegree}
                onCancel={() => {
                  setShowDegreeForm(false);
                  setDegreeForm(emptyDegree());
                }}
              />
            )}

            <TeacherDegreeTable
              degrees={form.degrees}
              onRemove={removeDegree}
            />
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

