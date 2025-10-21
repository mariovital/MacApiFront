#!/bin/bash

# =====================================================
# CREAR USUARIO ADMINISTRADOR EN RDS
# =====================================================

echo "🔧 Creando usuario administrador..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración (EDITA ESTOS VALORES)
DB_HOST="tu-rds-endpoint.rds.amazonaws.com"
DB_USER="admin"
DB_NAME="macTickets"

echo -e "${YELLOW}Configuración:${NC}"
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo "Database: $DB_NAME"
echo ""

# Pedir contraseña de forma segura
echo -e "${YELLOW}Ingresa la contraseña de RDS:${NC}"
read -s DB_PASSWORD
echo ""

# Ejecutar SQL
echo -e "${YELLOW}Ejecutando SQL...${NC}"

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << 'EOF'

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
  1,
  1,
  0,
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  is_active = 1,
  login_attempts = 0,
  locked_until = NULL,
  updated_at = NOW();

-- Verificar
SELECT 
  id,
  username,
  email,
  first_name,
  last_name,
  role_id,
  is_active
FROM users 
WHERE email = 'admin@maccomputadoras.com';

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Usuario administrador creado exitosamente!${NC}"
    echo ""
    echo "Credenciales:"
    echo "  Email:    admin@maccomputadoras.com"
    echo "  Password: demo123"
    echo ""
    echo "Ahora puedes hacer login en:"
    echo "  POST http://tu-app.elasticbeanstalk.com/api/auth/login"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Error al crear usuario${NC}"
    echo "Verifica la configuración y la conexión a RDS"
    exit 1
fi

