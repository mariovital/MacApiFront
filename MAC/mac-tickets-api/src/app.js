// /src/app.js - Configuración de Express App

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();

// =====================================================================
// MIDDLEWARES DE SEGURIDAD
// =====================================================================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configurado
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting para prevenir ataques
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite de requests por IP
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// =====================================================================
// MIDDLEWARES GENERALES
// =====================================================================

// Morgan para logging de requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parser de JSON
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Parser de URL encoded
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// =====================================================================
// RUTAS
// =====================================================================

// Ruta de salud del servidor
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MAC Tickets API - Sistema de Gestión de Tickets',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Ruta de salud más detallada
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    data: {
      server: 'Online',
      database: 'Connected', // TODO: Verificar conexión real
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage()
    }
  });
});

// Importar rutas de la API
import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import userRoutes from './routes/users.js';
import catalogRoutes from './routes/catalog.js';
import attachmentRoutes from './routes/attachments.js';

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catalog', catalogRoutes); // Categories, Priorities, Statuses, Technicians
app.use('/api', attachmentRoutes); // Attachments (includes /api/tickets/:id/attachments and /api/attachments/:id)

// Archivos estáticos: adjuntos
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// =====================================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// =====================================================================

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    code: 'ENDPOINT_NOT_FOUND',
    requested_url: req.originalUrl,
    method: req.method
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);

  // Error de validación de Joi
  if (error.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Error de Sequelize
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación de base de datos',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message
      }))
    });
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      code: 'TOKEN_INVALID'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Error genérico
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export default app;
