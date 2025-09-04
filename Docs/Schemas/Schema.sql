
-- Esquema de Base de Datos para Sistema de Gestión de Tickets
-- Basado en las Historias de Usuario proporcionadas

-- Tabla de Roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar roles predeterminados
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador del sistema'),
('tecnico', 'Técnico de soporte'),
('mesa_trabajo', 'Mesa de trabajo');

-- Tabla de Usuarios
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
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Tabla de Categorías
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280', -- Color hex para UI
    is_active BOOLEAN DEFAULT true,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insertar categorías por defecto
INSERT INTO categories (name, description, color, created_by) VALUES
('Hardware', 'Problemas con equipos físicos', '#EF4444', 1),
('Software', 'Problemas con aplicaciones', '#3B82F6', 1),
('Red', 'Problemas de conectividad', '#10B981', 1),
('Cuenta', 'Problemas con cuentas de usuario', '#F59E0B', 1);

-- Tabla de Prioridades
CREATE TABLE priorities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    level INT NOT NULL UNIQUE, -- 1=Baja, 2=Media, 3=Alta, 4=Crítica
    color VARCHAR(7) NOT NULL,
    sla_hours INT NOT NULL, -- Horas para resolución según SLA
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar prioridades por defecto
INSERT INTO priorities (name, level, color, sla_hours) VALUES
('Baja', 1, '#4CAF50', 72),
('Media', 2, '#FF9800', 24),
('Alta', 3, '#FF5722', 8),
('Crítica', 4, '#F44336', 4);

-- Tabla de Estados de Tickets
CREATE TABLE ticket_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    is_final BOOLEAN DEFAULT false, -- Para estados finales como "Cerrado"
    order_index INT NOT NULL, -- Para ordenar estados en UI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Tabla principal de Tickets
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(20) NOT NULL UNIQUE, -- Formato: #ID-123
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    priority_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 1, -- Nuevo por defecto
    created_by INT NOT NULL, -- Usuario que creó el ticket
    assigned_to INT NULL, -- Técnico asignado
    assigned_by INT NULL, -- Quien lo asignó
    assigned_at TIMESTAMP NULL,
    accepted_at TIMESTAMP NULL, -- Cuando técnico aceptó
    resolved_at TIMESTAMP NULL, -- Cuando se marcó como resuelto
    closed_at TIMESTAMP NULL, -- Cuando se cerró definitivamente
    reopen_reason TEXT NULL, -- Motivo de reapertura
    solution_description TEXT NULL, -- Descripción de la solución
    estimated_hours DECIMAL(5,2) DEFAULT 0,
    actual_hours DECIMAL(5,2) DEFAULT 0,
    client_company VARCHAR(100), -- Empresa del cliente
    client_contact VARCHAR(100), -- Contacto del cliente
    location TEXT, -- Ubicación física si aplica
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (priority_id) REFERENCES priorities(id),
    FOREIGN KEY (status_id) REFERENCES ticket_statuses(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_status (status_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_by (created_by),
    INDEX idx_priority (priority_id),
    INDEX idx_created_at (created_at)
);

-- Tabla de Comentarios/Notas de Tickets
CREATE TABLE ticket_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- true = nota interna, false = visible para cliente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_created_at (created_at)
);

-- Tabla de Archivos Adjuntos
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_ticket_id (ticket_id)
);

-- Tabla de Historial de Cambios (Trazabilidad)
CREATE TABLE ticket_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type ENUM('created', 'status_changed', 'assigned', 'reassigned', 'commented', 'attachment_added', 'reopened', 'closed') NOT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    description TEXT, -- Descripción legible del cambio
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
);

-- Tabla de Notificaciones
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ticket_id INT NULL,
    type ENUM('ticket_assigned', 'ticket_status_changed', 'ticket_commented', 'ticket_reopened', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP NULL,
    data JSON NULL, -- Datos adicionales en formato JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Tabla de Configuraciones del Sistema
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
    
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Configuraciones por defecto
INSERT INTO system_settings (setting_key, setting_value, description, setting_type, is_public, updated_by) VALUES
('company_name', 'MAC Computadoras', 'Nombre de la empresa', 'string', true, 1),
('max_file_size', '10485760', 'Tamaño máximo de archivo en bytes (10MB)', 'number', false, 1),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf","doc","docx","txt"]', 'Tipos de archivo permitidos', 'json', false, 1),
('tickets_per_page', '20', 'Tickets por página en listados', 'number', true, 1),
('auto_assign_tickets', 'false', 'Asignación automática de tickets', 'boolean', false, 1);

-- Crear trigger para generar número de ticket automáticamente
DELIMITER //
CREATE TRIGGER generate_ticket_number 
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
    SET NEW.ticket_number = CONCAT('#ID-', LPAD(NEW.id, 3, '0'));
END//
DELIMITER ;

-- Vista para obtener información completa de tickets
CREATE VIEW ticket_details AS
SELECT 
    t.*,
    c.name as category_name,
    c.color as category_color,
    p.name as priority_name,
    p.color as priority_color,
    p.level as priority_level,
    s.name as status_name,
    s.color as status_color,
    creator.username as created_by_username,
    CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
    assignee.username as assigned_to_username,
    CONCAT(assignee.first_name, ' ', assignee.last_name) as assigned_to_name,
    assigner.username as assigned_by_username,
    CONCAT(assigner.first_name, ' ', assigner.last_name) as assigned_by_name
FROM tickets t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN priorities p ON t.priority_id = p.id
LEFT JOIN ticket_statuses s ON t.status_id = s.id
LEFT JOIN users creator ON t.created_by = creator.id
LEFT JOIN users assignee ON t.assigned_to = assignee.id
LEFT JOIN users assigner ON t.assigned_by = assigner.id;

-- Indices adicionales para performance
CREATE INDEX idx_tickets_compound ON tickets(status_id, priority_id, created_at);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_ticket_history_compound ON ticket_history(ticket_id, action_type, created_at);
