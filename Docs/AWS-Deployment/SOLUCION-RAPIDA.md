# ⚡ Solución Rápida - Errores en Elastic Beanstalk

## 🚨 **TUS ERRORES:**
1. ❌ `Unknown database 'macTickets'` → Base de datos no existe
2. ❌ `POST /auth/login HTTP/1.1" 404` → Usas rutas sin `/api/`

---

## ✅ **SOLUCIÓN EN 5 PASOS**

### **PASO 1: Crear Base de Datos en RDS** 

#### **Opción A: Script Automático (RECOMENDADO) 🤖**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas

./setup-rds-database.sh
```

El script te pedirá:
- RDS Endpoint (ejemplo: `mac-tickets-db.xxx.rds.amazonaws.com`)
- Usuario (generalmente `admin`)
- Contraseña
- Nombre de la BD (default: `macTickets`)

**¿Qué hace el script?**
- ✅ Crea la base de datos `macTickets`
- ✅ Ejecuta todas las tablas (schema completo)
- ✅ Verifica que todo esté correcto
- ✅ Te muestra los comandos para configurar Elastic Beanstalk

---

#### **Opción B: Manual (Si prefieres hacerlo paso a paso) 📝**

```bash
# 1. Conectarse a RDS
mysql -h tu-rds-endpoint.rds.amazonaws.com -u admin -p

# 2. Crear base de datos
CREATE DATABASE macTickets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Usar la base de datos
USE macTickets;

# 4. Salir
EXIT;

# 5. Ejecutar schema completo
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas

mysql -h tu-rds-endpoint.rds.amazonaws.com \
      -u admin \
      -p \
      macTickets < FULL-SCHEMA-AWS.sql
```

---

### **PASO 2: Configurar Variables de Entorno en Elastic Beanstalk**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

eb setenv \
  DB_NAME=macTickets \
  DB_HOST=tu-rds-endpoint.rds.amazonaws.com \
  DB_USER=admin \
  DB_PASSWORD=tu_password \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### **PASO 3: Reiniciar Aplicación**

```bash
eb restart
```

Espera 30-60 segundos mientras se reinicia.

---

### **PASO 4: Verificar que Funciona**

#### **1. Probar Health Check:**
```bash
curl http://tu-app.elasticbeanstalk.com/

# Debe responder:
# {
#   "success": true,
#   "message": "MAC Tickets API - Sistema de Gestión de Tickets",
#   ...
# }
```

#### **2. Probar Login (⚠️ NOTA LA RUTA CORRECTA):**
```bash
# ❌ INCORRECTO (devuelve 404):
curl -X POST http://tu-app.elasticbeanstalk.com/auth/login

# ✅ CORRECTO (debe funcionar):
curl -X POST http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123"
  }'

# Debe responder:
# {
#   "success": true,
#   "message": "Login exitoso",
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs...",
#     ...
#   }
# }
```

---

### **PASO 5: Ver Logs si Hay Errores**

```bash
eb logs

# O en tiempo real:
eb logs --stream
```

---

## 📋 **LISTA COMPLETA DE RUTAS CORRECTAS**

### ❌ **INCORRECTO:**
```
/login           → 404
/auth/login      → 404
/tickets         → 404
/users           → 404
```

### ✅ **CORRECTO:**
```
/api/auth/login
/api/tickets
/api/tickets/:id
/api/users
/api/catalog/categories
/api/reports/dashboard
```

**TODAS LAS RUTAS LLEVAN `/api/` AL INICIO**

---

## 🧪 **Script de Prueba Completo**

Crea un archivo `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://tu-app.elasticbeanstalk.com"

echo "🧪 Probando API..."
echo ""

# 1. Health Check
echo "1️⃣ Health Check:"
curl -s $BASE_URL/ | jq .
echo ""

# 2. Login
echo "2️⃣ Login:"
LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}')

echo $LOGIN | jq .
TOKEN=$(echo $LOGIN | jq -r '.data.token')

if [ "$TOKEN" != "null" ]; then
  echo "✅ Token obtenido"
else
  echo "❌ Login falló"
  exit 1
fi
echo ""

# 3. Get Tickets
echo "3️⃣ Get Tickets:"
curl -s $BASE_URL/api/tickets \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "✅ Todas las pruebas completadas"
```

**Ejecutar:**
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🔍 **Troubleshooting Rápido**

### **Error: "Unknown database 'macTickets'"**
```bash
# Verificar que existe
mysql -h tu-rds-endpoint -u admin -p -e "SHOW DATABASES;"

# Si no aparece, crearla:
mysql -h tu-rds-endpoint -u admin -p -e "CREATE DATABASE macTickets;"
```

### **Error: "404 Not Found" en /api/auth/login**
```bash
# Verificar que las rutas están cargadas
eb logs | grep "Servidor corriendo"

# Si no aparece, verificar que app.js tiene:
# app.use('/api/auth', authRoutes);
```

### **Error: "Cannot connect to RDS"**
```bash
# Verificar Security Group
# 1. Ir a AWS Console → RDS → tu-instancia → Connectivity
# 2. Click en Security Group
# 3. Inbound rules → Debe tener:
#    Type: MySQL/Aurora (3306)
#    Source: Security Group de Elastic Beanstalk
```

### **Error: "CORS policy"**
```bash
# Configurar CORS_ORIGIN
eb setenv CORS_ORIGIN=https://tu-frontend.com

# O temporalmente (solo para pruebas):
eb setenv CORS_ORIGIN=*
```

---

## ✅ **Checklist Final**

Después de completar los pasos, verifica:

- [ ] Base de datos `macTickets` existe en RDS
- [ ] Schema ejecutado correctamente (tablas creadas)
- [ ] Variables de entorno configuradas en EB
- [ ] Aplicación reiniciada
- [ ] `GET /` responde 200 OK
- [ ] `POST /api/auth/login` responde 200 (no 404)
- [ ] Login retorna token válido
- [ ] `GET /api/tickets` funciona con token

---

## 🎯 **Siguiente Paso: Configurar Frontend**

Una vez que el backend funcione:

1. Ir a tu proyecto de frontend
2. Crear/editar `.env`:
   ```bash
   VITE_API_URL=http://tu-app.elasticbeanstalk.com/api
   ```
3. Rebuild y deploy del frontend

---

## 📞 **¿Sigues con Problemas?**

Envía los logs completos:

```bash
eb logs > error-logs.txt
```

Y revisa:
- Variables de entorno: `eb printenv`
- Estado del servidor: `eb status`
- Conexión a RDS: `mysql -h tu-endpoint -u admin -p`

---

**¡Listo! 🚀 Tu API debería estar funcionando ahora.**

