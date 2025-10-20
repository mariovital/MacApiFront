// /routes/pdf.js

import express from 'express';
import pdfController from '../controllers/pdfController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Generar PDF de un ticket
router.get('/ticket/:id', pdfController.generateTicketPDF);

// Obtener información de PDFs generados
router.get('/ticket/:id/info', pdfController.getTicketPDFInfo);

export default router;

