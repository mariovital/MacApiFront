// /controllers/ticketController.js

import * as ticketService from '../services/ticketService.js';
import { Ticket, TicketAttachment } from '../models/index.js';
import path from 'path';

/**
 * Obtener lista de tickets con filtros y paginación
 * GET /api/tickets
 */
export const getTickets = async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      priority,
      category,
      assignedTo,
      createdBy,
      search
    } = req.query;

    const filters = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      status,
      priority,
      category,
      assignedTo,
      createdBy,
      search,
      userId: req.user.id,
      userRole: req.user.role
    };

    const result = await ticketService.getTickets(filters);

    res.status(200).json({
      success: true,
      message: 'Tickets obtenidos exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error en ticketController.getTickets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

/**
 * Obtener detalle de un ticket por ID
 * GET /api/tickets/:id
 */
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await ticketService.getTicketById(
      id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket obtenido exitosamente',
      data: ticket
    });

  } catch (error) {
    console.error('Error en ticketController.getTicketById:', error);
    
    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('No tienes permiso')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Crear nuevo ticket
 * POST /api/tickets
 */
export const createTicket = async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    };

    let newTicket = await ticketService.createTicket(
      ticketData,
      req.user.id
    );

    // Si viene technician_id en el body, intentar asignar inmediatamente
    const technician_id = req.body?.technician_id;
    if (technician_id) {
      try {
        newTicket = await ticketService.assignTicket(
          newTicket.id,
          technician_id,
          req.user.id,
          req.user.role
        );
      } catch (assignErr) {
        // No bloquear la creación por fallo de asignación; responder con 201 y mensaje informativo
        console.warn('Advertencia: ticket creado pero no asignado:', assignErr?.message || assignErr);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      data: newTicket
    });

  } catch (error) {
    console.error('Error en ticketController.createTicket:', error);
    
    if (error.message.includes('debe tener al menos')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Actualizar ticket
 * PUT /api/tickets/:id
 */
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTicket = await ticketService.updateTicket(
      id,
      updates,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket actualizado exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.updateTicket:', error);
    
    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('No tienes permiso')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Cambiar estado de ticket
 * PATCH /api/tickets/:id/status
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    if (!status_id) {
      return res.status(400).json({
        success: false,
        message: 'El campo status_id es requerido'
      });
    }

    const updatedTicket = await ticketService.updateTicketStatus(
      id,
      status_id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Estado del ticket actualizado exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.updateTicketStatus:', error);
    
    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('No tienes permiso')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Asignar ticket a técnico (solo admin)
 * POST /api/tickets/:id/assign
 */
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { technician_id } = req.body;

    if (!technician_id) {
      return res.status(400).json({
        success: false,
        message: 'El campo technician_id es requerido'
      });
    }

    const updatedTicket = await ticketService.assignTicket(
      id,
      technician_id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket asignado exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.assignTicket:', error);
    
    if (error.message === 'Ticket no encontrado' || error.message === 'Técnico no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message.includes('Solo administradores') ||
      error.message.includes('no es un técnico') ||
      error.message.includes('Permisos') ||
      error.message.includes('No tienes permiso')
    ) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Aceptar ticket por el técnico asignado
 * POST /api/tickets/:id/accept
 */
export const acceptTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTicket = await ticketService.acceptTicket(
      id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket aceptado exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.acceptTicket:', error);

    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (error.message.includes('Solo el técnico') || error.message.includes('no está en estado asignado')) {
      return res.status(403).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

/**
 * Rechazar ticket por el técnico asignado
 * POST /api/tickets/:id/reject
 */
export const rejectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    const updatedTicket = await ticketService.rejectTicket(
      id,
      reason,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket rechazado exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.rejectTicket:', error);

    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (error.message.includes('Solo el técnico') || error.message.includes('Solo se puede rechazar')) {
      return res.status(403).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

/**
 * Subir adjunto a un ticket
 * POST /api/tickets/:id/attachments
 */
export const uploadTicketAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket no encontrado' });

    // Permisos: admin, técnico asignado o creador (mesa)
    const isAdmin = req.user.role === 'admin';
    const isAssignee = ticket.assigned_to === req.user.id;
    const isCreator = ticket.created_by === req.user.id;
    if (!isAdmin && !isAssignee && !isCreator) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para adjuntar archivos a este ticket' });
    }

    if (!req.file) return res.status(400).json({ success: false, message: 'Archivo requerido (campo: file)' });

    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const filePath = `${uploadDir}/${req.file.filename}`;
    const record = await TicketAttachment.create({
      ticket_id: ticket.id,
      user_id: req.user.id,
      original_name: req.file.originalname,
      file_name: req.file.filename,
      file_size: req.file.size,
      file_type: req.file.mimetype,
      file_path: filePath,
      storage_type: 'local',
      s3_url: null, // DEPRECATED - mantener por compatibilidad
      s3_key: null, // DEPRECATED - mantener por compatibilidad
      is_image: req.file.mimetype.startsWith('image/'),
      description: req.body?.description || null,
      ip_address: req.ip || req.connection?.remoteAddress,
      user_agent: req.headers['user-agent']
    });

    res.status(201).json({ success: true, message: 'Archivo adjuntado', data: record });
  } catch (error) {
    console.error('Error en uploadTicketAttachment:', error);
    res.status(500).json({ success: false, message: 'Error subiendo adjunto' });
  }
};

/**
 * Listar adjuntos del ticket
 * GET /api/tickets/:id/attachments
 */
export const getTicketAttachments = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket no encontrado' });

    // Permisos: mismo criterio que detalle
    const isAdmin = req.user.role === 'admin';
    const canView = isAdmin || ticket.assigned_to === req.user.id || ticket.created_by === req.user.id;
    if (!canView) return res.status(403).json({ success: false, message: 'No tienes permiso' });

    const items = await TicketAttachment.findAll({ where: { ticket_id: id, deleted_at: null }, order: [['created_at', 'DESC']] });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error en getTicketAttachments:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo adjuntos' });
  }
};

/**
 * Descargar archivo adjunto
 * GET /api/tickets/:ticketId/attachments/:attachmentId/download
 */
export const downloadTicketAttachment = async (req, res) => {
  try {
    const { ticketId, attachmentId } = req.params;
    
    // Buscar el archivo
    const attachment = await TicketAttachment.findOne({
      where: { id: attachmentId, ticket_id: ticketId, deleted_at: null }
    });
    
    if (!attachment) {
      return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    }

    // Verificar permisos (mismo criterio que ver ticket)
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    const isAdmin = req.user.role === 'admin';
    const canView = isAdmin || ticket.assigned_to === req.user.id || ticket.created_by === req.user.id;
    if (!canView) {
      return res.status(403).json({ success: false, message: 'No tienes permiso' });
    }

    // Construir ruta del archivo
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const filePath = path.resolve(process.cwd(), uploadDir, attachment.file_name);

    // Verificar que el archivo exista
    const fs = await import('fs/promises');
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ success: false, message: 'Archivo no encontrado en el servidor' });
    }

    // Configurar headers para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(attachment.original_name)}"`);
    res.setHeader('Content-Type', attachment.file_type || 'application/octet-stream');

    // Enviar archivo
    res.sendFile(filePath);

  } catch (error) {
    console.error('Error en downloadTicketAttachment:', error);
    res.status(500).json({ success: false, message: 'Error descargando archivo' });
  }
};

/**
 * Eliminar archivo adjunto
 * DELETE /api/tickets/:ticketId/attachments/:attachmentId
 */
export const deleteTicketAttachment = async (req, res) => {
  try {
    const { ticketId, attachmentId } = req.params;
    
    // Buscar el archivo
    const attachment = await TicketAttachment.findOne({
      where: { id: attachmentId, ticket_id: ticketId, deleted_at: null }
    });
    
    if (!attachment) {
      return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    }

    // Verificar permisos
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    }

    // Solo admin, creador del ticket o técnico asignado pueden eliminar
    const isAdmin = req.user.role === 'admin';
    const isCreator = ticket.created_by === req.user.id;
    const isAssignee = ticket.assigned_to === req.user.id;
    
    if (!isAdmin && !isCreator && !isAssignee) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este archivo' });
    }

    // Soft delete
    attachment.deleted_at = new Date();
    await attachment.save();

    res.json({ success: true, message: 'Archivo eliminado exitosamente' });

  } catch (error) {
    console.error('Error en deleteTicketAttachment:', error);
    res.status(500).json({ success: false, message: 'Error eliminando archivo' });
  }
};
/**
 * Obtener estadísticas de tickets
 * GET /api/tickets/stats
 */
export const getTicketStats = async (req, res) => {
  try {
    const stats = await ticketService.getTicketStats(
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: stats
    });

  } catch (error) {
    console.error('Error en ticketController.getTicketStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Marcar ticket como resuelto (solo técnico asignado)
 * POST /api/tickets/:id/resolve
 */
export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_comment } = req.body;

    // Validación: comentario de resolución es obligatorio
    if (!resolution_comment || resolution_comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El comentario de resolución es obligatorio'
      });
    }

    if (resolution_comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'El comentario de resolución debe tener al menos 10 caracteres'
      });
    }

    const updatedTicket = await ticketService.resolveTicket(
      id,
      resolution_comment,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket marcado como resuelto exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.resolveTicket:', error);
    
    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message.includes('No tienes permiso') ||
      error.message.includes('Solo el técnico asignado') ||
      error.message.includes('debe estar en estado')
    ) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('debe tener al menos')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Cerrar ticket (solo admin)
 * POST /api/tickets/:id/close
 */
export const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { close_reason } = req.body;

    const updatedTicket = await ticketService.closeTicket(
  id,
  close_reason,
  req.user.id,
  req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket cerrado exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.closeTicket:', error);
    
    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message.includes('Solo administradores') ||
      error.message.includes('técnico asignado') ||
      error.message.includes('debe estar en estado')
    ) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Reabrir ticket cerrado (solo admin)
 * POST /api/tickets/:id/reopen
 */
export const reopenTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reopen_reason } = req.body;

    if (!reopen_reason || reopen_reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La razón para reabrir es obligatoria'
      });
    }

    const updatedTicket = await ticketService.reopenTicket(
      id,
      reopen_reason,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket reabierto exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Error en ticketController.reopenTicket:', error);
    
    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message.includes('Solo administradores') ||
      error.message.includes('debe estar en estado')
    ) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export default {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  acceptTicket,
  rejectTicket,
  getTicketStats,
  resolveTicket,
  closeTicket,
  reopenTicket
};

