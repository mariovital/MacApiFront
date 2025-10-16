// /contexts/AuthContext.jsx - Contexto de Autenticación

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

// 1. CREAR CONTEXTO
const AuthContext = createContext(null);

// 2. PROVIDER COMPONENT
export const AuthProvider = ({ children }) => {
  // Estado del contexto
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funciones del contexto
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(credentials);
      
      if (userData.success) {
        setUser(userData.data.user);
        localStorage.setItem('token', userData.data.token);
        localStorage.setItem('refreshToken', userData.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(userData.data.user));
        
        // Configurar header de autorización por defecto
        api.defaults.headers.Authorization = `Bearer ${userData.data.token}`;
        
        return userData.data.user;
      } else {
        throw new Error(userData.message || 'Error en el login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error de conexión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local siempre
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      delete api.defaults.headers.Authorization;
      
      // Redirigir al login
      window.location.href = '/login';
    }
  };

  const refreshUserProfile = async () => {
    try {
      const profileData = await authService.getProfile();
      if (profileData.success) {
        setUser(profileData.data);
      }
    } catch (error) {
      console.error('Error refrescando perfil:', error);
    }
  };

  // Verificar token al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token) {
        try {
          // Configurar header
          api.defaults.headers.Authorization = `Bearer ${token}`;
          
          // Intentar restaurar usuario desde localStorage primero
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Error parseando usuario guardado:', e);
            }
          }
          
          // Intentar obtener perfil actualizado (opcional, no crítico)
          try {
            const profileData = await authService.getProfile();
            if (profileData.success) {
              setUser(profileData.data);
              localStorage.setItem('user', JSON.stringify(profileData.data));
            }
          } catch (error) {
            // Si falla el profile pero tenemos token, mantener sesión
            console.warn('No se pudo obtener perfil, manteniendo sesión local:', error.message);
            // No eliminar token, mantener sesión
          }
        } catch (error) {
          console.error('Error inicializando autenticación:', error);
          // Solo limpiar si el error es crítico
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            delete api.defaults.headers.Authorization;
            setUser(null);
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Valor del contexto
  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUserProfile,
    isAuthenticated: !!user,
    setError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. CUSTOM HOOK - Exportado por separado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
