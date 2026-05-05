'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  phone?: string;
  first_name: string;
  last_name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Charger l'utilisateur au démarrage
  const loadUser = useCallback(async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getProfile();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Connexion
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      if (response.success) {
        Cookies.set('access_token', response.access_token, { expires: 1 });
        if (response.refresh_token) {
          Cookies.set('refresh_token', response.refresh_token, { expires: 30 });
        }
        setUser(response.user);
        return { success: true };
      }
      
      return { success: false, message: response.message || 'Erreur de connexion' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, message };
    }
  };

  // Inscription
  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      
      if (response.success) {
        if (response.access_token) {
          Cookies.set('access_token', response.access_token, { expires: 1 });
          if (response.refresh_token) {
            Cookies.set('refresh_token', response.refresh_token, { expires: 30 });
          }
          setUser(response.user);
        }
        return { success: true };
      }
      
      return { success: false, message: response.message || 'Erreur d\'inscription' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur d\'inscription';
      return { success: false, message };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setUser(null);
    }
  };

  // Rafraîchir l'utilisateur
  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
