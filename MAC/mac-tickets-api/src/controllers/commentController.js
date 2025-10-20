// /controllers/commentController.js - Controlador para comentarios de tickets

import { Comment, User } from '../models/index.js';

/**
 * Obtener comentarios de un ticket
 * GET /api/tickets/:ticketId/comments
 */
export const getTicketComments = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userRole = req.user.role;

    // Construir filtros según el rol
    let whereConditions = { ticket_id: ticketId };

    // Si no es admin ni técnico, filtrar solo comentarios públicos
    if (userRole === 'mesa_trabajo') {
      whereConditions.is_internal = false;
    }

    const comments = await Comment.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'username', 'email']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Comentarios obtenidos exitosamente',
      data: comments
    });

  } catch (error) {
    console.error('Error en commentController.getTicketComments:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Agregar comentario a un ticket
 * POST /api/tickets/:ticketId/comments
 */
export const addTicketComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { comment, is_internal = false } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El comentario es requerido'
      });
    }

    if (comment.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El comentario debe tener al menos 3 caracteres'
      });
    }

    // Crear comentario
    const newComment = await Comment.create({
      ticket_id: ticketId,
      user_id: userId,
      comment: comment.trim(),
      is_internal: is_internal,
      ip_address: req.ip || req.connection?.remoteAddress,
      user_agent: req.headers['user-agent']
    });

    // Obtener comentario con autor
    const commentWithAuthor = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'username', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Comentario agregado exitosamente',
      data: commentWithAuthor
    });

  } catch (error) {
    console.error('Error en commentController.addTicketComment:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export default {
  getTicketComments,
  addTicketComment
};

