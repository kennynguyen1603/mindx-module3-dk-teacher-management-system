import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

interface LoginPageProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm
        onSuccess={onSuccess}
        onSwitchToRegister={onSwitchToRegister}
      />
    </AuthLayout>
  );
};

export default LoginPage;
