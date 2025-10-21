-- =====================================================================
-- MIGRACIÓN RÁPIDA: Sin S3 - Solo Local Storage
-- Copiar y pegar COMPLETO en AWS RDS Query Editor
-- =====================================================================

USE mactickets;

-- Agregar file_path
ALTER TABLE ticket_attachments 
ADD COLUMN file_path VARCHAR(500) NULL COMMENT 'Ruta local del archivo'
AFTER file_type;

-- Agregar storage_type
ALTER TABLE ticket_attachments 
ADD COLUMN storage_type ENUM('local', 'external') DEFAULT 'local' NOT NULL
AFTER file_path;

-- Hacer S3 opcional
ALTER TABLE ticket_attachments 
MODIFY COLUMN s3_url VARCHAR(500) NULL;

ALTER TABLE ticket_attachments 
MODIFY COLUMN s3_key VARCHAR(500) NULL;

-- Verificar estructura
DESCRIBE ticket_attachments;

-- Verificar datos
SELECT 
    COUNT(*) as total_archivos,
    SUM(CASE WHEN file_path IS NOT NULL THEN 1 ELSE 0 END) as con_file_path,
    SUM(CASE WHEN s3_url IS NULL THEN 1 ELSE 0 END) as sin_s3
FROM ticket_attachments;

