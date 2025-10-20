# Fix: Carga Real de Tickets desde API

## Resumen
Se corrigió el componente TicketList para que cargue tickets reales desde la API en lugar de usar datos mock (falsos), agregando refresh manual y estados de loading/error.

## Fecha
Enero 2025

## Problema Original
El componente TicketList estaba usando datos hardcoded (mock data) en lugar de cargar los tickets reales desde la base de datos. Los tickets creados manualmente no se reflejaban en el dashboard.

## Solución Implementada

### 1. Integración con API Real

**ANTES: Datos Mock**
```jsx
const mockTickets = [
  { id: 1, ticket_number: 'TICKET-001', ... },
  { id: 2, ticket_number: 'TICKET-002', ... },
  // ... datos falsos
];

useEffect(() => {
  setTickets(mockTickets);  // ❌ Datos estáticos
}, []);
```

**DESPUÉS: API Real**
```jsx
import ticketService from '../../services/ticketService';

const loadTickets = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await ticketService.getTickets({
      limit: 100,
      page: 1
    });

    if (response.success && response.data) {
      setTickets(response.data.items || []);
    }
  } catch (err) {
    setError('Error al cargar los tickets.');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadTickets();  // ✅ Datos desde API
}, []);
```

### 2. Botón de Refresh Manual

**Agregado en el Header:**
```jsx
<IconButton
  onClick={handleRefresh}
  disabled={refreshing}
  sx={{
    color: '#E31E24',
    '&:hover': {
      backgroundColor: 'rgba(227, 30, 36, 0.1)'
    }
  }}
  title="Recargar tickets"
>
  <FiRefreshCw 
    size={20} 
    className={refreshing ? 'animate-spin' : ''}
  />
</IconButton>
```

**Función de Refresh:**
```jsx
const handleRefresh = async () => {
  try {
    setRefreshing(true);
    await loadTickets();
  } finally {
    setRefreshing(false);
  }
};
```

### 3. Estados de Loading y Error

**Estados agregados:**
```jsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [refreshing, setRefreshing] = useState(false);
```

**Loading State UI:**
```jsx
{loading && (
  <div className="flex items-center justify-center py-20">
    <CircularProgress sx={{ color: '#E31E24' }} size={48} />
    <Typography className="ml-4 text-gray-600 dark:text-gray-400">
      Cargando tickets...
    </Typography>
  </div>
)}
```

**Error State UI:**
```jsx
{error && !loading && (
  <Card className="p-8 text-center shadow-lg dark:bg-gray-800">
    <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
    <Typography variant="h5" className="mb-4 dark:text-white">
      {error}
    </Typography>
    <Button variant="contained" onClick={loadTickets}>
      Reintentar
    </Button>
  </Card>
)}
```

### 4. Actualización de Campos de Datos

**Cambios para coincidir con API:**

| Campo Mock | Campo API | Cambio |
|-----------|-----------|--------|
| `client_name` | `client_company` / `client_contact` | ✅ Actualizado |
| `reported_date` | `created_at` | ✅ Actualizado con formato |
| `status.name` | `status?.name` | ✅ Validación agregada |
| `priority.name` | `priority?.name` | ✅ Validación agregada |

**Ejemplo de actualización:**
```jsx
// ANTES
<Typography>
  {ticket.client_name}
</Typography>

// DESPUÉS (con fallback)
<Typography>
  {ticket.client_company || ticket.client_contact || 'Sin información'}
</Typography>

// ANTES
<Typography>
  {ticket.reported_date}
</Typography>

// DESPUÉS (con formato)
<Typography>
  {ticket.created_at 
    ? new Date(ticket.created_at).toLocaleString('es-MX') 
    : 'Sin fecha'}
</Typography>
```

### 5. Contador de Tickets en Header

**Agregado:**
```jsx
<div className="flex items-center space-x-4">
  <Typography variant="h4">
    Tickets<span className="text-[#E31E24]">.</span>
  </Typography>
  {!loading && (
    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
      <strong>{tickets.length}</strong> tickets activos
    </Typography>
  )}
</div>
```

## Características Implementadas

### ✅ Carga Automática
- Los tickets se cargan automáticamente al abrir la página
- useEffect ejecuta loadTickets() en el primer render

### ✅ Refresh Manual
- Botón de refresh visible en el header
- Icono gira mientras recarga (animate-spin)
- No bloquea la UI

### ✅ Estados Visuales
- **Loading:** Spinner rojo con mensaje
- **Error:** Card con mensaje y botón "Reintentar"
- **Vacío:** Mensaje "No se encontraron tickets"
- **Success:** Grid con tickets

### ✅ Validación de Datos
- Safe navigation operators (`?.`)
- Fallbacks para campos opcionales
- Formateo de fechas

### ✅ UX Mejorada
- Contador de tickets activos
- Feedback visual en refresh
- Mensajes claros de error
- Diseño responsive mantenido

## Archivo Modificado

**Ubicación:** `/MAC/mac-tickets-front/src/pages/tickets/TicketList.jsx`

**Líneas modificadas:** 3-445

**Cambios principales:**
1. Importación de `ticketService` y nuevos íconos
2. Estados de loading/error/refreshing
3. Función `loadTickets()` que llama a la API
4. Función `handleRefresh()` para recarga manual
5. UI condicional por estado (loading/error/success)
6. Actualización de campos de datos del ticket
7. Botón de refresh en header
8. Contador de tickets activos

## Flujo de Datos

### Carga Inicial
```
1. Componente monta
2. useEffect → loadTickets()
3. setLoading(true)
4. API call: ticketService.getTickets()
5. setTickets(response.data.items)
6. setLoading(false)
7. Render tickets
```

### Refresh Manual
```
1. Usuario click botón refresh
2. setRefreshing(true)
3. Icono empieza a girar
4. loadTickets()
5. API call
6. setTickets(nuevos datos)
7. setRefreshing(false)
8. Icono deja de girar
```

### Manejo de Errores
```
1. API call falla
2. catch(error)
3. setError(mensaje)
4. setLoading(false)
5. Render error UI
6. Usuario puede hacer click "Reintentar"
7. Volver a intentar loadTickets()
```

## Testing

### ✅ Test 1: Carga Inicial
```
1. Abrir /tickets
2. ✅ Debe mostrar spinner
3. ✅ Debe cargar tickets desde DB
4. ✅ Debe mostrar grid de tickets
```

### ✅ Test 2: Refresh Manual
```
1. Click botón refresh
2. ✅ Icono debe girar
3. ✅ Debe recargar tickets
4. ✅ Debe actualizar contador
```

### ✅ Test 3: Ticket Nuevo
```
1. Crear ticket desde DB
2. Ir a /tickets
3. ✅ Debe aparecer en lista
4. O click refresh
5. ✅ Debe aparecer actualizado
```

### ✅ Test 4: Error de Red
```
1. Apagar backend
2. Ir a /tickets
3. ✅ Debe mostrar mensaje error
4. ✅ Botón "Reintentar" visible
5. Encender backend
6. Click "Reintentar"
7. ✅ Debe cargar tickets
```

### ✅ Test 5: Sin Tickets
```
1. Vaciar tabla tickets en DB
2. Ir a /tickets
3. ✅ Debe mostrar "No se encontraron tickets"
```

## Parámetros de API Call

**Endpoint:** `GET /api/tickets`

**Query params:**
```javascript
{
  limit: 100,     // Máximo tickets por página
  page: 1         // Página actual
}
```

**Filtros adicionales disponibles (futuro):**
```javascript
{
  status: '1,2,3', // Filtrar por estado
  priority: '3,4', // Filtrar por prioridad
  assignedTo: 5,   // Filtrar por técnico
  search: 'texto'  // Búsqueda por texto
}
```

## Mejoras Futuras Sugeridas

### 1. **Auto-refresh con WebSockets**
```jsx
// Escuchar eventos de tickets
socket.on('ticket_created', (ticket) => {
  setTickets(prev => [ticket, ...prev]);
});

socket.on('ticket_updated', (ticket) => {
  setTickets(prev => prev.map(t => 
    t.id === ticket.id ? ticket : t
  ));
});
```

### 2. **Paginación**
```jsx
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

<Pagination 
  count={totalPages} 
  page={page} 
  onChange={(e, value) => setPage(value)} 
/>
```

### 3. **Filtros Avanzados**
```jsx
const [filters, setFilters] = useState({
  status: [],
  priority: [],
  assignedTo: null,
  dateFrom: null,
  dateTo: null
});
```

### 4. **Caché con React Query**
```jsx
const { data, isLoading, error, refetch } = useQuery(
  'tickets',
  ticketService.getTickets,
  {
    refetchInterval: 30000, // Auto-refresh cada 30s
    staleTime: 10000        // Considera datos stale después de 10s
  }
);
```

### 5. **Optimistic Updates**
```jsx
const handleAcceptTicket = async (ticketId, techId) => {
  // Actualizar UI inmediatamente
  setTickets(prev => prev.map(t => 
    t.id === ticketId 
      ? { ...t, assigned_to: techId } 
      : t
  ));
  
  // Luego hacer API call
  try {
    await ticketService.assignTicket(ticketId, techId);
  } catch (error) {
    // Revertir si falla
    loadTickets();
  }
};
```

## Imports Agregados

```jsx
import ticketService from '../../services/ticketService';
import { 
  FiRefreshCw,      // Icono de refresh
  FiAlertCircle,    // Icono de error
  // ... otros
} from 'react-icons/fi';
import { CircularProgress } from '@mui/material';
```

## CSS/Clases Utilizadas

### Animación de Spin (Tailwind)
```jsx
className={refreshing ? 'animate-spin' : ''}
```

### Loading Centered
```jsx
className="flex items-center justify-center py-20"
```

### Error Card
```jsx
className="p-8 text-center shadow-lg dark:bg-gray-800"
```

## Compatibilidad

✅ **Backend:** Compatible con endpoints actuales  
✅ **Dark Mode:** Todos los estados soportan dark mode  
✅ **Responsive:** Diseño responsive mantenido  
✅ **Performance:** Optimizado con estados condicionales  
✅ **Browsers:** Todos los navegadores modernos  

## Endpoints Requeridos

### GET /api/tickets
```
Headers:
  Authorization: Bearer <token>

Query Params:
  limit: number (opcional)
  page: number (opcional)

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "ticket_number": "ID-2025-01-001",
        "title": "Título",
        "description": "Descripción",
        "status": { "name": "Nuevo", "color": "#6B7280" },
        "priority": { "name": "Alta", "color": "#FF5722" },
        "client_company": "Empresa",
        "client_contact": "Juan",
        "created_at": "2025-01-20T10:00:00Z",
        "location": "San José",
        "assigned_to": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 13,
      "pages": 1
    }
  }
}
```

## Status

✅ **COMPLETO** - El componente TicketList ahora carga tickets reales desde la base de datos con refresh manual y manejo apropiado de estados.

**Funcionalidades:**
- ✅ Carga automática al montar
- ✅ Refresh manual con botón
- ✅ Estados de loading/error/vacío
- ✅ Contador de tickets activos
- ✅ Validación de campos opcionales
- ✅ Formato de fechas localizado
- ✅ Dark mode completo
- ✅ Diseño responsive

## Notas Importantes

1. **Backend debe estar corriendo:** El frontend ahora depende de la API
2. **Token JWT requerido:** AuthContext debe tener token válido
3. **CORS configurado:** Backend debe permitir requests desde frontend
4. **Formato de datos:** Backend debe retornar datos en formato esperado
5. **Error handling:** Usuarios ven mensajes claros si falla la API

---

**¡Tickets ahora cargan desde la base de datos real!** Los usuarios verán los tickets actualizados cada vez que entren a la página o hagan clic en el botón de refresh. 🔄✅

