#!/bin/bash

# =====================================================
# CONFIGURAR VERCEL CON AWS BACKEND
# =====================================================

echo "🚀 Configurando Vercel para conectarse a AWS..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI no está instalado.${NC}"
    echo "Instalando Vercel CLI..."
    npm install -g vercel
fi

# Variables
BACKEND_URL="http://macticketsv.us-east-1.elasticbeanstalk.com"
API_URL="${BACKEND_URL}/api"
FRONTEND_DIR="/Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front"

echo -e "${BLUE}==============================================
${NC}"
echo -e "${BLUE}Configuración:${NC}"
echo "Backend URL: $BACKEND_URL"
echo "API URL: $API_URL"
echo "Frontend Dir: $FRONTEND_DIR"
echo -e "${BLUE}==============================================${NC}"
echo ""

# Preguntar si quiere continuar
read -p "¿Continuar con la configuración? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Configuración cancelada."
    exit 0
fi

# Ir al directorio del frontend
cd "$FRONTEND_DIR" || exit 1

# Login en Vercel
echo ""
echo -e "${YELLOW}Iniciando sesión en Vercel...${NC}"
vercel login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al iniciar sesión en Vercel${NC}"
    exit 1
fi

# Agregar variables de entorno
echo ""
echo -e "${YELLOW}Agregando variables de entorno...${NC}"
echo ""

# VITE_API_URL
echo -e "${BLUE}1/7 - Configurando VITE_API_URL${NC}"
echo "$API_URL" | vercel env add VITE_API_URL production preview development

# VITE_SOCKET_URL
echo -e "${BLUE}2/7 - Configurando VITE_SOCKET_URL${NC}"
echo "$BACKEND_URL" | vercel env add VITE_SOCKET_URL production preview development

# VITE_AWS_REGION
echo -e "${BLUE}3/7 - Configurando VITE_AWS_REGION${NC}"
echo "us-east-1" | vercel env add VITE_AWS_REGION production preview development

# VITE_APP_NAME
echo -e "${BLUE}4/7 - Configurando VITE_APP_NAME${NC}"
echo "Sistema de Gestión de Tickets - MAC Computadoras" | vercel env add VITE_APP_NAME production preview development

# VITE_APP_VERSION
echo -e "${BLUE}5/7 - Configurando VITE_APP_VERSION${NC}"
echo "1.0.0" | vercel env add VITE_APP_VERSION production preview development

# VITE_DEBUG (Production)
echo -e "${BLUE}6/7 - Configurando VITE_DEBUG (Production)${NC}"
echo "false" | vercel env add VITE_DEBUG production

# VITE_DEBUG (Development)
echo -e "${BLUE}7/7 - Configurando VITE_DEBUG (Development)${NC}"
echo "true" | vercel env add VITE_DEBUG development

echo ""
echo -e "${GREEN}✅ Variables de entorno configuradas!${NC}"
echo ""

# Preguntar si quiere hacer deploy ahora
read -p "¿Hacer deploy a producción ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Haciendo deploy a producción...${NC}"
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Deploy completado!${NC}"
        echo ""
        echo -e "${BLUE}Tu aplicación está lista en:${NC}"
        vercel ls | head -1
    else
        echo ""
        echo -e "${RED}❌ Error al hacer deploy${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}==============================================
${NC}"
echo -e "${GREEN}✅ Configuración completada!${NC}"
echo -e "${GREEN}==============================================${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Verifica que el frontend funcione en Vercel"
echo "2. Prueba el login con: admin@maccomputadoras.com / demo123"
echo "3. Configura CORS en el backend si es necesario"
echo ""
echo "Comandos útiles:"
echo "  vercel env ls        - Ver variables de entorno"
echo "  vercel logs          - Ver logs de producción"
echo "  vercel domains       - Configurar dominio personalizado"
echo ""

