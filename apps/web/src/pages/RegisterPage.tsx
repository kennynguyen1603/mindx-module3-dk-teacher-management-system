import React from 'react';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

interface RegisterPageProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  return (
    <AuthLayout title="Join Us" subtitle="Create your account to get started">
      <RegisterForm onSuccess={onSuccess} onSwitchToLogin={onSwitchToLogin} />
    </AuthLayout>
  );
};

export default RegisterPage;
