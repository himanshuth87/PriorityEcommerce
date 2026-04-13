import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (m: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_KEY = 'priority-bags-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        let user = JSON.parse(saved) as User;
        // Fix for role updates
        const role = (user.email.toLowerCase().includes('admin') || user.email.toLowerCase() === 'himanshu@ss') ? 'admin' : 'user';
        if (user.role !== role) {
          user = { ...user, role };
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        }
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // In production, replace with API call
    // POST /api/auth/login { email, password }
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    const role = (email.toLowerCase().includes('admin') || email.toLowerCase() === 'himanshu@ss') ? 'admin' : 'user';
    const user: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      addresses: [],
      createdAt: new Date().toISOString(),
      role,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    setShowAuthModal(false);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    // In production: POST /api/auth/register { name, email, password }
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 800));
    const role = (email.toLowerCase().includes('admin') || email.toLowerCase() === 'himanshu@ss') ? 'admin' : 'user';
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      addresses: [],
      createdAt: new Date().toISOString(),
      role,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    setShowAuthModal(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, showAuthModal, setShowAuthModal, authMode, setAuthMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
