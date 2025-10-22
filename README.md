# 🎫 MAC Tickets System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Kotlin](https://img.shields.io/badge/Kotlin-1.9+-7F52FF?logo=kotlin)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql)
![AWS](https://img.shields.io/badge/AWS-Deployed-FF9900?logo=amazon-aws)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Sistema integral de gestión de tickets de soporte técnico para MAC Computadoras**

[Características](#-características-principales) •
[Tecnologías](#-stack-tecnológico) •
[Instalación](#-instalación) •
[Documentación](#-documentación) •
[Demo](#-demo)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Deployment en AWS](#-deployment-en-aws)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Documentación](#-documentación)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🎯 Descripción General

**MAC Tickets System** es una solución completa de gestión de tickets de soporte técnico diseñada específicamente para **MAC Computadoras**. El sistema permite a técnicos y usuarios gestionar eficientemente solicitudes de soporte, desde su creación hasta su resolución, con seguimiento en tiempo real y reportes detallados.

### **Componentes del Sistema:**

#### 🖥️ **Dashboard Web (React)**
Panel administrativo completo para gestión de tickets, usuarios, reportes y configuraciones. Accesible desde cualquier navegador web.

#### 📱 **Aplicación Android (Kotlin)**
App móvil nativa para técnicos de campo que permite:
- Ver tickets asignados
- Actualizar estado en tiempo real
- Agregar comentarios y fotos
- Registrar resolución con firma digital
- Funcionamiento offline con sincronización automática

---

## ✨ Características Principales

### 🎫 **Gestión de Tickets**
- ✅ Crear, editar y eliminar tickets
- ✅ Asignación automática y manual de técnicos
- ✅ 7 estados de tickets (Nuevo, Asignado, En Proceso, etc.)
- ✅ 4 niveles de prioridad con SLA
- ✅ Historial completo de cambios
- ✅ Comentarios internos y públicos
- ✅ Archivos adjuntos (imágenes, documentos)
- ✅ Búsqueda y filtros avanzados

### 👥 **Gestión de Usuarios**
- ✅ 3 roles definidos: Administrador, Técnico, Mesa de Trabajo
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Autenticación JWT segura
- ✅ Gestión de contraseñas y recuperación
- ✅ Registro de actividad de usuarios

### 📊 **Reportes y Estadísticas**
- ✅ Dashboard con métricas en tiempo real
- ✅ Tickets por estado, prioridad y categoría
- ✅ Rendimiento de técnicos
- ✅ Tiempo promedio de resolución
- ✅ Exportación a Excel
- ✅ Generación de PDFs con firma digital

### 🔔 **Notificaciones en Tiempo Real**
- ✅ WebSockets para actualizaciones instantáneas
- ✅ Notificaciones push en Android
- ✅ Alertas de SLA y tickets pendientes
- ✅ Indicadores de "usuario escribiendo"

### 🎨 **Interfaz de Usuario**
- ✅ Diseño moderno y responsivo
- ✅ Tema claro y oscuro
- ✅ Material Design (MUI + Tailwind CSS)
- ✅ Optimizado para móviles, tablets y escritorio

### 🔒 **Seguridad**
- ✅ Autenticación JWT con refresh tokens
- ✅ Rate limiting en endpoints
- ✅ Validación doble (frontend + backend)
- ✅ Sanitización de inputs
- ✅ CORS configurado
- ✅ Bcrypt para contraseñas (12 rounds)

---

## 🛠️ Stack Tecnológico

### 📱 **Frontend - Dashboard Web**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18+ | Framework principal |
| **Vite** | 5+ | Build tool y dev server |
| **TailwindCSS** | 3+ | Utilidades CSS |
| **Material-UI (MUI)** | 5+ | Componentes UI |
| **React Router** | 6+ | Routing |
| **Axios** | 1+ | HTTP client |
| **Socket.IO Client** | 4+ | WebSockets |
| **React Icons** | 4+ | Iconos |
| **jsPDF** | 2+ | Generación de PDFs |

### 📱 **Android - Aplicación Móvil**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Kotlin** | 1.9+ | Lenguaje principal |
| **Jetpack Compose** | 1.5+ | UI declarativa |
| **Coroutines** | 1.7+ | Asincronía |
| **Room** | 2.6+ | Base de datos local |
| **Retrofit** | 2.9+ | HTTP client |
| **Hilt** | 2.48+ | Inyección de dependencias |
| **Coil** | 2.5+ | Carga de imágenes |
| **DataStore** | 1.0+ | Almacenamiento local |

### ⚙️ **Backend - API REST**

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4+ | Framework web |
| **MySQL** | 8.0+ | Base de datos |
| **Sequelize** | 6+ | ORM |
| **JWT** | 9+ | Autenticación |
| **Bcrypt** | 5+ | Hash de contraseñas |
| **Multer** | 1+ | Upload de archivos |
| **Socket.IO** | 4+ | WebSockets |
| **Joi** | 17+ | Validación |

### ☁️ **Infraestructura - AWS**

| Servicio | Propósito |
|----------|-----------|
| **EC2 / Elastic Beanstalk** | Hosting del backend |
| **RDS MySQL** | Base de datos en producción |
| **S3** | Almacenamiento de archivos (opcional) |
| **Route 53** | DNS y dominio (opcional) |
| **CloudWatch** | Logs y monitoreo |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
├──────────────────────────┬──────────────────────────────────┤
│   Dashboard Web (React)  │  App Android (Kotlin)            │
│   - Admin                │  - Técnicos                       │
│   - Técnicos             │  - Mesa de Trabajo                │
│   - Mesa de Trabajo      │  - Modo Offline                   │
└──────────────┬───────────┴──────────────┬───────────────────┘
               │                          │
               │    HTTPS/REST API        │
               │    WebSockets            │
               │                          │
┌──────────────▼──────────────────────────▼───────────────────┐
│              CAPA DE LÓGICA DE NEGOCIO (Backend)            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  API REST (Express.js + Node.js)                    │    │
│  │  - Controladores                                    │    │
│  │  - Servicios                                        │    │
│  │  - Middleware (Auth, Validación, CORS)             │    │
│  │  - WebSocket Handler (Socket.IO)                   │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Sequelize ORM
               │
┌──────────────▼──────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  MySQL (RDS)   │  │  S3 (Archivos) │  │  Local Cache │  │
│  │  - Tickets     │  │  - Imágenes    │  │  - Android   │  │
│  │  - Usuarios    │  │  - PDFs        │  │  - Room DB   │  │
│  │  - Categorías  │  │  - Adjuntos    │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Flujo de Datos:**

1. **Usuario** crea ticket desde Web o Android
2. **Frontend** envía request a **Backend** (REST API)
3. **Backend** valida datos y autentica usuario
4. **Backend** guarda en **MySQL** y archivos en **S3**
5. **Backend** emite evento por **WebSocket**
6. **Todos los clientes conectados** reciben actualización
7. **Android** sincroniza con servidor cuando hay conexión

---

## 📁 Estructura del Proyecto

```
MacApiFront/
├── MAC/
│   ├── mac-tickets-api/          # Backend Node.js/Express
│   │   ├── src/
│   │   │   ├── controllers/      # Request handlers
│   │   │   ├── services/         # Lógica de negocio
│   │   │   ├── models/           # Modelos Sequelize
│   │   │   ├── routes/           # Rutas API
│   │   │   ├── middleware/       # Auth, validación
│   │   │   ├── config/           # Configuraciones
│   │   │   └── utils/            # Helpers
│   │   ├── uploads/              # Archivos subidos
│   │   ├── package.json
│   │   └── .env
│   │
│   └── mac-tickets-front/        # Dashboard Web React
│       ├── src/
│       │   ├── components/       # Componentes React
│       │   ├── pages/            # Páginas
│       │   ├── contexts/         # Context API
│       │   ├── hooks/            # Custom hooks
│       │   ├── services/         # API services
│       │   └── utils/            # Utilidades
│       ├── public/
│       ├── package.json
│       └── .env
│
├── Android/
│   └── Mac_Android/              # App Android Kotlin
│       ├── app/
│       │   └── src/
│       │       └── main/
│       │           ├── java/mx/mac/tickets/
│       │           │   ├── data/         # Repositorios y Room
│       │           │   ├── domain/       # Casos de uso
│       │           │   ├── presentation/ # UI Compose
│       │           │   └── di/           # Hilt modules
│       │           └── res/              # Recursos
│       └── build.gradle.kts
│
├── Docs/                         # Documentación completa
│   ├── AWS-Deployment/           # Guías de deployment
│   ├── Schemas/                  # SQL schemas y seed data
│   ├── ENDPOINTS-REFERENCE.md    # API endpoints
│   ├── DEVELOPMENT-RULES.md      # Reglas de desarrollo
│   └── ...
│
└── README.md                     # Este archivo
```

---

## 🚀 Instalación y Configuración

### **📋 Prerequisitos**

- **Node.js** 18+ y npm
- **MySQL** 8.0+
- **Android Studio** (para la app móvil)
- **Git**
- Cuenta de AWS (para producción)

### **1️⃣ Clonar el Repositorio**

```bash
git clone https://github.com/tu-usuario/MacApiFront.git
cd MacApiFront
```

### **2️⃣ Configurar Backend**

```bash
cd MAC/mac-tickets-api

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

**Configuración `.env` mínima:**
```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_NAME=macTickets
DB_USER=root
DB_PASSWORD=tu_password

JWT_SECRET=tu_secret_super_seguro_aqui
JWT_REFRESH_SECRET=otro_secret_diferente
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:5173
```

**Crear base de datos:**
```bash
mysql -u root -p

CREATE DATABASE macTickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Ejecutar schema
mysql -u root -p macTickets < ../Docs/Schemas/FULL-SCHEMA-AWS.sql

# Insertar datos iniciales
mysql -u root -p macTickets < ../Docs/Schemas/SEED-DATA-AWS.sql
```

**Iniciar backend:**
```bash
npm run dev
```

Backend corriendo en: `http://localhost:3001`

### **3️⃣ Configurar Frontend (Dashboard Web)**

```bash
cd ../mac-tickets-front

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env
nano .env
```

**Configuración `.env`:**
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

**Iniciar frontend:**
```bash
npm run dev
```

Frontend corriendo en: `http://localhost:5173`

### **4️⃣ Configurar Android**

```bash
cd ../../Android/Mac_Android
```

**En Android Studio:**

1. Abrir el proyecto `Mac_Android`
2. Sync Gradle
3. Editar `local.properties`:
   ```properties
   API_BASE_URL=http://10.0.2.2:3001/api
   # 10.0.2.2 es localhost en emulador Android
   ```
4. Build > Make Project
5. Run > Run 'app'

---

## ☁️ Deployment en AWS

### **🚀 Guía Completa de Deployment**

Consulta la documentación detallada en:
- [`Docs/AWS-Deployment/README.md`](Docs/AWS-Deployment/README.md) - Guía principal
- [`Docs/AWS-Deployment/START-HERE.md`](Docs/AWS-Deployment/START-HERE.md) - Inicio rápido
- [`Docs/AWS-ENV-PRODUCTION.md`](Docs/AWS-ENV-PRODUCTION.md) - Variables de entorno

### **📝 Resumen de Pasos:**

#### **Backend en Elastic Beanstalk**

```bash
cd MAC/mac-tickets-api

# Inicializar EB
eb init -p node.js-18 mac-tickets-api-prod --region us-east-1

# Crear entorno
eb create mac-tickets-api-prod-env

# Configurar variables de entorno
eb setenv \
  DB_HOST=tu-rds-endpoint.rds.amazonaws.com \
  DB_NAME=macTickets \
  DB_USER=admin \
  DB_PASSWORD=tu_password \
  JWT_SECRET=tu_secret \
  NODE_ENV=production

# Deploy
eb deploy
```

#### **Base de Datos RDS**

```bash
# Conectar a RDS
mysql -h tu-rds-endpoint.rds.amazonaws.com -u admin -p

# Ejecutar schema
source /ruta/a/FULL-SCHEMA-AWS.sql

# Insertar datos iniciales
source /ruta/a/SEED-DATA-AWS.sql
```

#### **Frontend en S3 + CloudFront (Opcional)**

```bash
cd ../../mac-tickets-front

# Build de producción
npm run build

# Subir a S3
aws s3 sync dist/ s3://tu-bucket-frontend --delete
```

---

## 🔑 Credenciales de Prueba

### **🔐 Usuarios del Sistema**

| Rol | Username | Password | Email |
|-----|----------|----------|-------|
| **Administrador** | `admin` | `Admin123` | admin@maccomputadoras.com |
| **Técnico 1** | `jtecnico` | `Tecnico123` | jtecnico@maccomputadoras.com |
| **Técnico 2** | `mtecnico` | `Tecnico123` | mtecnico@maccomputadoras.com |
| **Técnico 3** | `ctecnico` | `Tecnico123` | ctecnico@maccomputadoras.com |
| **Mesa de Trabajo 1** | `lperez` | `Usuario123` | lperez@maccomputadoras.com |
| **Mesa de Trabajo 2** | `agomez` | `Usuario123` | agomez@maccomputadoras.com |

### **📊 Datos de Prueba**

El sistema incluye:
- ✅ 7 Categorías (Hardware, Software, Red, Cuenta, Periféricos, Sistema, Otro)
- ✅ 4 Prioridades (Baja, Media, Alta, Crítica)
- ✅ 7 Estados de tickets
- ✅ 3 Roles (Administrador, Técnico, Mesa de Trabajo)
- ✅ 6 Usuarios de prueba

---

## 📚 Documentación

### **📖 Documentación Completa**

| Documento | Descripción |
|-----------|-------------|
| [`DEVELOPMENT-RULES.md`](Docs/DEVELOPMENT-RULES.md) | Guía definitiva de reglas de desarrollo |
| [`ENDPOINTS-REFERENCE.md`](Docs/ENDPOINTS-REFERENCE.md) | Referencia completa de API endpoints |
| [`AWS-Deployment/`](Docs/AWS-Deployment/) | Guías de deployment en AWS |
| [`Schemas/`](Docs/Schemas/) | Schemas SQL y seed data |
| [`API-Gateway-Endpoints.json`](Docs/API-Gateway-Endpoints.json) | Especificación OpenAPI |

### **🔗 Endpoints Principales**

**Base URL (Producción):** `http://macticketsv.us-east-1.elasticbeanstalk.com/api`  
**Base URL (Local):** `http://localhost:3001/api`

#### **Autenticación**
```
POST   /api/auth/login       # Login
POST   /api/auth/refresh     # Renovar token
POST   /api/auth/logout      # Logout
```

#### **Tickets**
```
GET    /api/tickets          # Lista de tickets
POST   /api/tickets          # Crear ticket
GET    /api/tickets/:id      # Detalle de ticket
PUT    /api/tickets/:id      # Actualizar ticket
POST   /api/tickets/:id/assign    # Asignar técnico
POST   /api/tickets/:id/resolve   # Resolver ticket
POST   /api/tickets/:id/close     # Cerrar ticket
```

#### **Usuarios (Admin)**
```
GET    /api/users            # Lista de usuarios
POST   /api/users            # Crear usuario
PUT    /api/users/:id        # Actualizar usuario
DELETE /api/users/:id        # Eliminar usuario
```

#### **Catálogos**
```
GET    /api/catalog/categories      # Categorías
GET    /api/catalog/priorities      # Prioridades
GET    /api/catalog/ticket-statuses # Estados
GET    /api/catalog/technicians     # Técnicos disponibles
```

#### **Reportes**
```
GET    /api/reports/dashboard # Métricas del dashboard
GET    /api/reports/export    # Exportar a Excel
```

Ver documentación completa: [`ENDPOINTS-REFERENCE.md`](Docs/ENDPOINTS-REFERENCE.md)

---

## 📸 Capturas de Pantalla

### **🖥️ Dashboard Web**

#### Login
![Login](docs/screenshots/login.png)

#### Dashboard Principal
![Dashboard](docs/screenshots/dashboard.png)

#### Lista de Tickets
![Tickets](docs/screenshots/tickets-list.png)

#### Detalle de Ticket
![Ticket Detail](docs/screenshots/ticket-detail.png)

#### Crear Ticket
![Create Ticket](docs/screenshots/create-ticket.png)

#### Gestión de Usuarios
![Users](docs/screenshots/users.png)

#### Reportes
![Reports](docs/screenshots/reports.png)

### **📱 Aplicación Android**

#### Login Móvil
![Android Login](docs/screenshots/android-login.png)

#### Lista de Tickets Asignados
![Android Tickets](docs/screenshots/android-tickets.png)

#### Detalle y Resolución
![Android Detail](docs/screenshots/android-detail.png)

#### Firma Digital
![Android Signature](docs/screenshots/android-signature.png)

---

## 🎨 Demo

### **🌐 Demo en Vivo**

- **Dashboard Web:** [http://macticketsv.us-east-1.elasticbeanstalk.com](http://macticketsv.us-east-1.elasticbeanstalk.com)
- **API Base URL:** [http://macticketsv.us-east-1.elasticbeanstalk.com/api](http://macticketsv.us-east-1.elasticbeanstalk.com/api)

**Credenciales de demo:**
- Usuario: `admin`
- Password: `Admin123`

### **📱 APK Android**

Descarga la última versión: [Releases](https://github.com/tu-usuario/MacApiFront/releases)

---

## 🧪 Testing

### **Backend**
```bash
cd MAC/mac-tickets-api
npm test
```

### **Frontend**
```bash
cd MAC/mac-tickets-front
npm test
```

### **Android**
```bash
cd Android/Mac_Android
./gradlew test
```

---

## 🐛 Troubleshooting

### **Error: "Unknown database 'macTickets'"**
**Solución:** Ejecutar el script de seed data
```bash
cd Docs/Schemas
./setup-rds-database.sh
```

### **Error: "404 Not Found" en endpoints**
**Causa:** Falta el prefijo `/api/`  
**Solución:** Todas las rutas deben empezar con `/api/`

### **Error: "Categorías vacías en AWS"**
**Solución:** Insertar datos iniciales
```bash
cd Docs/Schemas
mysql -h tu-rds-endpoint -u admin -p macTickets < SEED-DATA-AWS.sql
```

Ver más soluciones: [`Docs/AWS-Deployment/FIX-ELASTIC-BEANSTALK-ERRORS.md`](Docs/AWS-Deployment/FIX-ELASTIC-BEANSTALK-ERRORS.md)

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### **📝 Guías de Contribución**

- Seguir las reglas de desarrollo en [`DEVELOPMENT-RULES.md`](Docs/DEVELOPMENT-RULES.md)
- Escribir tests para nuevas funcionalidades
- Mantener la documentación actualizada
- Usar commits descriptivos
- No incluir credenciales o datos sensibles

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 MAC Computadoras

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Equipo

**Desarrollado por MAC Computadoras**

- 🌐 Web: [maccomputadoras.com](https://maccomputadoras.com)
- 📧 Email: soporte@maccomputadoras.com
- 📱 Teléfono: +52 555-0100

---

## 🙏 Agradecimientos

- [React](https://react.dev/) - Framework frontend
- [Node.js](https://nodejs.org/) - Runtime backend
- [Material-UI](https://mui.com/) - Componentes UI
- [TailwindCSS](https://tailwindcss.com/) - Utilidades CSS
- [Kotlin](https://kotlinlang.org/) - Lenguaje Android
- [MySQL](https://www.mysql.com/) - Base de datos
- [AWS](https://aws.amazon.com/) - Infraestructura cloud

---

## 📞 Soporte

¿Necesitas ayuda? Contáctanos:

- 📧 Email: soporte@maccomputadoras.com
- 💬 Issues: [GitHub Issues](https://github.com/tu-usuario/MacApiFront/issues)
- 📖 Docs: [Documentación completa](Docs/)

---

<div align="center">

**⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub ⭐**

Hecho con ❤️ por **MAC Computadoras**

[⬆ Volver arriba](#-mac-tickets-system)

</div>

