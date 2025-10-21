-- =====================================================================
-- MIGRACIÓN: ELIMINAR CAMPOS S3 Y AGREGAR ALMACENAMIENTO LOCAL
-- Base de datos: mactickets
-- Fecha: 2025-01-21
-- =====================================================================

USE mactickets;

-- =====================================================================
-- PASO 1: BACKUP DE DATOS EXISTENTES (IMPORTANTE)
-- =====================================================================
-- Ejecutar ANTES de migrar:
-- mysqldump -u root -p mactickets ticket_attachments > backup_attachments_$(date +%Y%m%d).sql

-- =====================================================================
-- PASO 2: AGREGAR NUEVOS CAMPOS
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
-- PASO 3: MIGRAR DATOS EXISTENTES (S3 -> Local)
-- =====================================================================

-- Opción A: Si NO HAY archivos importantes (DESARROLLO)
-- Simplemente marcar como eliminados
UPDATE ticket_attachments 
SET deleted_at = NOW(), 
    deleted_by = 1,
    file_path = CONCAT('/uploads/', file_name)
WHERE deleted_at IS NULL;

-- Opción B: Si HAY archivos en S3 (PRODUCCIÓN)
-- PRIMERO descargar manualmente de S3 y luego actualizar:
-- UPDATE ticket_attachments 
-- SET file_path = CONCAT('/var/app/current/uploads/', file_name),
--     storage_type = 'local'
-- WHERE deleted_at IS NULL;

-- =====================================================================
-- PASO 4: HACER file_path OBLIGATORIO
-- =====================================================================

-- Solo ejecutar DESPUÉS de migrar todos los datos
-- ALTER TABLE ticket_attachments 
-- MODIFY COLUMN file_path VARCHAR(500) NOT NULL COMMENT 'Ruta local del archivo en servidor';

-- =====================================================================
-- PASO 5: ELIMINAR CAMPOS S3 (OPCIONAL - SOLO DESPUÉS DE VERIFICAR)
-- =====================================================================

-- ⚠️ SOLO ejecutar cuando estés 100% seguro que no necesitas S3
-- ⚠️ Esto es IRREVERSIBLE sin backup
-- ALTER TABLE ticket_attachments DROP COLUMN s3_url;
-- ALTER TABLE ticket_attachments DROP COLUMN s3_key;

-- =====================================================================
-- PASO 6: VERIFICAR MIGRACIÓN
-- =====================================================================

SELECT 
    COUNT(*) as total_archivos,
    SUM(CASE WHEN file_path IS NOT NULL THEN 1 ELSE 0 END) as con_file_path,
    SUM(CASE WHEN s3_url IS NOT NULL THEN 1 ELSE 0 END) as con_s3_url,
    SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as eliminados
FROM ticket_attachments;

-- Ver archivos sin migrar
SELECT id, ticket_id, original_name, file_name, s3_url, file_path
FROM ticket_attachments
WHERE file_path IS NULL AND deleted_at IS NULL
LIMIT 10;

-- =====================================================================
-- RESUMEN DE CAMBIOS
-- =====================================================================
-- ✅ Campos AGREGADOS:
--    - file_path VARCHAR(500) NOT NULL
--    - storage_type ENUM('local', 'external') DEFAULT 'local'
--
-- ⚠️ Campos DEPRECADOS (mantener por ahora):
--    - s3_url VARCHAR(500)
--    - s3_key VARCHAR(500)
--
-- ❌ Campos A ELIMINAR (en futuro cuando se confirme):
--    - s3_url
--    - s3_key
-- =====================================================================

