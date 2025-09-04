// /routes/users.js - Rutas de Usuarios

import { Router } from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  resetPassword
} from '../controllers/userController.js';

const router = Router();

// Middleware temporal para simular autenticación
// TODO: Reemplazar con middleware real de autenticación
const mockAuthMiddleware = (req, res, next) => {
  // Simular usuario autenticado
  req.user = {
    id: 1,
    role: 'admin',
    email: 'admin@tuempresa.com'
  };
  next();
};

// =====================================================================
// RUTAS DE USUARIOS
// =====================================================================

// GET /api/users - Obtener lista de usuarios (con filtros y paginación)
router.get('/', mockAuthMiddleware, getUsers);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', mockAuthMiddleware, getUserById);

// POST /api/users - Crear nuevo usuario
router.post('/', mockAuthMiddleware, createUser);

// PUT /api/users/:id - Actualizar usuario completo
router.put('/:id', mockAuthMiddleware, updateUser);

// DELETE /api/users/:id - Eliminar usuario (soft delete)
router.delete('/:id', mockAuthMiddleware, deleteUser);

// POST /api/users/:id/reset-password - Resetear contraseña de usuario
router.post('/:id/reset-password', mockAuthMiddleware, resetPassword);

export default router;