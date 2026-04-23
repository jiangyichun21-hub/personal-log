import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { storageService } from '@/services/storage';

interface AuthContextValue {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = storageService.getCurrentUserId();
    if (userId) {
      const user = storageService.getUserById(userId);
      if (user) setCurrentUser(user);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = storageService.getUserByEmail(email);
    if (!user) throw new Error('该邮箱未注册');
    if (user.password !== password) throw new Error('密码错误');
    storageService.setCurrentUserId(user.id);
    setCurrentUser(user);
  };

  const register = async (username: string, email: string, password: string) => {
    const existing = storageService.getUserByEmail(email);
    if (existing) throw new Error('该邮箱已被注册');
    const newUser: User = {
      id: storageService.generateId(),
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: '',
      createdAt: new Date().toISOString(),
      friendIds: [],
    };
    storageService.createUser(newUser);
    storageService.setCurrentUserId(newUser.id);
    setCurrentUser(newUser);
  };

  const logout = () => {
    storageService.clearCurrentUser();
    setCurrentUser(null);
  };

  const updateCurrentUser = (user: User) => {
    storageService.updateUser(user);
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn: !!currentUser, login, register, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
