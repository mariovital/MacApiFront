#!/bin/bash

# Script para desplegar Frontend a AWS S3 + CloudFront
# Uso: ./deploy-frontend.sh

set -e

echo "🚀 Desplegando Frontend a AWS..."

# Variables (configurar según tu proyecto)
S3_BUCKET="mactickets-frontend"
CLOUDFRONT_ID="E123456ABCDEF"  # Cambiar por tu Distribution ID
FRONTEND_DIR="../../MAC/mac-tickets-front"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Error: Directorio frontend no encontrado${NC}"
    echo "Verifica la ruta: $FRONTEND_DIR"
    exit 1
fi

cd "$FRONTEND_DIR"

# Verificar que existe .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Advertencia: No existe .env.production${NC}"
    echo "Creando desde .env..."
    cp .env .env.production
fi

# Build del frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: Build falló, no se encontró carpeta dist/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completado${NC}"

# Subir a S3
echo -e "${YELLOW}☁️  Subiendo a S3...${NC}"
aws s3 sync dist/ s3://$S3_BUCKET/ --delete

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Archivos subidos a S3${NC}"
else
    echo -e "${RED}❌ Error subiendo a S3${NC}"
    exit 1
fi

# Invalidar cache de CloudFront
echo -e "${YELLOW}🔄 Invalidando cache de CloudFront...${NC}"
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*" \
    --output json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cache invalidado${NC}"
else
    echo -e "${YELLOW}⚠️  Advertencia: No se pudo invalidar cache${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ¡Deployment completado!${NC}"
echo -e "${GREEN}URL: https://tu-dominio.com${NC}"
echo ""
