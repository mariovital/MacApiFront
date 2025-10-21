-- =====================================================================
-- MIGRACIÓN: ELIMINAR S3 Y AGREGAR ALMACENAMIENTO LOCAL
-- EJECUTAR ESTE ARCHIVO EN TU BASE DE DATOS
-- Base de datos: mactickets
-- =====================================================================

USE mactickets;

-- =====================================================================
-- PASO 1: AGREGAR NUEVOS CAMPOS
-- =====================================================================

-- Agregar file_path (ruta local del archivo)
ALTER TABLE ticket_attachments 
ADD COLUMN file_path VARCHAR(500) NULL COMMENT 'Ruta local del archivo en servidor'
AFTER file_type;

-- Agregar storage_type (tipo de almacenamiento)
ALTER TABLE ticket_attachments 
ADD COLUMN storage_type ENUM('local', 'external') DEFAULT 'local' NOT NULL COMMENT 'Tipo de almacenamiento'
AFTER file_path;

-- =====================================================================
-- PASO 2: HACER CAMPOS S3 OPCIONALES
-- =====================================================================

ALTER TABLE ticket_attachments 
MODIFY COLUMN s3_url VARCHAR(500) NULL COMMENT 'DEPRECATED - Solo para migración';

ALTER TABLE ticket_attachments 
MODIFY COLUMN s3_key VARCHAR(500) NULL COMMENT 'DEPRECATED - Solo para migración';

-- =====================================================================
-- PASO 3: MIGRAR DATOS EXISTENTES
-- =====================================================================

-- Opción A: DESARROLLO - Marcar archivos existentes como eliminados
-- (Descomenta si NO tienes archivos importantes)
-- UPDATE ticket_attachments 
-- SET deleted_at = NOW(), 
--     deleted_by = 1,
--     file_path = CONCAT('/uploads/', file_name)
-- WHERE deleted_at IS NULL;

-- Opción B: PRODUCCIÓN - Actualizar file_path para archivos existentes
-- (Descomenta si tienes archivos que quieres mantener)
-- UPDATE ticket_attachments 
-- SET file_path = CONCAT('/var/app/current/uploads/', file_name),
--     storage_type = 'local'
-- WHERE deleted_at IS NULL;

-- =====================================================================
-- PASO 4: VERIFICAR MIGRACIÓN
-- =====================================================================

-- Ver estructura de la tabla
DESCRIBE ticket_attachments;

-- Ver datos migrados
SELECT 
    id,
    original_name,
    file_name,
    file_path,
    storage_type,
    s3_url,
    s3_key,
    deleted_at
FROM ticket_attachments
LIMIT 5;

-- Estadísticas de migración
SELECT 
    COUNT(*) as total_archivos,
    SUM(CASE WHEN file_path IS NOT NULL THEN 1 ELSE 0 END) as con_file_path,
    SUM(CASE WHEN storage_type = 'local' THEN 1 ELSE 0 END) as storage_local,
    SUM(CASE WHEN s3_url IS NULL THEN 1 ELSE 0 END) as sin_s3,
    SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as eliminados
FROM ticket_attachments;

-- =====================================================================
-- PASO 5 (OPCIONAL): ELIMINAR CAMPOS S3 EN EL FUTURO
-- =====================================================================

-- ⚠️ NO EJECUTAR AHORA - Solo cuando estés 100% seguro
-- ⚠️ Esto es IRREVERSIBLE sin backup

-- ALTER TABLE ticket_attachments DROP COLUMN s3_url;
-- ALTER TABLE ticket_attachments DROP COLUMN s3_key;

-- =====================================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================================

