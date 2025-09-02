// /src/server.js - Entry Point del Servidor

import app from './app.js';
import { testConnection } from './config/database.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3001;
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

    // Iniciar servidor HTTP
    const server = app.listen(PORT, HOST, () => {
      console.log('🚀 ================================================');
      console.log('🎫 MAC TICKETS API - Sistema de Gestión de Tickets');
      console.log('🚀 ================================================');
      console.log(`📡 Servidor corriendo en: http://${HOST}:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME || 'ticket_system'}`);
      console.log('🚀 ================================================');
    });

    // Configurar WebSocket (Socket.IO)
    // TODO: Implementar cuando sea necesario
    // const io = socketIO(server, {
    //   cors: {
    //     origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    //     methods: ["GET", "POST"]
    //   }
    // });

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

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
