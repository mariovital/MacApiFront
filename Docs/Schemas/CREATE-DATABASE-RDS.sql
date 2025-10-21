-- =====================================================================
-- CREAR BASE DE DATOS EN AWS RDS
-- =====================================================================
-- Ejecutar PRIMERO antes de ejecutar FULL-SCHEMA-AWS.sql

-- 1. Crear base de datos
CREATE DATABASE IF NOT EXISTS macTickets 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Usar la base de datos
USE macTickets;

-- 3. Verificar que se creó correctamente
SELECT DATABASE() AS current_database;

-- 4. Verificar charset
SELECT 
    DEFAULT_CHARACTER_SET_NAME,
    DEFAULT_COLLATION_NAME
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'macTickets';

-- =====================================================================
-- RESULTADO ESPERADO:
-- =====================================================================
-- current_database
-- ----------------
-- macTickets
--
-- DEFAULT_CHARACTER_SET_NAME | DEFAULT_COLLATION_NAME
-- ---------------------------|------------------------
-- utf8mb4                    | utf8mb4_unicode_ci
-- =====================================================================

-- Ahora ejecutar: FULL-SCHEMA-AWS.sql

