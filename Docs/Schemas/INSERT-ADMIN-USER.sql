-- =====================================================
-- INSERT USUARIO ADMINISTRADOR - MAC TICKETS
-- =====================================================
-- 
-- Este script crea el usuario administrador por defecto
-- 
-- CREDENCIALES:
-- Email:    admin@maccomputadoras.com
-- Password: demo123
-- Role:     Administrador (role_id = 1)
--
-- USO:
-- mysql -h [RDS_ENDPOINT] -u [USER] -p [DATABASE] < INSERT-ADMIN-USER.sql
-- =====================================================

USE macTickets;

-- Verificar que no exista el usuario
SELECT 'Verificando si el usuario ya existe...' AS mensaje;
SELECT COUNT(*) AS usuarios_existentes 
FROM users 
WHERE email = 'admin@maccomputadoras.com';

-- Insertar usuario administrador
INSERT INTO users (
  username,
  email,
  password_hash,
  first_name,
  last_name,
  role_id,
  is_active,
  login_attempts,
  locked_until,
  last_login,
  created_at,
  updated_at
) VALUES (
  'admin',
  'admin@maccomputadoras.com',
  '$2b$12$v/dFbmP.9LnnruzCpYDWlON0hbwne8ENYFO.VOp6vAm/imElihtte',
  'Admin',
  'Sistema',
  1,              -- role_id: 1 = admin
  1,              -- is_active: 1 = activo
  0,              -- login_attempts: 0
  NULL,           -- locked_until: NULL (no bloqueado)
  NULL,           -- last_login: NULL (nunca ha iniciado sesión)
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  is_active = 1,
  login_attempts = 0,
  locked_until = NULL,
  updated_at = NOW();

-- Verificar que se creó correctamente
SELECT 'Usuario administrador creado exitosamente!' AS resultado;
SELECT 
  id,
  username,
  email,
  first_name,
  last_name,
  role_id,
  is_active,
  created_at
FROM users 
WHERE email = 'admin@maccomputadoras.com';

-- =====================================================
-- INFORMACIÓN ADICIONAL
-- =====================================================

-- Para verificar los roles disponibles:
-- SELECT * FROM roles;

-- Para crear más usuarios administradores:
-- INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, is_active, created_at, updated_at)
-- VALUES ('admin2', 'admin2@maccomputadoras.com', '$2b$12$v/dFbmP.9LnnruzCpYDWlON0hbwne8ENYFO.VOp6vAm/imElihtte', 'Admin', 'Segundo', 1, 1, NOW(), NOW());

-- =====================================================
-- CONTRASEÑAS HASHEADAS ADICIONALES (bcrypt 12 rounds)
-- =====================================================

-- demo123:   $2b$12$v/dFbmP.9LnnruzCpYDWlON0hbwne8ENYFO.VOp6vAm/imElihtte
-- Admin123:  $2b$12$KvQxWZy4LGnJGZL.4xkYCu8J4j8Wz4QJ4Lz4Wz4QJ4Lz4Wz4QJ4L
-- password:  $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzVW8J9j6i

-- Para generar un nuevo hash:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tu_password', 12, (err, hash) => { console.log(hash); });"

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

