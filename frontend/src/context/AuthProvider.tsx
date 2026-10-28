import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './authContext';
import * as authApi from '../api/auth';
import type { RegisterPayload } from '../api/auth';
import type { User } from '../types';
import { TOKEN_KEY } from '../utils/constants';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // If a token exists, we must check it with the backend before deciding who is logged in
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    authApi
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY)) // expired or invalid token
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.loginUser({ email, password });
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
  };

  const register = async (payload: RegisterPayload) => {
    const result = await authApi.registerUser(payload);
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}   