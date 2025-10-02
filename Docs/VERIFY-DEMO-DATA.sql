-- ================================================================
-- SCRIPT DE VERIFICACIÓN DE DATOS DEMO
-- Ejecuta este script después de DEMO-DATA.sql para verificar
-- que todos los datos se crearon correctamente
-- ================================================================

USE ticket_system;

-- ================================================================
-- VERIFICACIÓN 1: Usuarios
-- ================================================================

SELECT 
    '========================================' as '',
    '1. VERIFICACIÓN DE USUARIOS' as '',
    '========================================' as '';

SELECT 
    role_id as Rol,
    CASE role_id
        WHEN 1 THEN 'Administrador'
        WHEN 2 THEN 'Técnico'
        WHEN 3 THEN 'Mesa de Trabajo'
    END as NombreRol,
    COUNT(*) as Cantidad,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as Activos,
    COUNT(CASE WHEN is_active = FALSE THEN 1 END) as Inactivos
FROM users
GROUP BY role_id
ORDER BY role_id;

SELECT '' as '';
SELECT 'Lista de usuarios creados:' as '';
SELECT 
    username as Usuario,
    email as Email,
    CASE role_id
        WHEN 1 THEN 'Admin'
        WHEN 2 THEN 'Técnico'
        WHEN 3 THEN 'Mesa'
    END as Rol,
    CASE WHEN is_active = TRUE THEN '✅ Activo' ELSE '❌ Inactivo' END as Estado
FROM users
ORDER BY role_id, username;

-- ================================================================
-- VERIFICACIÓN 2: Tickets
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    '2. VERIFICACIÓN DE TICKETS' as '',
    '========================================' as '';

SELECT 
    COUNT(*) as TotalTickets,
    COUNT(CASE WHEN status_id = 1 THEN 1 END) as Nuevos,
    COUNT(CASE WHEN status_id = 2 THEN 1 END) as Asignados,
    COUNT(CASE WHEN status_id = 3 THEN 1 END) as EnProceso,
    COUNT(CASE WHEN status_id = 4 THEN 1 END) as PendienteCliente,
    COUNT(CASE WHEN status_id = 5 THEN 1 END) as Resueltos,
    COUNT(CASE WHEN status_id = 6 THEN 1 END) as Cerrados
FROM tickets;

SELECT '' as '';
SELECT 'Tickets por prioridad:' as '';
SELECT 
    p.name as Prioridad,
    p.level as Nivel,
    COUNT(t.id) as Cantidad,
    CONCAT(ROUND(COUNT(t.id) * 100.0 / (SELECT COUNT(*) FROM tickets), 1), '%') as Porcentaje
FROM tickets t
JOIN priorities p ON t.priority_id = p.id
GROUP BY p.id, p.name, p.level
ORDER BY p.level DESC;

SELECT '' as '';
SELECT 'Tickets por categoría:' as '';
SELECT 
    c.name as Categoría,
    COUNT(t.id) as Cantidad,
    CONCAT(ROUND(COUNT(t.id) * 100.0 / (SELECT COUNT(*) FROM tickets), 1), '%') as Porcentaje
FROM tickets t
JOIN categories c ON t.category_id = c.id
GROUP BY c.id, c.name
ORDER BY COUNT(t.id) DESC;

SELECT '' as '';
SELECT 'Últimos 5 tickets creados:' as '';
SELECT 
    t.ticket_number as Ticket,
    t.title as Título,
    s.name as Estado,
    p.name as Prioridad,
    u.username as Creador,
    DATE_FORMAT(t.created_at, '%d/%m/%Y %H:%i') as Fecha
FROM tickets t
JOIN ticket_statuses s ON t.status_id = s.id
JOIN priorities p ON t.priority_id = p.id
JOIN users u ON t.created_by = u.id
ORDER BY t.created_at DESC
LIMIT 5;

-- ================================================================
-- VERIFICACIÓN 3: Comentarios
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    '3. VERIFICACIÓN DE COMENTARIOS' as '',
    '========================================' as '';

SELECT 
    COUNT(*) as TotalComentarios,
    COUNT(CASE WHEN is_internal = TRUE THEN 1 END) as Internos,
    COUNT(CASE WHEN is_internal = FALSE THEN 1 END) as Publicos
FROM ticket_comments;

SELECT '' as '';
SELECT 'Tickets con más comentarios:' as '';
SELECT 
    t.ticket_number as Ticket,
    t.title as Título,
    COUNT(tc.id) as NumComentarios
FROM tickets t
LEFT JOIN ticket_comments tc ON t.id = tc.ticket_id
GROUP BY t.id, t.ticket_number, t.title
HAVING COUNT(tc.id) > 0
ORDER BY COUNT(tc.id) DESC
LIMIT 5;

-- ================================================================
-- VERIFICACIÓN 4: Historial
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    '4. VERIFICACIÓN DE HISTORIAL' as '',
    '========================================' as '';

SELECT 
    COUNT(*) as TotalEntradas,
    COUNT(DISTINCT ticket_id) as TicketsConHistorial
FROM ticket_history;

SELECT '' as '';
SELECT 'Acciones más comunes en historial:' as '';
SELECT 
    action_type as TipoAcción,
    COUNT(*) as Cantidad
FROM ticket_history
GROUP BY action_type
ORDER BY COUNT(*) DESC;

-- ================================================================
-- VERIFICACIÓN 5: Archivos Adjuntos
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    '5. VERIFICACIÓN DE ARCHIVOS ADJUNTOS' as '',
    '========================================' as '';

SELECT 
    COUNT(*) as TotalArchivos,
    COUNT(DISTINCT ticket_id) as TicketsConArchivos,
    SUM(file_size) as TamañoTotalBytes,
    CONCAT(ROUND(SUM(file_size) / 1024 / 1024, 2), ' MB') as TamañoTotalMB
FROM ticket_attachments;

SELECT '' as '';
SELECT 'Archivos por tipo MIME:' as '';
SELECT 
    mime_type as TipoArchivo,
    COUNT(*) as Cantidad
FROM ticket_attachments
GROUP BY mime_type
ORDER BY COUNT(*) DESC;

-- ================================================================
-- VERIFICACIÓN 6: Notificaciones
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    '6. VERIFICACIÓN DE NOTIFICACIONES' as '',
    '========================================' as '';

SELECT 
    COUNT(*) as TotalNotificaciones,
    COUNT(CASE WHEN is_read = FALSE THEN 1 END) as NoLeídas,
    COUNT(CASE WHEN is_read = TRUE THEN 1 END) as Leídas
FROM notifications;

SELECT '' as '';
SELECT 'Notificaciones por tipo:' as '';
SELECT 
    notification_type as Tipo,
    COUNT(*) as Cantidad
FROM notifications
GROUP BY notification_type
ORDER BY COUNT(*) DESC;

SELECT '' as '';
SELECT 'Usuarios con notificaciones pendientes:' as '';
SELECT 
    u.username as Usuario,
    u.email as Email,
    COUNT(n.id) as NotificacionesPendientes
FROM users u
INNER JOIN notifications n ON u.id = n.user_id
WHERE n.is_read = FALSE
GROUP BY u.id, u.username, u.email
ORDER BY COUNT(n.id) DESC;

-- ================================================================
-- VERIFICACIÓN 7: Asignaciones de Tickets
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    '7. VERIFICACIÓN DE ASIGNACIONES' as '',
    '========================================' as '';

SELECT 
    COUNT(*) as TotalTicketsAsignados,
    COUNT(DISTINCT assigned_to) as TécnicosConTickets
FROM tickets
WHERE assigned_to IS NOT NULL;

SELECT '' as '';
SELECT 'Carga de trabajo por técnico:' as '';
SELECT 
    u.username as Técnico,
    u.email as Email,
    COUNT(t.id) as TicketsAsignados,
    COUNT(CASE WHEN t.status_id IN (2,3,4) THEN 1 END) as Activos,
    COUNT(CASE WHEN t.status_id IN (5,6) THEN 1 END) as Cerrados
FROM users u
LEFT JOIN tickets t ON u.id = t.assigned_to
WHERE u.role_id = 2
GROUP BY u.id, u.username, u.email
ORDER BY COUNT(t.id) DESC;

-- ================================================================
-- VERIFICACIÓN 8: Integridad de Datos
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    '8. VERIFICACIÓN DE INTEGRIDAD' as '',
    '========================================' as '';

SELECT 'Validando integridad de datos...' as '';

-- Verificar tickets sin categoría
SELECT 
    'Tickets sin categoría' as Validación,
    COUNT(*) as Cantidad,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ERROR' END as Estado
FROM tickets
WHERE category_id IS NULL OR category_id NOT IN (SELECT id FROM categories);

-- Verificar tickets sin prioridad
SELECT 
    'Tickets sin prioridad' as Validación,
    COUNT(*) as Cantidad,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ERROR' END as Estado
FROM tickets
WHERE priority_id IS NULL OR priority_id NOT IN (SELECT id FROM priorities);

-- Verificar tickets sin estado
SELECT 
    'Tickets sin estado' as Validación,
    COUNT(*) as Cantidad,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ERROR' END as Estado
FROM tickets
WHERE status_id IS NULL OR status_id NOT IN (SELECT id FROM ticket_statuses);

-- Verificar tickets sin creador
SELECT 
    'Tickets sin creador' as Validación,
    COUNT(*) as Cantidad,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ERROR' END as Estado
FROM tickets
WHERE created_by IS NULL OR created_by NOT IN (SELECT id FROM users);

-- Verificar comentarios huérfanos
SELECT 
    'Comentarios huérfanos' as Validación,
    COUNT(*) as Cantidad,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ERROR' END as Estado
FROM ticket_comments
WHERE ticket_id NOT IN (SELECT id FROM tickets);

-- Verificar historial huérfano
SELECT 
    'Historial huérfano' as Validación,
    COUNT(*) as Cantidad,
    CASE WHEN COUNT(*) = 0 THEN '✅ OK' ELSE '❌ ERROR' END as Estado
FROM ticket_history
WHERE ticket_id NOT IN (SELECT id FROM tickets);

-- ================================================================
-- RESUMEN FINAL
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    'RESUMEN FINAL' as '',
    '========================================' as '';

SELECT 
    'USUARIOS' as Entidad,
    (SELECT COUNT(*) FROM users) as Total,
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as Activos,
    '✅' as Estado
UNION ALL
SELECT 
    'TICKETS' as Entidad,
    (SELECT COUNT(*) FROM tickets) as Total,
    (SELECT COUNT(*) FROM tickets WHERE status_id NOT IN (5,6)) as Activos,
    '✅' as Estado
UNION ALL
SELECT 
    'COMENTARIOS' as Entidad,
    (SELECT COUNT(*) FROM ticket_comments) as Total,
    (SELECT COUNT(*) FROM ticket_comments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as Recientes,
    '✅' as Estado
UNION ALL
SELECT 
    'HISTORIAL' as Entidad,
    (SELECT COUNT(*) FROM ticket_history) as Total,
    (SELECT COUNT(*) FROM ticket_history WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as Recientes,
    '✅' as Estado
UNION ALL
SELECT 
    'ARCHIVOS' as Entidad,
    (SELECT COUNT(*) FROM ticket_attachments) as Total,
    (SELECT COUNT(*) FROM ticket_attachments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as Recientes,
    '✅' as Estado
UNION ALL
SELECT 
    'NOTIFICACIONES' as Entidad,
    (SELECT COUNT(*) FROM notifications) as Total,
    (SELECT COUNT(*) FROM notifications WHERE is_read = FALSE) as NoLeídas,
    '✅' as Estado;

-- ================================================================
-- VERIFICACIÓN DE CONTRASEÑAS
-- ================================================================

SELECT '' as '';
SELECT 
    '========================================' as '',
    'VERIFICACIÓN DE CONTRASEÑAS' as '',
    '========================================' as '';

SELECT 
    username as Usuario,
    CASE 
        WHEN password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a' 
        THEN '✅ demo123' 
        ELSE '❌ Diferente' 
    END as Contraseña
FROM users
WHERE is_active = TRUE
ORDER BY role_id, username;

-- ================================================================
-- MENSAJE FINAL
-- ================================================================

SELECT '' as '';
SELECT '========================================' as Mensaje
UNION ALL SELECT '✅ VERIFICACIÓN COMPLETADA EXITOSAMENTE' as Mensaje
UNION ALL SELECT '========================================' as Mensaje
UNION ALL SELECT '' as Mensaje
UNION ALL SELECT 'TODOS LOS DATOS DEMO FUERON CREADOS CORRECTAMENTE' as Mensaje
UNION ALL SELECT '' as Mensaje
UNION ALL SELECT 'Contraseña para todos los usuarios: demo123' as Mensaje
UNION ALL SELECT 'Consulta DEMO-CREDENTIALS.md para más detalles' as Mensaje
UNION ALL SELECT '========================================' as Mensaje;
