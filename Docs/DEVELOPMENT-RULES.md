# 📖 Guía Definitiva de Reglas para Desarrollo con Agentes AI

Este documento establece **TODAS** las reglas, arquitecturas y convenciones para el desarrollo del **Sistema de Gestión de Tickets**. Cualquier agente de IA debe seguir estas directrices **estrictamente** en cada generación de código para mantener consistencia, calidad y eficiencia.

---

## 🚀 **1. Resumen del Proyecto**

### **📋 Descripción General**
- **Sistema integral de gestión de tickets** con dashboard web administrativo
- **Roles definidos**: Administrador, Técnico, Mesa de Trabajo (3 roles únicamente)
- **Enfoque actual**: Dashboard web React (aplicación móvil Android es desarrollo futuro)
- **Empresa**: MAC Computadoras - Sistema de soporte técnico

### **🛠 Stack Tecnológico OBLIGATORIO**

#### **Frontend (Dashboard Web)**
- **Framework**: React 18+ con Vite
- **Estilos**: TailwindCSS + Material-UI (MUI) - **COMBINACIÓN OBLIGATORIA**
- **Iconos**: React Icons (**ÚNICAMENTE**)
- **Estado Global**: Context API (**NO Redux, NO Zustand**)
- **Autenticación**: JWT almacenado en localStorage
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios con interceptores
- **WebSockets**: Socket.IO Client
- **Tema**: Claro/Oscuro configurable

#### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de Datos**: MySQL 8.0+ con AWS RDS
- **ORM**: Sequelize (**NO Prisma en esta fase**)
- **Autenticación**: JWT + bcrypt (12 rounds)
- **WebSockets**: Socket.IO Server
- **Archivos**: AWS S3 + Multer
- **Validación**: Joi (**NO Zod en esta fase**)

#### **Infraestructura**
- **Deploy**: AWS (EC2, S3, RDS)
- **Archivos**: AWS S3 con nombres UUID
- **Dominio**: Route 53 (opcional)

---

## ⚖️ **2. Principios Fundamentales**

### **🔒 Seguridad Primero**
- **Validación doble**: SIEMPRE en frontend Y backend
- **Sanitización**: Toda entrada del usuario debe ser sanitizada
- **Variables de entorno**: Para TODAS las claves y secretos
- **JWT**: Con expiración de 24h y refresh token de 7 días
- **Rate limiting**: 5 intentos por minuto por IP en login
- **CORS**: Configuración estricta

### **📝 Código Claro y Mantenible**
- **Legibilidad > Complejidad**: Prefiere código claro
- **Comentarios**: Solo cuando la lógica sea compleja
- **Funciones pequeñas**: Máximo 20-30 líneas por función
- **Un archivo = Un propósito**: Componente por archivo

### **🎯 Fuente Única de Verdad (SSOT)**
- **Constantes centralizadas**: En `src/constants/` o `src/config/`
- **No duplicación**: Roles, estados, colores definidos una sola vez
- **Configuraciones**: Variables de entorno para todo

### **🔄 Separación de Responsabilidades**

#### **Frontend**
- **Componentes**: Solo UI y manejo de eventos
- **Hooks**: Lógica de estado y efectos
- **Services**: Comunicación con API
- **Context**: Estado global compartido

#### **Backend**
- **Controladores**: Request/Response y validación únicamente
- **Servicios**: Lógica de negocio y reglas
- **Modelos**: Definición de datos y relaciones
- **Middleware**: Autenticación, autorización, validación

---

## ✍️ **3. Nomenclatura y Convenciones OBLIGATORIAS**

### **📋 Tabla de Convenciones**

| Elemento | Convención | Ejemplo | ❌ Incorrecto |
|----------|------------|---------|---------------|
| **Variables y Funciones** | `camelCase` | `ticketData`, `handleFormSubmit` | `ticket_data`, `HandleSubmit` |
| **Componentes React** | `PascalCase` | `TicketCard`, `UserModal` | `ticketCard`, `user-modal` |
| **Archivos de Componentes** | `PascalCase.jsx` | `TicketCard.jsx` | `TicketCard.js`, `ticket-card.jsx` |
| **Páginas y Servicios** | `camelCase.js` | `ticketService.js`, `authService.js` | `ticket-service.js` |
| **Constantes Globales** | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `USER_ROLES` | `apiBaseUrl`, `userRoles` |
| **Tablas y Columnas BBDD** | `snake_case` | `ticket_history`, `created_at` | `ticketHistory`, `createdAt` |
| **Endpoints API** | `kebab-case` plural | `/api/tickets`, `/api/users` | `/api/ticket`, `/api/getUsers` |

### **🚫 PROHIBICIONES ABSOLUTAS**
- ❌ **NO TypeScript** - Solo JSX
- ❌ **NO CSS personalizado** - Solo TailwindCSS
- ❌ **NO styled-components** - Solo MUI + Tailwind
- ❌ **NO archivos .css/.scss** - Prohibido totalmente
- ❌ **NO librerías no autorizadas** - Stack definido es final
- ❌ **NO emojis en código** - Solo en documentación

---

## 📁 **4. Estructura de Carpetas OBLIGATORIA**

### **🎨 Frontend (`src/`)**
```
src/
├── assets/                     # Recursos estáticos
│   ├── images/                # logo.svg, avatar-placeholder.png
│   └── icons/                 # Iconos personalizados (si necesario)
├── components/                # Componentes reutilizables
│   ├── common/               # 100% reutilizables
│   │   ├── Button/           # Solo si necesitas customizar MUI
│   │   ├── Modal/            # Modales personalizados
│   │   ├── LoadingSpinner/   # Spinner de carga
│   │   ├── Toast/            # Notificaciones toast
│   │   ├── ConfirmDialog/    # Diálogos de confirmación
│   │   ├── DataTable/        # Tabla con paginación
│   │   ├── SearchInput/      # Input de búsqueda con debounce
│   │   ├── Pagination/       # Paginación personalizada
│   │   └── index.js          # Barrel exports
│   ├── layout/               # Componentes de layout
│   │   ├── Sidebar/          # Barra lateral de navegación
│   │   ├── Header/           # Header con usuario y notificaciones
│   │   ├── MainLayout/       # Layout principal
│   │   ├── AuthLayout/       # Layout para login
│   │   └── index.js
│   ├── forms/                # Formularios específicos
│   │   ├── TicketForm/       # Crear/editar tickets
│   │   ├── UserForm/         # Crear/editar usuarios
│   │   ├── LoginForm/        # Formulario de login
│   │   ├── CommentForm/      # Agregar comentarios
│   │   ├── FileUpload/       # Subir archivos
│   │   └── index.js
│   ├── tickets/              # Componentes específicos de tickets
│   │   ├── TicketCard/       # Tarjeta de ticket
│   │   ├── TicketList/       # Lista de tickets
│   │   ├── TicketFilters/    # Filtros de búsqueda
│   │   ├── TicketHistory/    # Historial de cambios
│   │   ├── TicketComments/   # Comentarios del ticket
│   │   ├── TicketAttachments/ # Archivos adjuntos
│   │   └── index.js
│   ├── users/                # Componentes de usuarios
│   │   ├── UserCard/         # Tarjeta de usuario
│   │   ├── UserList/         # Lista de usuarios
│   │   ├── UserProfile/      # Perfil de usuario
│   │   └── index.js
│   ├── reports/              # Componentes de reportes (admin)
│   │   ├── DashboardChart/   # Gráficos del dashboard
│   │   ├── MetricsCard/      # Tarjetas de métricas
│   │   ├── ReportFilters/    # Filtros de reportes
│   │   └── index.js
│   └── index.js              # Barrel export principal
├── pages/                    # Páginas/Vistas principales
│   ├── auth/                # Autenticación
│   │   ├── Login.jsx        # Página de login
│   │   ├── ForgotPassword.jsx
│   │   └── index.js
│   ├── dashboard/           # Dashboards por rol
│   │   ├── Dashboard.jsx    # Dashboard general
│   │   ├── AdminDashboard.jsx
│   │   ├── TechnicianDashboard.jsx
│   │   ├── WorkdeskDashboard.jsx
│   │   └── index.js
│   ├── tickets/             # Páginas de tickets
│   │   ├── TicketList.jsx   # Lista principal
│   │   ├── TicketDetail.jsx # Detalle completo
│   │   ├── CreateTicket.jsx # Crear nuevo
│   │   ├── MyTickets.jsx    # Mis tickets (técnico)
│   │   └── index.js
│   ├── users/               # Gestión de usuarios (admin)
│   │   ├── UserList.jsx
│   │   ├── CreateUser.jsx
│   │   ├── EditUser.jsx
│   │   └── index.js
│   ├── reports/             # Reportes (admin)
│   │   ├── Reports.jsx
│   │   ├── TicketReports.jsx
│   │   └── index.js
│   ├── settings/            # Configuraciones
│   │   ├── Settings.jsx
│   │   ├── Profile.jsx
│   │   ├── Categories.jsx   # Gestión categorías (admin)
│   │   └── index.js
│   ├── NotFound.jsx         # Error 404
│   ├── Unauthorized.jsx     # Error 403
│   └── index.js
├── contexts/                # Context API providers
│   ├── AuthContext.jsx      # Autenticación y usuario
│   ├── TicketContext.jsx    # Estado de tickets
│   ├── NotificationContext.jsx # Notificaciones
│   ├── ThemeContext.jsx     # Tema claro/oscuro
│   └── index.js
├── hooks/                   # Custom hooks
│   ├── useAuth.js           # Hook de autenticación
│   ├── useTickets.js        # Hook de tickets
│   ├── useSocket.js         # WebSocket connection
│   ├── useDebounce.js       # Debounce para búsquedas
│   ├── useLocalStorage.js   # LocalStorage helper
│   ├── useErrorHandler.js   # Manejo de errores
│   └── index.js
├── services/                # APIs y servicios externos
│   ├── api.js               # Configuración Axios base
│   ├── authService.js       # Servicios de auth
│   ├── ticketService.js     # Servicios de tickets
│   ├── userService.js       # Servicios de usuarios
│   ├── reportService.js     # Servicios de reportes
│   ├── uploadService.js     # Subida de archivos
│   ├── socketService.js     # WebSocket service
│   └── index.js
├── utils/                   # Funciones auxiliares
│   ├── constants.js         # Constantes de la app
│   ├── helpers.js           # Funciones helper
│   ├── validators.js        # Validaciones frontend
│   ├── formatters.js        # Formateo de datos
│   ├── permissions.js       # Lógica de permisos
│   └── index.js
├── constants/               # Constantes específicas
│   ├── roles.js             # USER_ROLES
│   ├── ticketStatus.js      # TICKET_STATUSES
│   ├── priorities.js        # PRIORITIES
│   ├── routes.js            # ROUTE_PATHS
│   └── index.js
├── App.jsx                  # Componente raíz
├── main.jsx                 # Entry point
└── index.css               # Solo imports de Tailwind
```

### **🔧 Backend (`src/`)**
```
src/
├── config/                  # Configuraciones
│   ├── database.js         # Sequelize config
│   ├── jwt.js              # JWT configuration
│   ├── aws.js              # AWS S3 config
│   ├── socket.js           # Socket.IO config
│   └── index.js
├── controllers/            # Request/Response handlers
│   ├── authController.js   # Login, logout, refresh
│   ├── userController.js   # CRUD usuarios
│   ├── ticketController.js # CRUD tickets
│   ├── commentController.js
│   ├── attachmentController.js
│   ├── reportController.js
│   └── index.js
├── middleware/             # Middlewares
│   ├── auth.js            # JWT verification
│   ├── roles.js           # Role authorization
│   ├── validation.js      # Request validation
│   ├── upload.js          # File upload (Multer)
│   ├── rateLimiter.js     # Rate limiting
│   ├── errorHandler.js    # Error handling
│   └── index.js
├── models/                # Sequelize models
│   ├── User.js
│   ├── Ticket.js
│   ├── Comment.js
│   ├── Attachment.js
│   ├── Category.js
│   ├── Priority.js
│   ├── TicketStatus.js
│   ├── Notification.js
│   └── index.js           # Model associations
├── routes/                # API routes
│   ├── auth.js
│   ├── tickets.js
│   ├── users.js
│   ├── comments.js
│   ├── reports.js
│   └── index.js
├── services/              # Business logic
│   ├── authService.js
│   ├── ticketService.js
│   ├── userService.js
│   ├── s3Service.js
│   ├── emailService.js
│   └── index.js
├── socket/                # WebSocket handlers
│   ├── socketHandler.js   # Main handler
│   ├── ticketSocket.js    # Ticket events
│   └── index.js
├── utils/                 # Helper functions
│   ├── constants.js
│   ├── helpers.js
│   ├── logger.js
│   └── index.js
├── validators/            # Joi schemas
│   ├── authValidators.js
│   ├── ticketValidators.js
│   ├── userValidators.js
│   └── index.js
├── app.js                 # Express app setup
└── server.js             # Entry point
```

---

## 💻 **5. Reglas de Frontend (React)**

### **🎨 Combinación MUI + TailwindCSS (OBLIGATORIO)**

#### **📋 Reglas de Uso**
1. **Material-UI**: Para componentes funcionales base
   - `<Button>`, `<TextField>`, `<Card>`, `<Modal>`, `<Menu>`, `<Dialog>`
   - Componentes con lógica compleja (DatePicker, Autocomplete, etc.)

2. **TailwindCSS**: Para TODO el layout y styling
   - Espaciado: `p-4`, `m-2`, `mx-auto`
   - Colores: `bg-blue-500`, `text-gray-800`, `border-red-400`
   - Layout: `flex`, `grid`, `items-center`, `justify-between`
   - Responsive: `sm:`, `md:`, `lg:`, `xl:`
   - Dark mode: `dark:bg-gray-800`, `dark:text-white`

#### **✅ Ejemplo Correcto**
```jsx
import React from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import { FiEdit, FiTrash } from 'react-icons/fi';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <Card className="p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow dark:bg-gray-800">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {user.first_name[0]}{user.last_name[0]}
            </span>
          </div>
          <div>
            <Typography variant="h6" className="font-bold dark:text-white">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
              {user.email}
            </Typography>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => onEdit(user.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FiEdit className="mr-2" />
            Editar
          </Button>
          <Button 
            onClick={() => onDelete(user.id)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <FiTrash />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
```

### **📝 Plantilla de Componente OBLIGATORIA**

```jsx
// /components/specific/ComponentName.jsx

import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@mui/material';
import { FiIcon } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const ComponentName = ({ prop1, prop2, onAction }) => {
  // 1. HOOKS - Siempre en este orden
  const { user } = useAuth();
  const [localState, setLocalState] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. FUNCIONES DE EVENTO
  const handleClick = async () => {
    setLoading(true);
    try {
      await onAction(prop1);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. EFFECTS - Siempre al final de hooks
  useEffect(() => {
    // Lógica de efectos
  }, [prop1]);

  // 4. EARLY RETURNS - Validaciones y loading states
  if (loading) return <div className="p-4">Cargando...</div>;
  if (!prop1) return null;

  // 5. RENDER LOGIC - Variables para el render
  const dynamicClass = prop2 ? 'bg-green-100' : 'bg-gray-100';

  // 6. JSX RETURN
  return (
    <Card className={`p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow ${dynamicClass} dark:bg-gray-800`}>
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold dark:text-white">
          {prop1}
        </Typography>
        <Button 
          onClick={handleClick}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <FiIcon className="mr-2" />
          Acción
        </Button>
      </div>
    </Card>
  );
};

export default ComponentName;
```

### **🔄 Context API - Plantilla OBLIGATORIA**

```jsx
// /contexts/TicketContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import { useAuth } from './AuthContext';

// 1. CREAR CONTEXTO
const TicketContext = createContext();

// 2. PROVIDER COMPONENT
export const TicketProvider = ({ children }) => {
  // Estado del contexto
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const { user } = useAuth();

  // Funciones del contexto
  const loadTickets = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketService.getTickets({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setTickets(response.data.items);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      const response = await ticketService.createTicket(ticketData);
      setTickets(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateTicket = async (ticketId, updates) => {
    try {
      const response = await ticketService.updateTicket(ticketId, updates);
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? response.data : ticket
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Cargar tickets iniciales
  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  // Valor del contexto
  const contextValue = {
    tickets,
    loading,
    error,
    pagination,
    loadTickets,
    createTicket,
    updateTicket,
    setError
  };

  return (
    <TicketContext.Provider value={contextValue}>
      {children}
    </TicketContext.Provider>
  );
};

// 3. CUSTOM HOOK
export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets debe ser usado dentro de TicketProvider');
  }
  return context;
};
```

### **🌐 API Services - Plantilla OBLIGATORIA**

```jsx
// /services/api.js - Configuración base

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de error 401 - Token expirado
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    // Manejo de error 403 - Sin permisos
    if (error.response?.status === 403) {
      console.error('Acceso denegado');
    }

    return Promise.reject(error);
  }
);

export default api;
```

```jsx
// /services/ticketService.js - Servicio específico

import api from './api';

export const ticketService = {
  // Obtener lista de tickets
  getTickets: async (params = {}) => {
    try {
      const response = await api.get('/tickets', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tickets:', error);
      throw error;
    }
  },

  // Obtener ticket por ID
  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ticket:', error);
      throw error;
    }
  },

  // Crear nuevo ticket
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creando ticket:', error);
      throw error;
    }
  },

  // Actualizar ticket
  updateTicket: async (ticketId, updates) => {
    try {
      const response = await api.put(`/tickets/${ticketId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error actualizando ticket:', error);
      throw error;
    }
  },

  // Cambiar estado de ticket
  updateTicketStatus: async (ticketId, statusId, reason = '') => {
    try {
      const response = await api.patch(`/tickets/${ticketId}/status`, {
        status_id: statusId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error cambiando estado:', error);
      throw error;
    }
  },

  // Asignar ticket
  assignTicket: async (ticketId, technicianId, reason = '') => {
    try {
      const response = await api.post(`/tickets/${ticketId}/assign`, {
        assigned_to: technicianId,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error asignando ticket:', error);
      throw error;
    }
  },

  // Subir archivo
  uploadAttachment: async (ticketId, file, description = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  },

  // Agregar comentario
  addComment: async (ticketId, comment, isInternal = false) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/comments`, {
        comment,
        is_internal: isInternal
      });
      return response.data;
    } catch (error) {
      console.error('Error agregando comentario:', error);
      throw error;
    }
  }
};

export default ticketService;
```

---

## 🌐 **6. Reglas de Backend (Node.js/Express)**

### **📋 Formato de Respuesta API (OBLIGATORIO)**

**TODAS** las respuestas de la API deben seguir este formato exacto:

#### **✅ Respuesta Exitosa**
```json
{
  "success": true,
  "message": "Operación completada exitosamente",
  "data": {
    "items": [/* array de elementos */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### **❌ Respuesta de Error**
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

### **🎛️ Plantilla de Controlador OBLIGATORIA**

```javascript
// /controllers/ticketController.js

const ticketService = require('../services/ticketService');
const { validationResult } = require('express-validator');

// Obtener lista de tickets
const getTickets = async (req, res) => {
  try {
    // 1. Validar errores de validación (middleware)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    // 2. Extraer parámetros y preparar datos
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      search
    } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      priority,
      assignedTo,
      search,
      userId: req.user.id,
      userRole: req.user.role
    };

    // 3. Llamar al servicio
    const result = await ticketService.getTickets(filters);

    // 4. Responder con formato estándar
    res.status(200).json({
      success: true,
      message: 'Tickets obtenidos exitosamente',
      data: result
    });

  } catch (error) {
    // 5. Manejo de errores consistente
    console.error('Error obteniendo tickets:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Crear nuevo ticket
const createTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const ticketData = {
      ...req.body,
      created_by: req.user.id
    };

    const newTicket = await ticketService.createTicket(ticketData);

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      data: newTicket
    });

  } catch (error) {
    console.error('Error creando ticket:', error);
    
    // Manejo específico de errores de negocio
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getTickets,
  createTicket
};
```

### **🔧 Plantilla de Servicio OBLIGATORIA**

```javascript
// /services/ticketService.js

const { Ticket, User, Category, Priority, TicketStatus, Comment, Attachment } = require('../models');
const { Op } = require('sequelize');
const notificationService = require('./notificationService');

const ticketService = {
  
  // Obtener tickets con filtros y paginación
  getTickets: async (filters) => {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      search,
      userId,
      userRole
    } = filters;

    // Construir condiciones WHERE basadas en rol
    let whereConditions = {};

    // Filtros por rol
    if (userRole === 'tecnico') {
      whereConditions.assigned_to = userId;
    } else if (userRole === 'mesa_trabajo') {
      whereConditions.created_by = userId;
    }
    // Admin ve todos los tickets

    // Filtros adicionales
    if (status) whereConditions.status_id = status;
    if (priority) whereConditions.priority_id = priority;
    if (assignedTo) whereConditions.assigned_to = assignedTo;

    // Búsqueda por texto
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { ticket_number: { [Op.like]: `%${search}%` } }
      ];
    }

    // Calcular offset
    const offset = (page - 1) * limit;

    try {
      const { count, rows } = await Ticket.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color']
          },
          {
            model: Priority,
            as: 'priority',
            attributes: ['id', 'name', 'level', 'color']
          },
          {
            model: TicketStatus,
            as: 'status',
            attributes: ['id', 'name', 'color']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'username']
          },
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'first_name', 'last_name', 'username']
          }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['created_at', 'DESC']],
        distinct: true
      });

      return {
        items: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      };

    } catch (error) {
      console.error('Error en getTickets service:', error);
      throw new Error('Error obteniendo tickets de la base de datos');
    }
  },

  // Crear nuevo ticket
  createTicket: async (ticketData) => {
    try {
      // Validaciones de negocio
      if (!ticketData.title || ticketData.title.length < 5) {
        throw new Error('El título debe tener al menos 5 caracteres');
      }

      if (!ticketData.description || ticketData.description.length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }

      // Crear ticket
      const ticket = await Ticket.create({
        title: ticketData.title,
        description: ticketData.description,
        category_id: ticketData.category_id,
        priority_id: ticketData.priority_id,
        created_by: ticketData.created_by,
        client_company: ticketData.client_company,
        client_contact: ticketData.client_contact,
        location: ticketData.location,
        status_id: 1 // Nuevo por defecto
      });

      // Obtener ticket completo con relaciones
      const newTicket = await Ticket.findByPk(ticket.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Priority, as: 'priority' },
          { model: TicketStatus, as: 'status' },
          { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] }
        ]
      });

      // Crear entrada en el historial
      await ticketService.addToHistory(ticket.id, ticketData.created_by, 'created', null, null, 'Ticket creado');

      // Enviar notificación a administradores (async)
      setImmediate(async () => {
        try {
          await notificationService.notifyNewTicket(newTicket);
        } catch (error) {
          console.error('Error enviando notificación:', error);
        }
      });

      return newTicket;

    } catch (error) {
      console.error('Error en createTicket service:', error);
      throw error;
    }
  },

  // Agregar entrada al historial
  addToHistory: async (ticketId, userId, actionType, oldValue, newValue, description) => {
    const TicketHistory = require('../models/TicketHistory');
    
    try {
      await TicketHistory.create({
        ticket_id: ticketId,
        user_id: userId,
        action_type: actionType,
        old_value: oldValue,
        new_value: newValue,
        description: description
      });
    } catch (error) {
      console.error('Error agregando al historial:', error);
      // No lanzar error para no interrumpir la operación principal
    }
  }
};

module.exports = ticketService;
```

### **🛡️ Middleware de Autenticación OBLIGATORIO**

```javascript
// /middleware/auth.js

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extraer token del header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
        code: 'NO_TOKEN'
      });
    }

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar usuario
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'role_id', 'is_active']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo',
        code: 'USER_INACTIVE'
      });
    }

    // 4. Agregar usuario al request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role_id === 1 ? 'admin' : user.role_id === 2 ? 'tecnico' : 'mesa_trabajo'
    };

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        code: 'TOKEN_INVALID'
      });
    }

    console.error('Error en autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware de autorización por rol
const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};
```

---

## 🧪 **7. Testing (Pruebas Básicas)**

### **📋 ¿Qué son las Pruebas?**
Son pequeños programas que verifican automáticamente que tu código funciona como esperas. Ayudan a:
- **Encontrar errores** antes que los usuarios
- **Evitar regresiones** cuando cambias código
- **Documentar** cómo debe funcionar el código

### **🎯 Tipos de Pruebas Obligatorias**

#### **Frontend (React)**
- **Pruebas de Componentes**: Verifican que rendericen correctamente
- **Pruebas de Hooks**: Verifican lógica de custom hooks
- **Pruebas de Servicios**: Verifican llamadas a API

#### **Backend (Node.js)**
- **Pruebas de Controladores**: Verifican endpoints
- **Pruebas de Servicios**: Verifican lógica de negocio
- **Pruebas de Middleware**: Verifican autenticación/autorización

### **📝 Plantillas de Pruebas**

#### **Frontend - Componente**
```jsx
// /components/tickets/TicketCard.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TicketCard from './TicketCard';

const theme = createTheme();

const mockTicket = {
  id: 1,
  ticket_number: '#ID-001',
  title: 'Problema con impresora',
  category: { name: 'Hardware', color: '#EF4444' },
  priority: { name: 'Alta', color: '#FF5722', level: 3 },
  status: { name: 'Nuevo', color: '#6B7280' },
  created_at: '2025-01-15T10:00:00.000Z'
};

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('TicketCard', () => {
  it('debe renderizar el título del ticket', () => {
    const mockOnSelect = jest.fn();
    
    renderWithTheme(
      <TicketCard ticket={mockTicket} onSelect={mockOnSelect} />
    );
    
    expect(screen.getByText('Problema con impresora')).toBeInTheDocument();
    expect(screen.getByText('#ID-001')).toBeInTheDocument();
  });

  it('debe llamar onSelect cuando se hace clic', () => {
    const mockOnSelect = jest.fn();
    
    renderWithTheme(
      <TicketCard ticket={mockTicket} onSelect={mockOnSelect} />
    );
    
    fireEvent.click(screen.getByText('Problema con impresora'));
    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  it('debe mostrar la prioridad con el color correcto', () => {
    const mockOnSelect = jest.fn();
    
    renderWithTheme(
      <TicketCard ticket={mockTicket} onSelect={mockOnSelect} />
    );
    
    const priorityChip = screen.getByText('Alta');
    expect(priorityChip).toBeInTheDocument();
    expect(priorityChip).toHaveStyle({ backgroundColor: '#FF5722' });
  });
});
```

#### **Backend - Controlador**
```javascript
// /controllers/ticketController.test.js

const request = require('supertest');
const app = require('../app');
const { User, Ticket } = require('../models');
const jwt = require('jsonwebtoken');

describe('Ticket Controller', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Crear usuario de prueba
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      first_name: 'Test',
      last_name: 'User',
      role_id: 2, // tecnico
      is_active: true
    });

    // Generar token
    authToken = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET);
  });

  afterEach(async () => {
    // Limpiar datos de prueba
    await Ticket.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('GET /api/tickets', () => {
    it('debe retornar lista de tickets para usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tickets obtenidos exitosamente');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token de acceso requerido');
    });
  });

  describe('POST /api/tickets', () => {
    it('debe crear un nuevo ticket correctamente', async () => {
      const ticketData = {
        title: 'Nuevo ticket de prueba',
        description: 'Descripción del ticket de prueba para testing',
        category_id: 1,
        priority_id: 2,
        client_company: 'Empresa Test',
        client_contact: 'Contacto Test'
      };

      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ticketData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Ticket creado exitosamente');
      expect(response.body.data.title).toBe(ticketData.title);
      expect(response.body.data.created_by).toBe(testUser.id);
    });

    it('debe retornar error de validación con datos inválidos', async () => {
      const invalidData = {
        title: 'ABC', // Muy corto
        description: 'XYZ' // Muy corto
      };

      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Errores de validación');
      expect(response.body.errors).toBeInstanceOf(Array);
    });
  });
});
```

---

## 📱 **8. Responsive Design y Tema**

### **📐 Breakpoints de TailwindCSS (OBLIGATORIOS)**

```jsx
// Usar SIEMPRE estos breakpoints para responsive
const ResponsiveComponent = () => {
  return (
    <div className="
      grid 
      grid-cols-1          // Mobile: 1 columna
      sm:grid-cols-2       // Small (640px+): 2 columnas  
      md:grid-cols-3       // Medium (768px+): 3 columnas
      lg:grid-cols-4       // Large (1024px+): 4 columnas
      xl:grid-cols-6       // XL (1280px+): 6 columnas
      gap-4 
      p-4
    ">
      {/* Contenido */}
    </div>
  );
};
```

### **🌓 Tema Claro/Oscuro OBLIGATORIO**

```jsx
// /contexts/ThemeContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia del localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Detectar preferencia del sistema
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Aplicar clase al html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Tema de Material-UI
  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3B82F6', // blue-500
      },
      secondary: {
        main: '#10B981', // emerald-500
      },
      background: {
        default: darkMode ? '#111827' : '#F9FAFB', // gray-900 : gray-50
        paper: darkMode ? '#1F2937' : '#FFFFFF', // gray-800 : white
      },
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
    },
  });

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const value = {
    darkMode,
    toggleTheme,
    muiTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de CustomThemeProvider');
  }
  return context;
};
```

---

## 🔧 **9. Variables de Entorno**

### **🎨 Frontend (.env)**
```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001

# AWS Configuration (para uploads directos si es necesario)
VITE_AWS_REGION=us-east-1

# App Configuration
VITE_APP_NAME=Sistema de Gestión de Tickets
VITE_APP_VERSION=1.0.0

# Debug
VITE_DEBUG=true
```

### **⚙️ Backend (.env)**
```bash
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ticket_system
DB_USER=root
DB_PASSWORD=password
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-also-minimum-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ticket-attachments-bucket

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov

# Email Configuration (futuro)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

---

## 🗄️ **10. Base de Datos - Esquema y Constantes**

### **📊 Estados de Tickets (OBLIGATORIOS)**

```javascript
// /constants/ticketStatus.js

export const TICKET_STATUSES = {
  NUEVO: { id: 1, name: 'Nuevo', color: '#6B7280', order: 1 },
  ASIGNADO: { id: 2, name: 'Asignado', color: '#3B82F6', order: 2 },
  EN_PROCESO: { id: 3, name: 'En Proceso', color: '#F59E0B', order: 3 },
  PENDIENTE_CLIENTE: { id: 4, name: 'Pendiente Cliente', color: '#8B5CF6', order: 4 },
  RESUELTO: { id: 5, name: 'Resuelto', color: '#10B981', order: 5 },
  CERRADO: { id: 6, name: 'Cerrado', color: '#4B5563', order: 6, final: true },
  REABIERTO: { id: 7, name: 'Reabierto', color: '#EF4444', order: 7 }
};

export const getStatusById = (id) => {
  return Object.values(TICKET_STATUSES).find(status => status.id === id);
};

export const getStatusName = (id) => {
  return getStatusById(id)?.name || 'Desconocido';
};

export const getStatusColor = (id) => {
  return getStatusById(id)?.color || '#6B7280';
};
```

### **⚡ Prioridades (OBLIGATORIAS)**

```javascript
// /constants/priorities.js

export const PRIORITIES = {
  BAJA: { id: 1, name: 'Baja', level: 1, color: '#4CAF50', slaHours: 72 },
  MEDIA: { id: 2, name: 'Media', level: 2, color: '#FF9800', slaHours: 24 },
  ALTA: { id: 3, name: 'Alta', level: 3, color: '#FF5722', slaHours: 8 },
  CRITICA: { id: 4, name: 'Crítica', level: 4, color: '#F44336', slaHours: 4 }
};

export const getPriorityById = (id) => {
  return Object.values(PRIORITIES).find(priority => priority.id === id);
};

export const getPriorityName = (id) => {
  return getPriorityById(id)?.name || 'Media';
};

export const getPriorityColor = (id) => {
  return getPriorityById(id)?.color || '#FF9800';
};
```

### **👤 Roles de Usuario (OBLIGATORIOS)**

```javascript
// /constants/roles.js

export const USER_ROLES = {
  ADMIN: { id: 1, name: 'admin', label: 'Administrador', dashboardOnly: true },
  TECNICO: { id: 2, name: 'tecnico', label: 'Técnico', mobile: true },
  MESA_TRABAJO: { id: 3, name: 'mesa_trabajo', label: 'Mesa de Trabajo', mobile: true }
};

export const getRoleById = (id) => {
  return Object.values(USER_ROLES).find(role => role.id === id);
};

export const getRoleName = (id) => {
  return getRoleById(id)?.name || 'unknown';
};

export const getRoleLabel = (id) => {
  return getRoleById(id)?.label || 'Desconocido';
};

export const canAccessMobile = (roleId) => {
  return getRoleById(roleId)?.mobile || false;
};
```

---

## 📡 **11. WebSockets (Tiempo Real)**

### **⚡ Configuración Socket.IO**

```javascript
// /socket/socketHandler.js

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const socketHandler = (io) => {
  // Middleware de autenticación para sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Token requerido'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (!user || !user.is_active) {
        return next(new Error('Usuario no válido'));
      }

      socket.user = {
        id: user.id,
        username: user.username,
        role: user.role_id === 1 ? 'admin' : user.role_id === 2 ? 'tecnico' : 'mesa_trabajo'
      };

      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  // Manejo de conexiones
  io.on('connection', (socket) => {
    console.log(`Usuario ${socket.user.username} conectado`);

    // Unirse a salas por rol y usuario
    socket.join(`user_${socket.user.id}`);
    socket.join(`role_${socket.user.role}`);

    // Eventos de tickets
    socket.on('join_ticket_room', (ticketId) => {
      socket.join(`ticket_${ticketId}`);
      console.log(`Usuario ${socket.user.username} se unió a ticket ${ticketId}`);
    });

    socket.on('leave_ticket_room', (ticketId) => {
      socket.leave(`ticket_${ticketId}`);
    });

    // Evento de typing (usuario escribiendo)
    socket.on('typing', (data) => {
      socket.to(`ticket_${data.ticketId}`).emit('user_typing', {
        userId: socket.user.id,
        username: socket.user.username,
        isTyping: data.isTyping
      });
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`Usuario ${socket.user.username} desconectado`);
    });
  });

  return io;
};

// Funciones para emitir eventos desde services
const emitTicketUpdate = (io, ticketId, updateData) => {
  io.to(`ticket_${ticketId}`).emit('ticket_updated', {
    ticketId,
    ...updateData,
    timestamp: new Date().toISOString()
  });
};

const emitNewNotification = (io, userId, notification) => {
  io.to(`user_${userId}`).emit('new_notification', notification);
};

const emitTicketAssigned = (io, ticketId, technicianId, assignedBy) => {
  io.to(`user_${technicianId}`).emit('ticket_assigned', {
    ticketId,
    assignedBy: assignedBy.username,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  socketHandler,
  emitTicketUpdate,
  emitNewNotification,
  emitTicketAssigned
};
```

### **📱 Cliente Socket.IO (Frontend)**

```javascript
// /services/socketService.js

import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = new Map();
  }

  connect(token) {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });

    // Configurar listeners para eventos
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Ticket actualizado
    this.socket.on('ticket_updated', (data) => {
      this.emit('ticketUpdated', data);
    });

    // Nueva notificación
    this.socket.on('new_notification', (notification) => {
      this.emit('newNotification', notification);
    });

    // Ticket asignado
    this.socket.on('ticket_assigned', (data) => {
      this.emit('ticketAssigned', data);
    });

    // Usuario escribiendo
    this.socket.on('user_typing', (data) => {
      this.emit('userTyping', data);
    });
  }

  // Unirse a sala de ticket
  joinTicketRoom(ticketId) {
    if (this.socket) {
      this.socket.emit('join_ticket_room', ticketId);
    }
  }

  // Salir de sala de ticket
  leaveTicketRoom(ticketId) {
    if (this.socket) {
      this.socket.emit('leave_ticket_room', ticketId);
    }
  }

  // Emitir evento de typing
  emitTyping(ticketId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', { ticketId, isTyping });
    }
  }

  // Sistema de eventos personalizado
  on(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event).push(callback);
  }

  off(event, callback) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.callbacks.clear();
    }
  }
}

// Singleton
const socketService = new SocketService();
export default socketService;
```

---

## 📋 **12. Endpoints API Principales**

### **🔑 Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### **🎫 Tickets**
- `GET /api/tickets` - Lista con filtros y paginación
- `POST /api/tickets` - Crear nuevo ticket
- `GET /api/tickets/:id` - Detalle completo
- `PUT /api/tickets/:id` - Actualizar ticket
- `PATCH /api/tickets/:id/status` - Cambiar estado
- `POST /api/tickets/:id/assign` - Asignar técnico
- `POST /api/tickets/:id/accept` - Aceptar ticket (técnico)
- `POST /api/tickets/:id/close` - Cerrar ticket
- `POST /api/tickets/:id/reopen` - Reabrir ticket (admin)

### **💬 Comentarios**
- `GET /api/tickets/:id/comments` - Comentarios del ticket
- `POST /api/tickets/:id/comments` - Agregar comentario

### **📎 Archivos**
- `POST /api/tickets/:id/attachments` - Subir archivo
- `DELETE /api/attachments/:id` - Eliminar archivo

### **👥 Usuarios (Admin)**
- `GET /api/users` - Lista de usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `POST /api/users/:id/reset-password` - Resetear contraseña

### **📊 Reportes (Admin)**
- `GET /api/reports/dashboard` - Métricas del dashboard
- `GET /api/reports/tickets` - Reporte detallado

---

## ✅ **13. Reglas de Commits y Git**

### **📝 Formato de Commits (OBLIGATORIO)**
```bash
<tipo>: <descripción corta>

<descripción detallada si es necesaria>
```

### **🏷️ Tipos de Commits**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar pruebas
- `chore:` Tareas de mantenimiento

### **📋 Ejemplos**
```bash
feat: agregar filtro por prioridad en lista de tickets

fix: corregir error de autenticación en middleware JWT

docs: actualizar documentación de API endpoints

refactor: simplificar lógica de asignación de tickets
```

---

## 🎯 **14. Prioridades de Desarrollo**

### **📅 Fase 1 - Base (Semanas 1-2)**
1. **Configuración inicial** - Estructura de carpetas y dependencias
2. **Sistema de autenticación** - Login, JWT, middleware
3. **Modelos de base de datos** - Sequelize, migraciones
4. **Layout básico** - Sidebar, header, routing

### **📅 Fase 2 - Core (Semanas 3-4)**
5. **CRUD Tickets** - Crear, listar, detalle, actualizar
6. **Sistema de estados** - Cambios de estado y asignación
7. **Comentarios** - Agregar y mostrar comentarios
8. **Subida de archivos** - AWS S3 integration

### **📅 Fase 3 - Avanzado (Semanas 5-6)**
9. **WebSockets** - Notificaciones en tiempo real
10. **Gestión de usuarios** - Admin CRUD usuarios
11. **Reportes básicos** - Dashboard con métricas
12. **Temas y configuración** - Modo oscuro, settings

### **📅 Fase 4 - Pulimiento (Semana 7)**
13. **Testing** - Pruebas unitarias básicas
14. **Optimización** - Performance, SEO
15. **Deploy** - Configuración AWS
16. **Documentación final** - README, API docs

---

## 🚫 **15. NUNCA HACER (Prohibiciones Absolutas)**

### **❌ Tecnologías Prohibidas**
- **NO TypeScript** - Solo JSX permitido
- **NO CSS custom** - Solo TailwindCSS
- **NO styled-components** - Solo MUI + Tailwind
- **NO otras librerías de estado** - Solo Context API
- **NO otras librerías de iconos** - Solo React Icons
- **NO emojis en código** - Solo en documentación

### **❌ Malas Prácticas**
- **NO hardcodear valores** - Usar variables de entorno
- **NO omitir validaciones** - Validar en frontend Y backend  
- **NO endpoints sin auth** - Excepto login
- **NO exponer secretos** - JWT secret, DB password, etc.
- **NO console.log en producción** - Usar logger apropiado
- **NO fetch directo** - Usar Axios con interceptores
- **NO SQL injection** - Usar ORM (Sequelize)

### **❌ Estructura y Código**
- **NO archivos gigantes** - Máximo 200 líneas por componente
- **NO funciones enormes** - Máximo 30 líneas
- **NO duplicación de código** - DRY principle
- **NO importaciones absolutas** - Usar rutas relativas apropiadas
- **NO barrel exports complejos** - Solo para índices simples

---

## ✅ **16. SIEMPRE HACER (Obligatorio)**

### **✅ Seguridad**
- **Validar en frontend Y backend** - Doble validación
- **Sanitizar inputs** - Prevenir XSS e inyecciones
- **Usar HTTPS** - En producción siempre
- **Rate limiting** - Proteger contra ataques
- **Logs de seguridad** - Auditoría de accesos

### **✅ Performance**
- **Lazy loading** - Componentes y rutas
- **Paginación** - En todos los listados
- **Debounce** - En búsquedas y filtros
- **Optimización de imágenes** - Compresión y formatos
- **Caché inteligente** - Datos frecuentes

### **✅ UX/UI**
- **Responsive design** - Mobile first
- **Loading states** - Spinners y skeletons
- **Error handling** - Mensajes claros
- **Feedback visual** - Confirmaciones y alertas
- **Accesibilidad** - ARIA labels, keyboard nav

### **✅ Código**
- **Componentes reutilizables** - DRY principle
- **Hooks personalizados** - Lógica compartida
- **Manejo de errores** - Try/catch apropiados
- **Logs detallados** - Para debugging
- **Comentarios útiles** - Solo cuando sea necesario

---

## 🏁 **17. Conclusión**

Este documento es la **fuente única de verdad** para el desarrollo del Sistema de Gestión de Tickets. Cualquier agente de IA que asista en el desarrollo debe seguir estas reglas **estrictamente** para garantizar:

- **Consistencia** en el código y arquitectura
- **Calidad** en la implementación
- **Mantenibilidad** a largo plazo
- **Escalabilidad** para futuras funcionalidades
- **Seguridad** en todos los aspectos

### **📞 En Caso de Dudas**
1. **Consultar este documento** primero
2. **Revisar el código existente** para patrones
3. **Preguntar específicamente** sobre casos no cubiertos
4. **Mantener consistencia** con las reglas establecidas

### **🔄 Actualización del Documento**
Este documento debe actualizarse cuando:
- Se agreguen nuevas tecnologías al stack
- Cambien los requerimientos del proyecto
- Se identifiquen mejores prácticas
- Surjan casos no contemplados

---

**Última actualización**: 2 de Septiembre, 2025  
**Versión**: 1.0  
**Proyecto**: Sistema de Gestión de Tickets - MAC Computadoras
