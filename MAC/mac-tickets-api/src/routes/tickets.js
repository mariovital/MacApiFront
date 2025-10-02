// /routes/tickets.js

import express from 'express';
import * as ticketController from '../controllers/ticketController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Todas las rutas requieren autenticación
 */
router.use(authMiddleware);

/**
 * GET /api/tickets/stats
 * Obtener estadísticas de tickets
 */
router.get('/stats', ticketController.getTicketStats);

/**
 * GET /api/tickets
 * Listar tickets con filtros y paginación
 */
router.get('/', ticketController.getTickets);

/**
 * GET /api/tickets/:id
 * Obtener detalle de un ticket
 */
router.get('/:id', ticketController.getTicketById);

/**
 * POST /api/tickets
 * Crear nuevo ticket
 */
router.post('/', ticketController.createTicket);

/**
 * PUT /api/tickets/:id
 * Actualizar ticket completo
 */
router.put('/:id', ticketController.updateTicket);

/**
 * PATCH /api/tickets/:id/status
 * Cambiar solo el estado del ticket
 */
router.patch('/:id/status', ticketController.updateTicketStatus);

/**
 * POST /api/tickets/:id/assign
 * Asignar ticket a técnico (solo admin)
 */
router.post('/:id/assign', ticketController.assignTicket);

export default router;

