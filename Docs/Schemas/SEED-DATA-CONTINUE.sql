-- =====================================================================
-- CONTINUAR INSERCIÓN DE DATOS (Sin categorías que ya existen)
-- =====================================================================
-- Ejecutar esto si ya insertaste las categorías pero faltó el resto

USE macTickets;

-- =====================================================================
-- 1. ROLES DE USUARIO
-- =====================================================================

INSERT IGNORE INTO roles (id, name, description) VALUES
(1, 'administrador', 'Acceso completo al sistema, gestión de usuarios y reportes'),
(2, 'tecnico', 'Técnico de soporte, puede ver y resolver tickets asignados'),
(3, 'mesa_trabajo', 'Usuario de mesa de trabajo, puede crear tickets');

-- =====================================================================
-- 2. PRIORIDADES (SIN COLUMNA DESCRIPTION)
-- =====================================================================

INSERT IGNORE INTO priorities (id, name, level, color, sla_hours, is_active) VALUES
(1, 'Baja', 1, '#4CAF50', 72, 1),
(2, 'Media', 2, '#FF9800', 24, 1),
(3, 'Alta', 3, '#FF5722', 8, 1),
(4, 'Crítica', 4, '#F44336', 4, 1);

-- =====================================================================
-- 3. ESTADOS DE TICKETS (CON ORDER_INDEX)
-- =====================================================================

INSERT IGNORE INTO ticket_statuses (id, name, description, color, is_final, order_index) VALUES
(1, 'Nuevo', 'Ticket recién creado, pendiente de asignación', '#6B7280', 0, 1),
(2, 'Asignado', 'Ticket asignado a un técnico', '#3B82F6', 0, 2),
(3, 'En Proceso', 'Técnico trabajando en el ticket', '#F59E0B', 0, 3),
(4, 'Pendiente Cliente', 'Esperando respuesta o acción del cliente', '#8B5CF6', 0, 4),
(5, 'Resuelto', 'Problema resuelto, pendiente de cerrar', '#10B981', 0, 5),
(6, 'Cerrado', 'Ticket cerrado y finalizado', '#4B5563', 1, 6),
(7, 'Reabierto', 'Ticket reabierto después de estar cerrado', '#EF4444', 0, 7);

-- =====================================================================
-- 4. USUARIO ADMINISTRADOR
-- =====================================================================
-- Username: admin
-- Password: Admin123

INSERT IGNORE INTO users (
    id, 
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role_id,
    is_active
) VALUES (
    1,
    'admin',
    'admin@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Administrador',
    'Sistema',
    1,
    1
);

-- =====================================================================
-- 5. USUARIOS TÉCNICOS (Password: Tecnico123)
-- =====================================================================

INSERT IGNORE INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role_id,
    is_active
) VALUES 
(
    'jtecnico',
    'jtecnico@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Juan',
    'Técnico',
    2,
    1
),
(
    'mtecnico',
    'mtecnico@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'María',
    'Técnico',
    2,
    1
),
(
    'ctecnico',
    'ctecnico@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Carlos',
    'Técnico',
    2,
    1
);

-- =====================================================================
-- 6. USUARIOS MESA DE TRABAJO (Password: Usuario123)
-- =====================================================================

INSERT IGNORE INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role_id,
    is_active
) VALUES 
(
    'lperez',
    'lperez@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Luis',
    'Pérez',
    3,
    1
),
(
    'agomez',
    'agomez@maccomputadoras.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7TmQ8QC8Uu',
    'Ana',
    'Gómez',
    3,
    1
);

-- =====================================================================
-- VERIFICACIÓN
-- =====================================================================

SELECT '===== RESUMEN =====' AS '';

SELECT 
    (SELECT COUNT(*) FROM roles) AS Roles,
    (SELECT COUNT(*) FROM categories) AS Categorias,
    (SELECT COUNT(*) FROM priorities) AS Prioridades,
    (SELECT COUNT(*) FROM ticket_statuses) AS Estados,
    (SELECT COUNT(*) FROM users) AS Usuarios;

SELECT '===== USUARIOS CREADOS =====' AS '';
SELECT id, username, email, first_name, last_name, role_id FROM users;

-- =====================================================================
-- CREDENCIALES
-- =====================================================================
/*
ADMIN:
  Username: admin
  Password: Admin123

TÉCNICOS (Password: Tecnico123):
  - jtecnico@maccomputadoras.com
  - mtecnico@maccomputadoras.com
  - ctecnico@maccomputadoras.com

MESA DE TRABAJO (Password: Usuario123):
  - lperez@maccomputadoras.com
  - agomez@maccomputadoras.com
*/

