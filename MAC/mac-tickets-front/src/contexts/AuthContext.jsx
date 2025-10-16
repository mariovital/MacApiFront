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
        
        console.log('✅ LOGIN: Usuario guardado en localStorage:', userData.data.user.email);
        console.log('✅ LOGIN: Token guardado');
        
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
      // LOG PERSISTENTE: Inicio
      sessionStorage.setItem('auth_init_start', new Date().toISOString());
      
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // LOG PERSISTENTE: Estado inicial
      sessionStorage.setItem('auth_has_token', token ? 'YES' : 'NO');
      sessionStorage.setItem('auth_has_user', storedUser ? 'YES' : 'NO');
      
      console.log('🔄 AUTH INIT:', {
        hasToken: !!token,
        hasStoredUser: !!storedUser,
        timestamp: new Date().toISOString()
      });
      
      if (token && storedUser) {
        // Configurar header inmediatamente
        api.defaults.headers.Authorization = `Bearer ${token}`;
        sessionStorage.setItem('auth_header_set', 'YES');
        
        // Restaurar usuario desde localStorage INMEDIATAMENTE
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          sessionStorage.setItem('auth_user_restored', 'YES');
          sessionStorage.setItem('auth_user_email', parsedUser.email);
          console.log('✅ Usuario restaurado desde localStorage:', parsedUser.email);
        } catch (e) {
          sessionStorage.setItem('auth_parse_error', e.message);
          console.error('❌ Error parseando usuario guardado:', e);
        }
        
        // CRÍTICO: Marcar como NO loading inmediatamente después de restaurar
        setLoading(false);
        sessionStorage.setItem('auth_loading_set_false', 'YES');
        console.log('✅ Loading set to FALSE - UI should render');
        
        // Actualizar perfil en segundo plano (completamente opcional)
        setTimeout(async () => {
          try {
            const profileData = await authService.getProfile();
            if (profileData.success) {
              setUser(profileData.data);
              localStorage.setItem('user', JSON.stringify(profileData.data));
              sessionStorage.setItem('auth_profile_updated', 'YES');
              console.log('✅ Perfil actualizado desde API');
            }
          } catch (error) {
            sessionStorage.setItem('auth_profile_error', error.message);
            console.warn('⚠️ No se pudo actualizar perfil (sesión local activa):', error.message);
          }
        }, 100);
      } else if (token && !storedUser) {
        // Tenemos token pero no user - problema
        console.error('❌ PROBLEMA: Token exists but user missing');
        sessionStorage.setItem('auth_error', 'TOKEN_WITHOUT_USER');
        setLoading(false);
      } else {
        // No hay token, marcar como NO loading
        console.log('⚠️  No token found - user should see login');
        sessionStorage.setItem('auth_no_token', 'YES');
        setLoading(false);
      }
      
      sessionStorage.setItem('auth_init_complete', new Date().toISOString());
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
