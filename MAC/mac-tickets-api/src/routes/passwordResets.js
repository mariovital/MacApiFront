// /routes/passwordResets.js - Rutas para solicitudes de reseteo de contraseña

import { Router } from 'express';
import { createRequest, listRequests, markProcessed } from '../controllers/passwordResetController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = Router();

// Público: crear solicitud
router.post('/', createRequest);

// Admin: listar y procesar
router.get('/', authMiddleware, roleMiddleware(['admin']), listRequests);
router.patch('/:id/process', authMiddleware, roleMiddleware(['admin']), markProcessed);

export default router;
