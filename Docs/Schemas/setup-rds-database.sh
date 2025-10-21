#!/bin/bash

# =====================================================================
# SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS EN AWS RDS
# =====================================================================

set -e  # Detener si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =====================================================================
# CONFIGURACIÓN - EDITA ESTOS VALORES
# =====================================================================

echo -e "${BLUE}🔧 Configuración de Base de Datos RDS${NC}"
echo ""

# Solicitar información si no está configurada
read -p "📍 RDS Endpoint (ejemplo: xxx.rds.amazonaws.com): " RDS_HOST
read -p "👤 Usuario de RDS (generalmente 'admin'): " RDS_USER
read -sp "🔑 Contraseña de RDS: " RDS_PASSWORD
echo ""
read -p "💾 Nombre de la base de datos (default: macTickets): " DB_NAME
DB_NAME=${DB_NAME:-macTickets}

echo ""
echo -e "${YELLOW}⚙️  Configuración:${NC}"
echo "   Host: $RDS_HOST"
echo "   Usuario: $RDS_USER"
echo "   Base de datos: $DB_NAME"
echo ""

read -p "¿Continuar con esta configuración? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo -e "${RED}❌ Cancelado${NC}"
    exit 1
fi

# =====================================================================
# PASO 1: VERIFICAR CONEXIÓN
# =====================================================================

echo ""
echo -e "${BLUE}1️⃣ Verificando conexión a RDS...${NC}"

if mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Conexión exitosa${NC}"
else
    echo -e "${RED}❌ No se pudo conectar a RDS${NC}"
    echo ""
    echo "Posibles causas:"
    echo "  - Security Group no permite conexiones desde tu IP"
    echo "  - Credenciales incorrectas"
    echo "  - Endpoint incorrecto"
    exit 1
fi

# =====================================================================
# PASO 2: CREAR BASE DE DATOS
# =====================================================================

echo ""
echo -e "${BLUE}2️⃣ Creando base de datos '$DB_NAME'...${NC}"

mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Base de datos creada${NC}"
else
    echo -e "${RED}❌ Error creando base de datos${NC}"
    exit 1
fi

# Verificar que se creó
echo ""
echo -e "${BLUE}📋 Bases de datos disponibles:${NC}"
mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" -e "SHOW DATABASES;"

# =====================================================================
# PASO 3: EJECUTAR SCHEMA
# =====================================================================

echo ""
echo -e "${BLUE}3️⃣ Ejecutando schema SQL...${NC}"

# Verificar que el archivo existe
if [ ! -f "FULL-SCHEMA-AWS.sql" ]; then
    echo -e "${RED}❌ Archivo FULL-SCHEMA-AWS.sql no encontrado${NC}"
    echo "   Asegúrate de ejecutar este script desde el directorio /Docs/Schemas/"
    exit 1
fi

# Ejecutar schema
mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" < FULL-SCHEMA-AWS.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema ejecutado correctamente${NC}"
else
    echo -e "${RED}❌ Error ejecutando schema${NC}"
    exit 1
fi

# =====================================================================
# PASO 4: VERIFICAR TABLAS
# =====================================================================

echo ""
echo -e "${BLUE}4️⃣ Verificando tablas creadas...${NC}"

TABLES=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null | tail -n +2)

if [ -z "$TABLES" ]; then
    echo -e "${RED}❌ No se crearon tablas${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Tablas creadas:${NC}"
    echo "$TABLES" | while read table; do
        echo "   - $table"
    done
fi

# Contar tablas
TABLE_COUNT=$(echo "$TABLES" | wc -l | xargs)
echo ""
echo -e "${GREEN}📊 Total de tablas: $TABLE_COUNT${NC}"

# =====================================================================
# PASO 5: VERIFICAR USUARIO ADMIN
# =====================================================================

echo ""
echo -e "${BLUE}5️⃣ Verificando usuario administrador...${NC}"

ADMIN_EXISTS=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -e "SELECT COUNT(*) FROM users WHERE username='admin';" 2>/dev/null | tail -n 1)

if [ "$ADMIN_EXISTS" = "1" ]; then
    echo -e "${GREEN}✅ Usuario admin existe${NC}"
    
    # Mostrar información del admin
    mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
        -e "SELECT id, username, email, first_name, last_name, role_id, is_active FROM users WHERE username='admin';"
    
    echo ""
    echo -e "${YELLOW}📝 Credenciales de prueba:${NC}"
    echo "   Usuario: admin"
    echo "   Contraseña: Admin123"
else
    echo -e "${YELLOW}⚠️  No se encontró usuario admin${NC}"
    echo "   Ejecuta el script de datos de prueba si lo necesitas"
fi

# =====================================================================
# PASO 6: CONFIGURAR ELASTIC BEANSTALK
# =====================================================================

echo ""
echo -e "${BLUE}6️⃣ Configuración para Elastic Beanstalk${NC}"
echo ""
echo -e "${YELLOW}Ejecuta estos comandos en tu terminal:${NC}"
echo ""
echo "cd /ruta/a/tu/proyecto/backend"
echo "eb setenv \\"
echo "  DB_HOST=$RDS_HOST \\"
echo "  DB_NAME=$DB_NAME \\"
echo "  DB_USER=$RDS_USER \\"
echo "  DB_PASSWORD=$RDS_PASSWORD \\"
echo "  NODE_ENV=production \\"
echo "  PORT=8080"
echo ""
echo "eb restart"
echo ""

# =====================================================================
# RESUMEN
# =====================================================================

echo ""
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}✅ CONFIGURACIÓN COMPLETADA${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo "   ✅ Conexión a RDS verificada"
echo "   ✅ Base de datos '$DB_NAME' creada"
echo "   ✅ Schema SQL ejecutado ($TABLE_COUNT tablas)"
echo "   ✅ Usuario admin configurado"
echo ""
echo -e "${YELLOW}🚀 Siguientes pasos:${NC}"
echo "   1. Configurar variables de entorno en Elastic Beanstalk"
echo "   2. Reiniciar la aplicación: eb restart"
echo "   3. Probar login: curl -X POST https://tu-app/api/auth/login"
echo ""
echo -e "${BLUE}📋 Credenciales de prueba:${NC}"
echo "   Usuario: admin"
echo "   Contraseña: Admin123"
echo ""
echo -e "${GREEN}¡Listo para probar la API! 🎉${NC}"

