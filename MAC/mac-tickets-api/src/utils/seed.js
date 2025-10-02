// /utils/seed.js - Script para Poblar Base de Datos con Datos DEMO

import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const { User, Role, Category, Priority, TicketStatus, Ticket, sequelize } = db;

const seedDatabase = async () => {
  try {
    console.log('🌱 ========================================');
    console.log('🌱 SEED DATABASE - Poblando Datos DEMO');
    console.log('🌱 ========================================\n');

    // 1. Probar conexión
    console.log('🔍 Probando conexión a MySQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    // 2. Sincronizar modelos (no crear tablas, solo verificar)
    console.log('🔍 Verificando estructura de tablas...');
    await sequelize.sync({ alter: false }); // No alterar tablas existentes
    console.log('✅ Tablas verificadas\n');

    // =====================================================================
    // 3. POBLAR USUARIOS DEMO
    // =====================================================================
    console.log('👥 Creando usuarios DEMO...');
    
    const users = [
      // ADMINISTRADORES
      {
        username: 'admin',
        email: 'admin@maccomputadoras.com',
        password_hash: 'demo123', // El hook lo hasheará
        first_name: 'Roberto',
        last_name: 'Administrador',
        role_id: 1,
        is_active: true,
        created_at: '2024-11-01 08:00:00'
      },
      {
        username: 'admin.sistemas',
        email: 'sistemas@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Laura',
        last_name: 'Martínez',
        role_id: 1,
        is_active: true,
        created_at: '2024-11-01 09:00:00'
      },
      
      // TÉCNICOS
      {
        username: 'juan.perez',
        email: 'juan.perez@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Juan',
        last_name: 'Pérez',
        role_id: 2,
        is_active: true,
        created_at: '2024-11-05 10:00:00'
      },
      {
        username: 'maria.gonzalez',
        email: 'maria.gonzalez@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'María',
        last_name: 'González',
        role_id: 2,
        is_active: true,
        created_at: '2024-11-05 11:00:00'
      },
      {
        username: 'carlos.ruiz',
        email: 'carlos.ruiz@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Carlos',
        last_name: 'Ruiz',
        role_id: 2,
        is_active: true,
        created_at: '2024-11-10 09:30:00'
      },
      {
        username: 'ana.torres',
        email: 'ana.torres@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Ana',
        last_name: 'Torres',
        role_id: 2,
        is_active: true,
        created_at: '2024-11-10 10:00:00'
      },
      {
        username: 'pedro.ramirez',
        email: 'pedro.ramirez@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Pedro',
        last_name: 'Ramírez',
        role_id: 2,
        is_active: true,
        created_at: '2024-11-12 08:45:00'
      },
      
      // MESA DE TRABAJO
      {
        username: 'lucia.mesa',
        email: 'lucia.mesa@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Lucía',
        last_name: 'Mesa',
        role_id: 3,
        is_active: true,
        created_at: '2024-11-15 09:00:00'
      },
      {
        username: 'diego.soporte',
        email: 'diego.soporte@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Diego',
        last_name: 'Soporte',
        role_id: 3,
        is_active: true,
        created_at: '2024-11-15 10:00:00'
      },
      {
        username: 'carmen.ventas',
        email: 'carmen.ventas@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Carmen',
        last_name: 'Ventas',
        role_id: 3,
        is_active: true,
        created_at: '2024-11-18 11:30:00'
      },
      {
        username: 'roberto.admin',
        email: 'roberto.admin@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Roberto',
        last_name: 'Administración',
        role_id: 3,
        is_active: true,
        created_at: '2024-11-20 08:00:00'
      },
      
      // INACTIVO
      {
        username: 'usuario.inactivo',
        email: 'inactivo@maccomputadoras.com',
        password_hash: 'demo123',
        first_name: 'Usuario',
        last_name: 'Inactivo',
        role_id: 3,
        is_active: false,
        created_at: '2024-10-01 12:00:00'
      }
    ];

    for (const userData of users) {
      const [user, created] = await User.findOrCreate({
        where: { username: userData.username },
        defaults: userData
      });
      
      if (created) {
        console.log(`  ✅ Usuario creado: ${userData.email}`);
      } else {
        console.log(`  ℹ️  Usuario ya existe: ${userData.email}`);
      }
    }

    console.log(`\n✅ Total usuarios DEMO: ${users.length}\n`);

    // =====================================================================
    // 4. CREAR ALGUNOS TICKETS DE PRUEBA
    // =====================================================================
    console.log('🎫 Creando tickets DEMO...\n');

    const tickets = [
      // TICKET CRÍTICO 1
      {
        title: 'Sistema de facturación completamente caído',
        description: 'El sistema de facturación no responde desde hace 30 minutos. Ningún usuario puede generar facturas. Error crítico que afecta ventas.',
        category_id: 2, // Software
        priority_id: 4, // Crítica
        status_id: 3, // En Proceso
        created_by: 8, // lucia.mesa
        assigned_to: 3, // juan.perez
        assigned_by: 1, // admin
        client_company: 'Ventas MAC',
        client_contact: 'María Fernanda López',
        client_email: 'mflopez@maccomputadoras.com',
        client_phone: '+52 555 123 4567',
        client_department: 'Ventas',
        location: 'Oficina Central - Piso 2',
        ip_address: '192.168.1.105',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        priority_justification: 'Impacto crítico en ventas. Sistema completamente inoperativo.',
        created_at: '2025-01-15 08:15:00',
        assigned_at: '2025-01-15 08:20:00'
      },
      
      // TICKET CRÍTICO 2
      {
        title: 'Servidor de base de datos reporta falla en disco duro',
        description: 'El servidor principal de base de datos está mostrando alertas de falla en disco duro RAID. Riesgo inminente de pérdida de datos.',
        category_id: 1, // Hardware
        priority_id: 4, // Crítica
        status_id: 3, // En Proceso
        created_by: 1, // admin
        assigned_to: 4, // maria.gonzalez
        assigned_by: 1, // admin
        client_company: 'Infraestructura TI',
        client_contact: 'Roberto Administrador',
        client_email: 'admin@maccomputadoras.com',
        client_department: 'TI',
        location: 'Data Center - Rack A3',
        ip_address: '192.168.1.10',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        priority_justification: 'Servidor crítico con riesgo de pérdida total de datos',
        created_at: '2025-01-15 07:45:00',
        assigned_at: '2025-01-15 07:55:00'
      },

      // TICKET ALTA PRIORIDAD 1
      {
        title: 'Impresora HP LaserJet no imprime - Error 49',
        description: 'La impresora principal del departamento de contabilidad muestra error 49 y no imprime facturas urgentes.',
        category_id: 1, // Hardware
        priority_id: 3, // Alta
        status_id: 3, // En Proceso
        created_by: 8, // lucia.mesa
        assigned_to: 3, // juan.perez
        assigned_by: 2, // admin.sistemas
        client_company: 'Contabilidad',
        client_contact: 'Sandra Ramírez',
        client_email: 'sramirez@maccomputadoras.com',
        client_phone: '+52 555 234 5678',
        client_department: 'Contabilidad',
        location: 'Piso 3 - Oficina 301',
        ip_address: '192.168.1.87',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
        created_at: '2025-01-15 09:00:00',
        assigned_at: '2025-01-15 09:05:00'
      },

      // TICKET RESUELTO 1
      {
        title: 'Escáner Epson presenta líneas en digitalización',
        description: 'El escáner está digitalizando documentos con líneas verticales que distorsionan la imagen.',
        category_id: 1, // Hardware
        priority_id: 2, // Media
        status_id: 6, // Cerrado
        created_by: 8, // lucia.mesa
        assigned_to: 4, // maria.gonzalez
        assigned_by: 2, // admin.sistemas
        client_company: 'Recursos Humanos',
        client_contact: 'Laura Martínez',
        client_email: 'lmartinez@maccomputadoras.com',
        client_department: 'RRHH',
        location: 'Piso 1 - Recepción',
        ip_address: '192.168.1.55',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
        resolved_at: '2025-01-13 14:00:00',
        closed_at: '2025-01-13 14:30:00',
        resolution_time_hours: 28.00,
        solution_description: 'Escáner calibrado correctamente. Probado con 10 documentos diferentes sin problemas.',
        created_at: '2025-01-12 10:00:00',
        assigned_at: '2025-01-12 10:30:00'
      }
    ];

    // Función helper para generar ticket_number
    const generateTicketNumber = async (createdAt) => {
      const date = new Date(createdAt);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      // Obtener el último ticket del mes
      const lastTicket = await Ticket.findOne({
        where: {
          ticket_number: {
            [sequelize.Sequelize.Op.like]: `ID-${year}-${month}-%`
          }
        },
        order: [['created_at', 'DESC']]
      });

      let nextNumber = 1;
      if (lastTicket && lastTicket.ticket_number) {
        const lastNumber = parseInt(lastTicket.ticket_number.split('-')[3]);
        nextNumber = lastNumber + 1;
      }

      return `ID-${year}-${month}-${String(nextNumber).padStart(3, '0')}`;
    };

    for (const ticketData of tickets) {
      // Verificar si el ticket ya existe
      const existingTicket = await Ticket.findOne({
        where: { title: ticketData.title }
      });

      if (existingTicket) {
        console.log(`  ℹ️  Ticket ya existe: ${existingTicket.ticket_number}`);
        continue;
      }

      // Generar ticket_number manualmente
      const ticketNumber = await generateTicketNumber(ticketData.created_at);
      
      // Crear ticket con ticket_number incluido
      const ticket = await Ticket.create({
        ...ticketData,
        ticket_number: ticketNumber
      });
      
      console.log(`  ✅ Ticket creado: ${ticket.ticket_number} - ${ticketData.title.substring(0, 50)}...`);
    }

    console.log(`\n✅ Total tickets DEMO: ${tickets.length}\n`);

    console.log('🌱 ========================================');
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('🌱 ========================================\n');
    
    console.log('📝 Credenciales DEMO:');
    console.log('  Email: admin@maccomputadoras.com');
    console.log('  Password: demo123');
    console.log('  (Todos los usuarios usan password: demo123)\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el seed:');
    console.error(error);
    process.exit(1);
  }
};

// Ejecutar seed
seedDatabase();

