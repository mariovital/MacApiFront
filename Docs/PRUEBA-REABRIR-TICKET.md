# 🧪 Guía de Prueba: Reabrir Ticket Cerrado

## 📋 Contexto

Tienes un ticket cerrado (ID 4) que necesitas reabrir como administrador.

---

## ✅ **Opción 1: Acceso Directo al Ticket Cerrado**

### **Pasos:**

1. **Asegúrate de estar logueado como administrador**
   - Usuario: `admin`
   - Contraseña: `admin123`
   - O como: `Roberto Administrador` (ya estás logueado)

2. **Abre el ticket cerrado directamente en tu navegador:**
   ```
   http://localhost:5173/tickets/4
   ```

3. **Verás:**
   - Título: "Escáner Epson presenta líneas en digitalización"
   - Estado: **"Cerrado"** (chip gris)
   - Sección: **"Acciones del Ticket"**
   - Botón naranja: **"Reabrir Ticket"**

4. **Haz clic en "Reabrir Ticket"**

5. **Se abrirá un modal naranja:**
   - Título: "Reabrir Ticket"
   - Campo: "Razón para Reabrir" (obligatorio, mínimo 10 caracteres)

6. **Escribe la razón:**
   ```
   Cliente reporta que el problema volvió a ocurrir. Requiere nueva revisión.
   ```

7. **Haz clic en "Reabrir Ticket"**

8. **✅ Resultado Esperado:**
   - Ticket cambia a estado **"Reabierto"** (chip rojo)
   - Aparece comentario automático: `[REAPERTURA] Ticket reabierto. Razón: ...`
   - Fechas `resolved_at` y `closed_at` se borran
   - Se guarda `reopened_at` y `reopened_by`

---

## ✅ **Opción 2: Agregar Ticket Cerrado a la Vista**

Si quieres ver tickets cerrados en la lista principal:

### **Modificación Rápida (Temporal):**

1. **Abre el archivo:**
   ```
   /MAC/mac-tickets-front/src/pages/tickets/TicketList.jsx
   ```

2. **Busca la sección de filtros (aprox. línea 150-200)**

3. **Agrega un filtro de estado:**
   ```jsx
   const [statusFilter, setStatusFilter] = useState(''); // '' = todos, 6 = cerrado
   ```

4. **Modifica la llamada al API:**
   ```jsx
   const response = await ticketService.getTickets({
     page,
     limit: 20,
     status: statusFilter // Agregar este parámetro
   });
   ```

5. **Agrega un select para filtrar:**
   ```jsx
   <Select
     value={statusFilter}
     onChange={(e) => setStatusFilter(e.target.value)}
     displayEmpty
   >
     <MenuItem value="">Todos los estados</MenuItem>
     <MenuItem value="1">Nuevo</MenuItem>
     <MenuItem value="2">Asignado</MenuItem>
     <MenuItem value="3">En Proceso</MenuItem>
     <MenuItem value="5">Resuelto</MenuItem>
     <MenuItem value="6">Cerrado</MenuItem>
     <MenuItem value="7">Reabierto</MenuItem>
   </Select>
   ```

6. **Selecciona "Cerrado" en el filtro**

7. **Ahora verás el ticket ID 4 en la lista**

---

## 🧪 **Prueba Completa del Flujo**

### **Flujo Completo: Nuevo → Cerrado → Reabierto**

1. **Crear Ticket Nuevo** (como mesa de trabajo)
   - Login: `lucia` / `lucia123`
   - Crear ticket de prueba
   - Estado: "Nuevo"

2. **Asignar a Técnico** (como admin)
   - Login: `admin` / `admin123`
   - Asignar a Juan Pérez (tecnico1)
   - Estado: "Asignado"

3. **Aceptar y Trabajar** (como técnico)
   - Login: `tecnico1` / `tecnico123`
   - Aceptar asignación
   - Estado: "En Proceso"

4. **Marcar como Resuelto** (como técnico)
   - Botón verde "Marcar como Resuelto"
   - Escribir resolución
   - Estado: "Resuelto"

5. **Cerrar Ticket** (como admin)
   - Login: `admin` / `admin123`
   - Botón azul "Cerrar Ticket"
   - Estado: "Cerrado"

6. **Reabrir Ticket** (como admin)
   - Botón naranja "Reabrir Ticket"
   - Escribir razón de reapertura
   - Estado: "Reabierto"

7. **✅ Verificar:**
   - El ticket está en estado "Reabierto"
   - Aparece comentario automático con prefijo `[REAPERTURA]`
   - El técnico asignado puede volver a trabajar en él

---

## 🎯 **Verificación en Base de Datos**

Después de reabrir, verifica en MySQL:

```sql
-- Ver estado del ticket
SELECT id, title, status_id, reopened_at, reopened_by 
FROM tickets 
WHERE id = 4;

-- Ver comentarios del ticket
SELECT id, user_id, comment, is_internal, created_at 
FROM ticket_comments 
WHERE ticket_id = 4 
ORDER BY created_at DESC;
```

**Deberías ver:**
- `status_id = 7` (Reabierto)
- `reopened_at` con fecha/hora actual
- `reopened_by = 1` (ID del admin)
- Un comentario nuevo con texto `[REAPERTURA] ...`

---

## 🐛 **Posibles Errores**

### **Error 1: "No veo el botón Reabrir Ticket"**
**Causas:**
- No eres administrador
- El ticket NO está en estado "Cerrado" (status_id ≠ 6)
- El frontend no cargó correctamente (refresca F5)

### **Error 2: "Error 403 - Permisos insuficientes"**
**Solución:**
- Verifica que estés logueado como `admin`
- El rol del usuario debe ser `admin` en el contexto

### **Error 3: "Error 400 - Razón es obligatoria"**
**Solución:**
- Debes escribir al menos 10 caracteres en la razón
- No dejes el campo vacío

### **Error 4: "Error 403 - Ticket debe estar en Cerrado"**
**Solución:**
- El ticket debe estar exactamente en estado "Cerrado" (ID 6)
- No puedes reabrir tickets en otros estados

---

## 📊 **Estados y Transiciones Permitidas**

| Estado Actual | Puede cambiar a | Quién puede hacerlo |
|---------------|-----------------|---------------------|
| **Nuevo** | Asignado | Admin |
| **Asignado** | En Proceso | Técnico asignado |
| **En Proceso** | Resuelto | Técnico asignado / Admin |
| **Resuelto** | Cerrado | Admin |
| **Cerrado** | **Reabierto** | **Admin** ← ESTO ES LO QUE PROBAMOS |
| **Reabierto** | En Proceso | Admin (reasigna) |

---

## 🚀 **Comandos Útiles**

```bash
# Ver ticket cerrado
mysql -u root -p' ' macTickets -e "
SELECT id, title, status_id FROM tickets WHERE status_id = 6;
"

# Cerrar manualmente un ticket para pruebas
mysql -u root -p' ' macTickets -e "
UPDATE tickets SET status_id = 6, closed_at = NOW(), closed_by = 1 WHERE id = 4;
"

# Reabrir manualmente un ticket
mysql -u root -p' ' macTickets -e "
UPDATE tickets 
SET status_id = 7, reopened_at = NOW(), reopened_by = 1, resolved_at = NULL, closed_at = NULL 
WHERE id = 4;
"
```

---

**Fecha**: Enero 2025  
**Estado**: ✅ Funcionalidad Implementada y Lista para Probar

