import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  selectedLine: string;
  setSelectedLine: (line: string) => void;
  selectedShift: number;
  setSelectedShift: (shift: number) => void;
  openAlertsCount: number;
  refreshAlertsCount: () => void;
  quickView: boolean;
  setQuickView: (val: boolean | ((prev: boolean) => boolean)) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ps010_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<number>(1);
  const [openAlertsCount, setOpenAlertsCount] = useState<number>(0);
  const [quickView, setQuickView] = useState<boolean>(() => localStorage.getItem('ps010_quick_view') === 'true');
  const [highContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem('ps010_high_contrast') === 'true');

  useEffect(() => {
    localStorage.setItem('ps010_quick_view', String(quickView));
  }, [quickView]);

  useEffect(() => {
    localStorage.setItem('ps010_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('foundry-high-contrast');
    } else {
      document.documentElement.classList.remove('foundry-high-contrast');
    }
  }, [highContrast]);

  const refreshAlertsCount = async () => {
    try {
      const alerts = await api.getAlerts(selectedLine !== 'ALL' ? selectedLine : undefined, 'OPEN');
      setOpenAlertsCount(alerts.length);
    } catch {
      // ignore in offline/unauthorized state
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('ps010_token');
      if (storedToken) {
        try {
          const me = await api.getMe();
          setUser(me);
          refreshAlertsCount();
        } catch {
          // Token invalid, login default demo admin
          await switchRole('admin');
        }
      } else {
        // Auto-login default admin for seamless immediate demo access
        await switchRole('admin');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);
    localStorage.setItem('ps010_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    refreshAlertsCount();
  };

  const logout = () => {
    localStorage.removeItem('ps010_token');
    setToken(null);
    setUser(null);
  };

  const switchRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const creds: Record<UserRole, { u: string; p: string }> = {
        operator: { u: 'operator', p: 'operator123' },
        quality_engineer: { u: 'quality_engineer', p: 'quality123' },
        supervisor: { u: 'supervisor', p: 'super123' },
        quality_manager: { u: 'admin', p: 'admin123' },
        admin: { u: 'admin', p: 'admin123' },
      };
      const { u, p } = creds[role] || creds['admin'];
      await login(u, p);
    } catch (err) {
      console.error('Failed to switch role', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        selectedLine,
        setSelectedLine,
        selectedShift,
        setSelectedShift,
        openAlertsCount,
        refreshAlertsCount,
        quickView,
        setQuickView,
        highContrast,
        setHighContrast,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
