-- =====================================================================
-- SCHEMA COMPLETO - MAC TICKETS SYSTEM
-- Copiar y pegar COMPLETO en AWS RDS
-- Base de datos: mactickets
-- =====================================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS mactickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mactickets;

-- =====================================================================
-- TABLA: roles
-- =====================================================================
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    INDEX idx_roles_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: users
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    avatar_url VARCHAR(255) NULL,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_users_login (username, is_active, deleted_at),
    INDEX idx_users_security (email, login_attempts, locked_until, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: categories
-- =====================================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    color VARCHAR(7) DEFAULT '#6B7280',
    is_active TINYINT(1) DEFAULT 1,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_categories_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_categories_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: priorities
-- =====================================================================
CREATE TABLE IF NOT EXISTS priorities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    level INT NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL,
    sla_hours INT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    INDEX idx_priorities_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: ticket_statuses
-- =====================================================================
CREATE TABLE IF NOT EXISTS ticket_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    color VARCHAR(7) NOT NULL,
    is_final TINYINT(1) DEFAULT 0,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    INDEX idx_ticket_statuses_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: tickets
-- =====================================================================
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    priority_id INT NOT NULL,
    status_id INT DEFAULT 1 NOT NULL,
    created_by INT NOT NULL,
    assigned_to INT NULL,
    assigned_by INT NULL,
    assigned_at TIMESTAMP NULL,
    accepted_at TIMESTAMP NULL,
    first_response_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    reopen_reason TEXT NULL,
    solution_description TEXT NULL,
    priority_justification TEXT NULL,
    estimated_hours DECIMAL(5,2) DEFAULT 0.00,
    actual_hours DECIMAL(5,2) DEFAULT 0.00,
    resolution_time_hours DECIMAL(8,2) NULL,
    sla_breach TINYINT(1) DEFAULT 0,
    client_company VARCHAR(100) NULL,
    client_contact VARCHAR(100) NULL,
    client_email VARCHAR(100) NULL,
    client_phone VARCHAR(20) NULL,
    client_department VARCHAR(100) NULL,
    location TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    pdf_generated_at DATETIME NULL,
    pdf_generated_count INT DEFAULT 0,
    CONSTRAINT fk_tickets_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_tickets_priority FOREIGN KEY (priority_id) REFERENCES priorities(id),
    CONSTRAINT fk_tickets_status FOREIGN KEY (status_id) REFERENCES ticket_statuses(id),
    CONSTRAINT fk_tickets_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_tickets_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id),
    CONSTRAINT fk_tickets_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id),
    INDEX idx_tickets_compound (status_id, priority_id, created_at, deleted_at),
    INDEX idx_tickets_client (client_company, client_email, deleted_at),
    INDEX idx_tickets_sla (created_at, priority_id, resolved_at, deleted_at),
    INDEX idx_tickets_metrics (first_response_at, resolution_time_hours, sla_breach)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: ticket_attachments (SIN S3 - ALMACENAMIENTO LOCAL)
-- =====================================================================
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL COMMENT 'Ruta local del archivo',
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    storage_type ENUM('local', 'external') DEFAULT 'local' NOT NULL,
    is_image TINYINT(1) DEFAULT 0,
    description TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_attachments_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_attachments_ticket (ticket_id, created_at, deleted_at),
    INDEX idx_attachments_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: ticket_comments
-- =====================================================================
CREATE TABLE IF NOT EXISTS ticket_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal TINYINT(1) DEFAULT 0,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_comments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_comments_ticket (ticket_id, created_at, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: ticket_history
-- =====================================================================
CREATE TABLE IF NOT EXISTS ticket_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type ENUM('created', 'status_changed', 'assigned', 'reassigned', 'commented', 'attachment_added', 'reopened', 'closed', 'first_response', 'sla_breach') NOT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    description TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_ticket_history_compound (ticket_id, action_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: notifications
-- =====================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ticket_id INT NULL,
    type ENUM('ticket_assigned', 'ticket_status_changed', 'ticket_commented', 'ticket_reopened', 'sla_warning', 'sla_breach', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    read_at TIMESTAMP NULL,
    data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    INDEX idx_notifications_unread (user_id, is_read, created_at, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: system_settings
-- =====================================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public TINYINT(1) DEFAULT 0,
    updated_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    CONSTRAINT fk_system_settings_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_system_settings_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: ticket_status_transitions
-- =====================================================================
CREATE TABLE IF NOT EXISTS ticket_status_transitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_status_id INT NOT NULL,
    to_status_id INT NOT NULL,
    allowed_roles JSON NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_transition UNIQUE (from_status_id, to_status_id),
    CONSTRAINT fk_transition_from_status FOREIGN KEY (from_status_id) REFERENCES ticket_statuses(id),
    CONSTRAINT fk_transition_to_status FOREIGN KEY (to_status_id) REFERENCES ticket_statuses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- DATOS INICIALES: Roles
-- =====================================================================
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Administrador del sistema'),
(2, 'tecnico', 'Técnico de soporte'),
(3, 'mesa_trabajo', 'Usuario de mesa de trabajo')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- =====================================================================
-- DATOS INICIALES: Prioridades
-- =====================================================================
INSERT INTO priorities (id, name, level, color, sla_hours, is_active) VALUES
(1, 'Baja', 1, '#4CAF50', 72, 1),
(2, 'Media', 2, '#FF9800', 24, 1),
(3, 'Alta', 3, '#FF5722', 8, 1),
(4, 'Crítica', 4, '#F44336', 4, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color), sla_hours=VALUES(sla_hours);

-- =====================================================================
-- DATOS INICIALES: Estados de Tickets
-- =====================================================================
INSERT INTO ticket_statuses (id, name, description, color, is_final, order_index) VALUES
(1, 'Nuevo', 'Ticket recién creado', '#6B7280', 0, 1),
(2, 'Asignado', 'Asignado a un técnico', '#3B82F6', 0, 2),
(3, 'En Proceso', 'Técnico trabajando en el ticket', '#F59E0B', 0, 3),
(4, 'Pendiente Cliente', 'Esperando respuesta del cliente', '#8B5CF6', 0, 4),
(5, 'Resuelto', 'Ticket resuelto', '#10B981', 0, 5),
(6, 'Cerrado', 'Ticket cerrado', '#4B5563', 1, 6),
(7, 'Reabierto', 'Ticket reabierto', '#EF4444', 0, 7)
ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color), is_final=VALUES(is_final);

-- =====================================================================
-- DATOS INICIALES: Categorías (Ejemplo)
-- =====================================================================
-- Necesitas crear un usuario admin primero para esto
-- Se puede hacer después de crear el primer usuario

-- =====================================================================
-- VISTA: ticket_details (Opcional - Para reportes)
-- =====================================================================
CREATE OR REPLACE VIEW ticket_details AS
SELECT 
    t.*,
    c.name AS category_name,
    c.color AS category_color,
    p.name AS priority_name,
    p.color AS priority_color,
    p.level AS priority_level,
    s.name AS status_name,
    s.color AS status_color,
    creator.username AS created_by_username,
    CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_name,
    assignee.username AS assigned_to_username,
    CONCAT(assignee.first_name, ' ', assignee.last_name) AS assigned_to_name
FROM tickets t
LEFT JOIN categories c ON t.category_id = c.id AND c.deleted_at IS NULL
LEFT JOIN priorities p ON t.priority_id = p.id AND p.deleted_at IS NULL
LEFT JOIN ticket_statuses s ON t.status_id = s.id AND s.deleted_at IS NULL
LEFT JOIN users creator ON t.created_by = creator.id AND creator.deleted_at IS NULL
LEFT JOIN users assignee ON t.assigned_to = assignee.id AND assignee.deleted_at IS NULL
WHERE t.deleted_at IS NULL;

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================
SHOW TABLES;

SELECT 'Schema creado exitosamente - mactickets' AS Status;

