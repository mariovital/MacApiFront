// /routes/tickets.js

import express from 'express';
import * as ticketController from '../controllers/ticketController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

/**
 * POST /api/tickets/:id/accept
 * Aceptar ticket (técnico asignado)
 */
router.post('/:id/accept', ticketController.acceptTicket);

/**
 * POST /api/tickets/:id/reject
 * Rechazar ticket (técnico asignado)
 */
router.post('/:id/reject', ticketController.rejectTicket);

// =========================
// Adjuntos de ticket
// =========================
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadDir),
	filename: (_req, file, cb) => {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
		cb(null, unique + '-' + safe);
	}
});
const upload = multer({ storage });

/**
 * POST /api/tickets/:id/attachments
 * Subir un archivo adjunto al ticket
 */
router.post('/:id/attachments', upload.single('file'), ticketController.uploadTicketAttachment);

/**
 * GET /api/tickets/:id/attachments
 * Listar adjuntos del ticket
 */
router.get('/:id/attachments', ticketController.getTicketAttachments);

export default router;

