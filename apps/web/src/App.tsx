import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import type { Theme } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Teachers } from './pages/Teachers';
import { TeacherPositions } from './pages/TeacherPositions';
import './App.css';
import './index.css';

type AppPage = 'teachers' | 'positions';
type AuthPage = 'login' | 'register';

const SunIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden>
    <path
      d="M17 12.5A7 7 0 0 1 7.5 3a7 7 0 1 0 9.5 9.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SystemIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect x="2" y="3" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 17h6M10 14v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const THEMES: { value: Theme; label: string; Icon: React.FC }[] = [
  { value: 'light', label: 'Sáng', Icon: SunIcon },
  { value: 'dark', label: 'Tối', Icon: MoonIcon },
  { value: 'system', label: 'Hệ thống', Icon: SystemIcon },
];

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-toggle" role="group" aria-label="Chọn giao diện">
      {THEMES.map(({ value, label, Icon }) => (
        <button
          key={value}
          className={`theme-btn ${theme === value ? 'theme-btn-active' : ''}`}
          onClick={() => setTheme(value)}
          title={label}
          aria-pressed={theme === value}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<AuthPage>('login');
  const [activePage, setActivePage] = useState<AppPage>('teachers');

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return currentPage === 'login' ? (
      <LoginPage
        onSuccess={() => {}}
        onSwitchToRegister={() => setCurrentPage('register')}
      />
    ) : (
      <RegisterPage
        onSuccess={() => setCurrentPage('login')}
        onSwitchToLogin={() => setCurrentPage('login')}
      />
    );
  }

  return (
    <div className="main-layout">
      <nav className="main-nav">
        <div className="nav-brand">
          <div className="nav-brand-mark"><span>MX</span></div>
          <span className="nav-brand-name">MindX</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activePage === 'teachers' ? 'nav-tab-active' : ''}`}
            onClick={() => setActivePage('teachers')}
          >
            Danh sách giáo viên
          </button>
          <button
            className={`nav-tab ${activePage === 'positions' ? 'nav-tab-active' : ''}`}
            onClick={() => setActivePage('positions')}
          >
            Vị trí công tác
          </button>
        </div>
        <ThemeToggle />
        <button className="nav-logout" onClick={logout}>
          Đăng xuất
        </button>
      </nav>
      <main className="main-content">
        {activePage === 'teachers' ? <Teachers /> : <TeacherPositions />}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
