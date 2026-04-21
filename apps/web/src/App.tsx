import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Teachers } from './pages/Teachers';
import { TeacherPositions } from './pages/TeacherPositions';
import './App.css';
import './index.css';

type AppPage = 'teachers' | 'positions';
type AuthPage = 'login' | 'register';

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
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
