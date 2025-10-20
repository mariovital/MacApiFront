// /services/pdfService.js

import api from './api';

const pdfService = {
  /**
   * Genera y descarga el PDF de un ticket
   * @param {number} ticketId - ID del ticket
   * @returns {Promise<Blob>} - Blob del PDF
   */
  generateTicketPDF: async (ticketId) => {
    try {
      const response = await api.get(`/pdf/ticket/${ticketId}`, {
        responseType: 'blob' // Importante para recibir archivos binarios
      });
      return response.data;
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw error;
    }
  },

  /**
   * Descarga el PDF directamente en el navegador
   * @param {number} ticketId - ID del ticket
   * @param {string} ticketNumber - Número del ticket para el nombre del archivo
   */
  downloadTicketPDF: async (ticketId, ticketNumber) => {
    try {
      const blob = await pdfService.generateTicketPDF(ticketId);
      
      // Crear URL temporal para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento <a> temporal para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = `Ticket_${ticketNumber}_${Date.now()}.pdf`;
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error descargando PDF:', error);
      throw error;
    }
  },

  /**
   * Obtiene información sobre PDFs generados de un ticket
   * @param {number} ticketId - ID del ticket
   * @returns {Promise<Object>} - Información del PDF
   */
  getTicketPDFInfo: async (ticketId) => {
    try {
      const response = await api.get(`/pdf/ticket/${ticketId}/info`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo info de PDF:', error);
      throw error;
    }
  }
};

export default pdfService;

