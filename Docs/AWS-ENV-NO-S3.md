# 🚀 Configuración .env para AWS (Sin S3)

## 📋 **Stack de Infraestructura**

- ✅ **AWS RDS** - Base de datos MySQL
- ✅ **Elastic Beanstalk** - Backend Node.js
- ✅ **API Gateway** - (Opcional si Elastic Beanstalk ya expone la API)
- ✅ **Amplify** - Frontend React
- ❌ **S3** - NO se usa (archivos en servidor local)

---

## 📝 **Archivo .env para PRODUCCIÓN**

```bash
# =====================================================================
# CONFIGURACIÓN DE PRODUCCIÓN - AWS (SIN S3)
# =====================================================================

# =====================================================================
# ENTORNO
# =====================================================================
NODE_ENV=production
PORT=8080

# =====================================================================
# BASE DE DATOS - AWS RDS MySQL
# =====================================================================
DB_HOST=mac-tickets-db.xxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=tickets_production
DB_USER=admin
DB_PASSWORD=TU_PASSWORD_SEGURO_AQUI
DB_LOGGING=false

# =====================================================================
# JWT - SECRETOS DE PRODUCCIÓN
# =====================================================================
JWT_SECRET=generar_secreto_64_caracteres_con_crypto
JWT_REFRESH_SECRET=otro_secreto_diferente_64_caracteres
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# =====================================================================
# ARCHIVOS LOCALES (SIN S3)
# =====================================================================
UPLOAD_DIR=/var/app/current/uploads
# Directorio donde Elastic Beanstalk guarda los archivos
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov

# =====================================================================
# CORS - URL del frontend en Amplify
# =====================================================================
CORS_ORIGIN=https://main.xxxxx.amplifyapp.com
# O tu dominio personalizado:
# CORS_ORIGIN=https://tickets.maccomputadoras.com

# =====================================================================
# RATE LIMITING
# =====================================================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# =====================================================================
# SEGURIDAD
# =====================================================================
BCRYPT_ROUNDS=12

# =====================================================================
# LOGGING
# =====================================================================
LOG_LEVEL=error
LOG_FILE=/var/log/app.log
```

---

## 📝 **Archivo .env para DESARROLLO**

```bash
# =====================================================================
# DESARROLLO - LOCAL
# =====================================================================

NODE_ENV=development
PORT=3001

# BASE DE DATOS LOCAL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tickets_development
DB_USER=root
DB_PASSWORD=tu_password_local
DB_LOGGING=true

# JWT (Pueden ser simples en desarrollo)
JWT_SECRET=dev_secret_key_12345678
JWT_REFRESH_SECRET=dev_refresh_secret_12345678
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ARCHIVOS LOCALES
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov

# CORS LOCAL
CORS_ORIGIN=http://localhost:5173

# OTROS
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

---

## ⚠️ **IMPORTANTE: Limitaciones Sin S3**

### **Problema con Elastic Beanstalk:**

Elastic Beanstalk **NO persiste archivos** entre deployments. Cuando haces redeploy:
- ❌ Los archivos en `/uploads` se pierden
- ❌ No hay almacenamiento persistente por defecto

### **Soluciones:**

#### **Opción 1: EFS (Elastic File System) - Recomendado** ✅

Montar un sistema de archivos persistente en Elastic Beanstalk.

**Ventajas:**
- ✅ Archivos persisten entre deployments
- ✅ Compartido entre todas las instancias
- ✅ Escalable automáticamente

**Configuración:**

1. **Crear EFS en AWS Console**
2. **Configurar en `.ebextensions/efs-mount.config`:**

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    UPLOAD_DIR: /efs/uploads

files:
  "/opt/elasticbeanstalk/hooks/appdeploy/pre/01_mount_efs.sh":
    mode: "000755"
    owner: root
    group: root
    content: |
      #!/bin/bash
      EFS_ID=fs-xxxxxxxx
      EFS_MOUNT_DIR=/efs
      
      mkdir -p ${EFS_MOUNT_DIR}
      mount -t efs ${EFS_ID}:/ ${EFS_MOUNT_DIR}
      mkdir -p ${EFS_MOUNT_DIR}/uploads
      chown -R webapp:webapp ${EFS_MOUNT_DIR}/uploads
```

#### **Opción 2: Guardar en Base de Datos (BLOB)** 🔄

Guardar archivos directamente en MySQL como BLOB.

**Ventajas:**
- ✅ No se pierden en deployments
- ✅ Simple, sin configuración extra

**Desventajas:**
- ❌ Base de datos más grande
- ❌ Más lento para archivos grandes
- ❌ Backups más pesados

**Modificación necesaria en el modelo:**

```sql
ALTER TABLE ticket_attachments 
ADD COLUMN file_data LONGBLOB,
ADD COLUMN file_size INT;
```

#### **Opción 3: Volver a S3** 💡

Honestamente, **S3 es la mejor opción** para archivos con AWS. Es:
- ✅ Barato ($0.023 por GB/mes)
- ✅ Duradero (99.999999999% durabilidad)
- ✅ Escalable
- ✅ No se pierde en deployments

---

## 🔧 **Configuración de Multer (Ya Configurado)**

Tu código actual ya usa Multer para guardar archivos localmente. Está bien configurado:

```javascript
// /middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
```

---

## 📋 **Configurar en Elastic Beanstalk**

### **Método 1: AWS Console**

1. **Elastic Beanstalk** → Tu aplicación → **Configuration**
2. **Software** → **Edit**
3. **Environment Properties:**

```
NODE_ENV                = production
PORT                    = 8080
DB_HOST                 = xxx.rds.amazonaws.com
DB_NAME                 = tickets_production
DB_USER                 = admin
DB_PASSWORD             = tu_password
JWT_SECRET              = tu_secret_64_chars
JWT_REFRESH_SECRET      = otro_secret_64_chars
UPLOAD_DIR              = /var/app/current/uploads
CORS_ORIGIN             = https://main.xxxxx.amplifyapp.com
MAX_FILE_SIZE           = 10485760
ALLOWED_FILE_TYPES      = jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov
RATE_LIMIT_WINDOW_MS    = 900000
RATE_LIMIT_MAX_REQUESTS = 100
BCRYPT_ROUNDS           = 12
LOG_LEVEL               = error
DB_LOGGING              = false
```

### **Método 2: EB CLI**

```bash
eb setenv \
  NODE_ENV=production \
  PORT=8080 \
  DB_HOST=xxx.rds.amazonaws.com \
  DB_NAME=tickets_production \
  DB_USER=admin \
  DB_PASSWORD=tu_password \
  JWT_SECRET=tu_secret \
  JWT_REFRESH_SECRET=otro_secret \
  UPLOAD_DIR=/var/app/current/uploads \
  CORS_ORIGIN=https://tu-amplify-app.amplifyapp.com \
  MAX_FILE_SIZE=10485760 \
  BCRYPT_ROUNDS=12 \
  DB_LOGGING=false \
  LOG_LEVEL=error
```

---

## 🌐 **CORS con Amplify**

Tu frontend estará en Amplify, entonces el CORS_ORIGIN debe ser:

```bash
# URL generada por Amplify
CORS_ORIGIN=https://main.d1a2b3c4d5e6.amplifyapp.com

# O si tienes dominio personalizado
CORS_ORIGIN=https://tickets.maccomputadoras.com
```

---

## 🔐 **Generar Secretos JWT**

```bash
# Ejecutar en tu terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Obtendrás algo como:
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...

# Copiar y usar para JWT_SECRET
# Ejecutar de nuevo para JWT_REFRESH_SECRET (debe ser diferente)
```

---

## 📊 **Arquitectura Sin S3**

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  AWS Amplify (Frontend) │
│  React + Vite           │
└──────────┬──────────────┘
           │
           │ API Calls
           ▼
┌────────────────────────────────┐
│  API Gateway (Opcional)        │
│  O directo a EB                │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Elastic Beanstalk (Backend)   │
│  Node.js + Express             │
│  Archivos en /uploads          │
│  ⚠️ Se pierden en redeploy      │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  AWS RDS (Base de Datos)       │
│  MySQL 8.0                     │
└────────────────────────────────┘
```

---

## ⚠️ **Recomendación Final**

### **Escenario 1: Pocos Archivos o No Críticos**
- ✅ Usar almacenamiento local (`UPLOAD_DIR=/var/app/current/uploads`)
- ⚠️ **Advertir a usuarios** que archivos pueden perderse en mantenimiento
- Hacer backups regulares de `/uploads`

### **Escenario 2: Archivos Importantes**
- ✅ **Usar EFS** (Elastic File System) con Elastic Beanstalk
- Configurar mounting automático
- ~$10-20/mes adicionales

### **Escenario 3: Mejor Opción**
- ✅ **Reconsiderar S3**
- Solo ~$1-2/mes para archivos típicos
- Sin riesgo de pérdida
- Más simple de configurar

---

## 📋 **Checklist de Configuración**

### **Variables de Entorno:**
- [ ] `NODE_ENV=production`
- [ ] `PORT=8080`
- [ ] `DB_HOST=` (RDS endpoint)
- [ ] `DB_PASSWORD=` (seguro)
- [ ] `JWT_SECRET=` (64+ chars aleatorios)
- [ ] `JWT_REFRESH_SECRET=` (64+ chars diferentes)
- [ ] `UPLOAD_DIR=/var/app/current/uploads`
- [ ] `CORS_ORIGIN=` (URL de Amplify)
- [ ] `DB_LOGGING=false`
- [ ] `LOG_LEVEL=error`

### **Archivos:**
- [ ] `.env` en `.gitignore`
- [ ] Carpeta `/uploads` existe
- [ ] Permisos correctos en `/uploads`

### **Infraestructura:**
- [ ] RDS creado y accesible
- [ ] Elastic Beanstalk configurado
- [ ] Amplify conectado al repo
- [ ] Security Groups configurados (RDS acepta desde EB)

---

## 🔧 **Crear Carpeta de Uploads en EB**

Agregar `.ebextensions/create-uploads.config`:

```yaml
container_commands:
  01_create_uploads:
    command: |
      mkdir -p /var/app/current/uploads
      chown -R webapp:webapp /var/app/current/uploads
      chmod -R 755 /var/app/current/uploads
```

---

## 📝 **Resumen de Variables (Sin S3)**

```bash
# CRÍTICAS
NODE_ENV=production
PORT=8080
DB_HOST=xxx.rds.amazonaws.com
DB_PASSWORD=password_seguro
JWT_SECRET=64_chars_random
CORS_ORIGIN=https://tu-amplify.amplifyapp.com

# ARCHIVOS (SIN S3)
UPLOAD_DIR=/var/app/current/uploads
MAX_FILE_SIZE=10485760

# SEGURIDAD
BCRYPT_ROUNDS=12
DB_LOGGING=false
LOG_LEVEL=error
```

---

**¿Quieres que te ayude a configurar EFS para que los archivos persistan, o prefieres la opción de guardarlos en la base de datos como BLOB?** 🚀

O si cambias de opinión sobre S3, puedo ayudarte con eso también. S3 realmente es la mejor opción para archivos con AWS. 💡
