# 📋 **TODOS LOS ENDPOINTS PARA POSTMAN**
## Sistema de Gestión de Tickets - MAC Computadoras

---

## **🔧 CONFIGURACIÓN INICIAL POSTMAN**

### **Base URL**
```
Desarrollo: http://localhost:3001/api
Producción: https://api.mac-tickets.com/api
```

### **Headers Globales**
```
Content-Type: application/json
Authorization: Bearer {{jwt_token}}
```

### **Variables de Postman (Environment)**
```
base_url = http://localhost:3001/api
jwt_token = (se obtiene del login)
user_id = (se obtiene del login)
```

---

## **🔐 1. AUTENTICACIÓN (AUTH)**

### **1.1 POST /auth/login**
**Descripción:** Iniciar sesión  
**Permisos:** Público  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "email": "admin@tuempresa.com",
  "password": "admin123"
}
```
**Respuesta Esperada (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@tuempresa.com",
      "first_name": "Super",
      "last_name": "Admin",
      "role": "admin"
    },
    "token": "JWT_TOKEN_HERE",
    "refreshToken": "REFRESH_TOKEN_HERE"
  },
  "message": "Login exitoso"
}
```

### **1.2 POST /auth/refresh**
**Descripción:** Renovar token de acceso  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

### **1.3 POST /auth/logout**
**Descripción:** Cerrar sesión  
**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

### **1.4 POST /auth/forgot-password**
**Descripción:** Recuperar contraseña  
**Body (raw JSON):**
```json
{
  "email": "usuario@ejemplo.com"
}
```

### **1.5 POST /auth/reset-password**
**Descripción:** Resetear contraseña con token  
**Body (raw JSON):**
```json
{
  "token": "reset_token_aqui",
  "newPassword": "nueva_password123"
}
```

---

## **👥 2. USUARIOS (USERS)**

### **2.1 GET /users**
**Descripción:** Lista de usuarios  
**Permisos:** Admin  
**Headers:**
```
Authorization: Bearer {{jwt_token}}
```
**Query Params (opcionales):**
```
?page=1&limit=20&role=tecnico&search=juan&is_active=true
```

### **2.2 GET /users/:id**
**Descripción:** Obtener usuario por ID  
**URL:** `/users/1`  
**Permisos:** Admin o propio usuario  

### **2.3 POST /users**
**Descripción:** Crear nuevo usuario  
**Permisos:** Admin  
**Body (raw JSON):**
```json
{
  "username": "jtecnico",
  "email": "juan.tecnico@ejemplo.com",
  "password": "password123",
  "first_name": "Juan",
  "last_name": "Técnico",
  "role_id": 2
}
```

### **2.4 PUT /users/:id**
**Descripción:** Actualizar usuario  
**URL:** `/users/2`  
**Body (raw JSON):**
```json
{
  "first_name": "Juan Carlos",
  "last_name": "Técnico Experto",
  "email": "juancarlos.tecnico@ejemplo.com",
  "is_active": true
}
```

### **2.5 DELETE /users/:id**
**Descripción:** Eliminar usuario  
**URL:** `/users/2`  
**Permisos:** Admin  

### **2.6 POST /users/:id/reset-password**
**Descripción:** Resetear contraseña de usuario  
**URL:** `/users/2/reset-password`  
**Body (raw JSON):**
```json
{
  "newPassword": "nueva_password123"
}
```

### **2.7 PUT /users/:id/status**
**Descripción:** Activar/desactivar usuario  
**URL:** `/users/2/status`  
**Body (raw JSON):**
```json
{
  "is_active": false
}
```

---

## **🎫 3. TICKETS**

### **3.1 GET /tickets**
**Descripción:** Lista de tickets con filtros  
**Headers:**
```
Authorization: Bearer {{jwt_token}}
```
**Query Params (opcionales):**
```
?page=1&limit=20&status=2&priority=3&category=1&assigned_to=5&created_by=1&search=impresora&date_from=2024-01-01&date_to=2024-01-31
```

### **3.2 GET /tickets/:id**
**Descripción:** Detalle completo de ticket  
**URL:** `/tickets/1`  

### **3.3 POST /tickets**
**Descripción:** Crear nuevo ticket  
**Body (raw JSON):**
```json
{
  "title": "Problema con impresora HP LaserJet",
  "description": "La impresora HP LaserJet Pro no responde a los comandos de impresión desde las computadoras del área de contabilidad",
  "category_id": 1,
  "priority_id": 2,
  "client_company": "ITESM S.A de C.V.",
  "client_contact": "María González - Contabilidad",
  "client_email": "maria.gonzalez@itesm.com",
  "client_phone": "555-1234-567",
  "location": "Edificio A, Piso 2, Área Contabilidad",
  "estimated_hours": 2.0
}
```

### **3.4 PUT /tickets/:id**
**Descripción:** Actualizar ticket completo  
**URL:** `/tickets/1`  
**Body (raw JSON):**
```json
{
  "title": "Problema con impresora HP LaserJet - URGENTE",
  "description": "Descripción actualizada con más detalles",
  "priority_id": 3,
  "estimated_hours": 3.0
}
```

### **3.5 PATCH /tickets/:id/status**
**Descripción:** Cambiar estado de ticket  
**URL:** `/tickets/1/status`  
**Body (raw JSON):**
```json
{
  "status_id": 3,
  "reason": "Iniciando trabajo en sitio",
  "estimated_resolution": "2024-01-16T16:00:00.000Z"
}
```

### **3.6 POST /tickets/:id/assign**
**Descripción:** Asignar ticket a técnico  
**URL:** `/tickets/1/assign`  
**Permisos:** Admin o Mesa de Trabajo  
**Body (raw JSON):**
```json
{
  "assigned_to": 5,
  "reason": "Técnico especializado en hardware HP",
  "priority_justification": "Cliente VIP requiere atención urgente"
}
```

### **3.7 POST /tickets/:id/accept**
**Descripción:** Aceptar ticket (Técnico)  
**URL:** `/tickets/1/accept`  
**Permisos:** Técnico asignado  
**Body (raw JSON):**
```json
{
  "message": "Ticket aceptado, me dirijo al lugar"
}
```

### **3.8 POST /tickets/:id/reject**
**Descripción:** Rechazar ticket (Técnico)  
**URL:** `/tickets/1/reject`  
**Body (raw JSON):**
```json
{
  "reason": "No tengo las herramientas necesarias para este tipo de reparación"
}
```

### **3.9 POST /tickets/:id/close**
**Descripción:** Cerrar ticket con solución  
**URL:** `/tickets/1/close`  
**Permisos:** Técnico asignado  
**Body (raw JSON):**
```json
{
  "solution_description": "Se reemplazó el cable de alimentación defectuoso y se reinició el sistema de impresión. Problema completamente resuelto.",
  "actual_hours": 1.5,
  "resolution_notes": "Cable de repuesto instalado, sistema funcionando correctamente"
}
```

### **3.10 POST /tickets/:id/reopen**
**Descripción:** Reabrir ticket cerrado  
**URL:** `/tickets/1/reopen`  
**Permisos:** Admin  
**Body (raw JSON):**
```json
{
  "reason": "Cliente reporta que el problema persiste después de la supuesta solución"
}
```

### **3.11 GET /tickets/my-tickets**
**Descripción:** Tickets asignados al usuario actual  
**Permisos:** Técnico  

### **3.12 GET /tickets/stats**
**Descripción:** Estadísticas generales de tickets  
**Permisos:** Admin  

---

## **💬 4. COMENTARIOS (COMMENTS)**

### **4.1 GET /tickets/:id/comments**
**Descripción:** Obtener comentarios de ticket  
**URL:** `/tickets/1/comments`  
**Query Params:**
```
?page=1&limit=10&include_internal=true
```

### **4.2 POST /tickets/:id/comments**
**Descripción:** Agregar comentario a ticket  
**URL:** `/tickets/1/comments`  
**Body (raw JSON):**
```json
{
  "comment": "He revisado el equipo y confirmo que el problema es del cable de alimentación",
  "is_internal": false
}
```

### **4.3 PUT /comments/:id**
**Descripción:** Editar comentario  
**URL:** `/comments/5`  
**Body (raw JSON):**
```json
{
  "comment": "Comentario editado con información adicional"
}
```

### **4.4 DELETE /comments/:id**
**Descripción:** Eliminar comentario  
**URL:** `/comments/5`  

---

## **📎 5. ARCHIVOS ADJUNTOS (ATTACHMENTS)**

### **5.1 POST /tickets/:id/attachments**
**Descripción:** Subir archivo a ticket  
**URL:** `/tickets/1/attachments`  
**Headers:**
```
Authorization: Bearer {{jwt_token}}
Content-Type: multipart/form-data
```
**Body (form-data):**
```
file: [Seleccionar archivo]
description: "Foto del equipo dañado"
```

### **5.2 GET /tickets/:id/attachments**
**Descripción:** Obtener archivos de ticket  
**URL:** `/tickets/1/attachments`  

### **5.3 DELETE /attachments/:id**
**Descripción:** Eliminar archivo  
**URL:** `/attachments/10`  

### **5.4 GET /attachments/:id/download**
**Descripción:** Descargar archivo  
**URL:** `/attachments/10/download`  

---

## **📂 6. CATEGORÍAS (CATEGORIES)**

### **6.1 GET /categories**
**Descripción:** Lista de categorías activas  

### **6.2 GET /categories/:id**
**Descripción:** Obtener categoría por ID  
**URL:** `/categories/1`  

### **6.3 POST /categories**
**Descripción:** Crear nueva categoría  
**Permisos:** Admin  
**Body (raw JSON):**
```json
{
  "name": "Redes y Conectividad",
  "description": "Problemas relacionados con redes, WiFi, internet y conectividad",
  "color": "#10B981",
  "is_active": true
}
```

### **6.4 PUT /categories/:id**
**Descripción:** Actualizar categoría  
**URL:** `/categories/1`  
**Body (raw JSON):**
```json
{
  "name": "Hardware y Equipos",
  "description": "Problemas con equipos físicos y componentes",
  "color": "#EF4444"
}
```

### **6.5 DELETE /categories/:id**
**Descripción:** Eliminar categoría  
**URL:** `/categories/1`  
**Permisos:** Admin  

### **6.6 PUT /categories/:id/status**
**Descripción:** Activar/desactivar categoría  
**URL:** `/categories/1/status`  
**Body (raw JSON):**
```json
{
  "is_active": false
}
```

---

## **⚡ 7. PRIORIDADES (PRIORITIES)**

### **7.1 GET /priorities**
**Descripción:** Lista de prioridades activas  

### **7.2 GET /priorities/:id**
**URL:** `/priorities/1`  

### **7.3 POST /priorities**
**Permisos:** Admin  
**Body (raw JSON):**
```json
{
  "name": "Ultra Alta",
  "level": 5,
  "color": "#DC2626",
  "sla_hours": 2,
  "is_active": true
}
```

### **7.4 PUT /priorities/:id**
**URL:** `/priorities/1`  
**Body (raw JSON):**
```json
{
  "name": "Baja Prioridad",
  "sla_hours": 96
}
```

### **7.5 DELETE /priorities/:id**
**URL:** `/priorities/1`  

---

## **🔄 8. ESTADOS DE TICKETS (STATUSES)**

### **8.1 GET /ticket-statuses**
**Descripción:** Lista de estados disponibles  

### **8.2 GET /ticket-statuses/:id**
**URL:** `/ticket-statuses/1`  

### **8.3 POST /ticket-statuses**
**Permisos:** Admin  
**Body (raw JSON):**
```json
{
  "name": "En Revisión",
  "description": "Ticket en proceso de revisión por supervisor",
  "color": "#8B5CF6",
  "is_final": false,
  "order_index": 8
}
```

### **8.4 GET /ticket-statuses/transitions**
**Descripción:** Transiciones de estado permitidas  

### **8.5 GET /ticket-statuses/transitions/:from_status**
**Descripción:** Transiciones permitidas desde un estado  
**URL:** `/ticket-statuses/transitions/2`  

---

## **📊 9. REPORTES (REPORTS)**

### **9.1 GET /reports/dashboard**
**Descripción:** Métricas principales del dashboard  
**Permisos:** Admin  

### **9.2 GET /reports/tickets**
**Descripción:** Reporte detallado de tickets  
**Query Params:**
```
?date_from=2024-01-01&date_to=2024-01-31&status=3&technician=5&priority=4&category=1&format=json
```

### **9.3 GET /reports/technicians**
**Descripción:** Reporte de rendimiento por técnico  

### **9.4 GET /reports/sla**
**Descripción:** Reporte de cumplimiento SLA  

### **9.5 GET /reports/categories**
**Descripción:** Reporte por categorías  

### **9.6 GET /reports/resolution-times**
**Descripción:** Tiempos promedio de resolución  

### **9.7 POST /reports/custom**
**Descripción:** Generar reporte personalizado  
**Body (raw JSON):**
```json
{
  "title": "Reporte Mensual Hardware",
  "filters": {
    "date_from": "2024-01-01",
    "date_to": "2024-01-31",
    "category_id": 1,
    "priority_id": [3, 4]
  },
  "group_by": ["status", "priority"],
  "include_details": true
}
```

---

## **🔔 10. NOTIFICACIONES (NOTIFICATIONS)**

### **10.1 GET /notifications**
**Descripción:** Notificaciones del usuario actual  
**Query Params:**
```
?page=1&limit=20&unread_only=true&type=ticket_assigned
```

### **10.2 GET /notifications/count**
**Descripción:** Contador de notificaciones no leídas  

### **10.3 PUT /notifications/:id/read**
**Descripción:** Marcar notificación como leída  
**URL:** `/notifications/25/read`  

### **10.4 PUT /notifications/read-all**
**Descripción:** Marcar todas como leídas  

### **10.5 DELETE /notifications/:id**
**URL:** `/notifications/25`  

### **10.6 POST /notifications/test**
**Descripción:** Enviar notificación de prueba  
**Permisos:** Admin  
**Body (raw JSON):**
```json
{
  "user_id": 5,
  "title": "Notificación de Prueba",
  "message": "Esta es una notificación de prueba del sistema",
  "type": "system"
}
```

---

## **⚙️ 11. CONFIGURACIONES (SETTINGS)**

### **11.1 GET /settings**
**Descripción:** Todas las configuraciones del sistema  
**Permisos:** Admin  

### **11.2 GET /settings/public**
**Descripción:** Configuraciones públicas  

### **11.3 GET /settings/:key**
**URL:** `/settings/company_name`  

### **11.4 PUT /settings/:key**
**URL:** `/settings/max_file_size`  
**Body (raw JSON):**
```json
{
  "value": "15728640",
  "description": "Tamaño máximo de archivo en bytes (15MB)"
}
```

### **11.5 POST /settings**
**Body (raw JSON):**
```json
{
  "key": "notification_email_enabled",
  "value": "true",
  "description": "Envío de notificaciones por email habilitado",
  "type": "boolean",
  "is_public": false
}
```

---

## **📈 12. ESTADÍSTICAS Y MÉTRICAS**

### **12.1 GET /stats/overview**
**Descripción:** Vista general de estadísticas  

### **12.2 GET /stats/tickets/by-status**
**Descripción:** Tickets agrupados por estado  

### **12.3 GET /stats/tickets/by-priority**
**Descripción:** Tickets agrupados por prioridad  

### **12.4 GET /stats/tickets/by-category**
**Descripción:** Tickets agrupados por categoría  

### **12.5 GET /stats/technicians/performance**
**Descripción:** Rendimiento de técnicos  

### **12.6 GET /stats/resolution-times**
**Descripción:** Tiempos de resolución promedio  

### **12.7 GET /stats/sla-compliance**
**Descripción:** Cumplimiento de SLA  

---

## **🔍 13. BÚSQUEDA Y FILTROS**

### **13.1 GET /search/tickets**
**Query Params:**
```
?q=impresora&category=1&priority=3&status=2&date_from=2024-01-01
```

### **13.2 GET /search/users**
**Query Params:**
```
?q=juan&role=tecnico&is_active=true
```

### **13.3 POST /search/advanced**
**Body (raw JSON):**
```json
{
  "entity": "tickets",
  "query": "impresora OR scanner",
  "filters": {
    "category_id": [1, 2],
    "priority_id": [3, 4],
    "created_at": {
      "from": "2024-01-01",
      "to": "2024-01-31"
    }
  },
  "sort": {
    "field": "created_at",
    "order": "desc"
  },
  "page": 1,
  "limit": 50
}
```

---

## **🏥 14. HEALTH Y SISTEMA**

### **14.1 GET /health**
**Descripción:** Estado de salud del sistema  
**Permisos:** Público  

### **14.2 GET /health/detailed**
**Descripción:** Estado detallado del sistema  
**Permisos:** Admin  

### **14.3 GET /version**
**Descripción:** Versión de la API  
**Permisos:** Público  

### **14.4 GET /system/info**
**Descripción:** Información del sistema  
**Permisos:** Admin  

---

## **🧪 15. ENDPOINTS DE TESTING**

### **15.1 POST /test/populate-data**
**Descripción:** Poblar BD con datos de prueba  
**Permisos:** Solo en desarrollo  

### **15.2 POST /test/create-sample-tickets**
**Body (raw JSON):**
```json
{
  "count": 50,
  "categories": [1, 2, 3],
  "priorities": [1, 2, 3, 4]
}
```

### **15.3 DELETE /test/clear-data**
**Descripción:** Limpiar datos de prueba  

---

## **🔒 16. AUTORIZACIONES Y PERMISOS**

### **16.1 GET /auth/permissions**
**Descripción:** Permisos del usuario actual  

### **16.2 GET /auth/check-permission**
**Query Params:**
```
?resource=tickets&action=create
```

### **16.3 GET /roles**
**Descripción:** Lista de roles disponibles  

### **16.4 GET /roles/:id/permissions**
**URL:** `/roles/2/permissions`  

---

## **📝 NOTAS IMPORTANTES PARA POSTMAN**

### **Variables a Configurar:**
1. `{{base_url}}` = `http://localhost:3001/api`
2. `{{jwt_token}}` = Token obtenido del login
3. `{{user_id}}` = ID del usuario logueado
4. `{{refresh_token}}` = Token de refresh

### **Colecciones Recomendadas:**
1. **Auth & Setup** - Endpoints de autenticación
2. **Tickets Management** - CRUD de tickets
3. **User Management** - Gestión de usuarios (Admin)
4. **Reports & Analytics** - Reportes y estadísticas
5. **System Configuration** - Configuraciones del sistema

### **Tests de Postman Sugeridos:**
```javascript
// Test para verificar respuesta exitosa
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test para verificar estructura de respuesta
pm.test("Response has success property", function () {
    pm.expect(pm.response.json()).to.have.property('success');
});

// Guardar token JWT para otros requests
pm.test("Save JWT token", function () {
    var jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.token) {
        pm.environment.set("jwt_token", jsonData.data.token);
    }
});
```

### **Scripts Pre-request:**
```javascript
// Auto-refresh token si está expirado
if (pm.environment.get("jwt_token")) {
    // Lógica para verificar y renovar token si es necesario
}
```

---

**¡ENDPOINTS COMPLETOS LISTOS PARA POSTMAN!** 🚀

Total de endpoints: **89 endpoints** organizados en 16 categorías diferentes para testing completo del sistema.
