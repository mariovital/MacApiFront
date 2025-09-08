# 🏗️ **Estructura de Componentes - Dashboard MAC Computadoras**

## **📁 Árbol de Componentes**

```
src/
├── components/
│   ├── common/                     # Componentes 100% reutilizables
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.jsx
│   │   │   └── index.js
│   │   ├── Card/
│   │   │   ├── Card.jsx
│   │   │   ├── MetricsCard.jsx
│   │   │   ├── KPICard.jsx
│   │   │   └── index.js
│   │   ├── DataTable/
│   │   │   ├── DataTable.jsx
│   │   │   ├── TableHeader.jsx
│   │   │   ├── TableRow.jsx
│   │   │   ├── TablePagination.jsx
│   │   │   └── index.js
│   │   ├── Charts/
│   │   │   ├── DonutChart.jsx
│   │   │   ├── LineChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── StackedAreaChart.jsx
│   │   │   └── index.js
│   │   ├── Forms/
│   │   │   ├── FormField.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── DateRangePicker.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── index.js
│   │   ├── Modals/
│   │   │   ├── BaseModal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── index.js
│   │   ├── Navigation/
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── index.js
│   │   ├── Feedback/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── index.js
│   │   └── index.js                # Barrel exports
│   │
│   ├── layout/                     # Componentes de layout
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SidebarMenu.jsx
│   │   │   ├── SidebarUser.jsx
│   │   │   ├── SidebarLogo.jsx
│   │   │   └── index.js
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   ├── GlobalSearch.jsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   ├── UserDropdown.jsx
│   │   │   └── index.js
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   └── index.js
│   │   └── MobileNavigation/
│   │       ├── BottomTabs.jsx
│   │       ├── MobileHeader.jsx
│   │       └── index.js
│   │
│   ├── dashboard/                  # Componentes del dashboard
│   │   ├── MetricsRow/
│   │   │   ├── MetricsRow.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   └── index.js
│   │   ├── Charts/
│   │   │   ├── TicketStatusChart.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   ├── CategoryChart.jsx
│   │   │   └── index.js
│   │   ├── RecentTickets/
│   │   │   ├── RecentTickets.jsx
│   │   │   ├── TicketPreview.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── tickets/                    # Componentes de tickets
│   │   ├── TicketList/
│   │   │   ├── TicketList.jsx
│   │   │   ├── TicketTable.jsx
│   │   │   ├── TicketRow.jsx
│   │   │   ├── TicketFilters.jsx
│   │   │   ├── BulkActions.jsx
│   │   │   └── index.js
│   │   ├── TicketDetail/
│   │   │   ├── TicketDetail.jsx
│   │   │   ├── TicketHeader.jsx
│   │   │   ├── TicketDescription.jsx
│   │   │   ├── TicketTimeline.jsx
│   │   │   ├── TicketSidebar.jsx
│   │   │   └── index.js
│   │   ├── TicketForm/
│   │   │   ├── TicketForm.jsx
│   │   │   ├── TicketFormFields.jsx
│   │   │   ├── ClientInfoForm.jsx
│   │   │   └── index.js
│   │   ├── Comments/
│   │   │   ├── CommentSection.jsx
│   │   │   ├── CommentForm.jsx
│   │   │   ├── CommentList.jsx
│   │   │   ├── CommentItem.jsx
│   │   │   └── index.js
│   │   ├── Attachments/
│   │   │   ├── AttachmentCard.jsx
│   │   │   ├── AttachmentList.jsx
│   │   │   ├── AttachmentUpload.jsx
│   │   │   └── index.js
│   │   ├── StatusChips/
│   │   │   ├── StatusChip.jsx
│   │   │   ├── PriorityChip.jsx
│   │   │   ├── CategoryChip.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── users/                      # Componentes de usuarios
│   │   ├── UserList/
│   │   │   ├── UserList.jsx
│   │   │   ├── UserTable.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── UserFilters.jsx
│   │   │   └── index.js
│   │   ├── UserForm/
│   │   │   ├── UserForm.jsx
│   │   │   ├── UserFormModal.jsx
│   │   │   ├── AvatarUpload.jsx
│   │   │   └── index.js
│   │   ├── UserProfile/
│   │   │   ├── UserProfile.jsx
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── ProfileStats.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── reports/                    # Componentes de reportes
│   │   ├── ReportDashboard/
│   │   │   ├── ReportDashboard.jsx
│   │   │   ├── ReportFilters.jsx
│   │   │   ├── KPIRow.jsx
│   │   │   └── index.js
│   │   ├── PerformanceReports/
│   │   │   ├── TechnicianPerformance.jsx
│   │   │   ├── SLAReports.jsx
│   │   │   ├── CategoryAnalysis.jsx
│   │   │   └── index.js
│   │   ├── Charts/
│   │   │   ├── PerformanceChart.jsx
│   │   │   ├── TrendAnalysis.jsx
│   │   │   ├── HeatmapChart.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── settings/                   # Componentes de configuración
│   │   ├── ProfileSettings/
│   │   │   ├── ProfileSettings.jsx
│   │   │   ├── PasswordChange.jsx
│   │   │   ├── NotificationPrefs.jsx
│   │   │   └── index.js
│   │   ├── SystemSettings/
│   │   │   ├── SystemSettings.jsx
│   │   │   ├── SettingGroup.jsx
│   │   │   ├── SettingItem.jsx
│   │   │   └── index.js
│   │   ├── CategoryManagement/
│   │   │   ├── CategoryList.jsx
│   │   │   ├── CategoryForm.jsx
│   │   │   ├── PriorityManagement.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   └── index.js                    # Barrel export principal
│
├── pages/                          # Páginas principales
│   ├── dashboard/
│   │   ├── Dashboard.jsx           # Vista principal
│   │   ├── AdminDashboard.jsx      # Dashboard específico admin
│   │   ├── TechnicianDashboard.jsx # Dashboard específico técnico
│   │   └── index.js
│   ├── tickets/
│   │   ├── TicketListPage.jsx
│   │   ├── TicketDetailPage.jsx
│   │   ├── CreateTicketPage.jsx
│   │   ├── MyTicketsPage.jsx
│   │   └── index.js
│   ├── users/
│   │   ├── UserListPage.jsx
│   │   ├── CreateUserPage.jsx
│   │   └── index.js
│   ├── reports/
│   │   ├── ReportsPage.jsx
│   │   ├── PerformancePage.jsx
│   │   └── index.js
│   ├── settings/
│   │   ├── SettingsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── index.js
│   └── index.js
```

## **🎯 Componentes Clave Detallados**

### **1. Sidebar Component**

```jsx
// components/layout/Sidebar/Sidebar.jsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { SidebarMenu, SidebarUser, SidebarLogo } from './';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <SidebarLogo collapsed={collapsed} />
      <SidebarUser user={user} collapsed={collapsed} />
      <SidebarMenu userRole={user.role} collapsed={collapsed} />
    </div>
  );
};

export default Sidebar;
```

### **2. DataTable Component**

```jsx
// components/common/DataTable/DataTable.jsx
import React, { useState } from 'react';
import { TableHeader, TableRow, TablePagination } from './';

const DataTable = ({ 
  data, 
  columns, 
  pagination = true,
  sorting = true,
  selection = false,
  onRowClick,
  actions = []
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <div className="data-table">
      <TableHeader 
        columns={columns}
        sorting={sorting}
        selection={selection}
        onSort={setSortConfig}
        onSelectAll={handleSelectAll}
      />
      <div className="table-body">
        {data.map((row, index) => (
          <TableRow
            key={row.id}
            data={row}
            columns={columns}
            selected={selectedRows.includes(row.id)}
            onClick={() => onRowClick?.(row)}
            onSelect={handleRowSelect}
            actions={actions}
          />
        ))}
      </div>
      {pagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / 20)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default DataTable;
```

### **3. MetricsCard Component**

```jsx
// components/common/Card/MetricsCard.jsx
import React from 'react';
import { Card, Typography } from '@mui/material';

const MetricsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  trend,
  chart,
  onClick 
}) => {
  return (
    <Card 
      className={`metrics-card bg-${color}-50 dark:bg-${color}-900/20 hover:shadow-lg transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-6">
        <div>
          <Typography variant="h4" className={`font-bold text-${color}-900 dark:text-${color}-100`}>
            {value}
          </Typography>
          <Typography variant="body2" className={`text-${color}-700 dark:text-${color}-300 mt-1`}>
            {title}
          </Typography>
          {trend && (
            <Typography variant="caption" className="text-gray-500 mt-2">
              {trend}
            </Typography>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full bg-${color}-500 flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      {chart && (
        <div className="px-6 pb-4">
          {chart}
        </div>
      )}
    </Card>
  );
};

export default MetricsCard;
```

### **4. TicketCard Component**

```jsx
// components/tickets/TicketList/TicketCard.jsx
import React from 'react';
import { Card, Typography, Chip, Avatar } from '@mui/material';
import { StatusChip, PriorityChip, CategoryChip } from '../StatusChips';
import { formatDistanceToNow } from 'date-fns';

const TicketCard = ({ ticket, onClick }) => {
  return (
    <Card 
      className="ticket-card p-4 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => onClick(ticket.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Typography variant="h6" className="font-semibold truncate">
          {ticket.ticket_number}
        </Typography>
        <StatusChip status={ticket.status} size="small" />
      </div>
      
      {/* Title */}
      <Typography 
        variant="body1" 
        className="text-gray-900 dark:text-white mb-2 line-clamp-2"
      >
        {ticket.title}
      </Typography>
      
      {/* Meta Info */}
      <div className="flex items-center space-x-3 mb-3 text-sm text-gray-500">
        <PriorityChip priority={ticket.priority} size="small" />
        <CategoryChip category={ticket.category} size="small" />
        <span>
          {formatDistanceToNow(new Date(ticket.created_at))} ago
        </span>
      </div>
      
      {/* Client & Assignment */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="caption" className="text-gray-500">
            {ticket.client_company}
          </Typography>
        </div>
        {ticket.assignee && (
          <div className="flex items-center space-x-2">
            <Avatar 
              src={ticket.assignee.avatar} 
              alt={ticket.assignee.name}
              className="w-6 h-6"
            />
            <Typography variant="caption" className="text-gray-500">
              {ticket.assignee.first_name}
            </Typography>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TicketCard;
```

### **5. TicketTimeline Component**

```jsx
// components/tickets/TicketDetail/TicketTimeline.jsx
import React from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Avatar, Typography, Paper } from '@mui/material';
import { FiMessageSquare, FiUser, FiRefreshCw, FiClock } from 'react-icons/fi';

const TicketTimeline = ({ activities, ticketId }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment': return <FiMessageSquare />;
      case 'status_change': return <FiRefreshCw />;
      case 'assignment': return <FiUser />;
      default: return <FiClock />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'comment': return 'primary';
      case 'status_change': return 'warning';
      case 'assignment': return 'info';
      default: return 'grey';
    }
  };

  return (
    <Timeline>
      {activities.map((activity, index) => (
        <TimelineItem key={activity.id}>
          <TimelineSeparator>
            <TimelineDot color={getActivityColor(activity.type)}>
              {getActivityIcon(activity.type)}
            </TimelineDot>
            {index < activities.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          
          <TimelineContent>
            <Paper className="p-4 mb-2">
              {/* Activity Header */}
              <div className="flex items-center space-x-3 mb-2">
                <Avatar 
                  src={activity.user.avatar} 
                  alt={activity.user.name}
                  className="w-8 h-8"
                />
                <div>
                  <Typography variant="body2" className="font-semibold">
                    {activity.user.first_name} {activity.user.last_name}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at))} ago
                  </Typography>
                </div>
                {activity.is_internal && (
                  <Chip 
                    label="Interno" 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                )}
              </div>
              
              {/* Activity Content */}
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                {activity.content}
              </Typography>
              
              {/* Attachments if any */}
              {activity.attachments?.length > 0 && (
                <div className="mt-2">
                  <AttachmentList files={activity.attachments} />
                </div>
              )}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default TicketTimeline;
```

## **🔗 Integración entre Componentes**

### **Props Flow Diagram**

```
App.jsx
├── AuthProvider
│   ├── user
│   ├── login()
│   └── logout()
├── ThemeProvider
│   ├── darkMode
│   └── toggleTheme()
└── MainLayout
    ├── Sidebar
    │   ├── user (from AuthContext)
    │   ├── collapsed
    │   └── onToggle()
    ├── Header
    │   ├── user (from AuthContext)
    │   ├── notifications[]
    │   └── onSearch()
    └── PageContent
        └── Dynamic Route Components
```

### **Context Dependencies**

```jsx
// Contexts usados por componentes específicos
const componentContextMap = {
  'Sidebar': ['AuthContext', 'ThemeContext'],
  'Header': ['AuthContext', 'NotificationContext'],
  'TicketList': ['AuthContext', 'TicketContext'],
  'TicketDetail': ['AuthContext', 'TicketContext', 'SocketContext'],
  'Dashboard': ['AuthContext', 'DashboardContext'],
  'UserManagement': ['AuthContext'] // Solo admin
};
```

## **📱 Responsive Behavior**

### **Breakpoint Component Behavior**

```jsx
// Responsive behavior per component
const responsiveConfig = {
  'Sidebar': {
    mobile: 'hidden (bottom tabs instead)',
    tablet: 'collapsible',
    desktop: 'expanded'
  },
  'DataTable': {
    mobile: 'card view',
    tablet: 'horizontal scroll',
    desktop: 'full table'
  },
  'MetricsRow': {
    mobile: '1 column',
    tablet: '2 columns',
    desktop: '4 columns'
  },
  'TicketDetail': {
    mobile: 'single column (sidebar bottom)',
    tablet: 'single column (sidebar bottom)',
    desktop: '2 columns (sidebar right)'
  }
};
```

Este sistema de componentes modular permite:
- **Reutilización máxima**
- **Fácil testing unitario** 
- **Mantenimiento simplificado**
- **Escalabilidad** para futuras funcionalidades
- **Consistency** en toda la aplicación
