
<FirstAnswers>
## **Arquitectura y Tecnologías**

1. **Backend**: ¿Ya tienes definida la API REST? ¿Usarás Node.js/Express, Laravel, Spring Boot, o algún otro framework?

    <Respuesta>
        No, usaremos Node.js/Express.
    </Respuesta>

2. **Autenticación**: ¿Implementarás JWT, sessions, OAuth, o algún otro sistema de autenticación?
    <Respuesta>
        Sí, usaremos JWT.
    </Respuesta>
3. **Estado global**: ¿Prefieres Redux, Zustand, Context API, o alguna otra solución para el manejo de estado?
    <Respuesta>
        Podemos utilizar Context API.
    </Respuesta>
4. **Base de datos**: ¿Tienes ya el esquema de MySQL definido o necesitas que lo creemos basándose en las historias de usuario?
    <Respuesta>
        Creemos este en base a historias de usuario y mis respuestas.
    </Respuesta>
## **UI/UX y Componentes**

5. **Librería de componentes**: ¿Quieres usar alguna como Shadcn/ui, Material-UI, Ant Design, o prefieres componentes completamente custom?
    <Respuesta>
        Material-UI es perfecto.
    </Respuesta>
6. **Iconografía**: ¿Tienes preferencia por Lucide, Heroicons, React Icons, o alguna otra librería?
    <Respuesta>
        React Icons.
    </Respuesta>
7. **Tema**: Del mockup veo que manejas tema claro y oscuro. ¿Quieres que sea configurable por el usuario?
    <Respuesta>
        Sí, en settings dentro del dashboard web.
    </Respuesta>
## **Estructura del Proyecto**

8. **Roles de usuario**: Confirmando del PDF - ¿son exactamente 3 roles (Administrador, Técnico, Mesa de Trabajo)?
    <Respuesta>
        Sí, solo existen estos roles.
    </Respuesta>
9. **Rutas protegidas**: ¿Cómo quieres manejar la autorización por roles en las rutas?
    <Respuesta>
        No sé a que te refieres.
    </Respuesta>
10. **Responsive design**: ¿El dashboard debe ser completamente responsive o se enfoca principalmente en desktop?
    <Respuesta>
        Responsive.
    </Respuesta>
## **Funcionalidades Específicas**

11. **Notificaciones**: ¿Planeas usar WebSockets, Server-Sent Events, o polling para las notificaciones en tiempo real?
    <Respuesta>
        WebSockets. O cual sería el mejor?
    </Respuesta>
12. **Subida de archivos**: Para los adjuntos de tickets, ¿tienes preferencia por algún servicio (AWS S3, local storage, etc.)?
    <Respuesta>
        AWS S3.
    </Respuesta>
13. **Reportes**: ¿Los reportes deben exportarse a PDF/Excel o solo visualización web?
    <Respuesta>
        Solo web, podemos ofrecer PDF a futuro.
    </Respuesta>
## **Desarrollo y Deploy**

14. **Estructura de carpetas**: ¿Tienes alguna preferencia específica para la organización del código?
    <Respuesta>
        Folders estructurados.
    </Respuesta>
15. **Testing**: ¿Quieres incluir tests (Jest, Vitest, Cypress)?
    <Respuesta>
        No sé que es esto.
    </Respuesta>
16. **Deploy**: ¿Dónde planeas desplegarlo (Vercel, Netlify, servidor propio)?
    <Respuesta>
        AWS.
    </Respuesta>
</FirstAnswers>
---

<Context>

# Contexto del Proyecto - Sistema de Gestión de Tickets

## **Descripción General**
Sistema integral de gestión de tickets con dos componentes principales:
1. **Aplicación móvil Android nativa** (desarrollo futuro)
2. **Dashboard web administrativo** (desarrollo actual)

## **Stack Tecnológico**

### **Frontend (Dashboard Web)**
- **Framework**: React 18+ con Vite
- **Estilos**: TailwindCSS + Material-UI (MUI)
- **Iconos**: React Icons
- **Estado Global**: Context API
- **Autenticación**: JWT (localStorage)
- **Notificaciones**: WebSockets (Socket.IO client)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de Datos**: MySQL 8.0+
- **ORM**: Sequelize o Prisma
- **Autenticación**: JWT + bcrypt
- **WebSockets**: Socket.IO
- **File Upload**: AWS S3 + Multer
- **Validación**: Joi o Zod

### **Infraestructura**
- **Deploy**: AWS (EC2, S3, RDS)
- **Base de Datos**: AWS RDS MySQL
- **Archivos**: AWS S3
- **Dominio**: Route 53 (opcional)

## **Roles de Usuario**

### **1. Administrador**
- **Acceso**: Solo dashboard web (NO aplicación móvil)
- **Permisos**:
  - Gestión completa de usuarios (crear, editar, eliminar, resetear contraseñas)
  - Configuración de categorías y prioridades
  - Reasignación de tickets
  - Reapertura de tickets cerrados
  - Generación de reportes avanzados
  - Configuraciones del sistema

### **2. Técnico**
- **Acceso**: Dashboard web + aplicación móvil (futuro)
- **Permisos**:
  - Ver bandeja de tickets asignados
  - Aceptar/rechazar tickets
  - Cambiar estados de tickets
  - Agregar notas y comentarios
  - Adjuntar archivos y evidencias
  - Cerrar tickets con descripción de solución

### **3. Mesa de Trabajo**
- **Acceso**: Dashboard web + aplicación móvil (futuro)
- **Permisos**:
  - Crear nuevos tickets
  - Asignar tickets a técnicos
  - Monitorear progreso de tickets
  - Agregar comentarios
  - Cambiar estados básicos de tickets

## **Estructura de Carpetas - Frontend**

```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Botones, inputs, modales
│   ├── layout/          # Sidebar, Header, Footer
│   └── forms/           # Formularios específicos
├── pages/               # Páginas principales
│   ├── auth/           # Login, recuperar contraseña
│   ├── dashboard/      # Dashboard principal por rol
│   ├── tickets/        # Gestión de tickets
│   ├── users/          # Gestión de usuarios (admin)
│   ├── reports/        # Reportes (admin)
│   └── settings/       # Configuraciones
├── contexts/            # Context API providers
├── hooks/              # Custom hooks
├── services/           # APIs y servicios
├── utils/              # Funciones auxiliares
├── constants/          # Constantes y enums
└── assets/             # Imágenes, iconos, etc.
```

## **Estructura de Carpetas - Backend**

```
src/
├── controllers/        # Lógica de controladores
├── models/            # Modelos de base de datos
├── middleware/        # Middlewares (auth, validación)
├── routes/            # Definición de rutas
├── services/          # Lógica de negocio
├── utils/             # Funciones auxiliares
├── config/            # Configuraciones (DB, JWT, AWS)
└── validators/        # Esquemas de validación
```

## **Features Principales**

### **Autenticación y Autorización**
- Login con email/usuario y contraseña
- JWT con refresh tokens
- Protección de rutas por rol
- Middleware de autenticación

### **Gestión de Tickets**
- CRUD completo de tickets
- Estados: Pendiente, En Proceso, Resuelto, Cerrado, Reabierto
- Prioridades: Baja, Media, Alta, Crítica
- Categorías configurables
- Sistema de asignación automática/manual
- Historial completo de cambios

### **Sistema de Notificaciones**
- WebSockets para tiempo real
- Notificaciones por cambios de estado
- Notificaciones de asignación
- Badge de notificaciones no leídas

### **Gestión de Archivos**
- Subida a AWS S3
- Tipos permitidos: imágenes, documentos, videos
- Previsualización de imágenes
- Límite de tamaño por archivo

### **Reportes (Solo Admin)**
- Por fechas, estados, técnicos
- Métricas de volumen y tiempo de resolución
- SLA tracking
- Exportación futura a PDF

### **Temas**
- Modo claro/oscuro
- Configuración en settings
- Persistencia en localStorage

## **Estados de Tickets**

1. **Nuevo** - Recién creado, sin asignar
2. **Asignado** - Asignado a técnico, esperando aceptación
3. **En Proceso** - Técnico trabajando en la solución
4. **Pendiente Cliente** - Esperando respuesta del cliente
5. **Resuelto** - Técnico completó el trabajo
6. **Cerrado** - Ticket finalizado
7. **Reabierto** - Ticket reabierto por administrador

## **Prioridades**

1. **Baja** - Color: Verde (#4CAF50)
2. **Media** - Color: Amarillo (#FF9800)
3. **Alta** - Color: Naranja (#FF5722)
4. **Crítica** - Color: Rojo (#F44336)

## **Integración con Móvil**

- API RESTful compartida
- Endpoints idénticos para web y móvil
- Sincronización en tiempo real
- Push notifications para móvil (futuro)

## **Consideraciones de Seguridad**

- Validación en frontend y backend
- Sanitización de inputs
- Rate limiting en API
- CORS configurado correctamente
- Encriptación de contraseñas con bcrypt
- Tokens JWT con expiración

## **Performance**

- Lazy loading de componentes
- Paginación en listados
- Debounce en búsquedas
- Optimización de imágenes
- Caché de datos frecuentes

## **Responsive Design**

- Mobile first approach
- Breakpoints estándar de TailwindCSS
- Sidebar colapsible en móvil
- Tablas responsive con scroll horizontal
- Touch-friendly en dispositivos móviles

</Context>

<SQL>
-- Esquema de Base de Datos para Sistema de Gestión de Tickets
-- Basado en las Historias de Usuario proporcionadas

-- Tabla de Roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar roles predeterminados
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador del sistema'),
('tecnico', 'Técnico de soporte'),
('mesa_trabajo', 'Mesa de trabajo');

-- Tabla de Usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    avatar_url VARCHAR(255),
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Tabla de Categorías
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280', -- Color hex para UI
    is_active BOOLEAN DEFAULT true,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insertar categorías por defecto
INSERT INTO categories (name, description, color, created_by) VALUES
('Hardware', 'Problemas con equipos físicos', '#EF4444', 1),
('Software', 'Problemas con aplicaciones', '#3B82F6', 1),
('Red', 'Problemas de conectividad', '#10B981', 1),
('Cuenta', 'Problemas con cuentas de usuario', '#F59E0B', 1);

-- Tabla de Prioridades
CREATE TABLE priorities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    level INT NOT NULL UNIQUE, -- 1=Baja, 2=Media, 3=Alta, 4=Crítica
    color VARCHAR(7) NOT NULL,
    sla_hours INT NOT NULL, -- Horas para resolución según SLA
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar prioridades por defecto
INSERT INTO priorities (name, level, color, sla_hours) VALUES
('Baja', 1, '#4CAF50', 72),
('Media', 2, '#FF9800', 24),
('Alta', 3, '#FF5722', 8),
('Crítica', 4, '#F44336', 4);

-- Tabla de Estados de Tickets
CREATE TABLE ticket_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    is_final BOOLEAN DEFAULT false, -- Para estados finales como "Cerrado"
    order_index INT NOT NULL, -- Para ordenar estados en UI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar estados por defecto
INSERT INTO ticket_statuses (name, description, color, is_final, order_index) VALUES
('Nuevo', 'Ticket recién creado', '#6B7280', false, 1),
('Asignado', 'Asignado a técnico', '#3B82F6', false, 2),
('En Proceso', 'Técnico trabajando en la solución', '#F59E0B', false, 3),
('Pendiente Cliente', 'Esperando respuesta del cliente', '#8B5CF6', false, 4),
('Resuelto', 'Trabajo completado por técnico', '#10B981', false, 5),
('Cerrado', 'Ticket finalizado', '#4B5563', true, 6),
('Reabierto', 'Ticket reabierto por administrador', '#EF4444', false, 7);

-- Tabla principal de Tickets
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(20) NOT NULL UNIQUE, -- Formato: #ID-123
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    priority_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 1, -- Nuevo por defecto
    created_by INT NOT NULL, -- Usuario que creó el ticket
    assigned_to INT NULL, -- Técnico asignado
    assigned_by INT NULL, -- Quien lo asignó
    assigned_at TIMESTAMP NULL,
    accepted_at TIMESTAMP NULL, -- Cuando técnico aceptó
    resolved_at TIMESTAMP NULL, -- Cuando se marcó como resuelto
    closed_at TIMESTAMP NULL, -- Cuando se cerró definitivamente
    reopen_reason TEXT NULL, -- Motivo de reapertura
    solution_description TEXT NULL, -- Descripción de la solución
    estimated_hours DECIMAL(5,2) DEFAULT 0,
    actual_hours DECIMAL(5,2) DEFAULT 0,
    client_company VARCHAR(100), -- Empresa del cliente
    client_contact VARCHAR(100), -- Contacto del cliente
    location TEXT, -- Ubicación física si aplica
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (priority_id) REFERENCES priorities(id),
    FOREIGN KEY (status_id) REFERENCES ticket_statuses(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_status (status_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_by (created_by),
    INDEX idx_priority (priority_id),
    INDEX idx_created_at (created_at)
);

-- Tabla de Comentarios/Notas de Tickets
CREATE TABLE ticket_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- true = nota interna, false = visible para cliente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_created_at (created_at)
);

-- Tabla de Archivos Adjuntos
CREATE TABLE ticket_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL, -- Quien subió el archivo
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL, -- Nombre en S3
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    s3_url VARCHAR(500) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    is_image BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_ticket_id (ticket_id)
);

-- Tabla de Historial de Cambios (Trazabilidad)
CREATE TABLE ticket_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    action_type ENUM('created', 'status_changed', 'assigned', 'reassigned', 'commented', 'attachment_added', 'reopened', 'closed') NOT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    description TEXT, -- Descripción legible del cambio
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
);

-- Tabla de Notificaciones
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ticket_id INT NULL,
    type ENUM('ticket_assigned', 'ticket_status_changed', 'ticket_commented', 'ticket_reopened', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP NULL,
    data JSON NULL, -- Datos adicionales en formato JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Tabla de Configuraciones del Sistema
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public BOOLEAN DEFAULT false, -- true = visible en frontend
    updated_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Configuraciones por defecto
INSERT INTO system_settings (setting_key, setting_value, description, setting_type, is_public, updated_by) VALUES
('company_name', 'MAC Computadoras', 'Nombre de la empresa', 'string', true, 1),
('max_file_size', '10485760', 'Tamaño máximo de archivo en bytes (10MB)', 'number', false, 1),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf","doc","docx","txt"]', 'Tipos de archivo permitidos', 'json', false, 1),
('tickets_per_page', '20', 'Tickets por página en listados', 'number', true, 1),
('auto_assign_tickets', 'false', 'Asignación automática de tickets', 'boolean', false, 1);

-- Crear trigger para generar número de ticket automáticamente
DELIMITER //
CREATE TRIGGER generate_ticket_number 
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
    SET NEW.ticket_number = CONCAT('#ID-', LPAD(NEW.id, 3, '0'));
END//
DELIMITER ;

-- Vista para obtener información completa de tickets
CREATE VIEW ticket_details AS
SELECT 
    t.*,
    c.name as category_name,
    c.color as category_color,
    p.name as priority_name,
    p.color as priority_color,
    p.level as priority_level,
    s.name as status_name,
    s.color as status_color,
    creator.username as created_by_username,
    CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
    assignee.username as assigned_to_username,
    CONCAT(assignee.first_name, ' ', assignee.last_name) as assigned_to_name,
    assigner.username as assigned_by_username,
    CONCAT(assigner.first_name, ' ', assigner.last_name) as assigned_by_name
FROM tickets t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN priorities p ON t.priority_id = p.id
LEFT JOIN ticket_statuses s ON t.status_id = s.id
LEFT JOIN users creator ON t.created_by = creator.id
LEFT JOIN users assignee ON t.assigned_to = assignee.id
LEFT JOIN users assigner ON t.assigned_by = assigner.id;

-- Indices adicionales para performance
CREATE INDEX idx_tickets_compound ON tickets(status_id, priority_id, created_at);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_ticket_history_compound ON ticket_history(ticket_id, action_type, created_at);
</SQL>

<Rules>
# Reglas de Desarrollo para Agentes IDE

## **Reglas Generales de Código**

### **Nomenclatura**
- **Variables y funciones**: camelCase (ej: `handleSubmit`, `ticketData`)
- **Componentes React**: PascalCase (ej: `TicketCard`, `UserModal`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_BASE_URL`, `USER_ROLES`)
- **Archivos**: kebab-case para páginas, PascalCase para componentes
- **CSS Classes**: Usar solo TailwindCSS utility classes
- **Database**: snake_case para tablas y columnas

### **Estructura de Archivos**
- Un componente por archivo
- Índices barrel exports en carpetas principales
- Archivos de configuración en `/config`
- Tipos TypeScript en `/types` (si se usa)
- Hooks customizados en `/hooks`

## **Frontend - React + Material-UI + TailwindCSS**

### **Componentes React**
```javascript
// Estructura estándar de componente
import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { FiUser } from 'react-icons/fi';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks primero
  const [state, setState] = useState();
  
  // 2. Funciones de evento
  const handleClick = () => {
    // lógica aquí
  };
  
  // 3. useEffect al final de hooks
  useEffect(() => {
    // efectos aquí
  }, []);

  return (
    <Card className="p-4 shadow-lg rounded-lg">
      <Typography variant="h6">
        {prop1}
      </Typography>
    </Card>
  );
};

export default ComponentName;
```

### **Reglas de Estilo**
- **SIEMPRE usar TailwindCSS** para spacing, colors, sizing
- **SIEMPRE usar Material-UI** para componentes de UI (Button, TextField, Card, etc.)
- **NO crear CSS personalizado** a menos que sea absolutamente necesario
- **Responsive design**: usar clases `sm:`, `md:`, `lg:`, `xl:`
- **Tema oscuro**: usar clases `dark:` cuando sea necesario

### **Gestión de Estado**
```javascript
// Context API - Estructura estándar
const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    tickets,
    setTickets,
    loading,
    setLoading,
    error,
    setError
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within TicketProvider');
  }
  return context;
};
```

### **Manejo de APIs**
```javascript
// services/api.js - Estructura estándar
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **Rutas Protegidas**
```javascript
// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

## **Backend - Node.js + Express + MySQL**

### **Estructura de Controladores**
```javascript
// controllers/ticketController.js
const ticketService = require('../services/ticketService');
const { validationResult } = require('express-validator');

const getTickets = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20, status, assignedTo } = req.query;
    const tickets = await ticketService.getTickets({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      assignedTo,
      userId: req.user.id,
      userRole: req.user.role
    });

    res.json({
      success: true,
      data: tickets,
      message: 'Tickets retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { getTickets };
```

### **Estructura de Middlewares**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
```

### **Respuestas API Estándar**
```javascript
// Respuestas exitosas
{
  "success": true,
  "data": { /* datos */ },
  "message": "Operation completed successfully"
}

// Respuestas con paginación
{
  "success": true,
  "data": {
    "items": [/* array de elementos */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  },
  "message": "Data retrieved successfully"
}

// Respuestas de error
{
  "success": false,
  "message": "Error description",
  "errors": [/* array de errores específicos si aplica */]
}
```

## **Reglas Específicas por Módulo**

### **Autenticación**
- JWT con expiración de 24 horas
- Refresh token con 7 días de duración
- Hash de contraseñas con bcrypt (rounds: 12)
- Rate limiting: 5 intentos por minuto por IP

### **Tickets**
- Número de ticket auto-generado: #ID-001, #ID-002, etc.
- Estados inmutables después de creación (solo admin puede modificar)
- Historial completo de cambios (auditoría)
- Validación de permisos por rol en cada operación

### **Archivos**
- Tamaño máximo: 10MB por archivo
- Tipos permitidos: jpg, jpeg, png, gif, pdf, doc, docx, txt
- Almacenamiento en AWS S3 con nombres únicos (UUID)
- Eliminación automática de archivos huérfanos

# Sistema de Gestión de Tickets - Cursor Rules

## CONTEXTO DEL PROYECTO
Sistema integral de gestión de tickets con dashboard web React y API Node.js/Express.
- **Frontend**: React 18 + Vite + TailwindCSS + Material-UI + Context API
- **Backend**: Node.js + Express + MySQL + Sequelize + JWT + Socket.IO
- **Deploy**: AWS (EC2, RDS, S3)

## ROLES DE USUARIO
1. **admin**: Solo dashboard web - gestión completa del sistema
2. **tecnico**: Dashboard web + móvil futuro - gestión de tickets asignados  
3. **mesa_trabajo**: Dashboard web + móvil futuro - creación y asignación de tickets

## ESTRUCTURA DE CARPETAS

### Frontend (src/)
```
components/
├── common/         # Button, Modal, DataTable, SearchInput, Pagination
├── layout/         # Sidebar, Header, MainLayout, AuthLayout
├── forms/          # TicketForm, UserForm, LoginForm, FileUpload
├── tickets/        # TicketCard, TicketList, TicketFilters, TicketHistory
└── users/          # UserCard, UserList, UserProfile

pages/
├── auth/           # Login, ForgotPassword
├── dashboard/      # Dashboard, AdminDashboard, TechnicianDashboard
├── tickets/        # TicketList, TicketDetail, CreateTicket, MyTickets
├── users/          # UserList, CreateUser, EditUser (solo admin)
├── reports/        # Reports, TicketReports (solo admin)
└── settings/       # Settings, Categories, Priorities, Profile

contexts/           # AuthContext, TicketContext, NotificationContext, ThemeContext
hooks/              # useAuth, useTickets, useSocket, useDebounce
services/           # api.js, authService, ticketService, socketService
utils/              # constants, helpers, validators, permissions
```

### Backend (src/)
```
controllers/        # authController, ticketController, userController
middleware/         # auth.js, roles.js, validation.js, upload.js
models/             # User, Ticket, Comment, Attachment (Sequelize)
routes/             # auth.js, tickets.js, users.js
services/           # authService, ticketService, s3Service
config/             # database.js, jwt.js, aws.js
socket/             # socketHandler, ticketSocket, notificationSocket
```

## REGLAS DE CÓDIGO

### NOMENCLATURA
- **Variables/funciones**: camelCase (`handleSubmit`, `ticketData`)
- **Componentes React**: PascalCase (`TicketCard`, `UserModal`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `USER_ROLES`)
- **Archivos**: kebab-case para páginas, PascalCase para componentes
- **Database**: snake_case (`user_id`, `created_at`)

### COMPONENTES REACT
```javascript
// Estructura estándar obligatoria
import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button } from '@mui/material';
import { FiUser, FiEdit } from 'react-icons/fi';

const ComponentName = ({ prop1, prop2, onAction }) => {
  // 1. Hooks primero
  const [state, setState] = useState();
  
  // 2. Funciones de evento  
  const handleClick = () => {
    // lógica aquí
  };
  
  // 3. useEffect al final
  useEffect(() => {
    // efectos
  }, []);

  return (
    <Card className="p-4 shadow-lg rounded-lg hover:shadow-xl transition-shadow">
      <Typography variant="h6" className="mb-4">
        {prop1}
      </Typography>
      <Button 
        variant="contained" 
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <FiEdit className="mr-2" />
        Acción
      </Button>
    </Card>
  );
};

export default ComponentName;
```

### API SERVICES
```javascript
// services/ticketService.js - Estructura obligatoria
import api from './api';

export const ticketService = {
  getTickets: async (params) => {
    try {
      const response = await api.get('/tickets', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw error;
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }
};
```

### BACKEND CONTROLLERS
```javascript
// controllers/ticketController.js - Estructura obligatoria
const ticketService = require('../services/ticketService');
const { validationResult } = require('express-validator');

const getTickets = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const tickets = await ticketService.getTickets({
      ...req.query,
      userId: req.user.id,
      userRole: req.user.role
    });

    res.json({
      success: true,
      data: tickets,
      message: 'Tickets retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { getTickets };
```

## ESTILOS Y UI

### REGLAS OBLIGATORIAS
- **SIEMPRE usar TailwindCSS** para spacing, colors, sizing
- **SIEMPRE usar Material-UI** para componentes (Button, TextField, Card, etc.)
- **NO crear CSS personalizado** salvo casos excepcionales
- **Responsive**: usar `sm:`, `md:`, `lg:`, `xl:` en todo
- **Tema oscuro**: preparar con `dark:` classes

### COLORES ESTÁNDAR
```javascript
// utils/constants.js
export const COLORS = {
  priority: {
    baja: '#4CAF50',
    media: '#FF9800', 
    alta: '#FF5722',
    critica: '#F44336'
  },
  status: {
    nuevo: '#6B7280',
    asignado: '#3B82F6',
    proceso: '#F59E0B',
    resuelto: '#10B981',
    cerrado: '#4B5563'
  }
};
```

## AUTENTICACIÓN Y PERMISOS

### JWT CONFIGURATION
```javascript
// config/jwt.js
module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: '7d'
};
```

### MIDDLEWARE DE AUTENTICACIÓN
```javascript
// middleware/auth.js - Usar siempre esta estructura
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
```

### MATRIZ DE PERMISOS
```javascript
// utils/permissions.js
export const PERMISSIONS = {
  admin: ['tickets:*', 'users:*', 'reports:*', 'settings:*'],
  tecnico: ['tickets:read', 'tickets:update_own', 'tickets:accept', 'tickets:close'],
  mesa_trabajo: ['tickets:create', 'tickets:read', 'tickets:assign', 'tickets:comment']
};
```

## BASE DE DATOS

### MODELOS SEQUELIZE
```javascript
// models/Ticket.js - Estructura estándar
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ticket_number: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
    // ... más campos
  }, {
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Ticket;
};
```

## WEBSOCKETS

### ESTRUCTURA SOCKET.IO
```javascript
// socket/socketHandler.js
const socketHandler = (io) => {
  io.use(async (socket, next) => {
    // Autenticación JWT en sockets
    const token = socket.handshake.auth.token;
    // validar token...
    next();
  });

  io.on('connection', (socket) => {
    // Usuario se une a su sala personal
    socket.join(`user_${socket.user.id}`);
    socket.join(`role_${socket.user.role}`);

    socket.on('ticket_update', (data) => {
      // Emitir a usuarios relevantes
      io.to(`ticket_${data.ticketId}`).emit('ticket_updated', data);
    });
  });
};
```

## VALIDACIONES

### FRONTEND (React Hook Form + Joi)
```javascript
// forms/TicketForm.jsx
const ticketSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).required(),
  category_id: Joi.number().integer().required(),
  priority_id: Joi.number().integer().required()
});
```

### BACKEND (Express Validator)
```javascript
// validators/ticketValidators.js
const { body } = require('express-validator');

exports.createTicketValidator = [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters')
];
```

## MANEJO DE ERRORES

### FRONTEND
```javascript
// hooks/useErrorHandler.js
export const useErrorHandler = () => {
  const handleError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('No tienes permisos para esta acción');
    } else {
      toast.error(error.response?.data?.message || 'Ha ocurrido un error');
    }
  };
  return { handleError };
};
```

### BACKEND
```javascript
// middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors)
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

## RESPUESTAS API ESTÁNDAR

### RESPUESTAS EXITOSAS
```javascript
// Respuesta simple
{
  "success": true,
  "data": { /* datos */ },
  "message": "Operation completed successfully"
}

// Respuesta con paginación
{
  "success": true,
  "data": {
    "items": [/* array */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  },
  "message": "Data retrieved successfully"
}

// Respuesta de error
{
  "success": false,
  "message": "Error description",
  "errors": [/* array de errores */]
}
```

## VARIABLES DE ENTORNO

### FRONTEND (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
VITE_AWS_REGION=us-east-1
```

### BACKEND (.env)
```
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ticket_system
DB_USER=root
DB_PASSWORD=password
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ticket-attachments
```

## ENDPOINTS PRINCIPALES

- `POST /api/auth/login` - Login
- `GET /api/tickets` - Lista de tickets con filtros
- `POST /api/tickets` - Crear ticket
- `GET /api/tickets/:id` - Detalle de ticket
- `PUT /api/tickets/:id/status` - Cambiar estado
- `POST /api/tickets/:id/comments` - Agregar comentario
- `POST /api/tickets/:id/attachments` - Subir archivo
- `GET /api/users` - Lista usuarios (admin)
- `GET /api/reports/dashboard` - Métricas dashboard (admin)

## REGLAS DE COMMITS
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Documentación
- `refactor:` Refactorización
- `style:` Cambios de formato

## PRIORIDADES DE DESARROLLO
1. **Autenticación** (login, JWT, middleware)
2. **CRUD Tickets** (crear, listar, detalle, estados)
3. **Gestión Usuarios** (solo admin)
4. **Comentarios y Archivos**
5. **Notificaciones WebSocket**
6. **Reportes y Dashboard**
7. **Configuraciones y Temas**

## NUNCA HACER
- ❌ Crear CSS custom sin justificación
- ❌ Usar librerías no autorizadas
- ❌ Hardcodear valores de configuración
- ❌ Omitir validaciones en backend
- ❌ Exponer información sensible en frontend
- ❌ Crear endpoints sin autenticación
- ❌ Usar `any` en TypeScript (si se usa)
- ❌ Usar Emojis

## SIEMPRE HACER
- ✅ Validar en frontend Y backend
- ✅ Manejar errores apropiadamente  
- ✅ Usar interceptores de axios
- ✅ Implementar paginación en listados
- ✅ Logs detallados en backend
- ✅ Responsive design en todo
- ✅ Componentes reutilizables
- ✅ Context API para estado global

</Rules>

<Chat>
¡Perfecto! He leído y entendido completamente el archivo CONTEXT.md. 

## **Resumen del Sistema que Entendí:**

### **📋 Proyecto Principal**
- **Sistema de Gestión de Tickets** con dashboard web React + API Node.js
- **3 Roles definidos**: Administrador, Técnico, Mesa de Trabajo
- **Enfoque actual**: Dashboard web (móvil es desarrollo futuro)

### **🛠 Stack Tecnológico Confirmado**
- **Frontend**: React 18 + Vite + **TailwindCSS** + Material-UI + Context API
- **Backend**: Node.js + Express + MySQL + Sequelize + JWT + Socket.IO  
- **Deploy**: AWS (EC2, RDS, S3)
- **Autenticación**: JWT con refresh tokens
- **Tiempo Real**: WebSockets con Socket.IO
- **Archivos**: AWS S3

### **📁 Estructura de Proyecto Clara**
- Componentes organizados: `common/`, `layout/`, `forms/`, `tickets/`, `users/`, `reports/`
- Páginas por funcionalidad: `auth/`, `dashboard/`, `tickets/`, `users/`, `reports/`, `settings/`
- Context API para estado global
- Services para APIs
- Hooks customizados

### **🎯 Reglas Técnicas Entendidas**
- ✅ **SOLO JSX** (NO TypeScript)
- ✅ **SOLO TailwindCSS** (NO CSS personalizado)
- ✅ Material-UI para componentes UI
- ✅ React Icons para iconografía
- ✅ Responsive design obligatorio
- ✅ Tema claro/oscuro configurable

### **🔐 Sistema de Permisos**
- **Admin**: Gestión completa, solo dashboard web
- **Técnico**: Dashboard + móvil futuro, gestión tickets asignados
- **Mesa de Trabajo**: Dashboard + móvil futuro, crear y asignar tickets

### **📊 Base de Datos MySQL**
- Esquema completo definido con 11 tablas
- Estados de tickets: Nuevo → Asignado → En Proceso → Resuelto → Cerrado
- Prioridades con colores: Baja (Verde), Media (Amarillo), Alta (Naranja), Crítica (Rojo)
</Chat>

<Endpoints>
# Documentación de API Endpoints

## **Base URL**
```
Desarrollo: http://localhost:3001/api
Producción: https://api.ticketsystem.com/api
```

## **Autenticación**
Todos los endpoints (excepto login y register) requieren JWT Bearer token en el header:
```
Authorization: Bearer <jwt_token>
```

---

## **AUTH ENDPOINTS**

### **POST /auth/login**
Iniciar sesión de usuario

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "jdoe",
      "email": "usuario@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "tecnico",
      "avatar_url": null
    },
    "token": "JWT_TOKEN_HERE",
    "refresh_token": "REFRESH_TOKEN_HERE"
  },
  "message": "Login successful"
}
```

### **POST /auth/refresh**
Renovar token de acceso

**Request Body:**
```json
{
  "refresh_token": "REFRESH_TOKEN_HERE"
}
```

### **POST /auth/logout**
Cerrar sesión

**Headers:** Authorization Bearer token requerido

---

## **USER ENDPOINTS**

### **GET /users**
Obtener lista de usuarios (Solo Admin)

**Query Params:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 20, max: 100)
- `role` (opcional): Filtrar por rol (admin, tecnico, mesa_trabajo)
- `search` (opcional): Buscar por nombre o email

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "username": "jdoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "tecnico",
        "is_active": true,
        "last_login": "2024-01-15T10:30:00.000Z",
        "created_at": "2024-01-01T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  },
  "message": "Users retrieved successfully"
}
```

### **POST /users**
Crear nuevo usuario (Solo Admin)

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "Nuevo",
  "last_name": "Usuario",
  "role": "tecnico"
}
```

### **PUT /users/:id**
Actualizar usuario (Admin o propio usuario)

### **DELETE /users/:id**
Eliminar usuario (Solo Admin)

### **POST /users/:id/reset-password**
Resetear contraseña (Solo Admin)

---

## **TICKET ENDPOINTS**

### **GET /tickets**
Obtener lista de tickets

**Query Params:**
- `page` (opcional): Número de página
- `limit` (opcional): Items por página
- `status` (opcional): Filtrar por estado
- `priority` (opcional): Filtrar por prioridad
- `category` (opcional): Filtrar por categoría
- `assigned_to` (opcional): Filtrar por técnico asignado
- `created_by` (opcional): Filtrar por creador
- `search` (opcional): Buscar en título y descripción
- `date_from` (opcional): Fecha desde (YYYY-MM-DD)
- `date_to` (opcional): Fecha hasta (YYYY-MM-DD)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "ticket_number": "#ID-001",
        "title": "Pantalla Rota Dell",
        "description": "La pantalla del monitor Dell presenta líneas verticales",
        "category": {
          "id": 1,
          "name": "Hardware",
          "color": "#EF4444"
        },
        "priority": {
          "id": 3,
          "name": "Alta",
          "color": "#FF5722",
          "level": 3
        },
        "status": {
          "id": 2,
          "name": "Asignado",
          "color": "#3B82F6"
        },
        "created_by": {
          "id": 1,
          "name": "Omar Felipe",
          "username": "ofelipe"
        },
        "assigned_to": {
          "id": 2,
          "name": "Juan Técnico",
          "username": "jtecnico"
        },
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z",
        "comments_count": 3,
        "attachments_count": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  },
  "message": "Tickets retrieved successfully"
}
```

### **GET /tickets/:id**
Obtener detalle completo de ticket

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "ticket_number": "#ID-001",
    "title": "Pantalla Rota Dell",
    "description": "La pantalla del monitor Dell presenta líneas verticales",
    "category": {
      "id": 1,
      "name": "Hardware",
      "color": "#EF4444"
    },
    "priority": {
      "id": 3,
      "name": "Alta",
      "color": "#FF5722",
      "level": 3,
      "sla_hours": 8
    },
    "status": {
      "id": 2,
      "name": "Asignado",
      "color": "#3B82F6"
    },
    "created_by": {
      "id": 1,
      "name": "Omar Felipe",
      "username": "ofelipe",
      "email": "omar@example.com"
    },
    "assigned_to": {
      "id": 2,
      "name": "Juan Técnico",
      "username": "jtecnico"
    },
    "client_company": "ITESM S.A de C.V.",
    "client_contact": "María González",
    "location": "Edificio A, Piso 3",
    "solution_description": null,
    "estimated_hours": 2.5,
    "actual_hours": 0,
    "assigned_at": "2024-01-15T10:30:00.000Z",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "comments": [
      {
        "id": 1,
        "comment": "Esperando confirmación del técnico",
        "is_internal": false,
        "user": {
          "id": 1,
          "name": "Omar Felipe",
          "avatar_url": null
        },
        "created_at": "2024-01-15T10:15:00.000Z"
      }
    ],
    "attachments": [
      {
        "id": 1,
        "original_name": "pantalla_rota.jpg",
        "file_name": "uuid-filename.jpg",
        "file_size": 1024000,
        "file_type": "image/jpeg",
        "s3_url": "https://bucket.s3.amazonaws.com/uuid-filename.jpg",
        "is_image": true,
        "created_at": "2024-01-15T10:10:00.000Z"
      }
    ],
    "history": [
      {
        "id": 1,
        "action_type": "created",
        "description": "Ticket creado",
        "user": {
          "name": "Omar Felipe"
        },
        "created_at": "2024-01-15T10:00:00.000Z"
      },
      {
        "id": 2,
        "action_type": "assigned",
        "description": "Asignado a Juan Técnico",
        "user": {
          "name": "Admin Sistema"
        },
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  },
  "message": "Ticket retrieved successfully"
}
```

### **POST /tickets**
Crear nuevo ticket

**Request Body:**
```json
{
  "title": "Problema con impresora HP",
  "description": "La impresora HP LaserJet no responde a los comandos de impresión",
  "category_id": 1,
  "priority_id": 2,
  "client_company": "ITESM S.A de C.V.",
  "client_contact": "Pedro Martínez",
  "location": "Oficina 205"
}
```

### **PUT /tickets/:id**
Actualizar ticket

### **POST /tickets/:id/assign**
Asignar ticket a técnico

**Request Body:**
```json
{
  "assigned_to": 5,
  "reason": "Técnico especializado en hardware"
}
```

### **POST /tickets/:id/accept**
Aceptar ticket (Solo Técnico asignado)

### **POST /tickets/:id/status**
Cambiar estado de ticket

**Request Body:**
```json
{
  "status_id": 3,
  "reason": "Iniciando trabajo en sitio"
}
```

### **POST /tickets/:id/close**
Cerrar ticket (Solo Técnico)

**Request Body:**
```json
{
  "solution_description": "Se reemplazó el cable de alimentación defectuoso. Problema resuelto.",
  "actual_hours": 1.5
}
```

### **POST /tickets/:id/reopen**
Reabrir ticket cerrado (Solo Admin)

**Request Body:**
```json
{
  "reason": "Cliente reporta que el problema persiste"
}
```

---

## **TICKET COMMENTS ENDPOINTS**

### **POST /tickets/:id/comments**
Agregar comentario a ticket

**Request Body:**
```json
{
  "comment": "He revisado el equipo y confirmo el problema",
  "is_internal": false
}
```

### **GET /tickets/:id/comments**
Obtener comentarios de ticket

---

## **TICKET ATTACHMENTS ENDPOINTS**

### **POST /tickets/:id/attachments**
Subir archivo a ticket

**Request:** Multipart form-data
- `file`: Archivo a subir
- `description` (opcional): Descripción del archivo

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "original_name": "evidencia.jpg",
    "file_name": "uuid-filename.jpg",
    "file_size": 1024000,
    "file_type": "image/jpeg",
    "s3_url": "https://bucket.s3.amazonaws.com/uuid-filename.jpg",
    "is_image": true
  },
  "message": "File uploaded successfully"
}
```

### **DELETE /tickets/:id/attachments/:attachmentId**
Eliminar archivo de ticket

---

## **CATEGORIES ENDPOINTS**

### **GET /categories**
Obtener lista de categorías

### **POST /categories**
Crear nueva categoría (Solo Admin)

**Request Body:**
```json
{
  "name": "Software",
  "description": "Problemas relacionados con aplicaciones",
  "color": "#3B82F6"
}
```

### **PUT /categories/:id**
Actualizar categoría (Solo Admin)

### **DELETE /categories/:id**
Eliminar categoría (Solo Admin)

---

## **PRIORITIES ENDPOINTS**

### **GET /priorities**
Obtener lista de prioridades

### **POST /priorities**
Crear nueva prioridad (Solo Admin)

### **PUT /priorities/:id**
Actualizar prioridad (Solo Admin)

---

## **REPORTS ENDPOINTS**

### **GET /reports/dashboard**
Obtener métricas para dashboard (Solo Admin)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_tickets": 150,
      "open_tickets": 45,
      "closed_tickets": 105,
      "overdue_tickets": 8
    },
    "by_status": [
      { "status": "Nuevo", "count": 12, "color": "#6B7280" },
      { "status": "En Proceso", "count": 25, "color": "#F59E0B" },
      { "status": "Resuelto", "count": 8, "color": "#10B981" }
    ],
    "by_priority": [
      { "priority": "Baja", "count": 60, "color": "#4CAF50" },
      { "priority": "Media", "count": 50, "color": "#FF9800" },
      { "priority": "Alta", "count": 30, "color": "#FF5722" },
      { "priority": "Crítica", "count": 10, "color": "#F44336" }
    ],
    "by_technician": [
      { "technician": "Juan Pérez", "assigned": 15, "completed": 12 },
      { "technician": "María González", "assigned": 20, "completed": 18 }
    ],
    "resolution_times": {
      "average_hours": 18.5,
      "median_hours": 12.0,
      "sla_compliance": 85.2
    }
  },
  "message": "Dashboard metrics retrieved successfully"
}
```

### **GET /reports/tickets**
Reporte detallado de tickets (Solo Admin)

**Query Params:**
- `date_from`: Fecha desde
- `date_to`: Fecha hasta
- `status`: Filtrar por estado
- `technician`: Filtrar por técnico
- `priority`: Filtrar por prioridad
- `category`: Filtrar por categoría

---

## **NOTIFICATIONS ENDPOINTS**

### **GET /notifications**
Obtener notificaciones del usuario

**Query Params:**
- `page` (opcional): Número de página
- `limit` (opcional): Items por página
- `unread_only` (opcional): Solo no leídas (true/false)

### **PUT /notifications/:id/read**
Marcar notificación como leída

### **PUT /notifications/read-all**
Marcar todas las notificaciones como leídas

---

## **WEBSOCKET EVENTS**

### **Client to Server**
- `join_room`: Unirse a sala por rol/usuario
- `ticket_update`: Actualización de ticket
- `typing`: Usuario escribiendo comentario

### **Server to Client**
- `notification`: Nueva notificación
- `ticket_updated`: Ticket actualizado
- `user_assigned`: Usuario asignado a ticket
- `ticket_status_changed`: Estado de ticket cambió

**Ejemplo de evento:**
```javascript
// Cliente
socket.emit('join_room', { userId: 1, role: 'tecnico' });

// Servidor
socket.emit('notification', {
  id: 123,
  type: 'ticket_assigned',
  title: 'Nuevo ticket asignado',
  message: 'Se te ha asignado el ticket #ID-045',
  ticket_id: 45,
  created_at: '2024-01-15T10:30:00.000Z'
});
```

---

## **ERROR CODES**

### **Authentication (401)**
```json
{
  "success": false,
  "message": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

### **Authorization (403)**
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

### **Validation (400)**
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### **Not Found (404)**
```json
{
  "success": false,
  "message": "Ticket not found",
  "code": "TICKET_NOT_FOUND"
}
```

### **Server Error (500)**
```json
{
  "success": false,
  "message": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```
</Endpoints>

<Structure>
ticket-system/
├── frontend/                           # React Dashboard Web
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/                 # Componentes reutilizables
│   │   │   ├── common/                # Componentes base
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── Modal/
│   │   │   │   │   ├── Modal.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── LoadingSpinner/
│   │   │   │   ├── Toast/
│   │   │   │   ├── ConfirmDialog/
│   │   │   │   ├── DataTable/
│   │   │   │   ├── SearchInput/
│   │   │   │   ├── Pagination/
│   │   │   │   └── index.js           # Barrel exports
│   │   │   ├── layout/                # Componentes de layout
│   │   │   │   ├── Sidebar/
│   │   │   │   │   ├── Sidebar.jsx
│   │   │   │   │   ├── SidebarItem.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   ├── UserMenu.jsx
│   │   │   │   │   ├── NotificationBell.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── MainLayout/
│   │   │   │   ├── AuthLayout/
│   │   │   │   └── index.js
│   │   │   ├── forms/                 # Formularios específicos
│   │   │   │   ├── TicketForm/
│   │   │   │   │   ├── TicketForm.jsx
│   │   │   │   │   ├── TicketFormValidation.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── UserForm/
│   │   │   │   ├── LoginForm/
│   │   │   │   ├── CommentForm/
│   │   │   │   ├── FileUpload/
│   │   │   │   └── index.js
│   │   │   ├── tickets/               # Componentes específicos de tickets
│   │   │   │   ├── TicketCard/
│   │   │   │   │   ├── TicketCard.jsx
│   │   │   │   │   ├── TicketStatus.jsx
│   │   │   │   │   ├── TicketPriority.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── TicketList/
│   │   │   │   ├── TicketFilters/
│   │   │   │   ├── TicketHistory/
│   │   │   │   ├── TicketComments/
│   │   │   │   ├── TicketAttachments/
│   │   │   │   └── index.js
│   │   │   ├── users/                 # Componentes de usuarios
│   │   │   │   ├── UserCard/
│   │   │   │   ├── UserList/
│   │   │   │   ├── UserProfile/
│   │   │   │   └── index.js
│   │   │   ├── reports/               # Componentes de reportes
│   │   │   │   ├── DashboardChart/
│   │   │   │   ├── MetricsCard/
│   │   │   │   ├── ReportFilters/
│   │   │   │   └── index.js
│   │   │   └── index.js               # Barrel export principal
│   │   ├── pages/                     # Páginas principales
│   │   │   ├── auth/                  # Páginas de autenticación
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── index.js
│   │   │   ├── dashboard/             # Dashboard principal
│   │   │   │   ├── Dashboard.jsx      # Dashboard general
│   │   │   │   ├── AdminDashboard.jsx # Dashboard específico admin
│   │   │   │   ├── TechnicianDashboard.jsx
│   │   │   │   ├── WorkdeskDashboard.jsx
│   │   │   │   └── index.js
│   │   │   ├── tickets/               # Páginas de tickets
│   │   │   │   ├── TicketList.jsx     # Lista de tickets
│   │   │   │   ├── TicketDetail.jsx   # Detalle de ticket
│   │   │   │   ├── CreateTicket.jsx   # Crear ticket
│   │   │   │   ├── EditTicket.jsx     # Editar ticket
│   │   │   │   ├── MyTickets.jsx      # Mis tickets (técnico)
│   │   │   │   └── index.js
│   │   │   ├── users/                 # Páginas de usuarios (solo admin)
│   │   │   │   ├── UserList.jsx
│   │   │   │   ├── CreateUser.jsx
│   │   │   │   ├── EditUser.jsx
│   │   │   │   ├── UserProfile.jsx
│   │   │   │   └── index.js
│   │   │   ├── reports/               # Páginas de reportes (solo admin)
│   │   │   │   ├── Reports.jsx
│   │   │   │   ├── TicketReports.jsx
│   │   │   │   ├── UserReports.jsx
│   │   │   │   ├── PerformanceReports.jsx
│   │   │   │   └── index.js
│   │   │   ├── settings/              # Configuraciones
│   │   │   │   ├── Settings.jsx
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── Priorities.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── index.js
│   │   │   ├── NotFound.jsx           # Página 404
│   │   │   ├── Unauthorized.jsx       # Página 403
│   │   │   └── index.js
│   │   ├── contexts/                  # Context API providers
│   │   │   ├── AuthContext.jsx        # Contexto de autenticación
│   │   │   ├── TicketContext.jsx      # Contexto de tickets
│   │   │   ├── NotificationContext.jsx # Contexto de notificaciones
│   │   │   ├── ThemeContext.jsx       # Contexto de tema claro/oscuro
│   │   │   └── index.js
│   │   ├── hooks/                     # Custom hooks
│   │   │   ├── useAuth.js             # Hook de autenticación
│   │   │   ├── useTickets.js          # Hook de tickets
│   │   │   ├── useNotifications.js    # Hook de notificaciones
│   │   │   ├── useSocket.js           # Hook de WebSocket
│   │   │   ├── useDebounce.js         # Hook de debounce
│   │   │   ├── useLocalStorage.js     # Hook de localStorage
│   │   │   ├── usePagination.js       # Hook de paginación
│   │   │   ├── useErrorHandler.js     # Hook de manejo de errores
│   │   │   └── index.js
│   │   ├── services/                  # APIs y servicios
│   │   │   ├── api.js                 # Configuración axios base
│   │   │   ├── authService.js         # Servicios de autenticación
│   │   │   ├── ticketService.js       # Servicios de tickets
│   │   │   ├── userService.js         # Servicios de usuarios
│   │   │   ├── reportService.js       # Servicios de reportes
│   │   │   ├── uploadService.js       # Servicios de archivos
│   │   │   ├── socketService.js       # Servicios de WebSocket
│   │   │   └── index.js
│   │   ├── utils/                     # Funciones auxiliares
│   │   │   ├── constants.js           # Constantes de la aplicación
│   │   │   ├── helpers.js             # Funciones helper generales
│   │   │   ├── validators.js          # Validaciones frontend
│   │   │   ├── formatters.js          # Formateo de datos
│   │   │   ├── permissions.js         # Lógica de permisos
│   │   │   ├── storage.js             # Helpers de localStorage
│   │   │   └── index.js
│   │   ├── constants/                 # Constantes y enums
│   │   │   ├── roles.js               # Roles de usuario
│   │   │   ├── ticketStatus.js        # Estados de tickets
│   │   │   ├── priorities.js          # Prioridades
│   │   │   ├── routes.js              # Rutas de la aplicación
│   │   │   └── index.js
│   │   ├── assets/                    # Recursos estáticos
│   │   │   ├── images/
│   │   │   │   ├── logo.svg
│   │   │   │   ├── logo-dark.svg
│   │   │   │   ├── avatar-placeholder.png
│   │   │   │   └── no-data.svg
│   │   │   ├── icons/                 # Iconos personalizados si es necesario
│   │   │   └── styles/
│   │   │       └── globals.css        # Estilos globales
│   │   ├── App.jsx                    # Componente principal
│   │   ├── main.jsx                   # Punto de entrada
│   │   └── index.css                  # Estilos base con Tailwind
│   ├── .env                           # Variables de entorno
│   ├── .env.example                   # Ejemplo de variables
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js                 # Configuración de Vite
│   ├── tailwind.config.js             # Configuración de Tailwind
│   ├── postcss.config.js              # Configuración de PostCSS
│   └── README.md
├── backend/                           # API Node.js/Express
│   ├── src/
│   │   ├── controllers/               # Controladores de rutas
│   │   │   ├── authController.js      # Login, logout, refresh
│   │   │   ├── userController.js      # CRUD usuarios
│   │   │   ├── ticketController.js    # CRUD tickets
│   │   │   ├── commentController.js   # Comentarios de tickets
│   │   │   ├── attachmentController.js # Archivos adjuntos
│   │   │   ├── categoryController.js  # Categorías
│   │   │   ├── priorityController.js  # Prioridades
│   │   │   ├── reportController.js    # Reportes
│   │   │   ├── notificationController.js # Notificaciones
│   │   │   └── index.js
│   │   ├── middleware/                # Middlewares
│   │   │   ├── auth.js                # Autenticación JWT
│   │   │   ├── roles.js               # Autorización por roles
│   │   │   ├── validation.js          # Validación de datos
│   │   │   ├── upload.js              # Manejo de archivos
│   │   │   ├── rateLimiter.js         # Rate limiting
│   │   │   ├── errorHandler.js        # Manejo de errores
│   │   │   ├── logger.js              # Logging de requests
│   │   │   └── index.js
│   │   ├── models/                    # Modelos de base de datos
│   │   │   ├── User.js                # Modelo de usuario
│   │   │   ├── Ticket.js              # Modelo de ticket
│   │   │   ├── Comment.js             # Modelo de comentarios
│   │   │   ├── Attachment.js          # Modelo de archivos
│   │   │   ├── Category.js            # Modelo de categorías
│   │   │   ├── Priority.js            # Modelo de prioridades
│   │   │   ├── TicketStatus.js        # Modelo de estados
│   │   │   ├── TicketHistory.js       # Modelo de historial
│   │   │   ├── Notification.js        # Modelo de notificaciones
│   │   │   ├── SystemSetting.js       # Modelo de configuraciones
│   │   │   └── index.js               # Asociaciones de modelos
│   │   ├── routes/                    # Definición de rutas
│   │   │   ├── auth.js                # Rutas de autenticación
│   │   │   ├── users.js               # Rutas de usuarios
│   │   │   ├── tickets.js             # Rutas de tickets
│   │   │   ├── comments.js            # Rutas de comentarios
│   │   │   ├── attachments.js         # Rutas de archivos
│   │   │   ├── categories.js          # Rutas de categorías
│   │   │   ├── priorities.js          # Rutas de prioridades
│   │   │   ├── reports.js             # Rutas de reportes
│   │   │   ├── notifications.js       # Rutas de notificaciones
│   │   │   └── index.js               # Router principal
│   │   ├── services/                  # Lógica de negocio
│   │   │   ├── authService.js         # Lógica de autenticación
│   │   │   ├── userService.js         # Lógica de usuarios
│   │   │   ├── ticketService.js       # Lógica de tickets
│   │   │   ├── commentService.js      # Lógica de comentarios
│   │   │   ├── attachmentService.js   # Lógica de archivos
│   │   │   ├── reportService.js       # Lógica de reportes
│   │   │   ├── notificationService.js # Lógica de notificaciones
│   │   │   ├── emailService.js        # Envío de emails
│   │   │   ├── s3Service.js           # Servicio de AWS S3
│   │   │   └── index.js
│   │   ├── utils/                     # Funciones auxiliares
│   │   │   ├── constants.js           # Constantes del backend
│   │   │   ├── helpers.js             # Funciones helper
│   │   │   ├── logger.js              # Configuración de logs
│   │   │   ├── response.js            # Helpers de respuesta HTTP
│   │   │   ├── encryption.js          # Funciones de encriptación
│   │   │   └── index.js
│   │   ├── validators/                # Esquemas de validación
│   │   │   ├── authValidators.js      # Validaciones de auth
│   │   │   ├── userValidators.js      # Validaciones de usuarios
│   │   │   ├── ticketValidators.js    # Validaciones de tickets
│   │   │   ├── commentValidators.js   # Validaciones de comentarios
│   │   │   └── index.js
│   │   ├── config/                    # Configuraciones
│   │   │   ├── database.js            # Configuración de MySQL
│   │   │   ├── jwt.js                 # Configuración de JWT
│   │   │   ├── aws.js                 # Configuración de AWS
│   │   │   ├── socket.js              # Configuración de Socket.IO
│   │   │   ├── multer.js              # Configuración de Multer
│   │   │   └── index.js
│   │   ├── socket/                    # WebSocket handlers
│   │   │   ├── socketHandler.js       # Handler principal
│   │   │   ├── ticketSocket.js        # Events de tickets
│   │   │   ├── notificationSocket.js  # Events de notificaciones
│   │   │   └── index.js
│   │   ├── database/                  # Migraciones y seeders
│   │   │   ├── migrations/            # Archivos de migración
│   │   │   │   ├── 001_create_users.sql
│   │   │   │   ├── 002_create_roles.sql
│   │   │   │   ├── 003_create_categories.sql
│   │   │   │   ├── 004_create_priorities.sql
│   │   │   │   ├── 005_create_ticket_statuses.sql
│   │   │   │   ├── 006_create_tickets.sql
│   │   │   │   ├── 007_create_comments.sql
│   │   │   │   ├── 008_create_attachments.sql
│   │   │   │   ├── 009_create_history.sql
│   │   │   │   ├── 010_create_notifications.sql
│   │   │   │   └── 011_create_settings.sql
│   │   │   ├── seeders/               # Datos iniciales
│   │   │   │   ├── 001_roles.sql
│   │   │   │   ├── 002_admin_user.sql
│   │   │   │   ├── 003_categories.sql
│   │   │   │   ├── 004_priorities.sql
│   │   │   │   ├── 005_statuses.sql
│   │   │   │   └── 006_settings.sql
│   │   │   └── schema.sql             # Esquema completo
│   │   ├── tests/                     # Tests (futuro)
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── fixtures/
│   │   ├── app.js                     # Configuración de Express
│   │   └── server.js                  # Punto de entrada del servidor
│   ├── .env                           # Variables de entorno
│   ├── .env.example                   # Ejemplo de variables
│   ├── .gitignore
│   ├── package.json
│   ├── nodemon.json                   # Configuración de Nodemon
│   └── README.md
├── mobile/                            # Aplicación Android (futuro)
│   └── README.md                      # Placeholder para desarrollo futuro
├── docs/                              # Documentación del proyecto
│   ├── api/                           # Documentación de API
│   │   ├── endpoints.md
│   │   ├── authentication.md
│   │   └── websockets.md
│   ├── database/                      # Documentación de BD
│   │   ├── schema.md
│   │   ├── migrations.md
│   │   └── backup-restore.md
│   ├── deployment/                    # Documentación de deploy
│   │   ├── aws-setup.md
│   │   ├── environment-setup.md
│   │   └── ssl-certificate.md
│   ├── user-stories/                  # Historias de usuario
│   │   └── historias-usuario.pdf
│   ├── design/                        # Documentos de diseño
│   │   ├── wireframes/
│   │   ├── mockups/
│   │   └── user-flow.md
│   └── README.md                      # Documentación principal
├── scripts/                           # Scripts de utilidad
│   ├── deploy/                        # Scripts de deploy
│   │   ├── deploy-frontend.sh
│   │   ├── deploy-backend.sh
│   │   └── deploy-database.sh
│   ├── database/                      # Scripts de BD
│   │   ├── migrate.js
│   │   ├── seed.js
│   │   ├── backup.sh
│   │   └── restore.sh
│   ├── setup/                         # Scripts de configuración inicial
│   │   ├── setup-development.sh
│   │   ├── setup-production.sh
│   │   └── install-dependencies.sh
│   └── utils/                         # Scripts de utilidad
│       ├── generate-jwt-secret.js
│       ├── create-admin.js
│       └── cleanup-files.js
├── .gitignore                         # Git ignore global
├── .gitattributes                     # Git attributes
├── docker-compose.yml                 # Docker para desarrollo
├── docker-compose.prod.yml            # Docker para producción
├── Dockerfile.frontend                # Docker frontend
├── Dockerfile.backend                 # Docker backend
├── LICENSE                            # Licencia del proyecto
└── README.md                          # README principal del proyecto
</Structure>
