-- =====================================================================
-- DATOS INICIALES (SEED DATA) PARA AWS RDS
-- =====================================================================
-- Ejecutar DESPUÉS de crear la estructura de tablas
-- Este archivo inserta los datos mínimos necesarios para que el sistema funcione

USE macTickets;

-- =====================================================================
-- 1. ROLES DE USUARIO
-- =====================================================================

INSERT INTO roles (id, name, description) VALUES
(1, 'administrador', 'Acceso completo al sistema, gestión de usuarios y reportes'),
(2, 'tecnico', 'Técnico de soporte, puede ver y resolver tickets asignados'),
(3, 'mesa_trabajo', 'Usuario de mesa de trabajo, puede crear tickets');

-- =====================================================================
-- 2. CATEGORÍAS DE TICKETS
-- =====================================================================

INSERT INTO categories (id, name, description, color, is_active, created_by) VALUES
(1, 'Hardware', 'Problemas con equipos físicos (PC, laptops, impresoras, etc.)', '#EF4444', 1, 1),
(2, 'Software', 'Instalación, actualización y problemas de software', '#3B82F6', 1, 1),
(3, 'Red', 'Problemas de conectividad, internet, VPN', '#10B981', 1, 1),
(4, 'Cuenta', 'Creación, modificación o reseteo de cuentas de usuario', '#F59E0B', 1, 1),
(5, 'Periféricos', 'Problemas con mouse, teclado, monitores, etc.', '#8B5CF6', 1, 1),
(6, 'Sistema', 'Problemas con sistema operativo', '#EC4899', 1, 1),
(7, 'Otro', 'Otros problemas no categorizados', '#6B7280', 1, 1);

-- =====================================================================
-- 3. PRIORIDADES
-- =====================================================================

INSERT INTO priorities (id, name, level, color, sla_hours, description) VALUES
(1, 'Baja', 1, '#4CAF50', 72, 'Problema menor, no afecta trabajo diario'),
(2, 'Media', 2, '#FF9800', 24, 'Problema que afecta parcialmente el trabajo'),
(3, 'Alta', 3, '#FF5722', 8, 'Problema que impide trabajo normal'),
(4, 'Crítica', 4, '#F44336', 4, 'Problema crítico que requiere atención inmediata');

-- =====================================================================
-- 4. ESTADOS DE TICKETS
-- =====================================================================

INSERT INTO ticket_statuses (id, name, color, description, is_final) VALUES
(1, 'Nuevo', '#6B7280', 'Ticket recién creado, pendiente de asignación', 0),
(2, 'Asignado', '#3B82F6', 'Ticket asignado a un técnico', 0),
(3, 'En Proceso', '#F59E0B', 'Técnico trabajando en el ticket', 0),
(4, 'Pendiente Cliente', '#8B5CF6', 'Esperando respuesta o acción del cliente', 0),
(5, 'Resuelto', '#10B981', 'Problema resuelto, pendiente de cerrar', 0),
(6, 'Cerrado', '#4B5563', 'Ticket cerrado y finalizado', 1),
(7, 'Reabierto', '#EF4444', 'Ticket reabierto después de estar cerrado', 0);

-- =====================================================================
-- 5. USUARIO ADMINISTRADOR POR DEFECTO
-- =====================================================================
-- Password: Admin123
-- Hash generado con bcrypt (12 rounds)

INSERT INTO users (
    id, 
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role_id, 
    phone,
    is_active, 
    created_by
) VALUES (
    1,
    'admin',
    'admin@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Administrador',
    'Sistema',
    1,
    '555-0100',
    1,
    1
);

-- =====================================================================
-- 6. USUARIOS DE PRUEBA (TÉCNICOS)
-- =====================================================================
-- Password para todos: Tecnico123

INSERT INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role_id, 
    phone,
    is_active, 
    created_by
) VALUES 
(
    'jtecnico',
    'jtecnico@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Juan',
    'Técnico',
    2,
    '555-0101',
    1,
    1
),
(
    'mtecnico',
    'mtecnico@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'María',
    'Técnico',
    2,
    '555-0102',
    1,
    1
),
(
    'ctecnico',
    'ctecnico@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Carlos',
    'Técnico',
    2,
    '555-0103',
    1,
    1
);

-- =====================================================================
-- 7. USUARIOS DE PRUEBA (MESA DE TRABAJO)
-- =====================================================================
-- Password para todos: Usuario123

INSERT INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role_id, 
    phone,
    is_active, 
    created_by
) VALUES 
(
    'lperez',
    'lperez@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Luis',
    'Pérez',
    3,
    '555-0201',
    1,
    1
),
(
    'agomez',
    'agomez@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Ana',
    'Gómez',
    3,
    '555-0202',
    1,
    1
);

-- =====================================================================
-- 8. TICKETS DE EJEMPLO (OPCIONAL)
-- =====================================================================
-- Puedes descomentar esto si quieres tener tickets de prueba

/*
INSERT INTO tickets (
    ticket_number,
    title,
    description,
    category_id,
    priority_id,
    status_id,
    created_by,
    client_company,
    client_contact,
    location
) VALUES 
(
    'ID-001',
    'Impresora HP no imprime',
    'La impresora de la oficina 201 no responde al enviar trabajos de impresión. Se queda en cola.',
    1, -- Hardware
    2, -- Media
    1, -- Nuevo
    1, -- Creado por admin
    'MAC Computadoras',
    'Juan Pérez',
    'Oficina 201, Piso 2'
),
(
    'ID-002',
    'Instalación de Microsoft Office',
    'Nuevo empleado necesita instalación de Office 365 en su equipo.',
    2, -- Software
    2, -- Media
    1, -- Nuevo
    1,
    'MAC Computadoras',
    'María López',
    'Oficina 105, Piso 1'
),
(
    'ID-003',
    'Sin acceso a internet',
    'No hay conexión a internet en toda el área de ventas.',
    3, -- Red
    4, -- Crítica
    1, -- Nuevo
    1,
    'MAC Computadoras',
    'Carlos Méndez',
    'Área de Ventas, Piso 1'
);
*/

-- =====================================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================================

SELECT '===== ROLES =====' AS '';
SELECT * FROM roles;

SELECT '===== CATEGORÍAS =====' AS '';
SELECT * FROM categories;

SELECT '===== PRIORIDADES =====' AS '';
SELECT * FROM priorities;

SELECT '===== ESTADOS =====' AS '';
SELECT * FROM ticket_statuses;

SELECT '===== USUARIOS =====' AS '';
SELECT id, username, email, first_name, last_name, role_id, is_active FROM users;

-- SELECT '===== TICKETS =====' AS '';
-- SELECT * FROM tickets;

-- =====================================================================
-- RESUMEN
-- =====================================================================

SELECT 
    (SELECT COUNT(*) FROM roles) AS total_roles,
    (SELECT COUNT(*) FROM categories) AS total_categorias,
    (SELECT COUNT(*) FROM priorities) AS total_prioridades,
    (SELECT COUNT(*) FROM ticket_statuses) AS total_estados,
    (SELECT COUNT(*) FROM users) AS total_usuarios,
    (SELECT COUNT(*) FROM tickets) AS total_tickets;

-- =====================================================================
-- CREDENCIALES DE PRUEBA
-- =====================================================================
/*
USUARIOS CREADOS:

1. ADMINISTRADOR
   Username: admin
   Password: Admin123
   Email: admin@maccomputadoras.com

2. TÉCNICOS (Password para todos: Tecnico123)
   - jtecnico / jtecnico@maccomputadoras.com
   - mtecnico / mtecnico@maccomputadoras.com
   - ctecnico / ctecnico@maccomputadoras.com

3. MESA DE TRABAJO (Password para todos: Usuario123)
   - lperez / lperez@maccomputadoras.com
   - agomez / agomez@maccomputadoras.com

CATEGORÍAS CREADAS:
1. Hardware (Rojo)
2. Software (Azul)
3. Red (Verde)
4. Cuenta (Naranja)
5. Periféricos (Morado)
6. Sistema (Rosa)
7. Otro (Gris)

PRIORIDADES:
1. Baja (72h SLA)
2. Media (24h SLA)
3. Alta (8h SLA)
4. Crítica (4h SLA)

ESTADOS:
1. Nuevo
2. Asignado
3. En Proceso
4. Pendiente Cliente
5. Resuelto
6. Cerrado (Final)
7. Reabierto
*/

