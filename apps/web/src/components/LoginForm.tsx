import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      setLocalError('');
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as Error)?.message || 'Login failed. Please try again.';
      setLocalError(errorMsg);
      console.error('Login error:', err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
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

      {(localError || error) && (
        <div className="form-error">{localError || error}</div>
      )}

      <button type="submit" className="form-button primary" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="form-divider">
        <span>or</span>
      </div>

      <div className="form-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="form-link"
            onClick={onSwitchToRegister}
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
