#!/bin/bash

# =====================================================
# CONFIGURAR CORS EN ELASTIC BEANSTALK
# =====================================================

echo "🔧 Configurando CORS en Elastic Beanstalk..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio del backend
BACKEND_DIR="/Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api"

# Ir al directorio del backend
cd "$BACKEND_DIR" || exit 1

echo -e "${BLUE}==============================================
${NC}"
echo -e "${BLUE}Configuración de CORS${NC}"
echo -e "${BLUE}==============================================${NC}"
echo ""

# Preguntar la URL de Vercel
echo -e "${YELLOW}¿Cuál es la URL de tu aplicación en Vercel?${NC}"
echo "Ejemplo: https://mac-tickets.vercel.app"
read -p "URL de Vercel: " VERCEL_URL

if [ -z "$VERCEL_URL" ]; then
    echo -e "${RED}❌ URL de Vercel es requerida${NC}"
    exit 1
fi

# Normalizar URL (quitar / al final si existe)
VERCEL_URL="${VERCEL_URL%/}"

echo ""
echo -e "${YELLOW}Configurando CORS para permitir:${NC}"
echo "  - $VERCEL_URL"
echo "  - http://localhost:5173 (desarrollo local)"
echo ""

# Preguntar si quiere continuar
read -p "¿Continuar? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Configuración cancelada."
    exit 0
fi

# Configurar CORS_ORIGIN
echo ""
echo -e "${YELLOW}Configurando CORS_ORIGIN...${NC}"

CORS_ORIGINS="$VERCEL_URL,http://localhost:5173"

eb setenv CORS_ORIGIN="$CORS_ORIGINS"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al configurar CORS_ORIGIN${NC}"
    exit 1
fi

echo -e "${GREEN}✅ CORS_ORIGIN configurado${NC}"

# Verificar configuración
echo ""
echo -e "${YELLOW}Verificando configuración...${NC}"
eb printenv | grep CORS_ORIGIN

# Reiniciar aplicación
echo ""
echo -e "${YELLOW}Reiniciando aplicación...${NC}"
eb restart

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Aplicación reiniciada${NC}"
else
    echo -e "${RED}❌ Error al reiniciar aplicación${NC}"
    exit 1
fi

# Esperar a que la aplicación esté lista
echo ""
echo -e "${YELLOW}Esperando a que la aplicación esté lista...${NC}"
sleep 10

# Probar CORS
echo ""
echo -e "${YELLOW}Probando CORS desde Vercel...${NC}"

curl -X OPTIONS \
  http://macticketsv.us-east-1.elasticbeanstalk.com/api/auth/login \
  -H "Origin: $VERCEL_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -i "access-control"

echo ""
echo -e "${GREEN}==============================================
${NC}"
echo -e "${GREEN}✅ Configuración completada!${NC}"
echo -e "${GREEN}==============================================${NC}"
echo ""
echo "CORS configurado para:"
echo "  ✅ $VERCEL_URL"
echo "  ✅ http://localhost:5173"
echo ""
echo "Próximos pasos:"
echo "1. Verifica que el frontend en Vercel pueda hacer requests"
echo "2. Prueba el login desde Vercel"
echo "3. Si tienes errores CORS, revisa los logs:"
echo "   eb logs"
echo ""

