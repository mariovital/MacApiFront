// /services/catalogService.js - Servicio para catálogos (categorías, prioridades, etc.)

import api from './api';

const catalogService = {
  // Obtener categorías
  getCategories: async () => {
    try {
      const response = await api.get('/catalog/categories');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  },

  // Obtener prioridades
  getPriorities: async () => {
    try {
      const response = await api.get('/catalog/priorities');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo prioridades:', error);
      throw error;
    }
  },

  // Obtener estados de tickets
  getTicketStatuses: async () => {
    try {
      const response = await api.get('/catalog/ticket-statuses');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estados:', error);
      throw error;
    }
  },

  // Obtener técnicos disponibles
  getTechnicians: async () => {
    try {
      const response = await api.get('/catalog/technicians');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo técnicos:', error);
      throw error;
    }
  }
};

export default catalogService;

