# Referencia Rápida de Endpoints - MAC Tickets API

## Base URL

**Producción (AWS):** `http://macticketsv.us-east-1.elasticbeanstalk.com`  
**Local:** `http://localhost:3001`

> ⚠️ **IMPORTANTE:** Todas las rutas de la API llevan el prefijo `/api/` (excepto health checks `/` y `/health`)

---

## Health Check

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/` | ❌ No | Health check root (sin /api/) |
| GET | `/health` | ❌ No | Health check detallado (sin /api/) |

---

## Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ No | Iniciar sesión |
| GET | `/api/auth/profile` | ✅ Sí | Obtener perfil del usuario |
| POST | `/api/auth/logout` | ❌ No | Cerrar sesión |

---

## Tickets

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/tickets` | ✅ Sí | Lista de tickets con filtros |
| GET | `/api/tickets/stats` | ✅ Sí | Estadísticas de tickets |
| GET | `/api/tickets/:id` | ✅ Sí | Detalle de un ticket |
| POST | `/api/tickets` | ✅ Sí | Crear nuevo ticket |
| PUT | `/api/tickets/:id` | ✅ Sí | Actualizar ticket |
| PATCH | `/api/tickets/:id/status` | ✅ Sí | Cambiar estado del ticket |
| POST | `/api/tickets/:id/assign` | ✅ Sí | Asignar ticket a técnico |
| POST | `/api/tickets/:id/accept` | ✅ Sí | Aceptar ticket (técnico) |
| POST | `/api/tickets/:id/reject` | ✅ Sí | Rechazar ticket (técnico) |
| POST | `/api/tickets/:id/resolve` | ✅ Sí | Resolver ticket |
| POST | `/api/tickets/:id/close` | ✅ Sí | Cerrar ticket (admin) |
| POST | `/api/tickets/:id/reopen` | ✅ Sí | Reabrir ticket (admin) |

---

## Comentarios

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/tickets/:ticketId/comments` | ✅ Sí | Obtener comentarios |
| POST | `/api/tickets/:ticketId/comments` | ✅ Sí | Agregar comentario |

---

## Archivos Adjuntos

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/tickets/:ticketId/attachments` | ✅ Sí | Listar archivos del ticket |
| POST | `/api/tickets/:ticketId/attachments` | ✅ Sí | Subir archivo (single) |
| POST | `/api/tickets/:ticketId/attachments/multiple` | ✅ Sí | Subir múltiples archivos |
| GET | `/api/attachments/:id` | ✅ Sí | Info de un archivo |
| GET | `/api/attachments/:id/download` | ✅ Sí | Descargar archivo |
| DELETE | `/api/attachments/:id` | ✅ Sí | Eliminar archivo |

---

## Usuarios

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/users` | ✅ Sí | Lista de usuarios |
| GET | `/api/users/:id` | ✅ Sí | Obtener usuario por ID |
| POST | `/api/users` | ✅ Sí | Crear usuario (admin) |
| PUT | `/api/users/:id` | ✅ Sí | Actualizar usuario (admin) |
| DELETE | `/api/users/:id` | ✅ Sí | Eliminar usuario (admin) |
| POST | `/api/users/:id/reset-password` | ✅ Sí | Resetear contraseña (admin) |

---

## Catálogos

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/catalog/categories` | ✅ Sí | Lista de categorías |
| GET | `/api/catalog/priorities` | ✅ Sí | Lista de prioridades |
| GET | `/api/catalog/ticket-statuses` | ✅ Sí | Lista de estados |
| GET | `/api/catalog/technicians` | ✅ Sí | Lista de técnicos |

---

## Reportes

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/reports/dashboard` | ✅ Sí | Estadísticas del dashboard |
| GET | `/api/reports/export` | ✅ Sí | Exportar reporte a Excel |

---

## PDF

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/pdf/ticket/:id` | ✅ Sí | Generar PDF del ticket |
| GET | `/api/pdf/ticket/:id/info` | ✅ Sí | Info de PDFs generados |

---

## Password Reset

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/password-resets` | ❌ No | Crear solicitud (público) |
| GET | `/api/password-resets` | ✅ Sí | Listar solicitudes (admin) |
| PATCH | `/api/password-resets/:id/process` | ✅ Sí | Procesar solicitud (admin) |

---

## Query Parameters Comunes

### GET /api/tickets
```
?page=1                  # Número de página
&limit=20               # Items por página
&status=1               # Filtrar por estado
&priority=2             # Filtrar por prioridad
&assignedTo=5           # Filtrar por técnico
&search=impresora       # Buscar en título/descripción
```

### GET /api/users
```
?page=1                  # Número de página
&limit=20               # Items por página
&role=2                 # Filtrar por rol
&search=juan            # Buscar por nombre/email
```

### GET /api/reports/dashboard
```
?dateRange=7days        # 7days, 30days, 90days, 1year
```

---

## Request Body Examples

### POST /api/auth/login
```json
{
  "email": "admin@maccomputadoras.com",
  "password": "Admin123"
}
```

> ⚠️ **NOTA:** El backend espera `email`, NO `username`

### POST /api/tickets
```json
{
  "title": "Problema con impresora",
  "description": "La impresora no enciende",
  "category_id": 1,
  "priority_id": 2,
  "client_company": "Empresa ABC",
  "client_contact": "Juan Pérez",
  "location": "Oficina 101"
}
```

### PATCH /api/tickets/:id/status
```json
{
  "status_id": 3,
  "reason": "Técnico comenzó a trabajar en el ticket"
}
```

### POST /api/tickets/:id/assign
```json
{
  "assigned_to": 5,
  "reason": "Técnico disponible con experiencia en hardware"
}
```

### POST /api/tickets/:id/resolve
```json
{
  "resolution_report": "Se reemplazó el fusible de la impresora...",
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUh..."
}
```

### POST /api/tickets/:ticketId/comments
```json
{
  "comment": "Cliente confirmó que el problema persiste",
  "is_internal": false
}
```

### POST /api/users
```json
{
  "username": "jtecnico",
  "email": "jtecnico@mac.com",
  "password": "temp123",
  "first_name": "Juan",
  "last_name": "Técnico",
  "role_id": 2
}
```

---

## Response Format

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación completada exitosamente",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "Formato de email inválido"
    }
  ]
}
```

---

## Authentication Header

Para todos los endpoints que requieren autenticación (✅ Sí):

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## File Upload (Multipart)

### POST /api/tickets/:ticketId/attachments

```bash
Content-Type: multipart/form-data

file: [binary data]
description: "Foto del equipo dañado"
```

Ejemplo con curl:
```bash
curl -X POST \
  http://macticketsv.us-east-1.elasticbeanstalk.com/api/tickets/1/attachments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "description=Foto del equipo"
```

---

## Status Codes

| Código | Significado |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error de validación |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Testing con cURL

### Login
```bash
curl -X POST http://macticketsv.us-east-1.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maccomputadoras.com","password":"Admin123"}'
```

> ⚠️ **Importante:** Usa `email`, no `username`

### Get Tickets (con token)
```bash
curl -X GET http://macticketsv.us-east-1.elasticbeanstalk.com/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Ticket
```bash
curl -X POST http://macticketsv.us-east-1.elasticbeanstalk.com/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test ticket",
    "description": "Test description",
    "category_id": 1,
    "priority_id": 2,
    "client_company": "Test Co",
    "client_contact": "Test User"
  }'
```

---

## Rate Limiting

**Configuración actual:**
- Ventana: 15 minutos
- Límite: 100 requests por IP
- Headers de respuesta:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## CORS

**Orígenes permitidos:**
- `http://localhost:5173` (desarrollo)
- Configurar dominio de producción en `CORS_ORIGIN`

**Métodos permitidos:**
- GET, POST, PUT, PATCH, DELETE, OPTIONS

**Headers permitidos:**
- Content-Type, Authorization, X-Requested-With

---

## Recursos Estáticos

### Archivos subidos
```
http://macticketsv.us-east-1.elasticbeanstalk.com/uploads/[filename]
```

---

## Testing en Postman

### Variables de Entorno

Crear un Environment con:
```
BASE_URL: http://macticketsv.us-east-1.elasticbeanstalk.com
API_URL: {{BASE_URL}}/api
TOKEN: [Se llena automáticamente después del login]
```

> **Nota:** Usa `{{API_URL}}` en tus requests, no `{{BASE_URL}}`

### Tests automáticos

En el endpoint de login, agregar este script:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Save token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("TOKEN", jsonData.data.token);
});
```

---

## Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2025-01-21 | Versión inicial con 43 endpoints |

---

**Última actualización:** 2025-01-21  
**Total de endpoints:** 43  
**Archivo Swagger:** `Docs/API-Gateway-Endpoints.json`

