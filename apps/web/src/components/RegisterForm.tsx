import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(email, password, name);
      onSuccess?.();
    } catch (err) {
      setLocalError(error || 'Registration failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input"
          disabled={loading}
        />
      </div>

      {(localError || error) && (
        <div className="form-error">{localError || error}</div>
      )}

      <button type="submit" className="form-button primary" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="form-divider">
        <span>or</span>
      </div>

      <button type="button" className="form-button google" disabled={loading}>
        <span className="google-icon">🔵</span>
        Sign up with Google
      </button>

      <div className="form-footer">
        <p>
          Already have an account?{' '}
          <button type="button" className="form-link" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
