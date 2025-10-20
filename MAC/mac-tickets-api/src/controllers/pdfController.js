// /controllers/pdfController.js

import pdfService from '../services/pdfService.js';
import db from '../models/index.js';

const { Ticket } = db;

const pdfController = {
  /**
   * Genera y descarga el PDF de un ticket
   * GET /api/pdf/ticket/:id
   */
  generateTicketPDF: async (req, res) => {
    try {
      const ticketId = req.params.id;

      // Validar que el ticket existe
      const ticket = await Ticket.findByPk(ticketId);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket no encontrado'
        });
      }

      // Validar permisos: solo admin, técnico asignado o creador
      const userRole = req.user.role;
      const userId = req.user.id;

      if (userRole !== 'admin') {
        if (userRole === 'tecnico' && ticket.assigned_to !== userId) {
          return res.status(403).json({
            success: false,
            message: 'No tienes permiso para generar el PDF de este ticket'
          });
        }
        if (userRole === 'mesa_trabajo' && ticket.created_by !== userId) {
          return res.status(403).json({
            success: false,
            message: 'No tienes permiso para generar el PDF de este ticket'
          });
        }
      }

      // Generar el PDF
      const pdfDoc = await pdfService.generateTicketPDF(ticketId);

      // Actualizar contador de generación
      await Ticket.update(
        {
          pdf_generated_at: new Date(),
          pdf_generated_count: ticket.pdf_generated_count + 1
        },
        { where: { id: ticketId } }
      );

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="Ticket_${ticket.ticket_number}_${Date.now()}.pdf"`
      );

      // Stream del PDF al cliente
      pdfDoc.pipe(res);

    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error generando el PDF',
        error: error.message
      });
    }
  },

  /**
   * Obtiene información sobre la generación de PDFs de un ticket
   * GET /api/pdf/ticket/:id/info
   */
  getTicketPDFInfo: async (req, res) => {
    try {
      const ticketId = req.params.id;

      const ticket = await Ticket.findByPk(ticketId, {
        attributes: ['id', 'ticket_number', 'pdf_generated_at', 'pdf_generated_count']
      });

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          ticket_id: ticket.id,
          ticket_number: ticket.ticket_number,
          pdf_generated: ticket.pdf_generated_at !== null,
          last_generated_at: ticket.pdf_generated_at,
          generation_count: ticket.pdf_generated_count
        }
      });

    } catch (error) {
      console.error('Error obteniendo info de PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo información del PDF'
      });
    }
  }
};

export default pdfController;

