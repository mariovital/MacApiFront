// /controllers/ticketController.js

import * as ticketService from '../services/ticketService.js';

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

    const newTicket = await ticketService.createTicket(
      ticketData,
      req.user.id
    );

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

    if (error.message.includes('Solo administradores') || error.message.includes('no es un técnico')) {
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

export default {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  getTicketStats
};

