'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchApi } from '@/services/api';

export type User = {
  id: string;
  email?: string;
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN' | string;
  [key: string]: unknown;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (newUser: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // La función refreshUser mantiene la lógica de verificación de sesión
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi('/auth/verify-session');
      // Normalizamos: si tu backend devuelve { user: {...} } o directamente el objeto
      setUser(data?.user || data || null); 
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inicialización única al cargar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
  }, [refreshUser]);

  // Actualizador forzado para el Login
  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  // Login envolvente
  const login = (userData: User) => {
    updateUser(userData);
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/logout');
    } catch (e) {
      console.error("Error al cerrar sesión");
    } finally {
      setUser(null);
      // Forzamos redirección para limpiar estados persistentes
      window.location.replace('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};