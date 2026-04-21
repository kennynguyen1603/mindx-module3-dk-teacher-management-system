import { useState } from 'react';
import type { ITeacher } from '@mern/shared';
import { useTeachers } from '../hooks/useTeachers.js';
import { TeacherFormModal } from '../components/TeacherFormModal.js';
import './Teachers.css';

const DEGREE_ORDER = ['Tiến sĩ', 'Thạc sĩ', 'Cử nhân', 'Cao đẳng', 'Trung cấp'];

const getHighestDegree = (degrees: any[]) => {
  if (!degrees?.length) return null;
  return [...degrees].sort((a, b) => {
    const ai = DEGREE_ORDER.indexOf(a.type);
    const bi = DEGREE_ORDER.indexOf(b.type);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  })[0];
};

const getPositionName = (pos: any): string | null => {
  if (!pos) return null;
  if (typeof pos === 'object' && pos.name) return pos.name;
  return null;
};

export const Teachers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const limit = 10;

  const { teachers, total, loading, error, refetch } = useTeachers({ page, search, limit });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const openCreate = () => {
    setSelectedTeacher(null);
    setFormMode('create');
    setShowForm(true);
  };
  const openDetail = (t: ITeacher) => {
    setSelectedTeacher(t);
    setFormMode('edit');
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setSelectedTeacher(null);
  };
  const onSuccess = () => {
    closeForm();
    refetch();
  };

  const startPage = Math.max(1, Math.min(page - 1, totalPages - 2));
  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => startPage + i,
  );

  return (
    <div className="t-page">
      <div className="t-toolbar">
        <label className="t-search-box">
          <svg className="t-search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M14 14l3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            className="t-search-input"
            placeholder="Tìm kiếm thông tin"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <button className="t-btn-ghost" onClick={refetch}>
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
          Tải lại
        </button>
        <button className="t-btn-primary" onClick={openCreate}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z" />
          </svg>
          Tạo mới
        </button>
      </div>

      {error && <div className="t-error">{error}</div>}

      <div className="t-table-wrap">
        <table className="t-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Giáo viên</th>
              <th>Trình độ (cao nhất)</th>
              <th>Bộ môn</th>
              <th>
                TT Công tác <span className="th-info">ⓘ</span>
              </th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="t-loading">
                  <div className="t-spinner" />
                  <span>Đang tải dữ liệu...</span>
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={8} className="t-empty">
                  Không tìm thấy dữ liệu
                </td>
              </tr>
            ) : (
              teachers.map((t) => {
                const deg = getHighestDegree([...(t.degrees || [])]);
                const posName = t.positions?.map(getPositionName).find(Boolean);
                return (
                  <tr key={t._id}>
                    <td className="td-code">{t.code}</td>
                    <td className="td-teacher">
                      <div className="teacher-cell">
                        <div className="t-avatar">
                          <span>{t.name?.[0] || '?'}</span>
                        </div>
                        <div className="t-info">
                          <strong>{t.name}</strong>
                          <span>{t.email}</span>
                          <span>{t.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {deg ? (
                        <div className="degree-info">
                          <span>Bậc: {deg.type}</span>
                          <span className="t-muted">Chuyên ngành: {deg.major}</span>
                        </div>
                      ) : (
                        <span className="t-na">—</span>
                      )}
                    </td>
                    <td>
                      <span className="t-na">N/A</span>
                    </td>
                    <td>{posName || '—'}</td>
                    <td>{t.address}</td>
                    <td>
                      <span className={`t-badge ${t.isActive ? 'badge-on' : 'badge-off'}`}>
                        {t.isActive ? 'Đang công tác' : 'Nghỉ việc'}
                      </span>
                    </td>
                    <td>
                      <button className="t-btn-detail" onClick={() => openDetail(t)}>
                        <svg viewBox="0 0 22 16" fill="none">
                          <path
                            d="M1 8C1 8 4.5 2 11 2C17.5 2 21 8 21 8C21 8 17.5 14 11 14C4.5 14 1 8 1 8Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <circle cx="11" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="t-pagination">
        <span className="t-total">Tổng: {total}</span>
        <div className="t-pages">
          <button
            className="t-pg-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹
          </button>
          {visiblePages.map((n) => (
            <button
              key={n}
              className={`t-pg-btn ${n === page ? 'active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="t-pg-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </button>
        </div>
        <span className="t-perpage">10 / trang ▾</span>
      </div>

      {showForm && (
        <TeacherFormModal
          teacher={selectedTeacher}
          mode={formMode}
          onClose={closeForm}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};
