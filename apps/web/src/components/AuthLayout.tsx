import React from 'react';
import './Auth.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">📚</div>
            </div>
            <h1 className="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
          </div>
          <div className="auth-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
