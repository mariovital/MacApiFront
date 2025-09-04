-- =====================================================================
-- ESQUEMA MEJORADO - Sistema de Gestión de Tickets
-- =====================================================================
-- Versión: 2.0 Mejorada
-- Incorpora: Seguridad, Métricas, Soft Delete, Auditoría y Control de Estados
-- Fecha: Septiembre 2024
-- =====================================================================

-- =====================================================================
-- 1. TABLA DE ROLES
-- =====================================================================
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL
);

-- Insertar roles predeterminados
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador del sistema'),
('tecnico', 'Técnico de soporte'),
('mesa_trabajo', 'Mesa de trabajo');

-- =====================================================================
-- 2. TABLA DE USUARIOS (CON MEJORAS DE SEGURIDAD)
-- =====================================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    avatar_url VARCHAR(255),
    last_login TIMESTAMP NULL,
    
    -- Campos de Seguridad (Nuevos)
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Insertar usuario admin por defecto (Contraseña: "admin123")
-- Hash generado con bcrypt rounds=12: $2b$12$DPrR8qj127U5aD9vJnoOa.1JMbbPNAz8LXXGvIsjZp3lljcYp3mne
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, password_changed_at) VALUES
('admin', 'admin@tuempresa.com', '$2b$12$DPrR8qj127U5aD9vJnoOa.1JMbbPNAz8LXXGvIsjZp3lljcYp3mne', 'Super', 'Admin', 1, CURRENT_TIMESTAMP);

-- =====================================================================
-- 3. TABLA DE CATEGORÍAS
-- =====================================================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280', -- Color hex para UI
    is_active BOOLEAN DEFAULT true,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insertar categorías por defecto
INSERT INTO categories (name, description, color, created_by) VALUES
('Hardware', 'Problemas con equipos físicos', '#EF4444', 1),
('Software', 'Problemas con aplicaciones', '#3B82F6', 1),
('Red', 'Problemas de conectividad', '#10B981', 1),
('Cuenta', 'Problemas con cuentas de usuario', '#F59E0B', 1);

-- =====================================================================
-- 4. TABLA DE PRIORIDADES
-- =====================================================================
CREATE TABLE priorities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    level INT NOT NULL UNIQUE, -- 1=Baja, 2=Media, 3=Alta, 4=Crítica
    color VARCHAR(7) NOT NULL,
    sla_hours INT NOT NULL, -- Horas para resolución según SLA
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL
);

-- Insertar prioridades por defecto
INSERT INTO priorities (name, level, color, sla_hours) VALUES
('Baja', 1, '#4CAF50', 72),
('Media', 2, '#FF9800', 24),
('Alta', 3, '#FF5722', 8),
('Crítica', 4, '#F44336', 4);

-- =====================================================================
-- 5. TABLA DE ESTADOS DE TICKETS
-- =====================================================================
CREATE TABLE ticket_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    is_final BOOLEAN DEFAULT false, -- Para estados finales como "Cerrado"
    order_index INT NOT NULL, -- Para ordenar estados en UI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL
);

-- Insertar estados por defecto
INSERT INTO ticket_statuses (name, description, color, is_final, order_index) VALUES
('Nuevo', 'Ticket recién creado', '#6B7280', false, 1),
('Asignado', 'Asignado a técnico', '#3B82F6', false, 2),
('En Proceso', 'Técnico trabajando en la solución', '#F59E0B', false, 3),
('Pendiente Cliente', 'Esperando respuesta del cliente', '#8B5CF6', false, 4),
('Resuelto', 'Trabajo completado por técnico', '#10B981', false, 5),
('Cerrado', 'Ticket finalizado', '#4B5563', true, 6),
('Reabierto', 'Ticket reabierto por administrador', '#EF4444', false, 7);

-- =====================================================================
-- 6. TABLA DE TRANSICIONES DE ESTADOS (NUEVA)
-- =====================================================================
CREATE TABLE ticket_status_transitions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_status_id INT NOT NULL,
    to_status_id INT NOT NULL,
    allowed_roles JSON NOT NULL, -- ["admin", "tecnico", "mesa_trabajo"]
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (from_status_id) REFERENCES ticket_statuses(id),
    FOREIGN KEY (to_status_id) REFERENCES ticket_statuses(id),
    UNIQUE KEY unique_transition (from_status_id, to_status_id)
);

-- Insertar transiciones permitidas por defecto
INSERT INTO ticket_status_transitions (from_status_id, to_status_id, allowed_roles, description) VALUES
-- Desde Nuevo
(1, 2, '["admin", "mesa_trabajo"]', 'Asignar ticket a técnico'),
-- Desde Asignado
(2, 3, '["tecnico"]', 'Técnico acepta y comienza trabajo'),
(2, 1, '["admin", "tecnico"]', 'Rechazar asignación'),
-- Desde En Proceso
(3, 4, '["tecnico"]', 'Requiere información del cliente'),
(3, 5, '["tecnico"]', 'Trabajo completado'),
-- Desde Pendiente Cliente
(4, 3, '["tecnico"]', 'Cliente respondió, continuar trabajo'),
-- Desde Resuelto
(5, 6, '["admin", "mesa_trabajo"]', 'Confirmar cierre'),
(5, 7, '["admin"]', 'Reabrir por problemas'),
-- Desde Cerrado
(6, 7, '["admin"]', 'Reabrir ticket cerrado'),
-- Desde Reabierto
(7, 2, '["admin"]', 'Reasignar ticket reabierto');

-- =====================================================================
-- 7. TABLA PRINCIPAL DE TICKETS (CON TODAS LAS MEJORAS)
-- =====================================================================
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- NOTA: ticket_number se generará en el backend (NO trigger)
    ticket_number VARCHAR(20) NOT NULL UNIQUE, -- Formato: #ID-001, #ID-002, etc.
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    priority_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 1, -- Nuevo por defecto
    
    -- Usuarios relacionados
    created_by INT NOT NULL, -- Usuario que creó el ticket
    assigned_to INT NULL, -- Técnico asignado
    assigned_by INT NULL, -- Quien lo asignó
    
    -- Timestamps de flujo
    assigned_at TIMESTAMP NULL,
    accepted_at TIMESTAMP NULL, -- Cuando técnico aceptó
    first_response_at TIMESTAMP NULL, -- NUEVA: Primera respuesta técnica (KPI)
    resolved_at TIMESTAMP NULL, -- Cuando se marcó como resuelto
    closed_at TIMESTAMP NULL, -- Cuando se cerró definitivamente
    
    -- Información de resolución
    reopen_reason TEXT NULL, -- Motivo de reapertura
    solution_description TEXT NULL, -- Descripción de la solución
    priority_justification TEXT NULL, -- NUEVA: Por qué es crítica/alta
    
    -- Métricas de tiempo (NUEVAS)
    estimated_hours DECIMAL(5,2) DEFAULT 0,
    actual_hours DECIMAL(5,2) DEFAULT 0,
    resolution_time_hours DECIMAL(8,2) NULL, -- Calculado automáticamente
    sla_breach BOOLEAN DEFAULT FALSE, -- Si se rompió el SLA
    
    -- Información de cliente (MEJORADA)
    client_company VARCHAR(100),
    client_contact VARCHAR(100),
    client_email VARCHAR(100) NULL, -- NUEVA
    client_phone VARCHAR(20) NULL, -- NUEVA
    client_department VARCHAR(100) NULL, -- NUEVA
    location TEXT, -- Ubicación física si aplica
    
    -- Auditoría de seguridad (NUEVA)
    ip_address VARCHAR(45) NULL, -- IP que creó el ticket
    user_agent TEXT NULL, -- Navegador/dispositivo
    
    -- Timestamps estándar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    
    -- Foreign Keys
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (priority_id) REFERENCES priorities(id),
    FOREIGN KEY (status_id) REFERENCES ticket_statuses(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- =====================================================================
-- 8. TABLA DE COMENTARIOS/NOTAS DE TICKETS
-- =====================================================================
CREATE TABLE ticket_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- true = nota interna, false = visible para cliente
    
    -- Auditoría (NUEVA)
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================================
-- 9. TABLA DE ARCHIVOS ADJUNTOS
-- =====================================================================
CREATE TABLE ticket_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL, -- Quien subió el archivo
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL, -- Nombre en S3
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    s3_url VARCHAR(500) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    is_image BOOLEAN DEFAULT false,
    description TEXT NULL, -- Descripción del archivo
    
    -- Auditoría (NUEVA)
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================================
-- 10. TABLA DE HISTORIAL DE CAMBIOS (TRAZABILIDAD)
-- =====================================================================
CREATE TABLE ticket_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type ENUM('created', 'status_changed', 'assigned', 'reassigned', 'commented', 'attachment_added', 'reopened', 'closed', 'first_response', 'sla_breach') NOT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    description TEXT, -- Descripción legible del cambio
    
    -- Auditoría (NUEVA)
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================================
-- 11. TABLA DE NOTIFICACIONES
-- =====================================================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ticket_id INT NULL,
    type ENUM('ticket_assigned', 'ticket_status_changed', 'ticket_commented', 'ticket_reopened', 'sla_warning', 'sla_breach', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP NULL,
    data JSON NULL, -- Datos adicionales en formato JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- =====================================================================
-- 12. TABLA DE CONFIGURACIONES DEL SISTEMA
-- =====================================================================
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public BOOLEAN DEFAULT false, -- true = visible en frontend
    updated_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Soft Delete
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Configuraciones por defecto
INSERT INTO system_settings (setting_key, setting_value, description, setting_type, is_public, updated_by) VALUES
('company_name', 'MAC Computadoras', 'Nombre de la empresa', 'string', true, 1),
('max_file_size', '10485760', 'Tamaño máximo de archivo en bytes (10MB)', 'number', false, 1),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf","doc","docx","txt","mp4","mov"]', 'Tipos de archivo permitidos', 'json', false, 1),
('tickets_per_page', '20', 'Tickets por página en listados', 'number', true, 1),
('auto_assign_tickets', 'false', 'Asignación automática de tickets', 'boolean', false, 1),
('sla_warning_hours', '2', 'Horas antes del SLA para enviar advertencia', 'number', false, 1),
('max_login_attempts', '5', 'Máximo intentos de login antes de bloquear', 'number', false, 1),
('account_lockout_minutes', '15', 'Minutos de bloqueo por exceso de intentos', 'number', false, 1);

-- =====================================================================
-- 13. VISTA MEJORADA PARA OBTENER INFORMACIÓN COMPLETA DE TICKETS
-- =====================================================================
CREATE VIEW ticket_details AS
SELECT 
    t.*,
    -- Categoría
    c.name as category_name,
    c.color as category_color,
    -- Prioridad
    p.name as priority_name,
    p.color as priority_color,
    p.level as priority_level,
    p.sla_hours as priority_sla_hours,
    -- Estado
    s.name as status_name,
    s.color as status_color,
    s.is_final as status_is_final,
    -- Creador
    creator.username as created_by_username,
    CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
    creator.email as created_by_email,
    -- Asignado
    assignee.username as assigned_to_username,
    CONCAT(assignee.first_name, ' ', assignee.last_name) as assigned_to_name,
    assignee.email as assigned_to_email,
    -- Quien asignó
    assigner.username as assigned_by_username,
    CONCAT(assigner.first_name, ' ', assigner.last_name) as assigned_by_name,
    -- Métricas calculadas
    CASE 
        WHEN t.resolved_at IS NOT NULL AND t.created_at IS NOT NULL 
        THEN TIMESTAMPDIFF(HOUR, t.created_at, t.resolved_at)
        ELSE NULL 
    END as actual_resolution_hours,
    CASE 
        WHEN t.first_response_at IS NOT NULL AND t.created_at IS NOT NULL 
        THEN TIMESTAMPDIFF(MINUTE, t.created_at, t.first_response_at)
        ELSE NULL 
    END as first_response_minutes,
    -- Estado SLA
    CASE 
        WHEN t.resolved_at IS NOT NULL 
        THEN (TIMESTAMPDIFF(HOUR, t.created_at, t.resolved_at) > p.sla_hours)
        WHEN t.status_id != 6 -- No cerrado
        THEN (TIMESTAMPDIFF(HOUR, t.created_at, NOW()) > p.sla_hours)
        ELSE false
    END as is_sla_breached
FROM tickets t
LEFT JOIN categories c ON t.category_id = c.id AND c.deleted_at IS NULL
LEFT JOIN priorities p ON t.priority_id = p.id AND p.deleted_at IS NULL
LEFT JOIN ticket_statuses s ON t.status_id = s.id AND s.deleted_at IS NULL
LEFT JOIN users creator ON t.created_by = creator.id AND creator.deleted_at IS NULL
LEFT JOIN users assignee ON t.assigned_to = assignee.id AND assignee.deleted_at IS NULL
LEFT JOIN users assigner ON t.assigned_by = assigner.id AND assigner.deleted_at IS NULL
WHERE t.deleted_at IS NULL;

-- =====================================================================
-- 14. ÍNDICES OPTIMIZADOS PARA PERFORMANCE
-- =====================================================================

-- Índices originales mejorados
CREATE INDEX idx_tickets_compound ON tickets(status_id, priority_id, created_at, deleted_at);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, created_at, deleted_at);
CREATE INDEX idx_ticket_history_compound ON ticket_history(ticket_id, action_type, created_at);

-- Nuevos índices para campos agregados
CREATE INDEX idx_tickets_sla ON tickets(created_at, priority_id, resolved_at, deleted_at);
CREATE INDEX idx_tickets_metrics ON tickets(first_response_at, resolution_time_hours, sla_breach);
CREATE INDEX idx_tickets_client ON tickets(client_company, client_email, deleted_at);
CREATE INDEX idx_users_security ON users(email, login_attempts, locked_until, deleted_at);
CREATE INDEX idx_users_login ON users(username, is_active, deleted_at);
CREATE INDEX idx_comments_ticket ON ticket_comments(ticket_id, created_at, deleted_at);
CREATE INDEX idx_attachments_ticket ON ticket_attachments(ticket_id, created_at, deleted_at);

-- Índices para soft delete en todas las tablas principales
CREATE INDEX idx_roles_deleted ON roles(deleted_at);
CREATE INDEX idx_categories_deleted ON categories(deleted_at);
CREATE INDEX idx_priorities_deleted ON priorities(deleted_at);
CREATE INDEX idx_ticket_statuses_deleted ON ticket_statuses(deleted_at);
CREATE INDEX idx_system_settings_deleted ON system_settings(deleted_at);

-- =====================================================================
-- 15. FUNCIONES Y PROCEDIMIENTOS ALMACENADOS (OPCIONAL)
-- =====================================================================

-- Función para calcular si un ticket está en breach de SLA
DELIMITER //
CREATE FUNCTION is_ticket_sla_breached(
    ticket_created_at TIMESTAMP,
    ticket_resolved_at TIMESTAMP,
    priority_sla_hours INT
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE hours_taken INT;
    
    IF ticket_resolved_at IS NOT NULL THEN
        SET hours_taken = TIMESTAMPDIFF(HOUR, ticket_created_at, ticket_resolved_at);
    ELSE
        SET hours_taken = TIMESTAMPDIFF(HOUR, ticket_created_at, NOW());
    END IF;
    
    RETURN (hours_taken > priority_sla_hours);
END//
DELIMITER ;

-- =====================================================================
-- FIN DEL ESQUEMA MEJORADO
-- =====================================================================

-- Comentarios finales:
-- 1. El ticket_number se genera en el backend antes del INSERT
-- 2. Todos los campos de auditoría son opcionales (NULL permitido)
-- 3. Soft delete implementado en todas las tablas principales
-- 4. Los índices están optimizados para queries comunes y soft delete
-- 5. La vista ticket_details incluye cálculos de métricas en tiempo real
-- 6. Las transiciones de estado están controladas por la tabla ticket_status_transitions
-- 7. Configuraciones de seguridad incluidas en system_settings

-- Para aplicar este esquema:
-- 1. Crear base de datos: CREATE DATABASE ticket_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. Usar la base de datos: USE ticket_system;
-- 3. Ejecutar este script completo
-- 4. Verificar que el usuario admin fue creado correctamente
-- 5. Cambiar las credenciales por defecto en el primer despliegue
