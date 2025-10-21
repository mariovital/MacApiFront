# 🧪 Pruebas de Endpoints API - AWS Elastic Beanstalk

## 📋 **Configuración Inicial**

### **URL Base de tu API:**
```bash
# Reemplaza con tu URL real de Elastic Beanstalk
BASE_URL="http://mac-tickets-api-prod.us-east-1.elasticbeanstalk.com"
```

---

## 1️⃣ **Prueba de Salud del Servidor**

### **Endpoint: GET /**
```bash
curl $BASE_URL/
```

**Respuesta Esperada (200 OK):**
```json
{
  "success": true,
  "message": "MAC Tickets API - Sistema de Gestión de Tickets",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-10-21T21:31:19.000Z"
}
```

---

## 2️⃣ **Prueba de Login (Sin Base de Datos)**

### **Endpoint: POST /api/auth/login**

```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123"
  }'
```

### **Respuestas Posibles:**

#### ✅ **Éxito (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "first_name": "Admin",
      "last_name": "System",
      "role": "administrador",
      "is_active": true
    }
  }
}
```

#### ❌ **Base de Datos No Existe (500):**
```json
{
  "success": false,
  "message": "Error conectando a la base de datos"
}
```

#### ❌ **Credenciales Incorrectas (401):**
```json
{
  "success": false,
  "message": "Usuario o contraseña incorrectos",
  "code": "INVALID_CREDENTIALS"
}
```

#### ❌ **Endpoint No Encontrado (404):**
```json
{
  "success": false,
  "message": "Endpoint no encontrado",
  "code": "ENDPOINT_NOT_FOUND",
  "requested_url": "/auth/login",
  "method": "POST"
}
```

**🔧 Solución:** Usar `/api/auth/login` en lugar de `/auth/login`

---

## 3️⃣ **Prueba de Tickets (Requiere Autenticación)**

### **Endpoint: GET /api/tickets**

Primero necesitas obtener un token del login:

```bash
# 1. Login y guardar token
TOKEN=$(curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}' \
  -s | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Obtener tickets
curl $BASE_URL/api/tickets \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Esperada (200 OK):**
```json
{
  "success": true,
  "message": "Tickets obtenidos exitosamente",
  "data": {
    "items": [
      {
        "id": 1,
        "ticket_number": "#ID-001",
        "title": "Problema con impresora",
        "status": {
          "id": 1,
          "name": "Nuevo",
          "color": "#6B7280"
        },
        "priority": {
          "id": 2,
          "name": "Media",
          "level": 2,
          "color": "#FF9800"
        },
        "created_at": "2025-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

---

## 4️⃣ **Crear un Ticket de Prueba**

### **Endpoint: POST /api/tickets**

```bash
curl -X POST $BASE_URL/api/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ticket de Prueba desde API",
    "description": "Este es un ticket creado para probar la API en AWS",
    "category_id": 1,
    "priority_id": 2,
    "client_company": "MAC Computadoras",
    "client_contact": "Juan Pérez",
    "location": "Oficina Principal"
  }'
```

**Respuesta Esperada (201 Created):**
```json
{
  "success": true,
  "message": "Ticket creado exitosamente",
  "data": {
    "id": 2,
    "ticket_number": "#ID-002",
    "title": "Ticket de Prueba desde API",
    "description": "Este es un ticket creado para probar la API en AWS",
    "status": {
      "id": 1,
      "name": "Nuevo"
    },
    "priority": {
      "id": 2,
      "name": "Media"
    },
    "created_at": "2025-10-21T21:45:00.000Z"
  }
}
```

---

## 5️⃣ **Obtener Catálogos**

### **Endpoint: GET /api/catalog/categories**

```bash
curl $BASE_URL/api/catalog/categories \
  -H "Authorization: Bearer $TOKEN"
```

### **Endpoint: GET /api/catalog/priorities**

```bash
curl $BASE_URL/api/catalog/priorities \
  -H "Authorization: Bearer $TOKEN"
```

### **Endpoint: GET /api/catalog/statuses**

```bash
curl $BASE_URL/api/catalog/statuses \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📱 **Colección de Insomnia/Postman**

### **Importar Endpoints en Insomnia:**

1. **Crear nueva colección:** "MAC Tickets API - AWS"
2. **Configurar Base URL:** `http://tu-app.elasticbeanstalk.com`
3. **Agregar endpoints:**

#### **Health Check**
```
GET {{base_url}}/
```

#### **Login**
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123"
}
```

#### **Get Tickets**
```
GET {{base_url}}/api/tickets
Authorization: Bearer {{token}}
```

#### **Create Ticket**
```
POST {{base_url}}/api/tickets
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Nuevo ticket de prueba",
  "description": "Descripción del problema",
  "category_id": 1,
  "priority_id": 2,
  "client_company": "MAC Computadoras",
  "client_contact": "Contacto Test"
}
```

---

## 🔍 **Script de Prueba Completo**

Guarda esto como `test-api.sh`:

```bash
#!/bin/bash

# Configuración
BASE_URL="http://tu-app.elasticbeanstalk.com"
USERNAME="admin"
PASSWORD="Admin123"

echo "🧪 Iniciando pruebas de API..."
echo ""

# Test 1: Health Check
echo "1️⃣ Probando Health Check..."
HEALTH=$(curl -s $BASE_URL/)
echo $HEALTH | jq .
echo ""

# Test 2: Login
echo "2️⃣ Probando Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo $LOGIN_RESPONSE | jq .
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

if [ "$TOKEN" != "null" ]; then
  echo "✅ Token obtenido: ${TOKEN:0:20}..."
else
  echo "❌ No se pudo obtener token"
  exit 1
fi
echo ""

# Test 3: Get Tickets
echo "3️⃣ Probando GET Tickets..."
TICKETS=$(curl -s $BASE_URL/api/tickets \
  -H "Authorization: Bearer $TOKEN")
echo $TICKETS | jq .
echo ""

# Test 4: Get Categories
echo "4️⃣ Probando GET Categories..."
CATEGORIES=$(curl -s $BASE_URL/api/catalog/categories \
  -H "Authorization: Bearer $TOKEN")
echo $CATEGORIES | jq .
echo ""

# Test 5: Create Ticket
echo "5️⃣ Probando POST Ticket..."
CREATE_TICKET=$(curl -s -X POST $BASE_URL/api/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ticket de Prueba Automatizada",
    "description": "Creado por script de prueba",
    "category_id": 1,
    "priority_id": 2,
    "client_company": "MAC Computadoras",
    "client_contact": "Test Automation"
  }')
echo $CREATE_TICKET | jq .

echo ""
echo "✅ Pruebas completadas"
```

**Ejecutar:**
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🐛 **Códigos de Error Comunes**

| Código | Descripción | Solución |
|--------|-------------|----------|
| **404** | Endpoint no encontrado | Verificar que usas `/api/` antes de la ruta |
| **401** | No autorizado | Token inválido o expirado, hacer login nuevamente |
| **403** | Sin permisos | El usuario no tiene permisos para esa acción |
| **500** | Error interno | Revisar logs: `eb logs` o verificar conexión DB |
| **502** | Bad Gateway | Servidor no responde, verificar que está corriendo |
| **503** | Service Unavailable | Elastic Beanstalk está actualizando |

---

## 🔧 **Troubleshooting**

### **Error: "404 Not Found"**

```bash
# ❌ Incorrecto
curl $BASE_URL/auth/login

# ✅ Correcto
curl $BASE_URL/api/auth/login
```

### **Error: "Cannot connect to database"**

```bash
# Verificar variables de entorno
eb printenv | grep DB

# Verificar que la base de datos existe
mysql -h tu-rds-endpoint -u admin -p -e "SHOW DATABASES;"
```

### **Error: "Token invalid"**

```bash
# El token expira en 24h, obtener uno nuevo
TOKEN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}' | jq -r '.data.token')
```

---

## 📊 **Verificar Logs en Tiempo Real**

```bash
# Ver logs en tiempo real mientras pruebas
eb logs --stream

# En otra terminal, ejecutar las pruebas
./test-api.sh
```

---

## ✅ **Checklist de Pruebas**

Después de desplegar, verificar:

- [ ] `GET /` responde 200 OK
- [ ] `POST /api/auth/login` responde 200 (no 404)
- [ ] Login retorna token válido
- [ ] `GET /api/tickets` responde 200 con token
- [ ] Crear ticket funciona correctamente
- [ ] Catálogos cargan correctamente
- [ ] CORS permite requests del frontend

---

**¿Listo para probar tu API en AWS?** 🚀

**Siguiente paso:** Configurar el frontend para apuntar a la URL de Elastic Beanstalk.

