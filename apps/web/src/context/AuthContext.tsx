import React, { useState, useEffect, type ReactNode } from 'react';
import api from '../axios';
import type { IUser } from '@mern/shared';
import { AuthContext } from '../hooks/useAuth';

interface AuthContextProps {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is authenticated on mount
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Check if there's a token in localStorage/cookies
        // If not, skip the profile check
        const token =
          localStorage.getItem('accessToken') ||
          sessionStorage.getItem('accessToken');
        if (!token) {
          setUser(null);
          setError(null);
          setLoading(false);
          return;
        }

        // Optional: If there's a token, we could validate it by calling an endpoint
        // For now, we just mark loading as complete since the backend handles token validation
        setUser(null);
        setError(null);
      } catch (err) {
        console.log('error =>', err);
        setUser(null);
        setError(null); // Silent fail on profile check
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.data.user);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login failed. Please try again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post('/auth/register', {
        email,
        password,
        name: name || email.split('@')[0],
      });
      setUser(response.data.data.user);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await api.post('/auth/logout');
      setUser(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Logout failed. Please try again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const value: AuthContextProps = {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
