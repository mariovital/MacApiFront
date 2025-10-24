#!/bin/bash

# Script para preparar deploy COMPLETO con .ebextensions para aumentar límites de archivo

OUTPUT_ZIP="mac-tickets-api-full.zip"
TEMP_DIR="temp_deploy_full"

echo "🚀 Preparando deploy COMPLETO para AWS Elastic Beanstalk..."
echo "   (INCLUYE .ebextensions para aumentar límite de archivos)"

# Limpiar y crear carpeta temporal
echo "📁 Creando carpeta temporal..."
rm -rf $TEMP_DIR
mkdir $TEMP_DIR

# Copiar archivos esenciales
echo "📦 Copiando archivos esenciales..."
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/
cp -r src $TEMP_DIR/

# Crear carpeta uploads vacía
mkdir -p $TEMP_DIR/uploads
touch $TEMP_DIR/uploads/.gitkeep

# Copiar .ebignore
cp .ebignore $TEMP_DIR/

# Copiar configuración de Elastic Beanstalk
if [ -d .ebextensions ]; then
    cp -r .ebextensions $TEMP_DIR/
    echo "   ✅ Configuración .ebextensions copiada (incluye límites de archivos)"
fi

# Crear el archivo ZIP
echo "🗜️  Creando archivo ZIP..."
cd $TEMP_DIR
zip -r ../$OUTPUT_ZIP ./* > /dev/null
cd ..

# Limpiar archivos temporales
echo "🧹 Limpiando archivos temporales..."
rm -rf $TEMP_DIR

echo ""
echo "✅ ¡Listo! Archivo COMPLETO creado: $OUTPUT_ZIP"
echo ""
echo "📋 Contenido del ZIP:"
zipinfo $OUTPUT_ZIP | head -n 25

echo ""
echo "⚠️  IMPORTANTE:"
echo "   Este ZIP INCLUYE .ebextensions para:"
echo "   - Aumentar límite de nginx a 50 MB"
echo "   - Aumentar timeouts de proxy"
echo "   - Crear carpeta uploads con permisos"
echo ""
echo "   Si el deploy tarda más de 10 minutos o falla:"
echo "   1. Cancela el deploy"
echo "   2. Usa mac-tickets-api-minimal.zip en su lugar"
echo "   3. Configura nginx manualmente por SSH"
echo ""
echo "📤 Siguiente paso:"
echo "   1. Ve a AWS Elastic Beanstalk Console"
echo "   2. Selecciona tu ambiente 'TicketSystem-env'"
echo "   3. Click en 'Upload and deploy'"
echo "   4. Sube el archivo: $OUTPUT_ZIP"
echo "   5. Version label: 'v1.3-increase-file-limits'"
echo "   6. Deploy"
echo "   7. ⏳ Espera 5-8 minutos (más tiempo por .ebextensions)"
echo "   8. Si funciona: ✅ Archivos hasta 50 MB"
echo "   9. Si falla: Usa minimal ZIP y configura SSH"

