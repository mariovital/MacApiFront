// /routes/reports.js - Rutas de Reportes

import express from 'express';
import { getDashboardStats, exportToExcel } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /api/reports/dashboard
 * Obtener estadísticas generales del dashboard
 * Query params: dateRange (7days|30days|90days|1year)
 */
router.get('/dashboard', getDashboardStats);

/**
 * GET /api/reports/export
 * Exportar reporte a Excel
 * Query params: dateRange (7days|30days|90days|1year)
 */
router.get('/export', exportToExcel);

export default router;

