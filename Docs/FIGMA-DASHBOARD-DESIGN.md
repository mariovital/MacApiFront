# 🎨 **Diseño del Dashboard Web - MAC Computadoras**

## **📋 Descripción General**

Este documento describe el diseño completo del dashboard web para el Sistema de Gestión de Tickets de MAC Computadoras, basado en los diseños de Figma proporcionados. El dashboard está diseñado para ser **responsive**, **moderno** y **funcional**, adaptándose a los tres roles principales del sistema.

### **🔗 Referencias de Figma**
- **Vista Principal Dashboard**: [Figma - Node 111-211](https://www.figma.com/design/VqzpasiznL47YrRBOXdWU9/Mac-Android-App---Dashboard-Web.?node-id=111-211&t=tWKVZCDZw64gHbn9-4)
- **Vista Lista de Tickets**: [Figma - Node 111-273](https://www.figma.com/design/VqzpasiznL47YrRBOXdWU9/Mac-Android-App---Dashboard-Web.?node-id=111-273&t=tWKVZCDZw64gHbn9-11)
- **Vista Detalle de Ticket**: [Figma - Node 118-251](https://www.figma.com/design/VqzpasiznL47YrRBOXdWU9/Mac-Android-App---Dashboard-Web.?node-id=118-251&t=tWKVZCDZw64gHbn9-11)
- **Vista Gestión de Usuarios**: [Figma - Node 117-320](https://www.figma.com/design/VqzpasiznL47YrRBOXdWU9/Mac-Android-App---Dashboard-Web.?node-id=117-320&t=tWKVZCDZw64gHbn9-11)
- **Vista Reportes y Métricas**: [Figma - Node 117-301](https://www.figma.com/design/VqzpasiznL47YrRBOXdWU9/Mac-Android-App---Dashboard-Web.?node-id=117-301&t=tWKVZCDZw64gHbn9-11)
- **Vista Configuraciones**: [Figma - Node 120-276](https://www.figma.com/design/VqzpasiznL47YrRBOXdWU9/Mac-Android-App---Dashboard-Web.?node-id=120-276&t=tWKVZCDZw64gHbn9-11)

---

## **🏗️ Estructura Global del Dashboard**

### **1. Layout Principal**

#### **Sidebar (Navegación Lateral)**
```
📁 Componente: `components/layout/Sidebar.jsx`
📏 Dimensiones: 280px ancho (desktop), collapsed 64px
🎨 Estilo: Background gradient azul oscuro, iconos blancos
```

**Elementos del Sidebar:**
- **Logo MAC Computadoras** (top)
- **Perfil de Usuario** (avatar, nombre, rol)
- **Navegación Principal**:
  - 🏠 **Dashboard** (todos los roles)
  - 🎫 **Tickets** (todos los roles)
  - 👥 **Usuarios** (solo Admin)
  - 📊 **Reportes** (solo Admin)
  - ⚙️ **Configuración** (todos los roles)
- **Notificaciones Badge** (tiempo real)
- **Tema Toggle** (claro/oscuro)

#### **Header (Barra Superior)**
```
📁 Componente: `components/layout/Header.jsx`
📏 Dimensiones: 100% width, 64px height
🎨 Estilo: Background blanco, sombra sutil
```

**Elementos del Header:**
- **Breadcrumbs** (navegación jerárquica)
- **Buscador Global** (búsqueda de tickets por ID, título, cliente)
- **Notificaciones Dropdown** (tiempo real)
- **Perfil Dropdown** (configuración, logout)

---

## **📊 Vista Principal Dashboard (Node 111-211)**

### **Métricas Principales (Cards Row)**

#### **Card 1: Total Tickets**
```jsx
// Implementación: components/dashboard/MetricsCard.jsx
<MetricsCard
  title="Total Tickets"
  value={totalTickets}
  icon={<FiTag />}
  color="blue"
  trend="+12% vs mes anterior"
  endpoint="/api/dashboard/metrics"
/>
```

#### **Card 2: Tickets Pendientes**
```jsx
<MetricsCard
  title="Pendientes"
  value={pendingTickets}
  icon={<FiClock />}
  color="orange"
  trend="Urgente: 8 tickets"
  priority="high"
/>
```

#### **Card 3: Tickets Resueltos Hoy**
```jsx
<MetricsCard
  title="Resueltos Hoy"
  value={resolvedToday}
  icon={<FiCheck />}
  color="green"
  trend="+5 vs ayer"
/>
```

#### **Card 4: SLA Compliance**
```jsx
<MetricsCard
  title="SLA Compliance"
  value="94.2%"
  icon={<FiTarget />}
  color="purple"
  trend="Meta: >90%"
  status="success"
/>
```

### **Gráficos y Visualizaciones**

#### **Gráfico 1: Tickets por Estado (Donut Chart)**
```jsx
// Implementación: components/dashboard/TicketStatusChart.jsx
const chartData = [
  { name: 'Nuevo', value: 25, color: '#6B7280' },
  { name: 'En Proceso', value: 45, color: '#F59E0B' },
  { name: 'Resuelto', value: 120, color: '#10B981' },
  { name: 'Cerrado', value: 89, color: '#4B5563' }
];
```

#### **Gráfico 2: Tendencia Semanal (Line Chart)**
```jsx
// Implementación: components/dashboard/TrendChart.jsx
const trendData = [
  { day: 'Lun', tickets: 23 },
  { day: 'Mar', tickets: 45 },
  { day: 'Mie', tickets: 32 },
  { day: 'Jue', tickets: 56 },
  { day: 'Vie', tickets: 78 },
  { day: 'Sab', tickets: 12 },
  { day: 'Dom', tickets: 8 }
];
```

### **Sección: Tickets Recientes**
```jsx
// Implementación: components/dashboard/RecentTickets.jsx
<RecentTickets
  limit={5}
  showActions={true}
  realTime={true}
  endpoint="/api/tickets/recent"
/>
```

---

## **🎫 Vista Lista de Tickets (Node 111-273)**

### **Filtros y Búsqueda**

#### **Barra de Filtros Superior**
```jsx
// Implementación: components/tickets/TicketFilters.jsx
<TicketFilters>
  <SearchInput placeholder="Buscar por ID, título o cliente..." />
  <StatusFilter multiple={true} />
  <PriorityFilter />
  <CategoryFilter />
  <DateRangeFilter />
  <AssigneeFilter /> {/* Solo para Admin */}
  <ClearFilters />
</TicketFilters>
```

### **Tabla de Tickets**

#### **Columnas de la Tabla**
| Campo | Ancho | Contenido | Acciones |
|-------|--------|-----------|-----------|
| **ID** | 80px | `#ID-001` | Link al detalle |
| **Título** | 300px | Título truncado + tooltip | Click para detalle |
| **Cliente** | 180px | Empresa + Contacto | - |
| **Estado** | 120px | Chip colorizado | Dropdown cambio |
| **Prioridad** | 100px | Badge con color | - |
| **Asignado** | 140px | Avatar + nombre | Dropdown asignar |
| **Creado** | 120px | Fecha relativa | Tooltip fecha exacta |
| **Acciones** | 100px | Ver, Editar, Más | Dropdown menu |

#### **Funcionalidades de la Tabla**
```jsx
// Implementación: components/tickets/TicketTable.jsx
<DataTable
  data={tickets}
  columns={ticketColumns}
  pagination={true}
  sorting={true}
  selection={true} // Para acciones en lote
  realTime={true}
  onRowClick={handleTicketDetail}
  actions={[
    { label: 'Ver', icon: <FiEye />, action: 'view' },
    { label: 'Editar', icon: <FiEdit />, action: 'edit' },
    { label: 'Asignar', icon: <FiUser />, action: 'assign' }
  ]}
/>
```

### **Acciones en Lote**
```jsx
<BulkActions
  selectedItems={selectedTickets}
  actions={[
    'Cambiar Estado',
    'Asignar Técnico',
    'Cambiar Prioridad',
    'Exportar'
  ]}
/>
```

---

## **📝 Vista Detalle de Ticket (Node 118-251)**

### **Layout de 2 Columnas**

#### **Columna Principal (70%)**

##### **Header del Ticket**
```jsx
// Implementación: components/tickets/TicketHeader.jsx
<TicketHeader>
  <TicketNumber>{ticket.ticket_number}</TicketNumber>
  <TicketTitle editable={canEdit}>{ticket.title}</TicketTitle>
  <TicketMeta>
    <StatusChip status={ticket.status} editable={canChangeStatus} />
    <PriorityChip priority={ticket.priority} editable={canChangePriority} />
    <CategoryChip category={ticket.category} />
    <CreatedDate date={ticket.created_at} />
  </TicketMeta>
</TicketHeader>
```

##### **Descripción del Ticket**
```jsx
<TicketDescription
  content={ticket.description}
  editable={canEdit}
  onSave={handleDescriptionUpdate}
/>
```

##### **Timeline de Actividades**
```jsx
// Implementación: components/tickets/TicketTimeline.jsx
<TicketTimeline ticketId={ticket.id}>
  {activities.map(activity => (
    <TimelineItem
      key={activity.id}
      type={activity.type} // comment, status_change, assignment
      user={activity.user}
      timestamp={activity.created_at}
      content={activity.content}
      private={activity.is_internal} // Solo visible para técnicos/admin
    />
  ))}
</TicketTimeline>
```

##### **Comentarios**
```jsx
<CommentSection>
  <CommentForm
    onSubmit={handleAddComment}
    placeholder="Agregar comentario..."
    attachments={true}
    internal={userRole !== 'mesa_trabajo'} // Toggle para comentarios internos
  />
  <CommentList comments={comments} />
</CommentSection>
```

#### **Columna Lateral (30%)**

##### **Información del Cliente**
```jsx
<ClientInfo>
  <ClientCompany>{ticket.client_company}</ClientCompany>
  <ClientContact>{ticket.client_contact}</ClientContact>
  <ClientEmail>{ticket.client_email}</ClientEmail>
  <ClientPhone>{ticket.client_phone}</ClientPhone>
  <ClientDepartment>{ticket.client_department}</ClientDepartment>
</ClientInfo>
```

##### **Asignación**
```jsx
<AssignmentCard>
  <AssignedTo user={ticket.assignee} />
  <AssignButton 
    onClick={handleReassign}
    disabled={!canAssign}
  />
  <AssignmentHistory />
</AssignmentCard>
```

##### **Archivos Adjuntos**
```jsx
<AttachmentsCard>
  <FileUpload
    onUpload={handleFileUpload}
    maxSize="10MB"
    acceptedTypes={['.jpg', '.png', '.pdf', '.doc', '.txt']}
  />
  <AttachmentList files={ticket.attachments} />
</AttachmentsCard>
```

##### **Métricas del Ticket**
```jsx
<TicketMetrics>
  <Metric label="Tiempo Transcurrido" value={timeElapsed} />
  <Metric label="Primera Respuesta" value={firstResponseTime} />
  <Metric label="SLA Restante" value={slaTimeRemaining} warning={slaBreach} />
  <Metric label="Número de Comentarios" value={commentCount} />
</TicketMetrics>
```

---

## **👥 Vista Gestión de Usuarios (Node 117-320)**

### **Solo Visible para Administradores**

#### **Header con Acciones**
```jsx
<UsersHeader>
  <PageTitle>Gestión de Usuarios</PageTitle>
  <UserActions>
    <CreateUserButton />
    <ImportUsersButton />
    <ExportUsersButton />
  </UserActions>
</UsersHeader>
```

#### **Filtros de Usuario**
```jsx
<UserFilters>
  <SearchUsers placeholder="Buscar por nombre, email o usuario..." />
  <RoleFilter options={['admin', 'tecnico', 'mesa_trabajo']} />
  <StatusFilter options={['active', 'inactive']} />
  <DepartmentFilter />
</UserFilters>
```

#### **Tabla de Usuarios**
```jsx
<UserTable>
  {/* Columnas */}
  <Column field="avatar" header="Avatar" />
  <Column field="name" header="Nombre Completo" />
  <Column field="username" header="Usuario" />
  <Column field="email" header="Email" />
  <Column field="role" header="Rol" />
  <Column field="last_login" header="Último Acceso" />
  <Column field="status" header="Estado" />
  <Column field="actions" header="Acciones" />
</UserTable>
```

#### **Modal de Crear/Editar Usuario**
```jsx
<UserFormModal>
  <UserForm>
    <TextField name="first_name" label="Nombre" required />
    <TextField name="last_name" label="Apellido" required />
    <TextField name="username" label="Usuario" required />
    <TextField name="email" label="Email" type="email" required />
    <Select name="role_id" label="Rol" options={roles} required />
    <TextField name="password" label="Contraseña" type="password" />
    <Switch name="is_active" label="Usuario Activo" />
    <AvatarUpload name="avatar" />
  </UserForm>
</UserFormModal>
```

---

## **📊 Vista Reportes y Métricas (Node 117-301)**

### **Solo Visible para Administradores**

#### **Filtros de Reporte**
```jsx
<ReportFilters>
  <DateRangePicker 
    label="Período"
    presets={['Última Semana', 'Último Mes', 'Último Trimestre']}
  />
  <MultiSelect 
    label="Técnicos"
    options={technicians}
    placeholder="Todos los técnicos"
  />
  <MultiSelect 
    label="Categorías"
    options={categories}
    placeholder="Todas las categorías"
  />
  <Select 
    label="Tipo de Reporte"
    options={['Productividad', 'SLA', 'Categorías', 'Tendencias']}
  />
</ReportFilters>
```

#### **Dashboard de Métricas Avanzadas**

##### **Row 1: KPIs Principales**
```jsx
<MetricsRow>
  <KPICard
    title="Tiempo Promedio de Resolución"
    value="4.2 horas"
    target="< 6 horas"
    status="success"
    chart="trend"
  />
  <KPICard
    title="Tickets por Técnico"
    value="23.5 promedio"
    variance="±5.2"
    chart="bar"
  />
  <KPICard
    title="Satisfacción del Cliente"
    value="4.6/5.0"
    target="> 4.0"
    status="excellent"
    chart="gauge"
  />
  <KPICard
    title="SLA Breach Rate"
    value="5.8%"
    target="< 10%"
    status="warning"
    chart="donut"
  />
</MetricsRow>
```

##### **Row 2: Gráficos Detallados**
```jsx
<ChartsRow>
  <ChartCard title="Tickets por Estado (Últimos 30 días)" span={2}>
    <StackedAreaChart data={ticketStatusData} />
  </ChartCard>
  <ChartCard title="Top Categorías" span={1}>
    <HorizontalBarChart data={categoryData} />
  </ChartCard>
</ChartsRow>
```

##### **Row 3: Tablas de Rendimiento**
```jsx
<TablesRow>
  <PerformanceTable
    title="Rendimiento por Técnico"
    data={technicianPerformance}
    columns={['Técnico', 'Asignados', 'Resueltos', 'Promedio', 'SLA']}
  />
  <TrendTable
    title="Tendencias por Categoría"
    data={categoryTrends}
    columns={['Categoría', 'Este Mes', 'Mes Anterior', 'Variación']}
  />
</TablesRow>
```

---

## **⚙️ Vista Configuraciones (Node 120-276)**

### **Navegación por Pestañas**

#### **Pestaña: Perfil de Usuario**
```jsx
<ProfileSettings>
  <AvatarUpload currentAvatar={user.avatar} />
  <ProfileForm>
    <TextField name="first_name" value={user.first_name} />
    <TextField name="last_name" value={user.last_name} />
    <TextField name="email" value={user.email} />
    <PasswordChangeSection />
    <NotificationPreferences />
  </ProfileForm>
</ProfileSettings>
```

#### **Pestaña: Configuración del Sistema (Solo Admin)**
```jsx
<SystemSettings>
  <SettingGroup title="General">
    <Setting 
      label="Nombre de la Empresa"
      value={settings.company_name}
      type="text"
    />
    <Setting 
      label="Email de Notificaciones"
      value={settings.notification_email}
      type="email"
    />
  </SettingGroup>
  
  <SettingGroup title="SLA y Tiempos">
    <Setting 
      label="Tiempo de Primera Respuesta"
      value={settings.first_response_sla}
      type="number"
      unit="horas"
    />
    <Setting 
      label="Tiempo de Resolución por Prioridad"
      type="complex"
      component={<SLAConfiguration />}
    />
  </SettingGroup>
  
  <SettingGroup title="Notificaciones">
    <Setting 
      label="Notificaciones por Email"
      value={settings.email_notifications}
      type="boolean"
    />
    <Setting 
      label="Notificaciones Push"
      value={settings.push_notifications}
      type="boolean"
    />
  </SettingGroup>
</SystemSettings>
```

#### **Pestaña: Gestión de Categorías y Prioridades (Solo Admin)**
```jsx
<CategoriesManagement>
  <CategoryList>
    <CategoryItem 
      name="Hardware"
      color="#EF4444"
      ticketCount={45}
      actions={['edit', 'delete']}
    />
    <CategoryItem 
      name="Software"
      color="#3B82F6"
      ticketCount={32}
      actions={['edit', 'delete']}
    />
  </CategoryList>
  <AddCategoryButton />
</CategoriesManagement>

<PriorityManagement>
  <PriorityList>
    <PriorityItem
      name="Crítica"
      level={4}
      color="#F44336"
      slaHours={4}
      actions={['edit']}
    />
  </PriorityList>
</PriorityManagement>
```

---

## **🎨 Paleta de Colores y Temas**

### **Tema Claro**
```css
:root {
  /* Colores Principales */
  --primary-50: #EFF6FF;
  --primary-500: #3B82F6;
  --primary-600: #2563EB;
  --primary-900: #1E3A8A;
  
  /* Estados de Tickets */
  --status-new: #6B7280;
  --status-assigned: #3B82F6;
  --status-in-progress: #F59E0B;
  --status-pending: #8B5CF6;
  --status-resolved: #10B981;
  --status-closed: #4B5563;
  
  /* Prioridades */
  --priority-low: #4CAF50;
  --priority-medium: #FF9800;
  --priority-high: #FF5722;
  --priority-critical: #F44336;
  
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
}
```

### **Tema Oscuro**
```css
[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --bg-tertiary: #374151;
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
}
```

---

## **📱 Diseño Responsive**

### **Breakpoints**
```css
/* Mobile First Approach */
.dashboard {
  @apply grid grid-cols-1 gap-4;
  
  /* Tablet */
  @screen md {
    @apply grid-cols-2 gap-6;
  }
  
  /* Desktop */
  @screen lg {
    @apply grid-cols-3 gap-8;
  }
  
  /* Large Desktop */
  @screen xl {
    @apply grid-cols-4;
  }
}
```

### **Mobile Navigation**
```jsx
<MobileNavigation>
  <BottomTabs>
    <Tab icon={<FiHome />} label="Dashboard" />
    <Tab icon={<FiTag />} label="Tickets" badge={pendingCount} />
    <Tab icon={<FiUser />} label="Perfil" />
    <Tab icon={<FiBell />} label="Notificaciones" />
  </BottomTabs>
</MobileNavigation>
```

---

## **🚀 Funcionalidades Tiempo Real**

### **WebSocket Integration**
```jsx
// hooks/useRealTimeUpdates.js
const useRealTimeUpdates = () => {
  useEffect(() => {
    // Conectar a tickets updates
    socket.on('ticket_updated', (data) => {
      updateTicketInCache(data.ticketId, data.changes);
      showNotification(`Ticket ${data.ticketId} actualizado`);
    });
    
    // Conectar a nuevos tickets
    socket.on('new_ticket', (ticket) => {
      addTicketToCache(ticket);
      showNotification(`Nuevo ticket: ${ticket.title}`);
    });
    
    return () => {
      socket.off('ticket_updated');
      socket.off('new_ticket');
    };
  }, []);
};
```

---

## **⚡ Performance y Optimización**

### **Lazy Loading de Vistas**
```jsx
// Implementar en App.jsx
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const TicketList = lazy(() => import('./pages/tickets/TicketList'));
const TicketDetail = lazy(() => import('./pages/tickets/TicketDetail'));
const UserManagement = lazy(() => import('./pages/users/UserManagement'));
const Reports = lazy(() => import('./pages/reports/Reports'));
```

### **Optimización de Imágenes**
```jsx
<OptimizedImage
  src={user.avatar}
  alt={user.name}
  width={40}
  height={40}
  placeholder="blur"
  className="rounded-full"
/>
```

---

## **📋 Checklist de Implementación**

### **Fase 1: Estructura Base**
- [ ] Layout principal (Sidebar + Header)
- [ ] Sistema de routing
- [ ] Autenticación y protección de rutas
- [ ] Tema claro/oscuro
- [ ] Componentes base (Button, Card, Table, etc.)

### **Fase 2: Dashboard Principal**
- [ ] Métricas cards
- [ ] Gráficos de estado
- [ ] Lista de tickets recientes
- [ ] Integración con API de métricas

### **Fase 3: Gestión de Tickets**
- [ ] Lista de tickets con filtros
- [ ] Vista detalle de ticket
- [ ] Formularios de creación/edición
- [ ] Sistema de comentarios
- [ ] Subida de archivos

### **Fase 4: Funcionalidades Avanzadas**
- [ ] Gestión de usuarios (Admin)
- [ ] Reportes y analytics (Admin)
- [ ] Configuraciones del sistema
- [ ] Notificaciones tiempo real

### **Fase 5: Optimización**
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Testing
- [ ] Documentación

---

## **🔗 Integración con API Existente**

### **Endpoints Requeridos**
```javascript
// Dashboard Metrics
GET /api/dashboard/metrics
GET /api/dashboard/recent-tickets
GET /api/dashboard/charts/status
GET /api/dashboard/charts/trends

// Tickets
GET /api/tickets
POST /api/tickets
GET /api/tickets/:id
PUT /api/tickets/:id
PATCH /api/tickets/:id/status
POST /api/tickets/:id/comments
POST /api/tickets/:id/attachments

// Users (Admin only)
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

// Reports (Admin only)
GET /api/reports/performance
GET /api/reports/sla
GET /api/reports/categories

// Settings
GET /api/settings
PUT /api/settings/:key
```

Este diseño proporciona una base sólida y completa para implementar un dashboard moderno, funcional y escalable que sigue las mejores prácticas de UX/UI y se integra perfectamente con nuestra API existente.
