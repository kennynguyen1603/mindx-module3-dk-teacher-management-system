import React from 'react';
import type { IDegree } from '@mern/shared';

interface Props {
  degrees: IDegree[];
  onRemove: (index: number) => void;
}

export const TeacherDegreeTable: React.FC<Props> = ({ degrees, onRemove }) => {
  return (
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
        {degrees.length === 0 ? (
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
          degrees.map((deg, i) => (
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
                  onClick={() => onRemove(i)}
                >
                  ×
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
