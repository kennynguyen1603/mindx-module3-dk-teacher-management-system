import { useState } from 'react';
import type { ITeacherPosition } from '@mern/shared';
import {
  useTeacherPositions,
  useCreatePosition,
  useUpdatePosition,
} from '../hooks/useTeacherPositions.js';
import './TeacherPositions.css';

interface DrawerProps {
  position: ITeacherPosition | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
  creating: boolean;
  updating: boolean;
  formError: string | null;
  onCreate: (data: any) => Promise<any>;
  onUpdate: (id: string, data: any) => Promise<any>;
}

const PositionDrawer: React.FC<DrawerProps> = ({
  position,
  mode,
  onClose,
  onSuccess,
  creating,
  updating,
  formError,
  onCreate,
  onUpdate,
}) => {
  const [form, setForm] = useState({
    code: position?.code || '',
    name: position?.name || '',
    des: position?.des || '',
    isActive: position?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isBusy = creating || updating;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = 'Bắt buộc';
    if (!form.name.trim()) e.name = 'Bắt buộc';
    if (!form.des.trim()) e.des = 'Bắt buộc';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (mode === 'create') await onCreate(form);
      else if (position) await onUpdate(position._id, form);
      onSuccess();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="pos-overlay" onClick={onClose}>
      <div className="pos-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="pos-header">
          <button className="pos-close" onClick={onClose}>
            ×
          </button>
          <span className="pos-title">Vị trí công tác</span>
        </div>
        <form className="pos-body" onSubmit={handleSubmit}>
          {formError && <div className="pos-error">{formError}</div>}

          <div className="pos-field">
            <label>* Mã</label>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              disabled={mode === 'edit'}
              className={errors.code ? 'err' : ''}
            />
            {errors.code && <span className="pos-err-msg">{errors.code}</span>}
          </div>

          <div className="pos-field">
            <label>* Tên</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={errors.name ? 'err' : ''}
            />
            {errors.name && <span className="pos-err-msg">{errors.name}</span>}
          </div>

          <div className="pos-field">
            <label>* Mô tả</label>
            <textarea
              rows={4}
              value={form.des}
              onChange={(e) => setForm((f) => ({ ...f, des: e.target.value }))}
              className={errors.des ? 'err' : ''}
            />
            {errors.des && <span className="pos-err-msg">{errors.des}</span>}
          </div>

          <div className="pos-field">
            <label>* Trạng thái</label>
            <div className="pos-toggle-group">
              <button
                type="button"
                className={`pos-toggle-btn ${form.isActive ? 'pos-toggle-active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, isActive: true }))}
              >
                Hoạt động
              </button>
              <button
                type="button"
                className={`pos-toggle-btn ${!form.isActive ? 'pos-toggle-off' : ''}`}
                onClick={() => setForm((f) => ({ ...f, isActive: false }))}
              >
                Ngừng
              </button>
            </div>
          </div>

          <div className="pos-footer">
            <button type="submit" className="pos-btn-save" disabled={isBusy}>
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

export const TeacherPositions = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] =
    useState<ITeacherPosition | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const { positions, loading, error, refetch } = useTeacherPositions({});
  const { create, loading: creating, error: createError } = useCreatePosition();
  const { update, loading: updating, error: updateError } = useUpdatePosition();

  const openCreate = () => {
    setEditingPosition(null);
    setFormMode('create');
    setShowForm(true);
  };

  const openEdit = (pos: ITeacherPosition) => {
    setEditingPosition(pos);
    setFormMode('edit');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPosition(null);
  };

  const onSuccess = () => {
    closeForm();
    refetch();
  };

  return (
    <div className="pos-page">
      <div className="pos-toolbar">
        <button className="pos-btn-create" onClick={openCreate}>
          + Tạo
        </button>
        <button className="pos-btn-refresh" onClick={refetch}>
          <svg viewBox="0 0 20 20" fill="none">
            <path
              d="M3.5 10a6.5 6.5 0 1 1 1 3.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M4 15v-4.5h4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Làm mới
        </button>
      </div>

      {error && <div className="pos-page-error">{error}</div>}

      <div className="pos-table-wrap">
        <table className="pos-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Tên</th>
              <th>Trạng thái</th>
              <th>Mô tả</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="pos-loading">
                  Đang tải...
                </td>
              </tr>
            ) : positions.length === 0 ? (
              <tr>
                <td colSpan={6} className="pos-empty">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              positions.map((pos, idx) => (
                <tr key={pos._id}>
                  <td className="pos-stt">{idx + 1}</td>
                  <td className="pos-code">{pos.code}</td>
                  <td className="pos-name">{pos.name}</td>
                  <td>
                    <span
                      className={`pos-badge ${pos.isActive ? 'pos-badge-on' : 'pos-badge-off'}`}
                    >
                      {pos.isActive ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td className="pos-des">{pos.des}</td>
                  <td className="pos-actions">
                    <button
                      className="pos-gear-btn"
                      onClick={() => openEdit(pos)}
                      title="Chỉnh sửa"
                    >
                      <svg viewBox="0 0 20 20" fill="none">
                        <path
                          d="M8.325 3.317a1.75 1.75 0 0 1 3.35 0l.23.86a1.75 1.75 0 0 0 2.607.99l.774-.474a1.75 1.75 0 0 1 2.37 2.37l-.474.774a1.75 1.75 0 0 0 .99 2.607l.86.23a1.75 1.75 0 0 1 0 3.35l-.86.23a1.75 1.75 0 0 0-.99 2.607l.474.774a1.75 1.75 0 0 1-2.37 2.37l-.774-.474a1.75 1.75 0 0 0-2.607.99l-.23.86a1.75 1.75 0 0 1-3.35 0l-.23-.86a1.75 1.75 0 0 0-2.607-.99l-.774.474a1.75 1.75 0 0 1-2.37-2.37l.474-.774a1.75 1.75 0 0 0-.99-2.607l-.86-.23a1.75 1.75 0 0 1 0-3.35l.86-.23a1.75 1.75 0 0 0 .99-2.607l-.474-.774a1.75 1.75 0 0 1 2.37-2.37l.774.474a1.75 1.75 0 0 0 2.607-.99l.23-.86z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="10"
                          cy="10"
                          r="2.25"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <PositionDrawer
          position={editingPosition}
          mode={formMode}
          onClose={closeForm}
          onSuccess={onSuccess}
          creating={creating}
          updating={updating}
          formError={createError || updateError}
          onCreate={create}
          onUpdate={update}
        />
      )}
    </div>
  );
};
