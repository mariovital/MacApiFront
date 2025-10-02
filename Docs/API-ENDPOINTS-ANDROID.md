# 📱 API Endpoints - Guía para Equipo Android

**Sistema de Gestión de Tickets - MAC Computadoras**

Esta documentación contiene **TODOS** los endpoints disponibles para la aplicación Android, con ejemplos completos y respuestas esperadas.

---

## 🔐 **1. AUTENTICACIÓN**

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@maccomputadoras.com",
  "password": "demo123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@maccomputadoras.com",
      "first_name": "Roberto",
      "last_name": "Administrador",
      "role_id": 1,
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**
- **401**: Email o contraseña incorrectos
- **401**: Usuario inactivo
- **429**: Demasiados intentos de login

### **Obtener Perfil**
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@maccomputadoras.com",
    "first_name": "Roberto",
    "last_name": "Administrador",
    "role_id": 1,
    "role": "admin",
    "avatar_url": null,
    "created_at": "2024-11-01T14:00:00.000Z"
  }
}
```

---

## 🎫 **2. TICKETS**

### **2.1. Listar Tickets**
```http
GET /api/tickets?page=1&limit=20&status=2&priority=4&search=impresora
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `status` (opcional): Filtrar por estado (1-7)
- `priority` (opcional): Filtrar por prioridad (1-4)
- `category` (opcional): Filtrar por categoría
- `assignedTo` (opcional): Filtrar por técnico asignado
- `createdBy` (opcional): Filtrar por creador
- `search` (opcional): Buscar en título, descripción o número

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Tickets obtenidos exitosamente",
  "data": {
    "items": [
      {
        "id": 1,
        "ticket_number": "ID-2025-10-001",
        "title": "Sistema de facturación caído",
        "description": "El sistema no responde...",
        "status": {
          "id": 3,
          "name": "En Proceso",
          "color": "#F59E0B"
        },
        "priority": {
          "id": 4,
          "name": "Crítica",
          "level": 4,
          "color": "#F44336",
          "sla_hours": 4
        },
        "category": {
          "id": 2,
          "name": "Software",
          "color": "#3B82F6"
        },
        "creator": {
          "id": 8,
          "first_name": "Lucía",
          "last_name": "Mesa",
          "email": "lucia.mesa@maccomputadoras.com"
        },
        "assignee": {
          "id": 3,
          "first_name": "Juan",
          "last_name": "Pérez",
          "email": "juan.perez@maccomputadoras.com"
        },
        "created_at": "2025-10-02T18:00:00.000Z",
        "updated_at": "2025-10-02T18:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

**Filtrado por Rol:**
- **Admin**: Ve TODOS los tickets
- **Técnico**: Solo tickets asignados a él (`assigned_to = userId`)
- **Mesa de Trabajo**: Solo tickets que creó (`created_by = userId`)

---

### **2.2. Detalle de Ticket**
```http
GET /api/tickets/{id}
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Ticket obtenido exitosamente",
  "data": {
    "id": 1,
    "ticket_number": "ID-2025-10-001",
    "title": "Sistema de facturación caído",
    "description": "El sistema no responde desde las 8:00 AM...",
    "category": { "id": 2, "name": "Software", "color": "#3B82F6" },
    "priority": { "id": 4, "name": "Crítica", "level": 4, "color": "#F44336", "sla_hours": 4 },
    "status": { "id": 3, "name": "En Proceso", "color": "#F59E0B" },
    "creator": {
      "id": 8,
      "first_name": "Lucía",
      "last_name": "Mesa",
      "username": "lucia.mesa",
      "email": "lucia.mesa@maccomputadoras.com",
      "avatar_url": null
    },
    "assignee": {
      "id": 3,
      "first_name": "Juan",
      "last_name": "Pérez",
      "username": "juan.perez",
      "email": "juan.perez@maccomputadoras.com",
      "avatar_url": null
    },
    "assigner": {
      "id": 1,
      "first_name": "Roberto",
      "last_name": "Administrador",
      "username": "admin"
    },
    "client_company": "Contabilidad",
    "client_contact": "Sandra Ramírez",
    "client_email": "sramirez@empresa.com",
    "client_phone": "+52 555 234 5678",
    "client_department": "Contabilidad",
    "location": "Piso 3 - Oficina 301",
    "priority_justification": "Sistema crítico para operación diaria",
    "created_at": "2025-10-02T18:00:00.000Z",
    "updated_at": "2025-10-02T18:30:00.000Z",
    "assigned_at": "2025-10-02T18:05:00.000Z",
    "resolved_at": null,
    "closed_at": null
  }
}
```

**Errores:**
- **404**: Ticket no encontrado
- **403**: Sin permiso para ver este ticket

---

### **2.3. Crear Ticket**
```http
POST /api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Impresora no funciona en contabilidad",
  "description": "La impresora HP LaserJet presenta error 49 y no imprime documentos. Es urgente porque necesitamos imprimir facturas.",
  "category_id": 1,
  "priority_id": 3,
  "client_company": "Contabilidad",
  "client_contact": "María López",
  "client_email": "mlopez@empresa.com",
  "client_phone": "+52 555 123 4567",
  "client_department": "Contabilidad",
  "location": "Piso 3 - Oficina 301",
  "priority_justification": "Bloquea emisión de facturas del día"
}
```

**Campos Requeridos:**
- `title` (string, min: 5 caracteres)
- `description` (string, min: 10 caracteres)
- `category_id` (integer)
- `priority_id` (integer)

**Campos Opcionales:**
- `client_company` (string)
- `client_contact` (string)
- `client_email` (email)
- `client_phone` (string)
- `client_department` (string)
- `location` (string)
- `priority_justification` (string)

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Ticket creado exitosamente",
  "data": {
    "id": 5,
    "ticket_number": "ID-2025-10-002",
    "title": "Impresora no funciona en contabilidad",
    "status": {
      "id": 1,
      "name": "Nuevo",
      "color": "#6B7280"
    },
    "priority": {
      "id": 3,
      "name": "Alta",
      "color": "#FF5722"
    },
    "created_at": "2025-10-02T19:00:00.000Z"
  }
}
```

**Errores:**
- **400**: Validación fallida (título o descripción muy cortos)
- **400**: category_id o priority_id inválidos

---

### **2.4. Actualizar Ticket**
```http
PUT /api/tickets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Impresora HP LaserJet Error 49 - URGENTE",
  "description": "Actualización: El problema persiste después del reinicio. Error 49 indica problema de firmware.",
  "priority_id": 4,
  "client_phone": "+52 555 123 4567 ext. 205"
}
```

**Campos Actualizables:**
- `title`
- `description`
- `category_id`
- `priority_id`
- `client_company`, `client_contact`, `client_email`, `client_phone`, `client_department`
- `location`
- `priority_justification`

**Permisos:**
- **Admin**: Puede actualizar cualquier ticket
- **Técnico**: Solo tickets asignados a él
- **Mesa de Trabajo**: Solo tickets que creó

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Ticket actualizado exitosamente",
  "data": {
    "id": 5,
    "ticket_number": "ID-2025-10-002",
    "title": "Impresora HP LaserJet Error 49 - URGENTE",
    "priority": {
      "id": 4,
      "name": "Crítica",
      "color": "#F44336"
    }
  }
}
```

---

### **2.5. Cambiar Estado de Ticket**
```http
PATCH /api/tickets/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status_id": 3
}
```

**Estados Disponibles:**
- `1` - Nuevo
- `2` - Asignado
- `3` - En Proceso
- `4` - Pendiente Cliente
- `5` - Resuelto
- `6` - Cerrado
- `7` - Reabierto

**Permisos:**
- **Admin**: Puede cambiar cualquier estado
- **Técnico**: Solo sus tickets asignados
- **Mesa de Trabajo**: No puede cambiar estados

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estado del ticket actualizado exitosamente",
  "data": {
    "id": 5,
    "ticket_number": "ID-2025-10-002",
    "status": {
      "id": 3,
      "name": "En Proceso",
      "color": "#F59E0B"
    }
  }
}
```

**Errores:**
- **403**: Solo técnicos y admins pueden cambiar estados
- **404**: Ticket no encontrado

---

### **2.6. Asignar Ticket a Técnico**
```http
POST /api/tickets/{id}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "technician_id": 3
}
```

**Permisos:**
- Solo **Admin** puede asignar tickets

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Ticket asignado exitosamente",
  "data": {
    "id": 5,
    "ticket_number": "ID-2025-10-002",
    "status": {
      "id": 2,
      "name": "Asignado",
      "color": "#3B82F6"
    },
    "assignee": {
      "id": 3,
      "first_name": "Juan",
      "last_name": "Pérez"
    },
    "assigned_at": "2025-10-02T19:15:00.000Z"
  }
}
```

**Errores:**
- **403**: Solo administradores pueden asignar
- **404**: Técnico no encontrado
- **403**: Usuario seleccionado no es técnico

---

### **2.7. Estadísticas de Tickets**
```http
GET /api/tickets/stats
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 45,
    "porEstado": {
      "nuevo": 8,
      "asignado": 12,
      "enProceso": 15,
      "resuelto": 7,
      "cerrado": 3
    },
    "porPrioridad": {
      "critica": 5,
      "alta": 12
    }
  }
}
```

**Filtrado por Rol:**
- **Admin**: Estadísticas de TODOS los tickets
- **Técnico**: Solo sus tickets asignados
- **Mesa de Trabajo**: Solo tickets que creó

---

## 📋 **3. CATÁLOGOS (Datos Auxiliares)**

### **3.1. Categorías**
```http
GET /api/categories
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Hardware",
      "description": "Problemas con equipos físicos",
      "color": "#EF4444"
    },
    {
      "id": 2,
      "name": "Software",
      "description": "Errores en aplicaciones",
      "color": "#3B82F6"
    },
    {
      "id": 3,
      "name": "Red",
      "description": "Problemas de conectividad",
      "color": "#10B981"
    },
    {
      "id": 4,
      "name": "Cuenta",
      "description": "Gestión de cuentas y accesos",
      "color": "#F59E0B"
    }
  ]
}
```

---

### **3.2. Prioridades**
```http
GET /api/priorities
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Prioridades obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Baja",
      "level": 1,
      "color": "#4CAF50",
      "sla_hours": 72
    },
    {
      "id": 2,
      "name": "Media",
      "level": 2,
      "color": "#FF9800",
      "sla_hours": 24
    },
    {
      "id": 3,
      "name": "Alta",
      "level": 3,
      "color": "#FF5722",
      "sla_hours": 8
    },
    {
      "id": 4,
      "name": "Crítica",
      "level": 4,
      "color": "#F44336",
      "sla_hours": 4
    }
  ]
}
```

---

### **3.3. Estados de Tickets**
```http
GET /api/ticket-statuses
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Estados obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Nuevo",
      "description": "Ticket recién creado",
      "color": "#6B7280",
      "is_final": false,
      "order_index": 1
    },
    {
      "id": 2,
      "name": "Asignado",
      "description": "Ticket asignado a técnico",
      "color": "#3B82F6",
      "is_final": false,
      "order_index": 2
    },
    {
      "id": 3,
      "name": "En Proceso",
      "description": "Técnico trabajando en el ticket",
      "color": "#F59E0B",
      "is_final": false,
      "order_index": 3
    },
    {
      "id": 4,
      "name": "Pendiente Cliente",
      "description": "Esperando respuesta del cliente",
      "color": "#8B5CF6",
      "is_final": false,
      "order_index": 4
    },
    {
      "id": 5,
      "name": "Resuelto",
      "description": "Problema resuelto",
      "color": "#10B981",
      "is_final": false,
      "order_index": 5
    },
    {
      "id": 6,
      "name": "Cerrado",
      "description": "Ticket cerrado",
      "color": "#4B5563",
      "is_final": true,
      "order_index": 6
    },
    {
      "id": 7,
      "name": "Reabierto",
      "description": "Ticket reabierto por el admin",
      "color": "#EF4444",
      "is_final": false,
      "order_index": 7
    }
  ]
}
```

---

### **3.4. Técnicos Activos**
```http
GET /api/technicians
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Técnicos obtenidos exitosamente",
  "data": [
    {
      "id": 3,
      "username": "juan.perez",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@maccomputadoras.com",
      "avatar_url": null
    },
    {
      "id": 4,
      "username": "maria.gonzalez",
      "first_name": "María",
      "last_name": "González",
      "email": "maria.gonzalez@maccomputadoras.com",
      "avatar_url": null
    }
  ]
}
```

---

## 👥 **4. USUARIOS (Admin)**

### **4.1. Listar Usuarios**
```http
GET /api/users?page=1&limit=20&role=2
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (opcional): Número de página
- `limit` (opcional): Resultados por página
- `role` (opcional): Filtrar por rol (1=admin, 2=tecnico, 3=mesa_trabajo)

**Permisos:** Solo **Admin**

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios recuperados exitosamente",
  "data": {
    "items": [
      {
        "id": 3,
        "username": "juan.perez",
        "email": "juan.perez@maccomputadoras.com",
        "first_name": "Juan",
        "last_name": "Pérez",
        "role_id": 2,
        "is_active": true,
        "avatar_url": null,
        "created_at": "2024-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "pages": 1
    }
  }
}
```

---

## ⚠️ **5. MANEJO DE ERRORES**

Todos los endpoints siguen el mismo formato de error:

### **Error de Validación (400)**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "title",
      "message": "El título debe tener al menos 5 caracteres"
    }
  ]
}
```

### **No Autenticado (401)**
```json
{
  "success": false,
  "message": "Token de acceso requerido",
  "code": "NO_TOKEN"
}
```

```json
{
  "success": false,
  "message": "Token expirado",
  "code": "TOKEN_EXPIRED"
}
```

### **Sin Permisos (403)**
```json
{
  "success": false,
  "message": "Permisos insuficientes",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

### **No Encontrado (404)**
```json
{
  "success": false,
  "message": "Ticket no encontrado"
}
```

### **Rate Limit (429)**
```json
{
  "success": false,
  "message": "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### **Error Interno (500)**
```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```

---

## 🔑 **6. CREDENCIALES DEMO**

**Administrador:**
- Email: `admin@maccomputadoras.com`
- Password: `demo123`
- Permisos: Todos

**Técnico:**
- Email: `juan.perez@maccomputadoras.com`
- Password: `demo123`
- Permisos: Ver y actualizar tickets asignados

**Mesa de Trabajo:**
- Email: `lucia.mesa@maccomputadoras.com`
- Password: `demo123`
- Permisos: Crear y ver sus propios tickets

**Todos los usuarios:** Password es `demo123`

---

## 🚀 **7. FLUJO DE TRABAJO RECOMENDADO**

### **Para Mesa de Trabajo (Crear Ticket)**
1. `POST /api/auth/login` → Obtener token
2. `GET /api/categories` → Cargar categorías
3. `GET /api/priorities` → Cargar prioridades
4. `POST /api/tickets` → Crear ticket con datos seleccionados
5. `GET /api/tickets` → Ver mis tickets creados

### **Para Técnico (Gestionar Ticket)**
1. `POST /api/auth/login` → Obtener token
2. `GET /api/tickets` → Ver tickets asignados
3. `GET /api/tickets/{id}` → Ver detalle
4. `PATCH /api/tickets/{id}/status` → Cambiar a "En Proceso"
5. `PUT /api/tickets/{id}` → Actualizar información
6. `PATCH /api/tickets/{id}/status` → Marcar como "Resuelto"

### **Para Admin (Asignar y Supervisar)**
1. `POST /api/auth/login` → Obtener token
2. `GET /api/tickets?status=1` → Ver tickets nuevos
3. `GET /api/technicians` → Ver técnicos disponibles
4. `POST /api/tickets/{id}/assign` → Asignar a técnico
5. `GET /api/tickets/stats` → Ver estadísticas generales

---

## 📡 **8. BASE URL**

**Desarrollo Local:**
```
http://localhost:3001/api
```

**Con ngrok (para testing remoto):**
```bash
ngrok http 3001
# Usar URL generada: https://xxxx-xx-xxx-xxx-xx.ngrok.io/api
```

---

## 💡 **9. TIPS DE IMPLEMENTACIÓN**

### **Almacenar Token**
```kotlin
// Guardar token después de login
val token = loginResponse.data.token
sharedPreferences.edit()
    .putString("jwt_token", token)
    .apply()

// Usar en requests
val token = sharedPreferences.getString("jwt_token", "")
val request = Request.Builder()
    .url("${BASE_URL}/tickets")
    .addHeader("Authorization", "Bearer $token")
    .build()
```

### **Manejo de Token Expirado**
```kotlin
// Si recibes 401 con code "TOKEN_EXPIRED"
if (response.code == 401 && errorCode == "TOKEN_EXPIRED") {
    // Hacer logout y redirigir a login
    clearTokens()
    navigateToLogin()
}
```

### **Colores de Estados y Prioridades**
Usa los colores hexadecimales del API directamente en la UI:
```kotlin
val priorityColor = Color.parseColor(ticket.priority.color) // "#F44336"
```

---

## 📞 **10. SOPORTE**

**Problemas con el API:**
- Revisar formato de request (Content-Type, Authorization header)
- Verificar que el token no haya expirado
- Confirmar que el usuario tiene permisos para la acción

**Base de datos:**
- Para resetear datos demo: `npm run seed` en el servidor

**Documentación adicional:**
- Revisar `Docs/POSTMAN-ENDPOINTS.md` para ejemplos con Postman
- Revisar `MAC/mac-tickets-api/README-SEED.md` para setup del servidor

---

**Última actualización:** 2 de octubre, 2025
**Versión API:** 1.0.0

