// /routes/catalog.js

import express from 'express';
import * as catalogController from '../controllers/catalogController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Todas las rutas requieren autenticación
 */
router.use(authMiddleware);

/**
 * GET /api/categories
 * Obtener todas las categorías activas
 */
router.get('/categories', catalogController.getCategories);

/**
 * GET /api/priorities
 * Obtener todas las prioridades activas
 */
router.get('/priorities', catalogController.getPriorities);

/**
 * GET /api/ticket-statuses
 * Obtener todos los estados de tickets
 */
router.get('/ticket-statuses', catalogController.getTicketStatuses);

/**
 * GET /api/technicians
 * Obtener lista de técnicos activos (para asignación)
 */
router.get('/technicians', catalogController.getTechnicians);

export default router;

