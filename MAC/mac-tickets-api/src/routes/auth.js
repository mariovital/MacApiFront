// /routes/auth.js - Rutas de Autenticación

import { Router } from 'express';
import { login, getProfile, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/profile - Obtener perfil del usuario (requiere autenticación)
router.get('/profile', authMiddleware, getProfile);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', logout);

export default router;
