import React from 'react';
import type { IUser } from '@mern/shared';

interface AuthContextProps {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
