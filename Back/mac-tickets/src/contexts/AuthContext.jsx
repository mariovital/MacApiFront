// /contexts/AuthContext.jsx - Contexto de Autenticación

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

// 1. CREAR CONTEXTO
const AuthContext = createContext();

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
      
      if (token) {
        try {
          // Configurar header
          api.defaults.headers.Authorization = `Bearer ${token}`;
          
          // Verificar token obteniendo perfil
          const profileData = await authService.getProfile();
          
          if (profileData.success) {
            setUser(profileData.data);
          } else {
            // Token inválido
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            delete api.defaults.headers.Authorization;
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          // Token inválido o expirado
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.Authorization;
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

// 3. CUSTOM HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
