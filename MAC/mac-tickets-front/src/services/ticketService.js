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
        technician_id: technicianId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error asignando ticket:', error);
      throw error;
    }
  },

  // Obtener comentarios de un ticket
  getComments: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
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
  },

  // Obtener lista de archivos adjuntos
  getAttachments: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/attachments`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo adjuntos:', error);
      throw error;
    }
  },

  // Descargar archivo adjunto
  downloadAttachment: async (ticketId, attachmentId, fileName) => {
    try {
      // Construir URL de descarga
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      // Crear URL con token
      const downloadUrl = `${API_BASE_URL}/tickets/${ticketId}/attachments/${attachmentId}/download?token=${token}`;
      
      // Abrir en nueva ventana para descargar
      window.open(downloadUrl, '_blank');
      
      return { success: true };
    } catch (error) {
      console.error('Error descargando archivo:', error);
      throw error;
    }
  },

  // Eliminar archivo adjunto
  deleteAttachment: async (ticketId, attachmentId) => {
    try {
      const response = await api.delete(`/tickets/${ticketId}/attachments/${attachmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      throw error;
    }
  },

  // Marcar ticket como resuelto (técnico asignado)
  resolveTicket: async (ticketId, resolutionComment, evidenceFile = null) => {
    try {
      // Si hay evidencia, subirla primero
      if (evidenceFile) {
        await ticketService.uploadAttachment(ticketId, evidenceFile, 'Evidencia de resolución');
      }

      // Marcar como resuelto
      const response = await api.post(`/tickets/${ticketId}/resolve`, {
        resolution_comment: resolutionComment
      });
      return response.data;
    } catch (error) {
      console.error('Error resolviendo ticket:', error);
      throw error;
    }
  },

  // Cerrar ticket (solo admin)
  closeTicket: async (ticketId, closeReason = '') => {
    try {
      const response = await api.post(`/tickets/${ticketId}/close`, {
        close_reason: closeReason
      });
      return response.data;
    } catch (error) {
      console.error('Error cerrando ticket:', error);
      throw error;
    }
  },

  // Reabrir ticket (solo admin)
  reopenTicket: async (ticketId, reopenReason) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/reopen`, {
        reopen_reason: reopenReason
      });
      return response.data;
    } catch (error) {
      console.error('Error reabriendo ticket:', error);
      throw error;
    }
  }
};

export default ticketService;

