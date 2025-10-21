// /src/server.js - Entry Point del Servidor

import app from './app.js';
import { testConnection } from './config/database.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const BASE_PORT = parseInt(process.env.PORT, 10) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    // Probar conexión a la base de datos (opcional en desarrollo)
    console.log('🔍 Probando conexión a la base de datos...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  No se pudo conectar a MySQL. Continuando sin base de datos para desarrollo...');
      console.warn('   Las funciones que requieren DB no funcionarán hasta configurar MySQL.');
    } else {
      console.log('✅ Base de datos conectada correctamente.');
    }

    // Iniciar servidor HTTP con fallback de puerto si está en uso
    const startOnPort = (port, attemptsLeft = 3) => {
      const server = app
        .listen(port, HOST, () => {
          console.log('🚀 ================================================');
          console.log('🎫 MAC TICKETS API - Sistema de Gestión de Tickets');
          console.log('🚀 ================================================');
          console.log(`📡 Servidor corriendo en: http://${HOST}:${port}`);
          console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
          console.log(`📊 Base de datos: ${process.env.DB_NAME || 'ticket_system'}`);
          console.log('🚀 ================================================');
        })
        .on('error', (err) => {
          if (err?.code === 'EADDRINUSE' && attemptsLeft > 0) {
            const nextPort = port + 1;
            console.warn(`⚠️  Puerto ${port} en uso. Intentando en ${nextPort}...`);
            startOnPort(nextPort, attemptsLeft - 1);
          } else {
            console.error('❌ Error iniciando el servidor:', err);
            process.exit(1);
          }
        });

      // Manejo graceful de cierre del servidor
      process.on('SIGINT', () => {
        console.log('\n🛑 Cerrando servidor...');
        server.close(() => {
          console.log('✅ Servidor cerrado correctamente.');
          process.exit(0);
        });
      });

      process.on('SIGTERM', () => {
        console.log('\n🛑 Cerrando servidor...');
        server.close(() => {
          console.log('✅ Servidor cerrado correctamente.');
          process.exit(0);
        });
      });
    };

    startOnPort(BASE_PORT);
    // Configurar WebSocket (Socket.IO)
    // TODO: Implementar cuando sea necesario
    // const io = socketIO(server, {
    //   cors: {
    //     origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    //     methods: ["GET", "POST"]
    //   }
    // });

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
