-- Crear tabla de comentarios de tickets
-- Ejecutar esto en tu base de datos MySQL

CREATE TABLE IF NOT EXISTS ticket_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false COMMENT 'Si es true, solo visible para técnicos y admin',
  is_resolution BOOLEAN DEFAULT false COMMENT 'Comentario de resolución del técnico',
  is_closure BOOLEAN DEFAULT false COMMENT 'Comentario de cierre del admin',
  is_reopening BOOLEAN DEFAULT false COMMENT 'Comentario de reapertura del admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Índices para mejorar performance
  INDEX idx_ticket_id (ticket_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar comentario de ejemplo (opcional, comentar si no se necesita)
-- INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal, is_resolution) 
-- VALUES (3, 2, 'Demo termine', false, true);

SELECT 'Tabla ticket_comments creada exitosamente' AS result;

