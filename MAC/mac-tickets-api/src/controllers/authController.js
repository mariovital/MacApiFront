// /controllers/authController.js - Controlador de Autenticación

import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

// Login con autenticación real usando MySQL
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador.',
        code: 'USER_INACTIVE'
      });
    }

    // Verificar si la cuenta está bloqueada
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(401).json({
        success: false,
        message: `Cuenta bloqueada. Intente de nuevo en ${minutesLeft} minutos.`,
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Validar contraseña usando el método del modelo
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      await user.update({
        login_attempts: user.login_attempts + 1,
        locked_until: user.login_attempts + 1 >= 5 
          ? new Date(Date.now() + 15 * 60 * 1000) // Bloquear por 15 minutos
          : null
      });

      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Login exitoso - Resetear intentos fallidos y actualizar last_login
    await user.update({
      login_attempts: 0,
      locked_until: null,
      last_login: new Date()
    });

    // Generar tokens JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Preparar respuesta con datos seguros del usuario
    const safeUser = user.toSafeObject();
    safeUser.role = user.role.name;

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: safeUser,
        token,
        refresh_token: refreshToken
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    // req.user será establecido por el middleware de autenticación
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Buscar usuario en la base de datos
    const user = await User.findByPk(req.user.userId, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Preparar respuesta con datos seguros
    const safeUser = user.toSafeObject();
    safeUser.role = user.role.name;

    res.status(200).json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: safeUser
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función temporal de logout
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export {
  login,
  getProfile,
  logout
};
