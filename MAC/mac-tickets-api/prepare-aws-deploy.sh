#!/bin/bash

# Script para preparar el deploy a AWS Elastic Beanstalk
# Uso: ./prepare-aws-deploy.sh

echo "🚀 Preparando deploy para AWS Elastic Beanstalk..."
echo ""

# Crear carpeta temporal
TEMP_DIR="aws-deploy-temp"
ZIP_NAME="mac-tickets-api-aws.zip"

echo "📁 Creando carpeta temporal..."
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

echo "📦 Copiando archivos necesarios..."

# Copiar package.json y package-lock.json
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/

# Copiar carpeta src completa
cp -r src $TEMP_DIR/

# Copiar configuración de Elastic Beanstalk
if [ -d .ebextensions ]; then
    cp -r .ebextensions $TEMP_DIR/
    echo "   ✅ Configuración .ebextensions copiada"
fi

# Crear carpeta uploads vacía (importante!)
mkdir -p $TEMP_DIR/uploads
touch $TEMP_DIR/uploads/.gitkeep

# Copiar .npmrc si existe
if [ -f .npmrc ]; then
    cp .npmrc $TEMP_DIR/
fi

# Crear .ebignore si no existe
if [ ! -f .ebignore ]; then
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
fi

echo "🗜️  Creando archivo ZIP..."
cd $TEMP_DIR
zip -r ../$ZIP_NAME . -x "*.DS_Store" "*.git*" "node_modules/*"
cd ..

echo "🧹 Limpiando archivos temporales..."
rm -rf $TEMP_DIR

echo ""
echo "✅ ¡Listo! Archivo creado: $ZIP_NAME"
echo ""
echo "📋 Contenido del ZIP:"
unzip -l $ZIP_NAME | head -20
echo ""
echo "📤 Siguiente paso:"
echo "   1. Ve a AWS Elastic Beanstalk Console"
echo "   2. Selecciona tu ambiente 'TicketSystem-env'"
echo "   3. Click en 'Upload and deploy'"
echo "   4. Sube el archivo: $ZIP_NAME"
echo "   5. Espera 3-5 minutos"
echo ""

