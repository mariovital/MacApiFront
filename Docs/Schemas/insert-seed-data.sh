#!/bin/bash

# =====================================================================
# SCRIPT PARA INSERTAR DATOS INICIALES EN AWS RDS
# =====================================================================

set -e  # Detener si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌱 Inserción de Datos Iniciales en AWS RDS${NC}"
echo ""

# =====================================================================
# CONFIGURACIÓN
# =====================================================================

read -p "📍 RDS Endpoint: " RDS_HOST
read -p "👤 Usuario de RDS (default: admin): " RDS_USER
RDS_USER=${RDS_USER:-admin}
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
# VERIFICAR CONEXIÓN
# =====================================================================

echo ""
echo -e "${BLUE}1️⃣ Verificando conexión a RDS...${NC}"

if mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" -e "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✅ Conexión exitosa${NC}"
else
    echo -e "${RED}❌ No se pudo conectar a RDS${NC}"
    exit 1
fi

# =====================================================================
# VERIFICAR QUE EXISTAN LAS TABLAS
# =====================================================================

echo ""
echo -e "${BLUE}2️⃣ Verificando que existan las tablas...${NC}"

TABLES=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -e "SHOW TABLES LIKE 'categories';" 2>/dev/null | tail -n +2)

if [ -z "$TABLES" ]; then
    echo -e "${RED}❌ No se encontró la tabla 'categories'${NC}"
    echo -e "${YELLOW}   Primero debes ejecutar el schema: FULL-SCHEMA-AWS.sql${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Tablas encontradas${NC}"
fi

# =====================================================================
# VERIFICAR SI YA HAY DATOS
# =====================================================================

echo ""
echo -e "${BLUE}3️⃣ Verificando si ya existen datos...${NC}"

CATEGORY_COUNT=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -se "SELECT COUNT(*) FROM categories;" 2>/dev/null)

if [ "$CATEGORY_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Ya existen $CATEGORY_COUNT categorías en la base de datos${NC}"
    read -p "¿Deseas eliminar los datos existentes y empezar de nuevo? (y/n): " DELETE_CONFIRM
    
    if [ "$DELETE_CONFIRM" = "y" ]; then
        echo -e "${YELLOW}🗑️  Eliminando datos existentes...${NC}"
        
        mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" << EOF
        SET FOREIGN_KEY_CHECKS = 0;
        DELETE FROM ticket_history;
        DELETE FROM ticket_attachments;
        DELETE FROM ticket_comments;
        DELETE FROM tickets;
        DELETE FROM users WHERE id > 1;
        DELETE FROM categories;
        DELETE FROM priorities;
        DELETE FROM ticket_statuses;
        DELETE FROM roles;
        SET FOREIGN_KEY_CHECKS = 1;
EOF
        echo -e "${GREEN}✅ Datos eliminados${NC}"
    else
        echo -e "${YELLOW}⚠️  Los datos existentes se mantendrán. Puede haber conflictos de IDs.${NC}"
        read -p "¿Continuar de todos modos? (y/n): " CONTINUE
        if [ "$CONTINUE" != "y" ]; then
            echo -e "${RED}❌ Cancelado${NC}"
            exit 1
        fi
    fi
else
    echo -e "${GREEN}✅ No hay datos previos, listo para insertar${NC}"
fi

# =====================================================================
# INSERTAR DATOS
# =====================================================================

echo ""
echo -e "${BLUE}4️⃣ Insertando datos iniciales...${NC}"

# Verificar que el archivo existe
if [ ! -f "SEED-DATA-AWS.sql" ]; then
    echo -e "${RED}❌ Archivo SEED-DATA-AWS.sql no encontrado${NC}"
    echo "   Asegúrate de ejecutar este script desde el directorio /Docs/Schemas/"
    exit 1
fi

# Ejecutar el SQL
mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" < SEED-DATA-AWS.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Datos insertados correctamente${NC}"
else
    echo -e "${RED}❌ Error insertando datos${NC}"
    exit 1
fi

# =====================================================================
# VERIFICAR DATOS INSERTADOS
# =====================================================================

echo ""
echo -e "${BLUE}5️⃣ Verificando datos insertados...${NC}"

echo ""
echo -e "${GREEN}📊 RESUMEN DE DATOS:${NC}"
echo ""

# Contar registros
ROLES=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -se "SELECT COUNT(*) FROM roles;")
CATEGORIES=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -se "SELECT COUNT(*) FROM categories;")
PRIORITIES=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -se "SELECT COUNT(*) FROM priorities;")
STATUSES=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -se "SELECT COUNT(*) FROM ticket_statuses;")
USERS=$(mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -se "SELECT COUNT(*) FROM users;")

echo -e "   ${GREEN}✅ Roles:${NC} $ROLES"
echo -e "   ${GREEN}✅ Categorías:${NC} $CATEGORIES"
echo -e "   ${GREEN}✅ Prioridades:${NC} $PRIORITIES"
echo -e "   ${GREEN}✅ Estados:${NC} $STATUSES"
echo -e "   ${GREEN}✅ Usuarios:${NC} $USERS"

# Mostrar categorías
echo ""
echo -e "${BLUE}📁 CATEGORÍAS CREADAS:${NC}"
mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -e "SELECT id, name, color FROM categories;" 2>/dev/null

# Mostrar usuarios
echo ""
echo -e "${BLUE}👥 USUARIOS CREADOS:${NC}"
mysql -h "$RDS_HOST" -u "$RDS_USER" -p"$RDS_PASSWORD" "$DB_NAME" \
    -e "SELECT id, username, email, first_name, last_name, role_id FROM users;" 2>/dev/null

# =====================================================================
# RESUMEN Y SIGUIENTES PASOS
# =====================================================================

echo ""
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}✅ DATOS INICIALES INSERTADOS CORRECTAMENTE${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo ""
echo -e "${BLUE}📋 Credenciales de prueba:${NC}"
echo ""
echo -e "${YELLOW}👤 ADMINISTRADOR:${NC}"
echo "   Username: admin"
echo "   Password: Admin123"
echo "   Email: admin@maccomputadoras.com"
echo ""
echo -e "${YELLOW}🔧 TÉCNICOS (Password: Tecnico123):${NC}"
echo "   - jtecnico@maccomputadoras.com"
echo "   - mtecnico@maccomputadoras.com"
echo "   - ctecnico@maccomputadoras.com"
echo ""
echo -e "${YELLOW}💼 MESA DE TRABAJO (Password: Usuario123):${NC}"
echo "   - lperez@maccomputadoras.com"
echo "   - agomez@maccomputadoras.com"
echo ""
echo -e "${BLUE}📁 Categorías disponibles:${NC}"
echo "   1. Hardware (Rojo)"
echo "   2. Software (Azul)"
echo "   3. Red (Verde)"
echo "   4. Cuenta (Naranja)"
echo "   5. Periféricos (Morado)"
echo "   6. Sistema (Rosa)"
echo "   7. Otro (Gris)"
echo ""
echo -e "${GREEN}🚀 Siguientes pasos:${NC}"
echo "   1. Reiniciar la aplicación en Elastic Beanstalk: eb restart"
echo "   2. Probar login con el usuario admin"
echo "   3. Probar crear un ticket (ahora deberían aparecer las categorías)"
echo ""
echo -e "${GREEN}¡Listo para usar! 🎉${NC}"

