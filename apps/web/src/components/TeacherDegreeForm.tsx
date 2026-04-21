import React from 'react';
import type { IDegree } from '@mern/shared';
import { DEGREE_TYPES } from '../utils/constants.js';

interface Props {
  degree: IDegree;
  onChange: (data: Partial<IDegree>) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export const TeacherDegreeForm: React.FC<Props> = ({
  degree,
  onChange,
  onAdd,
  onCancel,
}) => {
  return (
    <div className="degree-form">
      <div className="form-grid-3">
        <div className="fg">
          <label>Bậc</label>
          <select
            value={degree.type}
            onChange={(e) => onChange({ type: e.target.value })}
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
            value={degree.school}
            placeholder="Tên trường"
            onChange={(e) => onChange({ school: e.target.value })}
          />
        </div>
        <div className="fg">
          <label>Chuyên ngành</label>
          <input
            value={degree.major}
            placeholder="Ngành học"
            onChange={(e) => onChange({ major: e.target.value })}
          />
        </div>
        <div className="fg">
          <label>Năm tốt nghiệp</label>
          <input
            type="number"
            value={degree.year}
            onChange={(e) => onChange({ year: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="fg">
          <label>Trạng thái</label>
          <select
            value={degree.isGraduated ? '1' : '0'}
            onChange={(e) => onChange({ isGraduated: e.target.value === '1' })}
          >
            <option value="1">Đã tốt nghiệp</option>
            <option value="0">Đang học</option>
          </select>
        </div>
      </div>
      <div className="degree-form-actions">
        <button type="button" className="btn-cancel-sm" onClick={onCancel}>
          Hủy
        </button>
        <button type="button" className="btn-add-degree" onClick={onAdd}>
          + Thêm
        </button>
      </div>
    </div>
  );
};
