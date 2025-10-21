# 🚀 Guía de Despliegue y Solución de Errores - AWS Elastic Beanstalk

## 📋 **LEE ESTO PRIMERO**

Tu API en Elastic Beanstalk tiene **2 errores críticos**:

1. ❌ **Base de datos no existe:** `Unknown database 'macTickets'`
2. ❌ **Rutas devuelven 404:** Estás usando `/auth/login` en vez de `/api/auth/login`

**Tiempo estimado de solución:** 10-15 minutos  
**Dificultad:** Fácil (con script automatizado)

---

## ⚡ **Solución Rápida (5 Pasos)**

### **PASO 1: Crear Base de Datos** ⏱️ 2 minutos

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas
./setup-rds-database.sh
```

El script creará automáticamente:
- ✅ Base de datos `macTickets`
- ✅ Todas las tablas (20+)
- ✅ Usuario admin de prueba

---

### **PASO 2: Configurar Variables de Entorno** ⏱️ 3 minutos

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

eb setenv \
  DB_NAME=macTickets \
  DB_HOST=tu-rds-endpoint.rds.amazonaws.com \
  DB_USER=admin \
  DB_PASSWORD=tu_password \
  NODE_ENV=production \
  PORT=8080 \
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
```

---

### **PASO 3: Reiniciar Aplicación** ⏱️ 1 minuto

```bash
eb restart
```

---

### **PASO 4: Verificar** ⏱️ 2 minutos

```bash
# Health check
curl http://tu-app.elasticbeanstalk.com/

# Login (NOTA: /api/ al inicio)
curl -X POST http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

---

### **PASO 5: Actualizar Rutas** ⏱️ 1 minuto

**❌ Incorrecto:**
```
/auth/login      → 404
/tickets         → 404
```

**✅ Correcto:**
```
/api/auth/login  → 200 ✅
/api/tickets     → 200 ✅
```

**TODAS las rutas llevan `/api/` al inicio** (excepto `/` y `/health`)

---

## 📚 **Documentación Completa**

| Documento | Para qué sirve | Cuándo usarlo |
|-----------|----------------|---------------|
| **[SOLUCION-RAPIDA.md](SOLUCION-RAPIDA.md)** | Pasos resumidos | Empezar aquí ⭐ |
| **[FIX-ELASTIC-BEANSTALK-ERRORS.md](FIX-ELASTIC-BEANSTALK-ERRORS.md)** | Guía detallada | Necesitas más info |
| **[TEST-API-ENDPOINTS.md](TEST-API-ENDPOINTS.md)** | Probar endpoints | Después de arreglar |
| **[RESUMEN-SOLUCION.md](RESUMEN-SOLUCION.md)** | Resumen ejecutivo | Para entender todo |

---

## 🗄️ **Scripts y SQL**

| Archivo | Descripción |
|---------|-------------|
| `setup-rds-database.sh` | Script automatizado (RECOMENDADO) |
| `CREATE-DATABASE-RDS.sql` | SQL para crear DB manualmente |
| `FULL-SCHEMA-AWS.sql` | Schema completo con todas las tablas |

---

## 🎯 **Verificación Rápida**

### **¿Está todo bien?**

Verifica estos puntos:

```bash
# 1. Base de datos existe
mysql -h tu-rds-endpoint -u admin -p -e "SHOW DATABASES;" | grep macTickets
# ✅ Debe aparecer 'macTickets'

# 2. Variables configuradas
eb printenv | grep DB_NAME
# ✅ Debe mostrar: DB_NAME=macTickets

# 3. Health check funciona
curl http://tu-app.elasticbeanstalk.com/
# ✅ Debe responder: {"success":true,...}

# 4. Login funciona
curl -X POST http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
# ✅ Debe responder: {"success":true,"data":{"token":"..."}}
```

---

## 🔍 **Diagnóstico de Problemas**

### **Error: "Unknown database 'macTickets'"**

```bash
# Solución:
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas
./setup-rds-database.sh
```

### **Error: "404 Not Found" en /api/auth/login**

```bash
# Verificar que las rutas estén cargadas
eb logs | grep "Servidor corriendo"

# Ver errores recientes
eb logs | tail -50
```

### **Error: "Cannot connect to RDS"**

```bash
# 1. Verificar Security Group
# AWS Console → RDS → tu-instancia → Connectivity
# Security Group debe permitir puerto 3306

# 2. Probar conexión manual
mysql -h tu-rds-endpoint -u admin -p
```

---

## 📊 **Estado Actual vs Esperado**

### **ANTES (Actual):**
```
🔴 Base de datos: No existe
🟢 Health check: ✅ (200 OK)
🔴 Login: ❌ (404 Not Found)
🔴 Tickets: ❌ (404 Not Found)
```

### **DESPUÉS (Esperado):**
```
🟢 Base de datos: ✅ Existe con todas las tablas
🟢 Health check: ✅ (200 OK)
🟢 Login: ✅ (200 OK, retorna token)
🟢 Tickets: ✅ (200 OK, retorna lista)
```

---

## 🛠️ **Comandos Útiles**

```bash
# Ver estado de la aplicación
eb status

# Ver variables de entorno
eb printenv

# Ver logs en tiempo real
eb logs --stream

# Reiniciar aplicación
eb restart

# Desplegar cambios
eb deploy

# Conectar a RDS
mysql -h tu-rds-endpoint -u admin -p

# Generar JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📋 **Checklist Final**

Marca estos puntos antes de considerar el problema resuelto:

- [ ] Base de datos `macTickets` existe
- [ ] Schema ejecutado (20+ tablas creadas)
- [ ] Usuario admin existe (username: admin, password: Admin123)
- [ ] Variables de entorno configuradas en EB
- [ ] Aplicación reiniciada
- [ ] `GET /` responde 200 OK
- [ ] `POST /api/auth/login` responde 200 (no 404)
- [ ] Login retorna token válido
- [ ] `GET /api/tickets` funciona con token
- [ ] No hay "Unknown database" en logs

---

## 🎯 **Siguiente Paso**

Una vez que tu backend funcione:

### **Configurar Frontend**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Crear/editar .env
echo "VITE_API_URL=http://tu-app.elasticbeanstalk.com/api" > .env

# Rebuild
npm run build
```

---

## 📞 **¿Necesitas Ayuda?**

### **1. Revisar Logs**
```bash
eb logs > error-logs.txt
cat error-logs.txt
```

### **2. Verificar Configuración**
```bash
eb printenv
eb status
```

### **3. Probar Conexión a RDS**
```bash
mysql -h tu-rds-endpoint -u admin -p
```

### **4. Verificar Security Groups**
- AWS Console → RDS → tu-instancia → Connectivity
- Security Group debe permitir conexiones desde Elastic Beanstalk

---

## 🚀 **Documentos Adicionales**

- [Configuración de Variables de Entorno](../AWS-ENV-PRODUCTION.md)
- [Guía Completa de AWS Deployment](01-GUIA-COMPLETA-AWS.md)
- [Referencia de Endpoints](../ENDPOINTS-REFERENCE.md)
- [Schema SQL Completo](../Schemas/FULL-SCHEMA-AWS.sql)

---

## ⚡ **Quick Commands**

```bash
# TODO EN UNO - Copiar y ejecutar
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas && \
./setup-rds-database.sh && \
cd ../../MAC/mac-tickets-api && \
eb restart && \
echo "✅ Listo! Probando..." && \
curl http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

---

**¡Listo para arreglar tu API! 🎉**

**Tiempo total:** 10-15 minutos  
**Dificultad:** ⭐⭐☆☆☆ Fácil  
**Resultado:** API funcionando al 100%
