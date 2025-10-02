-- ================================================================
-- SCRIPT DE DATOS DEMO PARA SISTEMA DE TICKETS
-- Fecha: 2025-01-15
-- Propósito: Poblar la base de datos con datos realistas para demo
-- ================================================================

USE ticket_system;

-- ================================================================
-- 1. LIMPIAR DATOS EXISTENTES (SOLO DEMO - ¡CUIDADO EN PRODUCCIÓN!)
-- ================================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE ticket_history;
TRUNCATE TABLE ticket_attachments;
TRUNCATE TABLE ticket_comments;
TRUNCATE TABLE notifications;
TRUNCATE TABLE tickets;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- ================================================================
-- 2. USUARIOS DEMO
-- ================================================================
-- Contraseña para TODOS los usuarios: "demo123"
-- Hash bcrypt: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a

INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, is_active, created_at) VALUES
-- ADMINISTRADORES
('admin', 'admin@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Roberto', 'Administrador', 1, TRUE, '2024-11-01 08:00:00'),
('admin.sistemas', 'sistemas@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Laura', 'Martínez', 1, TRUE, '2024-11-01 09:00:00'),

-- TÉCNICOS
('juan.perez', 'juan.perez@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Juan', 'Pérez', 2, TRUE, '2024-11-05 10:00:00'),
('maria.gonzalez', 'maria.gonzalez@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'María', 'González', 2, TRUE, '2024-11-05 11:00:00'),
('carlos.ruiz', 'carlos.ruiz@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Carlos', 'Ruiz', 2, TRUE, '2024-11-10 09:30:00'),
('ana.torres', 'ana.torres@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Ana', 'Torres', 2, TRUE, '2024-11-10 10:00:00'),
('pedro.ramirez', 'pedro.ramirez@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Pedro', 'Ramírez', 2, TRUE, '2024-11-12 08:45:00'),

-- MESA DE TRABAJO (Usuarios que crean tickets)
('lucia.mesa', 'lucia.mesa@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Lucía', 'Mesa', 3, TRUE, '2024-11-15 09:00:00'),
('diego.soporte', 'diego.soporte@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Diego', 'Soporte', 3, TRUE, '2024-11-15 10:00:00'),
('carmen.ventas', 'carmen.ventas@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Carmen', 'Ventas', 3, TRUE, '2024-11-18 11:30:00'),
('roberto.admin', 'roberto.admin@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Roberto', 'Administración', 3, TRUE, '2024-11-20 08:00:00'),

-- USUARIOS INACTIVOS (para pruebas)
('usuario.inactivo', 'inactivo@maccomputadoras.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a', 'Usuario', 'Inactivo', 3, FALSE, '2024-10-01 12:00:00');

-- ================================================================
-- 4. TICKETS DEMO (Variedad de estados y prioridades)
-- ================================================================

INSERT INTO tickets (
    ticket_number, 
    title, 
    description, 
    category_id, 
    priority_id, 
    status_id, 
    created_by, 
    assigned_to,
    client_company,
    client_contact,
    client_email,
    client_phone,
    location,
    created_at,
    updated_at
) VALUES

-- TICKETS CRÍTICOS (Prioridad 4)
('ID-2025-001', 
 'Sistema de facturación completamente caído', 
 'El sistema de facturación no responde desde las 08:00 AM. Usuarios no pueden generar facturas. Error 500 en el servidor principal. Se requiere atención inmediata ya que afecta operaciones de todo el departamento de ventas.',
 2, 4, 3, 8, 3, 
 'Corporativo XYZ', 'Ing. Martín López', 'martin.lopez@corporativoxyz.com', '+52 555 111 2222', 
 'Edificio Central - Piso 5', 
 '2025-01-15 08:15:00', '2025-01-15 09:30:00'),

('ID-2025-002', 
 'Servidor de base de datos en falla crítica', 
 'El servidor de producción está mostrando errores de disco. Logs indican posible falla de hardware en RAID. Respaldo funcionando pero sistema principal caído. Clientes externos afectados.',
 3, 4, 3, 1, 4, 
 'TechSolutions SA', 'Lic. Patricia Gómez', 'patricia.gomez@techsolutions.com', '+52 555 222 3333', 
 'Data Center - Rack A15', 
 '2025-01-15 07:45:00', '2025-01-15 08:00:00'),

('ID-2025-003', 
 'Ataque de ransomware detectado en red corporativa', 
 'URGENTE: Firewall detectó actividad sospechosa tipo ransomware. Se aisló segmento de red afectado. Requiere revisión inmediata de seguridad y análisis forense. 15 equipos potencialmente comprometidos.',
 3, 4, 2, 2, 5, 
 'Grupo Empresarial ABC', 'Dr. Fernando Sánchez', 'fernando.sanchez@grupoabc.com', '+52 555 333 4444', 
 'Torre Norte - Piso 12', 
 '2025-01-15 06:30:00', '2025-01-15 07:00:00'),

-- TICKETS DE PRIORIDAD ALTA (Prioridad 3)
('ID-2025-004', 
 'Impresora principal de oficina no funciona', 
 'La impresora HP LaserJet Pro 4001dw en recepción no imprime. Muestra mensaje "Error 49" en pantalla. Ya se reinició pero persiste el problema. Afecta a 25 usuarios que necesitan imprimir documentos urgentes.',
 1, 3, 2, 8, 3, 
 'Despacho Legal Morales', 'Lic. Jorge Morales', 'jorge.morales@despacholegal.com', '+52 555 444 5555', 
 'Oficina Principal - Recepción', 
 '2025-01-15 09:00:00', '2025-01-15 09:15:00'),

('ID-2025-005', 
 'Red WiFi caída en piso 3', 
 'El access point del piso 3 dejó de funcionar. 30 usuarios sin conexión. Se verificó que el switch principal está funcionando. Posible falla en el AP o configuración.',
 3, 3, 3, 9, 6, 
 'Consultores Unidos', 'Arq. Sandra Jiménez', 'sandra.jimenez@consultores.com', '+52 555 555 6666', 
 'Edificio B - Piso 3', 
 '2025-01-14 16:30:00', '2025-01-15 08:00:00'),

('ID-2025-006', 
 'Correo electrónico no envía ni recibe', 
 'El cliente Outlook muestra error al intentar enviar/recibir correos. Probado en varios equipos del mismo departamento. Posible problema con configuración de servidor Exchange o credenciales expiradas.',
 2, 3, 3, 10, 4, 
 'Inmobiliaria Premier', 'Ing. Ricardo Vega', 'ricardo.vega@inmobiliaria.com', '+52 555 666 7777', 
 'Oficinas Administrativas - Piso 2', 
 '2025-01-14 14:00:00', '2025-01-15 10:00:00'),

('ID-2025-007', 
 'Sistema ERP lento y con errores', 
 'El sistema ERP SAP está extremadamente lento desde ayer. Transacciones que tomaban segundos ahora tardan minutos. Usuarios reportan timeouts frecuentes. 50+ usuarios afectados.',
 2, 3, 2, 8, 7, 
 'Manufactura Industrial SA', 'Ing. Luis Herrera', 'luis.herrera@manufactura.com', '+52 555 777 8888', 
 'Planta Industrial - Área Administrativa', 
 '2025-01-14 10:00:00', '2025-01-14 15:30:00'),

-- TICKETS DE PRIORIDAD MEDIA (Prioridad 2)
('ID-2025-008', 
 'Solicitud de nueva cuenta de usuario', 
 'Se requiere crear cuenta de Active Directory y correo electrónico para nuevo empleado que ingresa el lunes 20 de enero. Departamento: Ventas. Accesos: CRM, ERP, Correo.',
 4, 2, 1, 9, NULL, 
 'Distribuidora Nacional', 'RRHH - Ana Beltrán', 'rrhh@distribuidora.com', '+52 555 888 9999', 
 'Recursos Humanos - Piso 1', 
 '2025-01-15 11:00:00', '2025-01-15 11:00:00'),

('ID-2025-009', 
 'Actualización de software Office requerida', 
 'Equipo del área de diseño requiere actualización a Office 2021. Actualmente tienen Office 2016 y necesitan nuevas funciones de Excel y PowerPoint para proyecto con cliente.',
 2, 2, 2, 10, 3, 
 'Agencia Creativa Plus', 'Dir. Mónica Reyes', 'monica.reyes@agenciacreativa.com', '+52 555 999 0000', 
 'Área de Diseño - Piso 4', 
 '2025-01-14 12:30:00', '2025-01-14 16:00:00'),

('ID-2025-010', 
 'Solicitud instalación software AutoCAD', 
 'Se requiere instalación de AutoCAD 2024 en 3 equipos del departamento de ingeniería. Licencias ya adquiridas. Coordinar con jefe de departamento para instalación.',
 2, 2, 3, 11, 6, 
 'Constructora Moderna', 'Ing. Alberto Paz', 'alberto.paz@constructora.com', '+52 555 101 1111', 
 'Departamento Ingeniería - Piso 6', 
 '2025-01-13 15:00:00', '2025-01-14 09:00:00'),

('ID-2025-011', 
 'Problema con escáner de documentos', 
 'El escáner Canon en el área de archivo no está digitalizando correctamente. Las imágenes salen con líneas y manchas. Ya se limpió el vidrio pero persiste. Posible calibración o mantenimiento.',
 1, 2, 5, 8, 4, 
 'Notaría Pública 15', 'Not. Roberto Castillo', 'notaria15@notariapublica.com', '+52 555 111 2222', 
 'Área de Archivo - Planta Baja', 
 '2025-01-12 10:00:00', '2025-01-13 14:30:00'),

('ID-2025-012', 
 'Cambio de contraseña - usuario bloqueado', 
 'Usuario reporta que su cuenta quedó bloqueada después de 3 intentos fallidos. Requiere desbloqueo y cambio de contraseña. Usuario: jperez. Urgente para continuar labores.',
 4, 2, 5, 9, 3, 
 'Comercializadora del Norte', 'Jorge Pérez', 'jorge.perez@comercializadora.com', '+52 555 222 3333', 
 'Departamento Ventas', 
 '2025-01-11 09:30:00', '2025-01-11 10:15:00'),

-- TICKETS DE PRIORIDAD BAJA (Prioridad 1)
('ID-2025-013', 
 'Solicitud de mouse inalámbrico', 
 'Usuario solicita cambio de mouse con cable por uno inalámbrico para mayor comodidad. Mouse actual funciona correctamente. No es urgente.',
 1, 1, 1, 10, NULL, 
 'Consultoría Empresarial', 'Lic. Sofía Ruiz', 'sofia.ruiz@consultoria.com', '+52 555 333 4444', 
 'Oficina 305', 
 '2025-01-15 10:30:00', '2025-01-15 10:30:00'),

('ID-2025-014', 
 'Consulta sobre respaldo de archivos', 
 'Usuario pregunta cómo configurar respaldo automático de carpeta personal al servidor. No es urgente, solo capacitación preventiva.',
 4, 1, 2, 9, 7, 
 'Estudio Contable Rodríguez', 'CP Laura Méndez', 'laura.mendez@estudiocontable.com', '+52 555 444 5555', 
 'Área Contabilidad', 
 '2025-01-14 16:00:00', '2025-01-15 08:30:00'),

('ID-2025-015', 
 'Capacitación en nuevo sistema de nómina', 
 'Departamento de RRHH solicita capacitación grupal para el nuevo módulo de nómina del ERP. Coordinar fecha y horario con el equipo (8 personas).',
 4, 1, 1, 11, NULL, 
 'Hotel Plaza Internacional', 'RRHH - Gabriela Núñez', 'rrhh@hotelplaza.com', '+52 555 555 6666', 
 'Recursos Humanos - Piso 2', 
 '2025-01-13 11:00:00', '2025-01-13 11:00:00'),

-- TICKETS RESUELTOS RECIENTEMENTE
('ID-2025-016', 
 'Problema con proyector en sala de juntas', 
 'Proyector Epson en sala principal no mostraba imagen. Se revisó cable HDMI y configuración. Cable defectuoso fue reemplazado. Proyector funcionando correctamente.',
 1, 2, 5, 8, 3, 
 'Corporativo Financiero', 'Asist. Paula Ortiz', 'paula.ortiz@corporativofinanciero.com', '+52 555 666 7777', 
 'Sala de Juntas A', 
 '2025-01-14 08:00:00', '2025-01-14 11:30:00'),

('ID-2025-017', 
 'Instalación de certificado digital', 
 'Se requería instalación de certificado digital para firma electrónica. Se instaló certificado y se configuró Adobe Reader. Usuario puede firmar documentos correctamente.',
 2, 2, 5, 9, 4, 
 'Despacho de Abogados Luna', 'Lic. Ernesto Luna', 'ernesto.luna@despacholuna.com', '+52 555 777 8888', 
 'Oficina Director', 
 '2025-01-13 14:00:00', '2025-01-13 16:45:00'),

('ID-2025-018', 
 'VPN no conectaba desde casa', 
 'Usuario no podía conectarse a VPN desde home office. Se actualizó cliente VPN y se reconfiguraron credenciales. Conexión establecida exitosamente.',
 3, 3, 5, 10, 6, 
 'Servicios Profesionales GHI', 'Ing. Claudia Vargas', 'claudia.vargas@serviciosghi.com', '+52 555 888 9999', 
 'Home Office', 
 '2025-01-12 09:00:00', '2025-01-12 15:20:00'),

-- TICKETS CERRADOS
('ID-2025-019', 
 'Actualización de antivirus en estaciones', 
 'Se realizó actualización masiva de Kaspersky en todas las estaciones de trabajo (45 equipos). Proceso completado exitosamente. Todos los equipos actualizados a última versión.',
 2, 2, 6, 1, 5, 
 'Clínica Médica del Valle', 'Admin. Roberto Guzmán', 'admin@clinicadelvalle.com', '+52 555 999 0000', 
 'Toda la clínica', 
 '2025-01-10 08:00:00', '2025-01-10 17:00:00'),

('ID-2025-020', 
 'Migración de datos a nuevo servidor', 
 'Migración exitosa de 2TB de datos históricos al nuevo servidor NAS Synology. Se verificó integridad de datos y accesos. Servidor antiguo desconectado como respaldo.',
 4, 3, 6, 2, 7, 
 'Corporativo Inmobiliario JKL', 'CTO Miguel Ángel Ruiz', 'cto@corporativoinmo.com', '+52 555 101 1111', 
 'Data Center Principal', 
 '2025-01-08 06:00:00', '2025-01-09 22:00:00');

-- ================================================================
-- 5. COMENTARIOS EN TICKETS
-- ================================================================

INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal, created_at) VALUES
-- Comentarios ticket ID-2025-001 (Crítico - Facturación)
(1, 3, 'He revisado los logs del servidor. El servicio de IIS se detuvo inesperadamente. Reiniciando servicios ahora.', TRUE, '2025-01-15 08:30:00'),
(1, 3, 'Servicios reiniciados. Sistema de facturación respondiendo. Monitoreando estabilidad.', TRUE, '2025-01-15 09:00:00'),
(1, 8, '¿Ya puedo generar facturas? Tengo 15 pendientes de emitir.', FALSE, '2025-01-15 09:15:00'),
(1, 3, 'Sí, el sistema está operativo. Por favor confirma si puedes generar facturas correctamente.', FALSE, '2025-01-15 09:20:00'),
(1, 8, 'Confirmado, ya estoy generando facturas sin problemas. Gracias por la rapidez.', FALSE, '2025-01-15 09:35:00'),

-- Comentarios ticket ID-2025-002 (Crítico - Base de datos)
(2, 4, 'Detectado error en disco 2 del arreglo RAID 5. Disco en estado "degraded". Requiere reemplazo urgente.', TRUE, '2025-01-15 08:15:00'),
(2, 1, 'Tenemos disco de repuesto en stock. ¿Procedo con reemplazo en caliente?', TRUE, '2025-01-15 08:30:00'),
(2, 4, 'Afirmativo. Iniciando procedimiento de reemplazo hot-swap. Sistema permanecerá en línea.', TRUE, '2025-01-15 08:45:00'),

-- Comentarios ticket ID-2025-004 (Alta - Impresora)
(4, 3, 'En camino a la ubicación. ETA 15 minutos.', TRUE, '2025-01-15 09:10:00'),
(4, 3, 'Error 49 típico de memoria insuficiente o archivo corrupto. Reiniciando completamente la impresora.', TRUE, '2025-01-15 09:30:00'),
(4, 8, '¿Cuánto tiempo más? Necesito imprimir documentos urgentes para junta de las 10:00 AM.', FALSE, '2025-01-15 09:40:00'),
(4, 3, 'En 10 minutos estará lista. Estoy actualizando el firmware que corrige este error.', FALSE, '2025-01-15 09:42:00'),

-- Comentarios ticket ID-2025-005 (Alta - WiFi)
(5, 6, 'Access point no responde a ping. Posible falla de hardware. Llevaré equipo de reemplazo.', TRUE, '2025-01-14 17:00:00'),
(5, 6, 'AP reemplazado y configurado. Red WiFi operativa en piso 3. 30 usuarios reconectados.', TRUE, '2025-01-15 08:30:00'),
(5, 9, 'Confirmado. Ya tenemos internet en todas las oficinas. Velocidad normal. Muchas gracias.', FALSE, '2025-01-15 08:45:00'),

-- Comentarios ticket ID-2025-006 (Alta - Correo)
(6, 4, 'Revisando configuración de Outlook en equipos afectados. Parece problema de autenticación.', TRUE, '2025-01-14 14:30:00'),
(6, 4, 'Encontrado: Contraseña de aplicación expirada. Regenerando tokens de autenticación para los 8 usuarios.', TRUE, '2025-01-14 15:00:00'),
(6, 10, '¿Necesitamos cambiar algo en nuestros equipos o ustedes lo configuran?', FALSE, '2025-01-14 15:15:00'),
(6, 4, 'Lo configuro yo remotamente. En 30 minutos todos tendrán correo funcionando.', FALSE, '2025-01-14 15:20:00'),

-- Comentarios ticket ID-2025-009 (Media - Office)
(9, 3, 'Licencias verificadas en portal de Microsoft. Descargando instalador de Office 2021 Professional Plus.', TRUE, '2025-01-14 13:00:00'),
(9, 10, '¿Perderemos nuestros archivos y configuraciones?', FALSE, '2025-01-14 14:00:00'),
(9, 3, 'No, es actualización in-place. Todos sus archivos y configuraciones se mantienen. Solo mejora la versión.', FALSE, '2025-01-14 14:10:00'),

-- Comentarios ticket ID-2025-011 (Media - Escáner - RESUELTO)
(11, 4, 'Escáner revisado. Necesita calibración de CCD. Ejecutando proceso de calibración del fabricante.', TRUE, '2025-01-12 11:00:00'),
(11, 4, 'Calibración completada. Probado con 10 documentos diferentes. Digitalización perfecta sin líneas ni manchas.', TRUE, '2025-01-13 14:00:00'),
(11, 8, 'Perfecto. Ya escaneamos 50 documentos sin problemas. Cerrado.', FALSE, '2025-01-13 14:30:00'),

-- Comentarios ticket ID-2025-016 (Media - Proyector - RESUELTO)
(16, 3, 'Cable HDMI presentaba corto en conector. Reemplazado por cable de repuesto certificado 4K.', TRUE, '2025-01-14 10:00:00'),
(16, 8, 'Probamos con laptop y funciona perfecto. Imagen HD clara. Gracias.', FALSE, '2025-01-14 11:30:00');

-- ================================================================
-- 6. HISTORIAL DE TICKETS (Tracking de cambios)
-- ================================================================

INSERT INTO ticket_history (ticket_id, user_id, action_type, old_value, new_value, description, created_at) VALUES
-- Historial ticket 1 (Facturación)
(1, 8, 'created', NULL, NULL, 'Ticket creado por Lucía Mesa', '2025-01-15 08:15:00'),
(1, 1, 'status_change', 'Nuevo', 'Asignado', 'Ticket asignado a técnico Juan Pérez', '2025-01-15 08:20:00'),
(1, 3, 'status_change', 'Asignado', 'En Proceso', 'Técnico comenzó diagnóstico', '2025-01-15 08:30:00'),

-- Historial ticket 2 (Base de datos)
(2, 1, 'created', NULL, NULL, 'Ticket creado por admin Roberto', '2025-01-15 07:45:00'),
(2, 1, 'priority_change', 'Alta', 'Crítica', 'Escalado a prioridad crítica por impacto', '2025-01-15 07:50:00'),
(2, 1, 'status_change', 'Nuevo', 'Asignado', 'Asignado a María González', '2025-01-15 07:55:00'),
(2, 4, 'status_change', 'Asignado', 'En Proceso', 'Iniciando diagnóstico de hardware', '2025-01-15 08:00:00'),

-- Historial ticket 4 (Impresora)
(4, 8, 'created', NULL, NULL, 'Ticket creado por Lucía Mesa', '2025-01-15 09:00:00'),
(4, 2, 'status_change', 'Nuevo', 'Asignado', 'Asignado a Juan Pérez', '2025-01-15 09:05:00'),
(4, 3, 'comment_added', NULL, NULL, 'Técnico agregó comentario', '2025-01-15 09:10:00'),

-- Historial ticket 5 (WiFi)
(5, 9, 'created', NULL, NULL, 'Ticket creado por Diego Soporte', '2025-01-14 16:30:00'),
(5, 1, 'status_change', 'Nuevo', 'Asignado', 'Asignado a Ana Torres', '2025-01-14 16:45:00'),
(5, 6, 'status_change', 'Asignado', 'En Proceso', 'Técnico en sitio diagnosticando', '2025-01-14 17:00:00'),
(5, 6, 'status_change', 'En Proceso', 'Resuelto', 'AP reemplazado, problema solucionado', '2025-01-15 08:30:00'),

-- Historial ticket 11 (Escáner - RESUELTO)
(11, 8, 'created', NULL, NULL, 'Ticket creado por Lucía Mesa', '2025-01-12 10:00:00'),
(11, 2, 'status_change', 'Nuevo', 'Asignado', 'Asignado a María González', '2025-01-12 10:30:00'),
(11, 4, 'status_change', 'Asignado', 'En Proceso', 'Técnico revisando escáner', '2025-01-12 11:00:00'),
(11, 4, 'status_change', 'En Proceso', 'Resuelto', 'Escáner calibrado correctamente', '2025-01-13 14:00:00'),
(11, 8, 'status_change', 'Resuelto', 'Cerrado', 'Usuario confirmó solución', '2025-01-13 14:30:00'),

-- Historial ticket 16 (Proyector - RESUELTO)
(16, 8, 'created', NULL, NULL, 'Ticket creado', '2025-01-14 08:00:00'),
(16, 1, 'status_change', 'Nuevo', 'Asignado', 'Asignado a Juan Pérez', '2025-01-14 08:15:00'),
(16, 3, 'status_change', 'Asignado', 'En Proceso', 'Técnico diagnosticando', '2025-01-14 09:00:00'),
(16, 3, 'status_change', 'En Proceso', 'Resuelto', 'Cable HDMI reemplazado', '2025-01-14 11:00:00'),
(16, 8, 'status_change', 'Resuelto', 'Cerrado', 'Usuario confirmó funcionamiento', '2025-01-14 11:30:00'),

-- Historial ticket 19 (Antivirus - CERRADO)
(19, 1, 'created', NULL, NULL, 'Ticket creado por admin', '2025-01-10 08:00:00'),
(19, 1, 'status_change', 'Nuevo', 'Asignado', 'Asignado a Pedro Ramírez', '2025-01-10 08:15:00'),
(19, 7, 'status_change', 'Asignado', 'En Proceso', 'Iniciando actualización masiva', '2025-01-10 09:00:00'),
(19, 7, 'status_change', 'En Proceso', 'Resuelto', '45 equipos actualizados exitosamente', '2025-01-10 16:00:00'),
(19, 1, 'status_change', 'Resuelto', 'Cerrado', 'Verificación completa, ticket cerrado', '2025-01-10 17:00:00');

-- ================================================================
-- 7. NOTIFICACIONES DEMO
-- ================================================================

INSERT INTO notifications (user_id, ticket_id, notification_type, title, message, is_read, created_at) VALUES
-- Notificaciones para técnicos
(3, 1, 'ticket_assigned', 'Ticket Crítico Asignado', 'Se te ha asignado el ticket ID-2025-001: Sistema de facturación caído', FALSE, '2025-01-15 08:20:00'),
(4, 2, 'ticket_assigned', 'Ticket Crítico Asignado', 'Se te ha asignado el ticket ID-2025-002: Servidor de base de datos en falla', FALSE, '2025-01-15 07:55:00'),
(5, 3, 'ticket_assigned', 'Ticket Crítico Asignado', 'Se te ha asignado el ticket ID-2025-003: Ataque ransomware detectado', FALSE, '2025-01-15 07:00:00'),

-- Notificaciones para usuarios que crearon tickets
(8, 1, 'ticket_updated', 'Ticket Actualizado', 'Tu ticket ID-2025-001 ha sido actualizado a estado: En Proceso', TRUE, '2025-01-15 08:30:00'),
(8, 4, 'ticket_assigned', 'Ticket Asignado', 'Tu ticket ID-2025-004 ha sido asignado a Juan Pérez', TRUE, '2025-01-15 09:05:00'),
(9, 5, 'ticket_resolved', 'Ticket Resuelto', 'Tu ticket ID-2025-005 ha sido resuelto: Red WiFi restaurada', TRUE, '2025-01-15 08:30:00'),

-- Notificaciones de comentarios
(8, 1, 'comment_added', 'Nuevo Comentario', 'Juan Pérez ha comentado en tu ticket ID-2025-001', TRUE, '2025-01-15 09:20:00'),
(3, 4, 'comment_added', 'Nuevo Comentario', 'Usuario ha respondido en ticket ID-2025-004', FALSE, '2025-01-15 09:40:00'),

-- Notificaciones para administradores
(1, 3, 'priority_escalated', 'Ticket Escalado', 'Ticket ID-2025-003 escalado a prioridad CRÍTICA', FALSE, '2025-01-15 07:00:00'),
(2, 2, 'priority_escalated', 'Ticket Escalado', 'Ticket ID-2025-002 requiere atención inmediata', FALSE, '2025-01-15 07:50:00');

-- ================================================================
-- 8. ACTUALIZAR CONTADORES DE NOTIFICACIONES
-- ================================================================

-- Este update se haría normalmente en el backend, pero para DEMO lo dejamos así

-- ================================================================
-- 9. ARCHIVOS ADJUNTOS DEMO (Simulados - solo metadatos)
-- ================================================================

INSERT INTO ticket_attachments (ticket_id, uploaded_by, filename, original_filename, file_size, mime_type, s3_key, description, created_at) VALUES
(1, 3, 'error-log-facturacion.txt', 'error-log-facturacion.txt', 15234, 'text/plain', 'attachments/2025/01/uuid-error-log.txt', 'Log de errores del servidor de facturación', '2025-01-15 08:35:00'),
(1, 3, 'diagnostico-iis.pdf', 'diagnostico-iis.pdf', 245678, 'application/pdf', 'attachments/2025/01/uuid-diagnostico.pdf', 'Reporte de diagnóstico del servicio IIS', '2025-01-15 09:10:00'),

(2, 4, 'raid-status-report.png', 'raid-status-screenshot.png', 891234, 'image/png', 'attachments/2025/01/uuid-raid-status.png', 'Captura de pantalla del estado del RAID', '2025-01-15 08:20:00'),
(2, 4, 'smart-disk-report.pdf', 'smart-analysis-disk2.pdf', 456789, 'application/pdf', 'attachments/2025/01/uuid-smart-report.pdf', 'Análisis SMART del disco defectuoso', '2025-01-15 08:45:00'),

(4, 3, 'error-49-impresora.jpg', 'foto-error-impresora.jpg', 1234567, 'image/jpeg', 'attachments/2025/01/uuid-error-foto.jpg', 'Foto del mensaje de error en pantalla de impresora', '2025-01-15 09:25:00'),

(5, 6, 'ap-config-backup.cfg', 'access-point-config.cfg', 8192, 'text/plain', 'attachments/2025/01/uuid-ap-config.cfg', 'Respaldo de configuración del AP antes del reemplazo', '2025-01-14 17:30:00'),

(16, 3, 'proyector-funcionando.jpg', 'proyector-ok.jpg', 2345678, 'image/jpeg', 'attachments/2025/01/uuid-proyector.jpg', 'Evidencia de proyector funcionando correctamente', '2025-01-14 11:15:00');

-- ================================================================
-- 10. CONFIGURACIONES DEL SISTEMA
-- ================================================================

UPDATE system_settings SET value = '20' WHERE setting_key = 'tickets_per_page';
UPDATE system_settings SET value = '4' WHERE setting_key = 'max_priority_days';
UPDATE system_settings SET value = 'america_mexico_city' WHERE setting_key = 'default_timezone';

-- ================================================================
-- RESUMEN DE DATOS CREADOS
-- ================================================================

SELECT 
    'USUARIOS CREADOS' as Tipo,
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as Activos,
    (SELECT COUNT(*) FROM users WHERE is_active = FALSE) as Inactivos,
    (SELECT COUNT(*) FROM users) as Total
UNION ALL
SELECT 
    'TICKETS CREADOS' as Tipo,
    (SELECT COUNT(*) FROM tickets WHERE status_id NOT IN (5,6)) as Activos,
    (SELECT COUNT(*) FROM tickets WHERE status_id IN (5,6)) as Cerrados_Resueltos,
    (SELECT COUNT(*) FROM tickets) as Total
UNION ALL
SELECT 
    'COMENTARIOS' as Tipo,
    (SELECT COUNT(*) FROM ticket_comments WHERE is_internal = FALSE) as Publicos,
    (SELECT COUNT(*) FROM ticket_comments WHERE is_internal = TRUE) as Internos,
    (SELECT COUNT(*) FROM ticket_comments) as Total
UNION ALL
SELECT 
    'ARCHIVOS ADJUNTOS' as Tipo,
    NULL as Col1,
    NULL as Col2,
    (SELECT COUNT(*) FROM ticket_attachments) as Total
UNION ALL
SELECT 
    'NOTIFICACIONES' as Tipo,
    (SELECT COUNT(*) FROM notifications WHERE is_read = FALSE) as No_Leidas,
    (SELECT COUNT(*) FROM notifications WHERE is_read = TRUE) as Leidas,
    (SELECT COUNT(*) FROM notifications) as Total;

-- ================================================================
-- INFORMACIÓN DE ACCESO PARA EL EQUIPO
-- ================================================================

SELECT 
    '========================================' as '',
    'CREDENCIALES DE ACCESO DEMO' as '',
    '========================================' as '',
    '' as '',
    'TODOS LOS USUARIOS TIENEN LA MISMA CONTRASEÑA: demo123' as '',
    '' as ''
UNION ALL
SELECT 
    'USUARIOS POR ROL:' as '',
    '' as '',
    '' as '',
    '' as '',
    '' as '',
    '' as ''
UNION ALL
SELECT 
    '1. ADMINISTRADORES:' as Tipo,
    'admin / admin.sistemas' as Usuarios,
    '' as '',
    '' as '',
    '' as '',
    '' as ''
UNION ALL
SELECT 
    '2. TÉCNICOS:' as Tipo,
    'juan.perez / maria.gonzalez / carlos.ruiz' as Usuarios,
    '' as '',
    '' as '',
    '' as '',
    '' as ''
UNION ALL
SELECT 
    '',
    'ana.torres / pedro.ramirez' as Usuarios,
    '' as '',
    '' as '',
    '' as '',
    '' as ''
UNION ALL
SELECT 
    '3. MESA DE TRABAJO:' as Tipo,
    'lucia.mesa / diego.soporte' as Usuarios,
    '' as '',
    '' as '',
    '' as '',
    '' as ''
UNION ALL
SELECT 
    '',
    'carmen.ventas / roberto.admin' as Usuarios,
    '' as '',
    '' as '',
    '' as '',
    '' as '';

SELECT '✅ Script de datos DEMO ejecutado exitosamente' as Resultado;
