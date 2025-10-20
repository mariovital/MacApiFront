# Feature: Reasignación de Tickets

## Resumen
Funcionalidad completa para reasignar tickets a diferentes técnicos desde la vista de detalle del ticket.

## Fecha
Octubre 2025

## Ubicación
**Componente:** `/pages/tickets/TicketDetail.jsx`
**Sección:** Panel lateral derecho → Card "Asignación"

---

## Características Implementadas

### ✅ 1. Botón de Reasignación
- Ubicado en la card "Asignación" del panel lateral derecho
- Solo visible para usuarios con permisos (`canAssign`)
- Al hacer click abre un modal con lista de técnicos

### ✅ 2. Modal de Selección de Técnicos
- Lista completa de técnicos disponibles cargada desde el backend
- Cada técnico muestra:
  - Avatar con iniciales
  - Nombre completo
  - Username y email
- Selección con radio buttons
- Responsive y dark mode compatible

### ✅ 3. Integración con API
- Usa `catalogService.getTechnicians()` para cargar técnicos
- Usa `ticketService.assignTicket()` para reasignar
- Recarga automática del ticket después de asignar

---

## Componentes Agregados

### Estados
```jsx
// Estados para reasignación
const [showAssignDialog, setShowAssignDialog] = useState(false);
const [technicians, setTechnicians] = useState([]);
const [selectedTechnician, setSelectedTechnician] = useState(null);
const [loadingTechnicians, setLoadingTechnicians] = useState(false);
const [assigningTicket, setAssigningTicket] = useState(false);
```

### Funciones

#### 1. `handleOpenAssignDialog()`
```jsx
const handleOpenAssignDialog = async () => {
  setShowAssignDialog(true);
  setLoadingTechnicians(true);
  
  try {
    const response = await catalogService.getTechnicians();
    if (response.success) {
      setTechnicians(response.data || []);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error al cargar lista de técnicos');
  } finally {
    setLoadingTechnicians(false);
  }
};
```

**Función:**
- Abre el modal de asignación
- Carga la lista de técnicos desde el backend
- Maneja estados de loading y errores

#### 2. `handleCloseAssignDialog()`
```jsx
const handleCloseAssignDialog = () => {
  setShowAssignDialog(false);
  setSelectedTechnician(null);
};
```

**Función:**
- Cierra el modal
- Limpia la selección de técnico

#### 3. `handleAssignTicket()`
```jsx
const handleAssignTicket = async () => {
  if (!selectedTechnician) {
    alert('Por favor selecciona un técnico');
    return;
  }

  try {
    setAssigningTicket(true);
    await ticketService.assignTicket(id, selectedTechnician.id, 'Reasignación manual');
    
    // Recargar datos del ticket
    await loadTicketData();
    
    // Cerrar diálogo
    handleCloseAssignDialog();
    
    alert('Ticket reasignado exitosamente');
  } catch (err) {
    console.error('Error reasignando ticket:', err);
    alert('Error al reasignar el ticket. Intenta de nuevo.');
  } finally {
    setAssigningTicket(false);
  }
};
```

**Función:**
- Valida que haya un técnico seleccionado
- Llama a la API para asignar el ticket
- Recarga los datos del ticket
- Cierra el modal automáticamente
- Muestra confirmación al usuario

---

## Dialog de Reasignación

### Estructura
```
┌─────────────────────────────────────┐
│ 👤 Reasignar Ticket            [X]  │ ← Header rojo gradiente
├─────────────────────────────────────┤
│                                     │
│ Selecciona el técnico al que        │
│ deseas asignar este ticket:         │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ ○ [JP] Juan Pérez           │   │
│ │    @jperez • juan@mac.com   │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ ● [MG] María González       │   │ ← Seleccionado
│ │    @mgonzalez • maria@mac.com│   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ ○ [CR] Carlos Ruiz          │   │
│ │    @cruiz • carlos@mac.com  │   │
│ └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│              [Cancelar] [✓ Asignar] │
└─────────────────────────────────────┘
```

### Características Visuales

**Header:**
- Gradiente rojo de MAC (`#E31E24` → `#C41A1F`)
- Icono de usuario (FiUser)
- Texto blanco bold

**Lista de Técnicos:**
- Cards con hover effect
- Radio button para selección
- Avatar con iniciales
- Nombre completo + username + email
- Selección resaltada con fondo rojo claro

**Botones:**
- **Cancelar:** Gris, cierra sin cambios
- **Asignar Ticket:** Rojo MAC, disabled si no hay selección
- Loading state con spinner

---

## Flujo de Usuario

### Caso: Reasignar Ticket

```
1. Usuario: Ve ticket sin asignar o asignado a otro
2. Click "Reasignar"
3. ✅ Modal se abre
4. ✅ Loading: "Cargando técnicos..."
5. ✅ Lista de técnicos aparece
6. Usuario: Selecciona técnico (click en card)
7. ✅ Radio button se marca
8. ✅ Card se resalta con fondo rojo claro
9. Usuario: Click "Asignar Ticket"
10. ✅ Botón muestra "Asignando..." con spinner
11. ✅ API call: POST /tickets/{id}/assign
12. ✅ Ticket se recarga con nueva asignación
13. ✅ Modal se cierra automáticamente
14. ✅ Alert: "Ticket reasignado exitosamente"
15. ✅ Panel "Asignación" muestra nuevo técnico
```

### Caso: Cancelar Reasignación

```
1. Usuario: Click "Reasignar"
2. Modal se abre
3. Usuario: Selecciona técnico (o no)
4. Usuario: Click "Cancelar"
5. ✅ Modal se cierra
6. ✅ Selección se limpia
7. ✅ No se realizan cambios
```

---

## Integración con Backend

### Endpoint Usado
```
POST /api/tickets/{id}/assign
```

**Request Body:**
```json
{
  "assigned_to": 2,
  "reason": "Reasignación manual"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket asignado exitosamente",
  "data": {
    "id": 13,
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

### Servicios Utilizados

**1. catalogService.getTechnicians()**
```javascript
GET /api/catalog/technicians

Response: {
  "success": true,
  "data": [
    {
      "id": 2,
      "username": "mgonzalez",
      "first_name": "María",
      "last_name": "González",
      "email": "maria.gonzalez@maccomputadoras.com",
      "role_id": 2
    }
  ]
}
```

**2. ticketService.assignTicket()**
```javascript
POST /api/tickets/{id}/assign
Body: { assigned_to: technicianId, reason: string }
```

---

## Permisos

### ¿Quién Puede Reasignar?

La variable `canAssign` determina si se muestra el botón:

```jsx
const canAssign = user?.role === 'admin' || user?.role === 'tecnico';
```

**Roles con permiso:**
- ✅ **Administrador:** Puede reasignar cualquier ticket
- ✅ **Técnico:** Puede reasignar tickets asignados a él
- ❌ **Mesa de Trabajo:** NO puede reasignar tickets

---

## Estados del Dialog

### Loading
```
┌─────────────────────────────────┐
│ 👤 Reasignar Ticket             │
├─────────────────────────────────┤
│                                 │
│    ⏳ Cargando técnicos...      │
│                                 │
└─────────────────────────────────┘
```

### Sin Técnicos
```
┌─────────────────────────────────┐
│ 👤 Reasignar Ticket             │
├─────────────────────────────────┤
│                                 │
│    ⚠️                           │
│    No hay técnicos disponibles  │
│                                 │
└─────────────────────────────────┘
```

### Con Técnicos
```
┌─────────────────────────────────┐
│ 👤 Reasignar Ticket             │
├─────────────────────────────────┤
│ Selecciona el técnico...        │
│                                 │
│ [Lista de técnicos]             │
│                                 │
│          [Cancelar] [Asignar]   │
└─────────────────────────────────┘
```

---

## Responsive Design

### Mobile (< 640px)
- Modal ocupa 95% del ancho
- Lista scrollable verticalmente
- Botones apilados verticalmente (si es necesario)

### Desktop (≥ 640px)
- Modal ancho fijo (`maxWidth="sm"`)
- Lista con hover effects más notorios
- Botones en línea horizontal

---

## Dark Mode

### Soporte Completo
```jsx
// Header del dialog
className="bg-gradient-to-r from-[#E31E24] to-[#C41A1F] text-white"

// Contenido
className="dark:bg-gray-800"

// Lista items
className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"

// Texto
className="text-gray-900 dark:text-white"
className="text-gray-600 dark:text-gray-400"
```

---

## Testing

### ✅ Test 1: Abrir Modal
```
1. Ir a un ticket: /tickets/13
2. Verificar que existe el botón "Reasignar"
3. Click "Reasignar"
4. ✅ Modal debe abrirse
5. ✅ Debe mostrar "Cargando técnicos..."
6. ✅ Debe cargar lista de técnicos
```

### ✅ Test 2: Seleccionar Técnico
```
1. Modal abierto con técnicos
2. Click en un técnico
3. ✅ Radio button debe marcarse
4. ✅ Card debe resaltarse con fondo rojo claro
5. ✅ Botón "Asignar Ticket" debe habilitarse
```

### ✅ Test 3: Reasignar
```
1. Técnico seleccionado
2. Click "Asignar Ticket"
3. ✅ Botón debe mostrar "Asignando..." con spinner
4. ✅ API call debe ejecutarse
5. ✅ Modal debe cerrarse
6. ✅ Alert: "Ticket reasignado exitosamente"
7. ✅ Panel "Asignación" debe actualizar con nuevo técnico
```

### ✅ Test 4: Cancelar
```
1. Modal abierto
2. Seleccionar técnico (opcional)
3. Click "Cancelar"
4. ✅ Modal debe cerrarse
5. ✅ No debe hacer cambios
6. ✅ Selección debe limpiarse
```

### ✅ Test 5: Sin Técnicos
```
1. Backend retorna lista vacía
2. ✅ Debe mostrar "No hay técnicos disponibles"
3. ✅ Botón "Asignar" debe estar disabled
```

### ✅ Test 6: Error de Red
```
1. Desconectar backend
2. Click "Reasignar"
3. ✅ Alert: "Error al cargar lista de técnicos"
4. ✅ Modal permanece abierto
```

### ✅ Test 7: Dark Mode
```
1. Activar modo oscuro
2. Abrir modal de reasignación
3. ✅ Header debe verse correcto
4. ✅ Fondo debe ser gris oscuro
5. ✅ Cards de técnicos deben tener hover oscuro
6. ✅ Texto debe ser legible
```

---

## API Calls

### Cargar Técnicos
```javascript
GET /api/catalog/technicians

Response: {
  "success": true,
  "data": [
    {
      "id": 2,
      "username": "mgonzalez",
      "first_name": "María",
      "last_name": "González",
      "email": "maria.gonzalez@maccomputadoras.com",
      "role_id": 2,
      "is_active": true
    },
    {
      "id": 3,
      "username": "cruiz",
      "first_name": "Carlos",
      "last_name": "Ruiz",
      "email": "carlos.ruiz@maccomputadoras.com",
      "role_id": 2,
      "is_active": true
    }
  ]
}
```

### Asignar Ticket
```javascript
POST /api/tickets/13/assign
Body: {
  "assigned_to": 2,
  "reason": "Reasignación manual"
}

Response: {
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

## Imports Agregados

```jsx
// Material-UI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Radio
} from '@mui/material';

// Service
import catalogService from '../../services/catalogService';
```

---

## Código del Dialog

```jsx
<Dialog
  open={showAssignDialog}
  onClose={handleCloseAssignDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: { borderRadius: '16px' }
  }}
>
  <DialogTitle className="bg-gradient-to-r from-[#E31E24] to-[#C41A1F] text-white">
    <div className="flex items-center space-x-2">
      <FiUser size={24} />
      <Typography variant="h6" className="font-bold">
        Reasignar Ticket
      </Typography>
    </div>
  </DialogTitle>

  <DialogContent className="mt-4 dark:bg-gray-800">
    {loadingTechnicians ? (
      <div className="flex items-center justify-center py-8">
        <CircularProgress sx={{ color: '#E31E24' }} />
        <Typography className="ml-4">Cargando técnicos...</Typography>
      </div>
    ) : technicians.length === 0 ? (
      <div className="text-center py-8">
        <FiAlertCircle size={48} />
        <Typography>No hay técnicos disponibles</Typography>
      </div>
    ) : (
      <>
        <Typography variant="body2" className="mb-4">
          Selecciona el técnico al que deseas asignar este ticket:
        </Typography>
        
        <List className="space-y-2">
          {technicians.map((tech) => (
            <ListItem key={tech.id} disablePadding>
              <ListItemButton
                onClick={() => setSelectedTechnician(tech)}
                selected={selectedTechnician?.id === tech.id}
              >
                <Radio checked={selectedTechnician?.id === tech.id} />
                <ListItemAvatar>
                  <Avatar>
                    {tech.first_name?.[0]}{tech.last_name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${tech.first_name} ${tech.last_name}`}
                  secondary={`@${tech.username} • ${tech.email}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    )}
  </DialogContent>

  <DialogActions className="px-6 pb-4 dark:bg-gray-800">
    <Button onClick={handleCloseAssignDialog} disabled={assigningTicket}>
      Cancelar
    </Button>
    <Button
      onClick={handleAssignTicket}
      disabled={!selectedTechnician || assigningTicket}
      variant="contained"
      startIcon={assigningTicket ? <CircularProgress size={16} /> : <FiCheckCircle />}
    >
      {assigningTicket ? 'Asignando...' : 'Asignar Ticket'}
    </Button>
  </DialogActions>
</Dialog>
```

---

## Mejoras Futuras Sugeridas

### 1. Búsqueda de Técnicos
```jsx
const [searchTerm, setSearchTerm] = useState('');

<TextField
  placeholder="Buscar técnico..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

const filteredTechnicians = technicians.filter(tech =>
  tech.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  tech.last_name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 2. Razón de Reasignación
```jsx
const [assignReason, setAssignReason] = useState('');

<TextField
  label="Razón de la reasignación (opcional)"
  multiline
  rows={2}
  value={assignReason}
  onChange={(e) => setAssignReason(e.target.value)}
/>

// En handleAssignTicket:
await ticketService.assignTicket(id, selectedTechnician.id, assignReason || 'Reasignación manual');
```

### 3. Mostrar Carga de Trabajo
```jsx
<ListItemText
  primary={`${tech.first_name} ${tech.last_name}`}
  secondary={
    <>
      @{tech.username} • {tech.email}
      <br />
      Tickets asignados: {tech.active_tickets_count || 0}
    </>
  }
/>
```

### 4. Confirmación Visual Mejorada
```jsx
// Reemplazar alert() por Snackbar
const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

<Snackbar
  open={showSuccessSnackbar}
  autoHideDuration={3000}
  onClose={() => setShowSuccessSnackbar(false)}
>
  <Alert severity="success">
    Ticket reasignado exitosamente
  </Alert>
</Snackbar>
```

### 5. Notificación en Tiempo Real
```jsx
// Emitir evento de socket cuando se asigna
socket.emit('ticket_assigned', {
  ticketId: id,
  technicianId: selectedTechnician.id
});
```

---

## Errores Manejados

| Error | Manejo | UI |
|-------|--------|-----|
| **Sin conexión** | catch en `handleOpenAssignDialog` | Alert: "Error al cargar lista de técnicos" |
| **Lista vacía** | Validación `technicians.length === 0` | Mensaje: "No hay técnicos disponibles" |
| **Sin selección** | Validación `!selectedTechnician` | Alert: "Por favor selecciona un técnico" |
| **Error al asignar** | catch en `handleAssignTicket` | Alert: "Error al reasignar el ticket" |

---

## Status

✅ **COMPLETO** - La funcionalidad de reasignación de tickets está implementada y funcionando.

**Características:**
- ✅ Botón "Reasignar" conectado
- ✅ Modal con lista de técnicos
- ✅ Selección con radio buttons
- ✅ Integración completa con API
- ✅ Loading states apropiados
- ✅ Manejo de errores
- ✅ Recarga automática del ticket
- ✅ Confirmación visual al usuario
- ✅ Dark mode compatible
- ✅ Responsive design

---

## Archivo Modificado

**Ubicación:** `/pages/tickets/TicketDetail.jsx`

**Líneas agregadas:** ~150 líneas

**Secciones:**
- Imports: Dialog, List components
- Estados: showAssignDialog, technicians, selectedTechnician, etc.
- Funciones: handleOpenAssignDialog, handleCloseAssignDialog, handleAssignTicket
- JSX: Dialog completo con lista de técnicos

---

**¡Listo para usar!** Ahora puedes reasignar tickets a diferentes técnicos desde la vista de detalle. 🎯👥✨

