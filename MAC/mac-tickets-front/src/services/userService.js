// /services/userService.js - Servicio para gestión de usuarios

import api from './api';

const userService = {
  /**
   * Obtener lista de usuarios
   * @param {Object} params - Parámetros de filtro y paginación
   * @returns {Promise} Lista de usuarios
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener usuario por ID
   * @param {number} userId - ID del usuario
   * @returns {Promise} Datos del usuario
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} Usuario creado
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  /**
   * Actualizar usuario
   * @param {number} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise} Usuario actualizado
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  /**
   * Eliminar usuario (soft delete)
   * @param {number} userId - ID del usuario
   * @returns {Promise} Confirmación de eliminación
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },

  /**
   * Resetear contraseña de usuario
   * @param {number} userId - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise} Confirmación de reseteo
   */
  resetPassword: async (userId, newPassword) => {
    try {
      const response = await api.post(`/users/${userId}/reset-password`, {
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error reseteando contraseña:', error);
      throw error;
    }
  },

  /**
   * Cambiar estado de usuario (activar/desactivar)
   * @param {number} userId - ID del usuario
   * @param {boolean} isActive - Estado activo
   * @returns {Promise} Usuario actualizado
   */
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/users/${userId}`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      console.error('Error cambiando estado de usuario:', error);
      throw error;
    }
  }
};

export default userService;

