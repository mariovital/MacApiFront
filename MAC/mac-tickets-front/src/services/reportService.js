// /services/reportService.js - Servicio para reportes y estadísticas

import api from './api';

const reportService = {
  /**
   * Obtener estadísticas del dashboard
   * @param {string} dateRange - Rango de fechas (7days|30days|90days|1year)
   * @returns {Promise} Estadísticas del dashboard
   */
  getDashboardStats: async (dateRange = '30days') => {
    try {
      const response = await api.get('/reports/dashboard', {
        params: { dateRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  /**
   * Exportar reporte a Excel
   * @param {string} dateRange - Rango de fechas (7days|30days|90days|1year)
   * @returns {Promise} Archivo Excel como blob
   */
  exportToExcel: async (dateRange = '30days') => {
    try {
      const response = await api.get('/reports/export', {
        params: { dateRange },
        responseType: 'blob' // Importante para manejar archivos binarios
      });
      return response.data;
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      throw error;
    }
  },

  /**
   * Descargar archivo Excel
   * @param {Blob} blob - Blob del archivo Excel
   * @param {string} dateRange - Rango de fechas para nombre del archivo
   */
  downloadExcel: (blob, dateRange = '30days') => {
    // Crear un URL temporal para el blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear un elemento <a> temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Tickets_${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Simular click para descargar
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default reportService;

