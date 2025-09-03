// /routes/auth.js - Rutas de Autenticación

import { Router } from 'express';
import { login, getProfile, logout } from '../controllers/authController.js';

const router = Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/profile - Obtener perfil del usuario
router.get('/profile', getProfile);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', logout);

export default router;
