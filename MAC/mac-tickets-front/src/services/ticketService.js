// /services/ticketService.js - Servicio para manejo de tickets

import api from './api';

const ticketService = {
  // Obtener lista de tickets con filtros y paginación
  getTickets: async (params = {}) => {
    try {
      const response = await api.get('/tickets', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tickets:', error);
      throw error;
    }
  },

  // Obtener estadísticas de tickets
  getTicketStats: async () => {
    try {
      const response = await api.get('/tickets/stats');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Obtener ticket por ID
  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ticket:', error);
      throw error;
    }
  },

  // Crear nuevo ticket
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creando ticket:', error);
      throw error;
    }
  },

  // Actualizar ticket
  updateTicket: async (ticketId, updates) => {
    try {
      const response = await api.put(`/tickets/${ticketId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error actualizando ticket:', error);
      throw error;
    }
  },

  // Cambiar estado de ticket
  updateTicketStatus: async (ticketId, statusId, reason = '') => {
    try {
      const response = await api.patch(`/tickets/${ticketId}/status`, {
        status_id: statusId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error cambiando estado:', error);
      throw error;
    }
  },

  // Asignar ticket a técnico
  assignTicket: async (ticketId, technicianId, reason = '') => {
    try {
      const response = await api.post(`/tickets/${ticketId}/assign`, {
        assigned_to: technicianId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error asignando ticket:', error);
      throw error;
    }
  },

  // Agregar comentario
  addComment: async (ticketId, comment, isInternal = false) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/comments`, {
        comment,
        is_internal: isInternal
      });
      return response.data;
    } catch (error) {
      console.error('Error agregando comentario:', error);
      throw error;
    }
  },

  // Subir archivo
  uploadAttachment: async (ticketId, file, description = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  }
};

export default ticketService;

