# 🚀 Guía de Configuración del Entorno DEMO con ngrok

Esta guía te permitirá configurar el entorno de demostración completo con **múltiples usuarios** y **datos realistas** para que tu equipo pueda probar el sistema de tickets usando **ngrok** para acceso remoto.

---

## 📋 **Requisitos Previos**

### ✅ **Software Necesario**
- **Node.js** 18+ instalado
- **MySQL** 8.0+ instalado y corriendo
- **ngrok** instalado (descarga en [ngrok.com](https://ngrok.com))
- **Postman** o cualquier cliente API (opcional pero recomendado)

### ✅ **Archivos del Proyecto**
- Backend API en `/MAC/mac-tickets-api`
- Frontend en `/MAC/mac-tickets-front`
- Script SQL de datos DEMO en `/Docs/DEMO-DATA.sql`

---

## 🗄️ **PASO 1: Configurar la Base de Datos**

### 1.1 Ejecutar el Schema Principal

```bash
# Conéctate a MySQL
mysql -u root -p

# Ejecuta el schema principal (si no lo has hecho)
mysql -u root -p < Docs/Schema-Improved.sql
```

### 1.2 Poblar con Datos DEMO

```bash
# Ejecuta el script de datos DEMO
mysql -u root -p < Docs/DEMO-DATA.sql
```

**✅ Esto creará:**
- **12 usuarios** (2 admin, 5 técnicos, 4 mesa de trabajo, 1 inactivo)
- **20 tickets** con diferentes estados y prioridades
- **25+ comentarios** en los tickets
- **30+ entradas** de historial
- **12 notificaciones** para usuarios
- **7 archivos adjuntos** (metadatos simulados)

### 1.3 Verificar Datos Creados

```sql
-- Verifica usuarios creados
SELECT username, email, role_id, is_active FROM users;

-- Verifica tickets creados
SELECT ticket_number, title, status_id, priority_id FROM tickets;

-- Verifica comentarios
SELECT COUNT(*) as total_comentarios FROM ticket_comments;
```

---

## 🔐 **PASO 2: Credenciales de Acceso**

### 👥 **TODOS LOS USUARIOS TIENEN LA MISMA CONTRASEÑA: `demo123`**

#### **Administradores** (Acceso Total)
- 📧 **admin@maccomputadoras.com** / `admin` 
- 📧 **sistemas@maccomputadoras.com** / `admin.sistemas`

#### **Técnicos** (Tickets Asignados)
- 📧 **juan.perez@maccomputadoras.com** / `juan.perez`
- 📧 **maria.gonzalez@maccomputadoras.com** / `maria.gonzalez`
- 📧 **carlos.ruiz@maccomputadoras.com** / `carlos.ruiz`
- 📧 **ana.torres@maccomputadoras.com** / `ana.torres`
- 📧 **pedro.ramirez@maccomputadoras.com** / `pedro.ramirez`

#### **Mesa de Trabajo** (Crear Tickets)
- 📧 **lucia.mesa@maccomputadoras.com** / `lucia.mesa`
- 📧 **diego.soporte@maccomputadoras.com** / `diego.soporte`
- 📧 **carmen.ventas@maccomputadoras.com** / `carmen.ventas`
- 📧 **roberto.admin@maccomputadoras.com** / `roberto.admin`

---

## ⚙️ **PASO 3: Configurar Variables de Entorno del Backend**

### 3.1 Editar `.env` en `/MAC/mac-tickets-api/`

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
DB_PASSWORD=tu_password_mysql
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=tu-super-secret-key-minimum-32-characters-long-demo
JWT_REFRESH_SECRET=tu-refresh-secret-key-also-minimum-32-chars-demo
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,https://tu-url-ngrok.ngrok-free.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
```

---

## 🚀 **PASO 4: Iniciar el Backend API**

### 4.1 Instalar Dependencias (si no se ha hecho)

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront
npm run install:all
```

### 4.2 Iniciar el Servidor Backend

```bash
# Opción 1: Solo backend
cd MAC/mac-tickets-api
npm run dev

# Opción 2: Frontend + Backend simultáneamente (desde raíz)
npm run dev
```

**✅ El backend estará corriendo en: `http://localhost:3001`**

### 4.3 Verificar que el Backend Funciona

```bash
# Verifica el health check
curl http://localhost:3001/health

# Debe responder:
# {"status":"ok","message":"API funcionando correctamente"}
```

---

## 🌐 **PASO 5: Exponer el API con ngrok**

### 5.1 Instalar ngrok (si no lo tienes)

```bash
# macOS
brew install ngrok

# O descarga desde https://ngrok.com/download
```

### 5.2 Autenticarse en ngrok (primera vez)

```bash
# Regístrate en https://dashboard.ngrok.com/signup
# Copia tu authtoken y ejecuta:
ngrok config add-authtoken TU_AUTH_TOKEN
```

### 5.3 Iniciar ngrok para el Backend

```bash
# En una nueva terminal, ejecuta:
ngrok http 3001
```

**📝 ngrok te mostrará algo como:**

```
Forwarding: https://abc123xyz.ngrok-free.app -> http://localhost:3001
```

**🎯 Tu API ahora está accesible públicamente en: `https://abc123xyz.ngrok-free.app`**

### 5.4 Actualizar CORS_ORIGIN en el Backend

Edita `/MAC/mac-tickets-api/.env` y agrega tu URL de ngrok:

```bash
CORS_ORIGIN=http://localhost:5173,https://abc123xyz.ngrok-free.app
```

Reinicia el backend:

```bash
# Ctrl+C para detener
npm run dev
```

---

## 📱 **PASO 6: Configurar Frontend para usar ngrok**

### 6.1 Editar `.env` en `/MAC/mac-tickets-front/`

Crea o edita el archivo `.env`:

```bash
# API Configuration
VITE_API_URL=https://abc123xyz.ngrok-free.app/api
VITE_SOCKET_URL=https://abc123xyz.ngrok-free.app

# App Configuration
VITE_APP_NAME=Sistema de Gestión de Tickets
VITE_APP_VERSION=1.0.0
```

**⚠️ IMPORTANTE:** Reemplaza `abc123xyz.ngrok-free.app` con tu URL real de ngrok.

### 6.2 Iniciar el Frontend

```bash
cd MAC/mac-tickets-front
npm run dev
```

**✅ El frontend estará corriendo en: `http://localhost:5173`**

---

## 🧪 **PASO 7: Probar el Sistema Completo**

### 7.1 Probar Login en el Frontend

1. Abre `http://localhost:5173` en tu navegador
2. Inicia sesión con cualquier usuario (contraseña: `demo123`)
3. Explora el dashboard y las diferentes secciones

### 7.2 Probar Endpoints con Postman

#### **Login**
```http
POST https://abc123xyz.ngrok-free.app/api/auth/login
Content-Type: application/json

{
  "email": "admin@maccomputadoras.com",
  "password": "demo123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@maccomputadoras.com",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Obtener Tickets**
```http
GET https://abc123xyz.ngrok-free.app/api/tickets
Authorization: Bearer {TU_TOKEN_JWT}
```

#### **Obtener Usuarios (Solo Admin)**
```http
GET https://abc123xyz.ngrok-free.app/api/users
Authorization: Bearer {TU_TOKEN_JWT}
```

---

## 👥 **PASO 8: Compartir con tu Equipo**

### 8.1 URL del API para el Equipo

Comparte esta URL con tu equipo:

```
🌐 API Endpoint: https://abc123xyz.ngrok-free.app/api
🔐 Usar cualquier usuario del listado
🔑 Contraseña: demo123
```

### 8.2 Documentación de Endpoints

Envía el archivo `/Docs/POSTMAN-ENDPOINTS.md` a tu equipo para que conozcan todos los endpoints disponibles.

### 8.3 Colección de Postman

Puedes crear una colección de Postman con:
- **Base URL**: `https://abc123xyz.ngrok-free.app`
- **Auth Type**: Bearer Token
- **Todos los endpoints** del archivo `POSTMAN-ENDPOINTS.md`

---

## 🎯 **Escenarios de Prueba Sugeridos**

### ✅ **Escenario 1: Flujo Completo de Ticket**

1. **Mesa de Trabajo** (`lucia.mesa`) crea un ticket
2. **Admin** (`admin`) asigna el ticket a un técnico
3. **Técnico** (`juan.perez`) acepta y trabaja el ticket
4. **Técnico** agrega comentarios y actualiza estado
5. **Técnico** resuelve el ticket
6. **Mesa de Trabajo** confirma y cierra el ticket

### ✅ **Escenario 2: Gestión de Usuarios**

1. **Admin** lista todos los usuarios
2. **Admin** crea un nuevo usuario
3. **Admin** edita información de usuario
4. **Admin** desactiva un usuario

### ✅ **Escenario 3: Notificaciones en Tiempo Real**

1. Abre 2 navegadores con diferentes usuarios
2. Crea un ticket en uno
3. Asigna el ticket en el otro
4. Observa notificaciones en tiempo real (cuando Socket.IO esté implementado)

---

## 📊 **Datos DEMO Disponibles**

### **Tickets por Estado:**
- 🆕 **Nuevos**: 3 tickets
- 📋 **Asignados**: 3 tickets
- ⏳ **En Proceso**: 4 tickets
- ✅ **Resueltos**: 5 tickets
- 🔒 **Cerrados**: 5 tickets

### **Tickets por Prioridad:**
- 🔴 **Crítica**: 3 tickets
- 🟠 **Alta**: 4 tickets
- 🟡 **Media**: 8 tickets
- 🟢 **Baja**: 5 tickets

### **Comentarios y Actividad:**
- **25+ comentarios** distribuidos en múltiples tickets
- **30+ entradas** de historial de cambios
- **12 notificaciones** para diferentes usuarios

---

## 🔧 **Troubleshooting**

### ❌ **Problema: "Cannot connect to MySQL"**
**Solución:**
```bash
# Verifica que MySQL esté corriendo
mysql --version
mysql -u root -p -e "SELECT 1"

# Verifica las credenciales en .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
```

### ❌ **Problema: "CORS Error" en el navegador**
**Solución:**
- Verifica que `CORS_ORIGIN` en `.env` incluya tu URL de ngrok
- Reinicia el backend después de cambiar `.env`

### ❌ **Problema: ngrok "ERR_NGROK_108"**
**Solución:**
- Verifica que tengas una cuenta en ngrok.com
- Ejecuta: `ngrok config add-authtoken TU_TOKEN`

### ❌ **Problema: "Password incorrect" en login**
**Solución:**
- Verifica que ejecutaste `DEMO-DATA.sql` correctamente
- Contraseña para TODOS: `demo123`
- Hash en DB debe ser: `$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5QoBZxXyNXM5a`

---

## 🎉 **¡Listo para Demostración!**

Tu equipo ahora puede:
- ✅ Probar el API desde cualquier lugar usando ngrok
- ✅ Iniciar sesión con 12 usuarios diferentes
- ✅ Ver 20 tickets con datos realistas
- ✅ Probar todos los flujos de trabajo
- ✅ Crear, editar y gestionar tickets
- ✅ Ver comentarios, historial y notificaciones

---

## 📞 **Contacto y Soporte**

Si tienes problemas:
1. Verifica los logs del backend: `npm run dev`
2. Revisa la consola del navegador (F12)
3. Verifica que ngrok esté corriendo
4. Consulta la documentación en `/Docs/`

**¡Happy Testing! 🚀**
