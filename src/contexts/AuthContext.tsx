import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { apiService } from '@/services/api';

interface AuthContextValue {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = apiService.getToken();
    if (token) {
      apiService
        .getMe()
        .then((user) => setCurrentUser(user))
        .catch(() => apiService.clearToken())
        .finally(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { user } = await apiService.login(username, password);
    setCurrentUser(user);
  };

  const register = async (username: string, password: string) => {
    const { user } = await apiService.register(username, password);
    setCurrentUser(user);
  };

  const logout = () => {
    apiService.clearToken();
    setCurrentUser(null);
  };

  const updateCurrentUser = (user: User) => {
    setCurrentUser(user);
  };

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(160deg, #fdf6ee 0%, #fce8d5 100%)',
        }}
      >
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            border: '3px solid var(--color-primary-pale)',
            borderTop: '3px solid var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoggedIn: !!currentUser, login, register, logout, updateCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
