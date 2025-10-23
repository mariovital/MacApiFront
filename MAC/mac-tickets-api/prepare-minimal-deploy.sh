#!/bin/bash

# Script MINIMALISTA para deploy a AWS (SIN .ebextensions)
# Uso: ./prepare-minimal-deploy.sh

echo "🚀 Preparando deploy MÍNIMO para AWS Elastic Beanstalk..."
echo "   (SIN .ebextensions para evitar timeouts)"
echo ""

# Crear carpeta temporal
TEMP_DIR="aws-deploy-minimal"
ZIP_NAME="mac-tickets-api-minimal.zip"

echo "📁 Creando carpeta temporal..."
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "📦 Copiando SOLO archivos esenciales..."

# Copiar package.json y package-lock.json
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/

# Copiar carpeta src completa
cp -r src $TEMP_DIR/

# Crear carpeta uploads vacía (importante!)
mkdir -p $TEMP_DIR/uploads
touch $TEMP_DIR/uploads/.gitkeep

# Copiar .npmrc si existe
if [ -f .npmrc ]; then
    cp .npmrc $TEMP_DIR/
fi

# NO copiar .ebextensions para evitar timeouts

# Crear .ebignore
cat > $TEMP_DIR/.ebignore << EOF
# AWS Elastic Beanstalk ignores
node_modules/
.git/
.env.local
.DS_Store
*.log
npm-debug.log*
.vscode/
.idea/
EOF

echo "🗜️  Creando archivo ZIP MÍNIMO..."
cd $TEMP_DIR
zip -r ../$ZIP_NAME . -x "*.DS_Store" "*.git*" "node_modules/*"
cd ..

echo "🧹 Limpiando archivos temporales..."
rm -rf $TEMP_DIR

echo ""
echo "✅ ¡Listo! Archivo MÍNIMO creado: $ZIP_NAME"
echo ""
echo "📋 Contenido del ZIP:"
unzip -l $ZIP_NAME | head -20
echo ""
echo "⚠️  IMPORTANTE:"
echo "   Este ZIP NO incluye .ebextensions para evitar timeouts"
echo "   Después del deploy, conecta por SSH y crea la carpeta uploads manualmente:"
echo ""
echo "   eb ssh"
echo "   sudo mkdir -p /var/app/current/uploads"
echo "   sudo chmod 777 /var/app/current/uploads"
echo "   exit"
echo ""
echo "📤 Siguiente paso:"
echo "   1. Ve a AWS Elastic Beanstalk Console"
echo "   2. Selecciona tu ambiente 'TicketSystem-env'"
echo "   3. Click en 'Upload and deploy'"
echo "   4. Sube el archivo: $ZIP_NAME"
echo "   5. Espera 3-5 minutos"
echo "   6. Conecta por SSH y crea carpeta uploads"
echo ""

