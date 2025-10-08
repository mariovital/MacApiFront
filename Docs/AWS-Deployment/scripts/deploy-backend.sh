#!/bin/bash

# Script para desplegar Backend a AWS EC2
# Uso: ./deploy-backend.sh

set -e

echo "🚀 Desplegando Backend a AWS EC2..."

# Variables (configurar según tu proyecto)
EC2_HOST="ec2-user@54.123.45.67"  # Cambiar por tu EC2 IP
EC2_KEY="~/.ssh/mactickets-key.pem"
REMOTE_DIR="~/apps/MacApiFront/MAC/mac-tickets-api"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que existe el key
if [ ! -f "$EC2_KEY" ]; then
    echo -e "${RED}❌ Error: No se encontró el key de EC2${NC}"
    echo "Ruta esperada: $EC2_KEY"
    exit 1
fi

# Conectar y actualizar código
echo -e "${YELLOW}📡 Conectando a EC2...${NC}"
ssh -i "$EC2_KEY" "$EC2_HOST" << 'EOF'
    set -e
    
    echo "📥 Pulling latest code..."
    cd ~/apps/MacApiFront/MAC/mac-tickets-api
    git pull origin main
    
    echo "📦 Installing dependencies..."
    npm install --production
    
    echo "🔄 Restarting API with PM2..."
    pm2 restart mactickets-api
    
    echo "✅ Deployment completed on EC2"
    
    echo ""
    echo "📊 PM2 Status:"
    pm2 status
    
    echo ""
    echo "📝 Last 20 log lines:"
    pm2 logs mactickets-api --lines 20 --nostream
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ¡Deployment completado!${NC}"
    echo -e "${GREEN}API: https://api.tu-dominio.com${NC}"
    echo ""
    echo "Para ver logs en tiempo real:"
    echo "ssh -i $EC2_KEY $EC2_HOST 'pm2 logs mactickets-api'"
else
    echo -e "${RED}❌ Error en deployment${NC}"
    exit 1
fi
