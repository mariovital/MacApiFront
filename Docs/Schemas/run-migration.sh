#!/bin/bash

echo "======================================"
echo "MIGRACIÓN: Eliminar S3 - Agregar Local"
echo "======================================"
echo ""

# Variables
DB_NAME="mactickets"
BACKUP_FILE="backup_ticket_attachments_$(date +%Y%m%d_%H%M%S).sql"

echo "📦 Paso 1: Backup de la tabla ticket_attachments..."
mysqldump -u root -p $DB_NAME ticket_attachments > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup creado: $BACKUP_FILE"
else
    echo "❌ Error creando backup. Abortando."
    exit 1
fi

echo ""
echo "🔄 Paso 2: Ejecutando migración..."

mysql -u root -p $DB_NAME << SQL
-- Agregar file_path
ALTER TABLE ticket_attachments 
ADD COLUMN file_path VARCHAR(500) NULL COMMENT 'Ruta local del archivo'
AFTER file_type;

-- Agregar storage_type
ALTER TABLE ticket_attachments 
ADD COLUMN storage_type ENUM('local', 'external') DEFAULT 'local' NOT NULL
AFTER file_path;

-- Hacer S3 campos opcionales
ALTER TABLE ticket_attachments 
MODIFY COLUMN s3_url VARCHAR(500) NULL;

ALTER TABLE ticket_attachments 
MODIFY COLUMN s3_key VARCHAR(500) NULL;

-- Verificar
DESCRIBE ticket_attachments;

SELECT 'Migración completada exitosamente' as Status;
SQL

if [ $? -eq 0 ]; then
    echo "✅ Migración completada exitosamente"
else
    echo "❌ Error en la migración"
    exit 1
fi

echo ""
echo "======================================"
echo "MIGRACIÓN COMPLETADA"
echo "======================================"
echo "Backup guardado en: $BACKUP_FILE"
