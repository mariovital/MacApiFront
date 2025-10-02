// /controllers/catalogController.js

import { Category, Priority, TicketStatus, User } from '../models/index.js';

/**
 * Obtener todas las categorías activas
 * GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        is_active: true,
        deleted_at: null
      },
      attributes: ['id', 'name', 'description', 'color'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Categorías obtenidas exitosamente',
      data: categories
    });

  } catch (error) {
    console.error('Error en catalogController.getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtener todas las prioridades activas
 * GET /api/priorities
 */
export const getPriorities = async (req, res) => {
  try {
    const priorities = await Priority.findAll({
      where: {
        is_active: true,
        deleted_at: null
      },
      attributes: ['id', 'name', 'level', 'color', 'sla_hours'],
      order: [['level', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Prioridades obtenidas exitosamente',
      data: priorities
    });

  } catch (error) {
    console.error('Error en catalogController.getPriorities:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtener todos los estados de tickets
 * GET /api/ticket-statuses
 */
export const getTicketStatuses = async (req, res) => {
  try {
    const statuses = await TicketStatus.findAll({
      where: {
        deleted_at: null
      },
      attributes: ['id', 'name', 'description', 'color', 'is_final', 'order_index'],
      order: [['order_index', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Estados obtenidos exitosamente',
      data: statuses
    });

  } catch (error) {
    console.error('Error en catalogController.getTicketStatuses:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtener lista de técnicos activos (para asignación)
 * GET /api/technicians
 */
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.findAll({
      where: {
        role_id: 2, // Solo técnicos
        is_active: true,
        deleted_at: null
      },
      attributes: ['id', 'username', 'first_name', 'last_name', 'email', 'avatar_url'],
      order: [['first_name', 'ASC'], ['last_name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Técnicos obtenidos exitosamente',
      data: technicians
    });

  } catch (error) {
    console.error('Error en catalogController.getTechnicians:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export default {
  getCategories,
  getPriorities,
  getTicketStatuses,
  getTechnicians
};

