// /middleware/auth.js

import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

/**
 * Middleware de autenticación JWT
 * Verifica el token y adjunta el usuario a req.user
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extraer token del header Authorization
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
        code: 'NO_TOKEN'
      });
    }

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar usuario en la base de datos
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'role_id', 'is_active'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo',
        code: 'USER_INACTIVE'
      });
    }

    // 4. Determinar rol del usuario
    let roleName = 'unknown';
    if (user.role_id === 1) roleName = 'admin';
    else if (user.role_id === 2) roleName = 'tecnico';
    else if (user.role_id === 3) roleName = 'mesa_trabajo';

    // 5. Adjuntar usuario al request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role_id: user.role_id,
      role: roleName
    };

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        code: 'TOKEN_INVALID'
      });
    }

    console.error('Error en authMiddleware:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware de autorización por rol
 * Verifica que el usuario tenga uno de los roles requeridos
 */
export const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: userRole
      });
    }

    next();
  };
};

export default {
  authMiddleware,
  roleMiddleware
};

