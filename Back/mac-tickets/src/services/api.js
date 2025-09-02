// /services/api.js - Configuración Axios base

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de error 401 - Token expirado
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    // Manejo de error 403 - Sin permisos
    if (error.response?.status === 403) {
      console.error('Acceso denegado');
    }

    return Promise.reject(error);
  }
);

export default api;
