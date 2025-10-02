# 🌱 Guía de Seed - Poblar Base de Datos DEMO

Esta guía explica cómo poblar la base de datos con datos DEMO para que el equipo Android pueda empezar a probar el API.

---

## 📋 **Pre-requisitos**

1. **MySQL instalado y corriendo**
2. **Base de datos creada**: `mactickets`
3. **Schema aplicado**: `Schema-Improved.sql` ejecutado
4. **Variables de entorno configuradas** en `.env`

---

## ⚙️ **Paso 1: Configurar Variables de Entorno**

Asegúrate de que tu archivo `.env` tenga la configuración correcta:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mactickets
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=tu-secret-key-seguro-minimo-32-caracteres
JWT_REFRESH_SECRET=tu-refresh-secret-key-tambien-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

---

## 🗄️ **Paso 2: Crear la Base de Datos y Aplicar Schema**

```bash
# 1. Crear la base de datos
mysql -u root -p
CREATE DATABASE mactickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mactickets;
exit;

# 2. Aplicar el schema mejorado
mysql -u root -p mactickets < ../../Docs/Schemas/Schema-Improved.sql
```

---

## 🌱 **Paso 3: Ejecutar el Seed**

El script de seed:
- ✅ Se conecta a MySQL usando Sequelize
- ✅ Crea **12 usuarios** con contraseñas hasheadas (bcrypt)
- ✅ Crea **5 tickets DEMO** con datos realistas
- ✅ Genera `ticket_number` automáticamente (como lo haría el API real)
- ✅ Calcula métricas (`resolution_time_hours`, `sla_breach`)
- ✅ Incluye auditoría (`ip_address`, `user_agent`)

```bash
# Ejecutar el seed
npm run seed
```

**Output esperado:**
```
🌱 ========================================
🌱 SEED DATABASE - Poblando Datos DEMO
🌱 ========================================

🔍 Probando conexión a MySQL...
✅ Conexión exitosa

👥 Creando usuarios DEMO...
  ✅ Usuario creado: admin@maccomputadoras.com
  ✅ Usuario creado: sistemas@maccomputadoras.com
  ✅ Usuario creado: juan.perez@maccomputadoras.com
  ... (12 usuarios total)

✅ Total usuarios DEMO: 12

🎫 Creando tickets DEMO...
  ✅ Ticket creado: ID-2025-01-001 - Sistema de facturación caído
  ✅ Ticket creado: ID-2025-01-002 - Servidor de base de datos en falla
  ... (5 tickets total)

✅ Total tickets DEMO: 5

🌱 ========================================
✅ SEED COMPLETADO EXITOSAMENTE
🌱 ========================================

📝 Credenciales DEMO:
  Email: admin@maccomputadoras.com
  Password: demo123
  (Todos los usuarios usan password: demo123)
```

---

## 🔐 **Paso 4: Verificar Datos en MySQL**

```bash
mysql -u root -p mactickets

# Ver usuarios creados
SELECT id, username, email, role_id, is_active FROM users;

# Ver tickets creados
SELECT id, ticket_number, title, status_id, priority_id FROM tickets;

# Ver contraseñas hasheadas
SELECT username, LEFT(password_hash, 20) as hash_preview FROM users LIMIT 3;
```

---

## 🚀 **Paso 5: Iniciar el API**

```bash
# Modo desarrollo con nodemon
npm run dev

# O modo producción
npm start
```

El API correrá en: `http://localhost:3001`

---

## 🧪 **Paso 6: Probar con Postman**

### **Login con Usuario DEMO**

```http
POST http://localhost:3001/api/auth/login
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
      "first_name": "Roberto",
      "last_name": "Administrador",
      "role_id": 1,
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Obtener Lista de Tickets**

```http
GET http://localhost:3001/api/tickets
Authorization: Bearer {TOKEN_RECIBIDO_DEL_LOGIN}
```

---

## 👥 **Credenciales DEMO Disponibles**

### **Administradores**
- **Email:** `admin@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `sistemas@maccomputadoras.com` | **Password:** `demo123`

### **Técnicos**
- **Email:** `juan.perez@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `maria.gonzalez@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `carlos.ruiz@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `ana.torres@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `pedro.ramirez@maccomputadoras.com` | **Password:** `demo123`

### **Mesa de Trabajo**
- **Email:** `lucia.mesa@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `diego.soporte@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `carmen.ventas@maccomputadoras.com` | **Password:** `demo123`
- **Email:** `roberto.admin@maccomputadoras.com` | **Password:** `demo123`

---

## 🔄 **Re-ejecutar el Seed**

Si necesitas limpiar y volver a poblar la base de datos:

```bash
# Opción 1: Limpiar manualmente
mysql -u root -p mactickets
DELETE FROM tickets WHERE 1=1;
DELETE FROM users WHERE id > 1;
exit;

# Opción 2: Drop y recrear (CUIDADO: elimina todo)
mysql -u root -p
DROP DATABASE mactickets;
CREATE DATABASE mactickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mactickets;
source ../../Docs/Schemas/Schema-Improved.sql;
exit;

# Luego re-ejecutar el seed
npm run seed
```

---

## 🐛 **Troubleshooting**

### **Error: Access denied for user 'root'@'localhost'**
- Verifica que `DB_PASSWORD` en `.env` sea correcto
- Prueba conectarte manualmente: `mysql -u root -p`

### **Error: Unknown database 'mactickets'**
- Crea la base de datos primero: `CREATE DATABASE mactickets;`

### **Error: Table 'users' doesn't exist**
- Aplica el schema primero: `mysql -u root -p mactickets < ../../Docs/Schemas/Schema-Improved.sql`

### **Error: Duplicate entry for key 'email'**
- Los usuarios ya existen. Si quieres re-ejecutar el seed, limpia primero la base de datos.

---

## 📱 **Para el Equipo Android**

Una vez que el seed esté ejecutado y el API corriendo:

1. **Base URL del API:** `http://localhost:3001/api` (o tu URL de ngrok)
2. **Endpoint de Login:** `POST /auth/login`
3. **Credenciales de prueba:** Cualquiera de las listadas arriba
4. **Token:** Se recibe en la respuesta del login, usar en header `Authorization: Bearer {token}`

**Endpoints disponibles para Android:**
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario
- `GET /api/tickets` - Lista de tickets (con filtros y paginación)
- `GET /api/tickets/:id` - Detalle de ticket
- `POST /api/tickets` - Crear nuevo ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `GET /api/users` - Lista de usuarios (solo admin)

**Documentación completa:** Ver `Docs/POSTMAN-ENDPOINTS.md`

---

## ✅ **Verificación Final**

Para verificar que todo funciona:

```bash
# 1. API corriendo
curl http://localhost:3001/health

# 2. Login funciona
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maccomputadoras.com","password":"demo123"}'

# 3. Tickets creados
mysql -u root -p mactickets -e "SELECT COUNT(*) as total_tickets FROM tickets;"
```

---

**¡Listo! El equipo Android ya puede empezar a consumir el API con datos reales. 🚀**

