# Fix: Error 400 al Reasignar Ticket

## Error
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
Error asignando ticket: AxiosError
Error reasignando ticket: AxiosError
```

## Causa Raíz

**Desincronización entre Frontend y Backend:**

### Backend (Esperaba):
```javascript
// /controllers/ticketController.js - Línea 260
export const assignTicket = async (req, res) => {
  const { technician_id } = req.body;  // ← Esperaba 'technician_id'
  
  if (!technician_id) {
    return res.status(400).json({
      success: false,
      message: 'El campo technician_id es requerido'
    });
  }
  // ...
}
```

### Frontend (Enviaba):
```javascript
// /services/ticketService.js - Línea 79 (ANTES)
assignTicket: async (ticketId, technicianId, reason = '') => {
  const response = await api.post(`/tickets/${ticketId}/assign`, {
    assigned_to: technicianId,  // ❌ Enviaba 'assigned_to'
    reason
  });
}
```

**Resultado:** El backend no recibía `technician_id`, por lo que retornaba error 400.

---

## Solución Aplicada

### Archivo Corregido: `/services/ticketService.js`

**ANTES:**
```javascript
assignTicket: async (ticketId, technicianId, reason = '') => {
  try {
    const response = await api.post(`/tickets/${ticketId}/assign`, {
      assigned_to: technicianId,  // ❌ Incorrecto
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Error asignando ticket:', error);
    throw error;
  }
}
```

**DESPUÉS:**
```javascript
assignTicket: async (ticketId, technicianId, reason = '') => {
  try {
    const response = await api.post(`/tickets/${ticketId}/assign`, {
      technician_id: technicianId,  // ✅ Correcto
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Error asignando ticket:', error);
    throw error;
  }
}
```

**Cambio:** `assigned_to` → `technician_id`

---

## Verificación

### ✅ Request Correcto
```http
POST /api/tickets/13/assign
Content-Type: application/json

{
  "technician_id": 2,
  "reason": "Reasignación manual"
}
```

### ✅ Response Esperada
```json
{
  "success": true,
  "message": "Ticket asignado exitosamente",
  "data": {
    "id": 13,
    "ticket_number": "ID-2025-10-009",
    "assigned_to": 2,
    "assignee": {
      "id": 2,
      "first_name": "María",
      "last_name": "González",
      "username": "mgonzalez"
    }
  }
}
```

---

## Testing

### Test 1: Reasignación Básica
```bash
1. Login como admin
2. Ir a un ticket: /tickets/13
3. Click "Reasignar"
4. Seleccionar un técnico
5. Click "Asignar Ticket"
6. ✅ Debe asignarse sin errores
7. ✅ Modal debe cerrarse
8. ✅ Alert: "Ticket reasignado exitosamente"
9. ✅ Panel "Asignación" debe actualizar
```

### Test 2: Verificar en Consola del Navegador
```
Network Tab → POST /api/tickets/13/assign

Request Payload debe mostrar:
{
  "technician_id": 2,
  "reason": "Reasignación manual"
}

Response debe ser 200 OK con:
{
  "success": true,
  "message": "Ticket asignado exitosamente",
  "data": { ... }
}
```

### Test 3: Verificar en Backend Console
```bash
# En la terminal del backend NO debe aparecer:
❌ El campo technician_id es requerido

# Debe aparecer:
✅ Ticket asignado exitosamente
```

---

## ¿Por Qué Ocurrió Este Error?

### Documentación Inconsistente
En diferentes partes del código se usaban nombres diferentes para el mismo campo:

**En el modelo de datos:**
- `assigned_to` (columna de la tabla `tickets`)

**En el endpoint:**
- `technician_id` (body del POST request)

**En el servicio:**
- Se usaba `assigned_to` incorrectamente

### Lección Aprendida
✅ **Siempre verificar el contrato de la API antes de implementar:**
```javascript
// 1. Ver qué espera el backend
console.log('Backend expects:', req.body);

// 2. Ver qué envía el frontend
console.log('Frontend sends:', requestBody);

// 3. Asegurar que coincidan
```

---

## Archivos Afectados

### ✅ Corregido
- `/services/ticketService.js`
  - Línea 79: `assigned_to` → `technician_id`

### ✅ Sin Cambios (ya estaban correctos)
- `/pages/tickets/TicketDetail.jsx`
  - Solo llama al servicio, no construye el body
- `/controllers/ticketController.js`
  - Backend ya estaba esperando `technician_id` correctamente

---

## Validación Backend

El backend valida correctamente:

```javascript
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { technician_id } = req.body;

    // ✅ Validación de campo requerido
    if (!technician_id) {
      return res.status(400).json({
        success: false,
        message: 'El campo technician_id es requerido'
      });
    }

    // ✅ Llamar al servicio
    const updatedTicket = await ticketService.assignTicket(
      id,
      technician_id,
      req.user.id,
      req.user.role
    );

    // ✅ Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Ticket asignado exitosamente',
      data: updatedTicket
    });

  } catch (error) {
    // ✅ Manejo de errores específicos
    if (error.message === 'Ticket no encontrado' || 
        error.message === 'Técnico no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    // Otros errores...
  }
};
```

---

## Prevención de Errores Similares

### 1. Documentar Contratos de API
```javascript
/**
 * Asignar ticket a técnico
 * 
 * @endpoint POST /api/tickets/:id/assign
 * @body {
 *   technician_id: number (required),
 *   reason: string (optional)
 * }
 * @returns {
 *   success: boolean,
 *   message: string,
 *   data: Ticket
 * }
 */
```

### 2. Usar TypeScript (Futuro)
```typescript
interface AssignTicketRequest {
  technician_id: number;
  reason?: string;
}
```

### 3. Tests de Integración
```javascript
describe('POST /api/tickets/:id/assign', () => {
  it('debe asignar ticket con technician_id correcto', async () => {
    const response = await request(app)
      .post('/api/tickets/13/assign')
      .send({ technician_id: 2, reason: 'Test' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
  
  it('debe retornar 400 sin technician_id', async () => {
    const response = await request(app)
      .post('/api/tickets/13/assign')
      .send({ assigned_to: 2 })  // ❌ Campo incorrecto
      .expect(400);
    
    expect(response.body.message).toContain('technician_id es requerido');
  });
});
```

---

## Checklist de Verificación

Antes de implementar un nuevo endpoint:

- [ ] ✅ Revisar backend: ¿Qué campos espera?
- [ ] ✅ Revisar nombres exactos de campos
- [ ] ✅ Verificar tipos de datos (number, string, etc.)
- [ ] ✅ Probar con datos reales
- [ ] ✅ Revisar respuestas de error
- [ ] ✅ Documentar el contrato
- [ ] ✅ Agregar tests

---

## Comandos de Debugging

### Ver Request en Navegador
```javascript
// En DevTools → Network → Request Payload
{
  "technician_id": 2,  // ✅ Debe ser este nombre
  "reason": "Reasignación manual"
}
```

### Ver Request en Backend
```javascript
// En ticketController.js
console.log('Request body:', req.body);
// Output esperado: { technician_id: 2, reason: '...' }
```

### Curl para Testing Manual
```bash
curl -X POST http://localhost:3001/api/tickets/13/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "technician_id": 2,
    "reason": "Reasignación manual"
  }'
```

---

## Status

✅ **SOLUCIONADO**

**Cambio realizado:**
- `assigned_to` → `technician_id` en `/services/ticketService.js`

**Resultado:**
- ✅ Reasignación de tickets funciona correctamente
- ✅ Backend recibe el campo correcto
- ✅ Sin errores 400
- ✅ Confirmación exitosa al usuario

---

## Fecha
Octubre 2025

## Responsable
Vital (con asistencia de IA)

---

**¡Error corregido y funcionalidad 100% operativa!** 🎯✅🔧

