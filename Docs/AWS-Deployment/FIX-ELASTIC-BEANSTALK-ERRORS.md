# 🔧 Solución: Errores en Elastic Beanstalk

## 🚨 **Problemas Detectados**

```
Error conectando a MySQL: Unknown database 'macTickets'
POST /auth/login HTTP/1.1" 404 126
```

### **Causa Raíz:**
1. ❌ Base de datos `macTickets` no existe en RDS
2. ❌ Rutas sin prefijo `/api/` devuelven 404

---

## ✅ **Solución Paso a Paso**

### **PASO 1: Crear la Base de Datos en RDS**

#### **Opción A: Crear base de datos `macTickets` (Más Rápido)**

```bash
# 1. Conectarse a tu instancia RDS
mysql -h mac-tickets-db.c9p3abcd1234.us-east-1.rds.amazonaws.com \
      -u admin \
      -p

# 2. Crear la base de datos
CREATE DATABASE macTickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Usar la base de datos
USE macTickets;

# 4. Verificar que existe
SHOW DATABASES;

# Deberías ver:
# +--------------------+
# | Database           |
# +--------------------+
# | macTickets         |
# | information_schema |
# | mysql              |
# +--------------------+

# 5. Salir
EXIT;
```

#### **Opción B: Cambiar variable de entorno a `ticket_system`**

Si prefieres usar otro nombre:

```bash
# En AWS Console o con EB CLI
eb setenv DB_NAME=ticket_system

# Luego en MySQL:
CREATE DATABASE ticket_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### **PASO 2: Ejecutar el Schema SQL**

Una vez creada la base de datos, ejecuta el schema completo:

```bash
# Descargar el schema desde tu proyecto
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas

# Ejecutar en RDS
mysql -h mac-tickets-db.c9p3abcd1234.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      macTickets < FULL-SCHEMA-AWS.sql
```

**O ejecutar línea por línea:**

```bash
# Conectarse a RDS
mysql -h tu-rds-endpoint.rds.amazonaws.com -u admin -p

# Seleccionar la base de datos
USE macTickets;

# Copiar y pegar el contenido de FULL-SCHEMA-AWS.sql
```

---

### **PASO 3: Verificar Variables de Entorno en Elastic Beanstalk**

```bash
# Ver variables actuales
eb printenv

# Verificar que estén configuradas:
# ✅ DB_HOST = mac-tickets-db.xxx.rds.amazonaws.com
# ✅ DB_NAME = macTickets
# ✅ DB_USER = admin
# ✅ DB_PASSWORD = tu_password
# ✅ NODE_ENV = production
# ✅ PORT = 8080
# ✅ JWT_SECRET = (64+ caracteres)
# ✅ CORS_ORIGIN = URL de tu frontend
```

Si falta alguna:

```bash
# Configurar las faltantes
eb setenv DB_NAME=macTickets \
         DB_HOST=mac-tickets-db.xxx.rds.amazonaws.com \
         DB_USER=admin \
         DB_PASSWORD=tu_password_seguro \
         JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6 \
         NODE_ENV=production \
         PORT=8080
```

---

### **PASO 4: Reiniciar la Aplicación**

```bash
# Después de configurar las variables
eb deploy

# O simplemente reiniciar
eb restart
```

---

### **PASO 5: Probar con las Rutas Correctas**

#### ❌ **Incorrecto:**
```bash
POST http://tu-app.elasticbeanstalk.com/auth/login
POST http://tu-app.elasticbeanstalk.com/login
```

#### ✅ **Correcto:**
```bash
POST http://tu-app.elasticbeanstalk.com/api/auth/login
```

---

## 📋 **Lista Completa de Endpoints**

### **Autenticación**
```
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### **Tickets**
```
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PUT    /api/tickets/:id
PATCH  /api/tickets/:id/status
POST   /api/tickets/:id/assign
POST   /api/tickets/:id/accept
POST   /api/tickets/:id/close
POST   /api/tickets/:id/reopen
```

### **Comentarios**
```
GET    /api/tickets/:id/comments
POST   /api/tickets/:id/comments
```

### **Adjuntos**
```
POST   /api/tickets/:id/attachments
DELETE /api/attachments/:id
```

### **Usuarios (Admin)**
```
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/:id/reset-password
```

### **Catálogos**
```
GET    /api/catalog/categories
GET    /api/catalog/priorities
GET    /api/catalog/statuses
GET    /api/catalog/technicians
```

### **Reportes (Admin)**
```
GET    /api/reports/dashboard
GET    /api/reports/tickets
```

### **PDF**
```
POST   /api/pdf/generate/:ticketId
```

### **Health Check**
```
GET    /
GET    /health
```

---

## 🧪 **Prueba de Conexión Completa**

### **1. Verificar que el servidor está arriba:**
```bash
curl http://tu-app.elasticbeanstalk.com/
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "MAC Tickets API - Sistema de Gestión de Tickets",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-10-21T21:31:19.000Z"
}
```

### **2. Probar Login:**
```bash
curl -X POST http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123"
  }'
```

**Respuesta esperada (éxito):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "administrador"
    }
  }
}
```

**Respuesta esperada (error de DB):**
```json
{
  "success": false,
  "message": "Error conectando a la base de datos"
}
```

### **3. Probar Endpoint con Autenticación:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl http://tu-app.elasticbeanstalk.com/api/tickets \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 **Verificar Logs de Elastic Beanstalk**

```bash
# Ver logs en tiempo real
eb logs --stream

# Ver últimos logs
eb logs

# Buscar errores específicos
eb logs | grep "Error"
eb logs | grep "MySQL"
eb logs | grep "404"
```

---

## ❓ **Troubleshooting**

### **Error: "Unknown database 'macTickets'"**

```bash
# Verificar que la base de datos existe
mysql -h tu-rds-endpoint -u admin -p -e "SHOW DATABASES;"

# Si no existe, crearla:
mysql -h tu-rds-endpoint -u admin -p -e "CREATE DATABASE macTickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### **Error: "404 Not Found" en /api/auth/login**

```bash
# Verificar que las rutas están cargadas correctamente
eb logs | grep "Servidor corriendo"

# Debe mostrar:
# Servidor corriendo en: http://0.0.0.0:8080
```

### **Error: "Cannot connect to RDS"**

```bash
# 1. Verificar Security Group de RDS
# Debe permitir conexiones desde el Security Group de Elastic Beanstalk

# 2. Verificar endpoint de RDS
eb printenv | grep DB_HOST

# 3. Probar conexión manual
mysql -h tu-rds-endpoint -u admin -p
```

### **Error: "CORS policy"**

```bash
# Configurar CORS_ORIGIN
eb setenv CORS_ORIGIN=https://tu-frontend.com

# O para múltiples orígenes (en desarrollo)
eb setenv CORS_ORIGIN=*
```

---

## 📝 **Checklist de Verificación**

- [ ] Base de datos `macTickets` existe en RDS
- [ ] Schema SQL ejecutado correctamente
- [ ] Variables de entorno configuradas en EB
- [ ] Security Group de RDS permite conexiones desde EB
- [ ] Servidor reiniciado después de cambios
- [ ] Endpoint `/` responde 200 OK
- [ ] Endpoint `/api/auth/login` responde (no 404)
- [ ] Login funciona con credenciales de prueba
- [ ] CORS configurado para el frontend

---

## 🚀 **Comandos de Deploy Rápido**

```bash
# 1. Verificar estado actual
eb status

# 2. Ver variables configuradas
eb printenv

# 3. Configurar variables faltantes
eb setenv DB_NAME=macTickets \
         DB_HOST=tu-rds-endpoint \
         JWT_SECRET=tu-secret-de-64-caracteres

# 4. Reiniciar aplicación
eb restart

# 5. Ver logs
eb logs

# 6. Probar endpoint
curl http://tu-app.elasticbeanstalk.com/api/auth/login

# 7. Si todo funciona, hacer commit y deploy
git add .
git commit -m "fix: configurar base de datos y variables de entorno"
eb deploy
```

---

## 📞 **Siguiente Paso**

Una vez que el backend esté funcionando correctamente:

1. ✅ Verificar que `/api/auth/login` responde 200 (no 404)
2. ✅ Configurar el frontend para apuntar a la URL correcta
3. ✅ Probar login desde el dashboard web
4. ✅ Verificar que los tickets se cargan correctamente

---

**¿Necesitas ayuda con algún paso específico?** 🚀

