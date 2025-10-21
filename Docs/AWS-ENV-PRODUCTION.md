# 🚀 Configuración .env para AWS Elastic Beanstalk

## 📋 **Entendiendo NODE_ENV**

### **¿Qué es NODE_ENV?**

`NODE_ENV` es una variable de entorno que define el **modo de ejecución** de tu aplicación Node.js.

```bash
# En desarrollo (tu computadora)
NODE_ENV=development

# En producción (servidor AWS)
NODE_ENV=production
```

### **Diferencias Importantes:**

| Aspecto | `development` | `production` |
|---------|---------------|--------------|
| **Logs** | Detallados (fácil debug) | Mínimos (solo errores) |
| **Stack Traces** | Completos | Ocultos |
| **Cache** | Deshabilitado | Habilitado |
| **Optimización** | Baja | Alta |
| **Velocidad** | Lenta | Rápida |
| **Seguridad** | Relajada | Estricta |

### **En tu código (app.js):**

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs detallados
} else {
  app.use(morgan('combined')); // Logs mínimos
}

// Manejo de errores
res.status(500).json({
  message: process.env.NODE_ENV === 'development' 
    ? error.message // Muestra el error en desarrollo
    : 'Error interno del servidor' // Oculta en producción
});
```

---

## 📝 **Archivo .env para PRODUCCIÓN (AWS)**

```bash
# =====================================================================
# CONFIGURACIÓN DE PRODUCCIÓN - AWS ELASTIC BEANSTALK
# =====================================================================
# IMPORTANTE: Configurar estas variables en Elastic Beanstalk Console
# NO subir este archivo a Git con valores reales

# =====================================================================
# ENTORNO
# =====================================================================
NODE_ENV=production
PORT=8080
# Nota: Elastic Beanstalk usa puerto 8080 por defecto

# =====================================================================
# BASE DE DATOS - AWS RDS MySQL
# =====================================================================
# Endpoint de tu instancia RDS (lo obtienes de AWS Console)
DB_HOST=mac-tickets-db.xxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=tickets_production
DB_USER=admin
DB_PASSWORD=TU_PASSWORD_SUPER_SEGURO_AQUI_12345
DB_LOGGING=false
# IMPORTANTE: DB_LOGGING=false en producción para mejor performance

# =====================================================================
# JWT - SECRETOS DE PRODUCCIÓN
# =====================================================================
# ⚠️ CRÍTICO: GENERAR SECRETOS NUEVOS PARA PRODUCCIÓN
# Comando para generar: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_REFRESH_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# =====================================================================
# AWS S3 - Almacenamiento de archivos adjuntos
# =====================================================================
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=tu_secret_access_key_de_40_caracteres_aqui
AWS_REGION=us-east-1
AWS_S3_BUCKET=mac-tickets-attachments-prod

# =====================================================================
# CONFIGURACIÓN DE ARCHIVOS
# =====================================================================
MAX_FILE_SIZE=10485760
# 10MB = 10 * 1024 * 1024 bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov

# =====================================================================
# EMAIL (Para notificaciones - Opcional)
# =====================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notificaciones@maccomputadoras.com
SMTP_PASS=tu_gmail_app_password_aqui
# Nota: Usar "App Password" de Gmail, no tu password normal

# =====================================================================
# CORS - URL del frontend en producción
# =====================================================================
CORS_ORIGIN=https://tickets.maccomputadoras.com
# O si usas Elastic Beanstalk para el frontend:
# CORS_ORIGIN=https://tu-app-frontend.elasticbeanstalk.com

# =====================================================================
# RATE LIMITING
# =====================================================================
RATE_LIMIT_WINDOW_MS=900000
# 15 minutos = 15 * 60 * 1000
RATE_LIMIT_MAX_REQUESTS=100

# =====================================================================
# SEGURIDAD
# =====================================================================
BCRYPT_ROUNDS=12

# =====================================================================
# LOGGING
# =====================================================================
LOG_LEVEL=error
# Solo loggear errores en producción
LOG_FILE=/var/log/app.log
```

---

## 🔧 **Archivo .env para DESARROLLO (Local)**

```bash
# =====================================================================
# CONFIGURACIÓN DE DESARROLLO - LOCAL
# =====================================================================

# =====================================================================
# ENTORNO
# =====================================================================
NODE_ENV=development
PORT=3001

# =====================================================================
# BASE DE DATOS - MySQL Local
# =====================================================================
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tickets_development
DB_USER=root
DB_PASSWORD=tu_password_local
DB_LOGGING=true
# DB_LOGGING=true para ver las queries SQL en desarrollo

# =====================================================================
# JWT - Secretos de desarrollo (pueden ser más simples)
# =====================================================================
JWT_SECRET=dev_secret_key_not_for_production_12345678
JWT_REFRESH_SECRET=dev_refresh_secret_also_not_for_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# =====================================================================
# AWS S3 - Puede ser el mismo bucket o uno de dev
# =====================================================================
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=tu_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=mac-tickets-attachments-dev

# =====================================================================
# CORS - Frontend local
# =====================================================================
CORS_ORIGIN=http://localhost:5173

# =====================================================================
# Resto de configuraciones (iguales)
# =====================================================================
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

---

## 🔐 **Cómo Generar Secretos Seguros**

### **Método 1: Node.js (Recomendado)**

```bash
# En tu terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Genera algo como:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

### **Método 2: OpenSSL**

```bash
openssl rand -hex 64
```

### **⚠️ IMPORTANTE:**
- ✅ **Usa secretos DIFERENTES** para JWT y JWT_REFRESH
- ✅ **Mínimo 64 caracteres** cada uno
- ✅ **NUNCA uses los mismos secretos** de desarrollo en producción
- ✅ **NUNCA subas el .env a Git**

---

## 🌐 **Configurar Variables en Elastic Beanstalk**

### **Opción 1: AWS Console (Recomendado)**

1. **Ir a tu aplicación** en Elastic Beanstalk
2. **Configuration** → **Software**
3. **Environment Properties** → Agregar cada variable:
   ```
   NODE_ENV = production
   DB_HOST = mac-tickets-db.xxx.rds.amazonaws.com
   JWT_SECRET = tu_secret_aqui
   ...
   ```

### **Opción 2: EB CLI**

```bash
# Configurar una variable
eb setenv NODE_ENV=production

# Configurar múltiples
eb setenv DB_HOST=xxx.rds.amazonaws.com DB_NAME=tickets_production JWT_SECRET=xxxxx

# Ver variables configuradas
eb printenv
```

### **Opción 3: Archivo .ebextensions**

Crear `.ebextensions/environment.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
    DB_LOGGING: false
    LOG_LEVEL: error
    BCRYPT_ROUNDS: 12
```

**⚠️ SOLO para variables NO sensibles**. Para secretos usa AWS Secrets Manager.

---

## 🔒 **Mejores Prácticas de Seguridad**

### **❌ NUNCA HACER:**

```bash
# NO subir .env a Git
.env  # Debe estar en .gitignore

# NO usar secretos de desarrollo en producción
JWT_SECRET=dev123  # ❌

# NO exponer secretos en logs
console.log(process.env.JWT_SECRET)  # ❌
```

### **✅ SIEMPRE HACER:**

```bash
# Verificar .gitignore
echo ".env" >> .gitignore

# Usar secretos fuertes
JWT_SECRET=<64 caracteres aleatorios>  # ✅

# Validar variables al iniciar
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado');
}
```

---

## 📋 **Checklist de Configuración**

### **Antes de Desplegar:**

- [ ] **NODE_ENV** = `production`
- [ ] **PORT** = `8080` (Elastic Beanstalk usa este puerto)
- [ ] **DB_HOST** = Endpoint de tu RDS
- [ ] **DB_PASSWORD** = Password fuerte y seguro
- [ ] **JWT_SECRET** = Nuevo secreto de 64+ caracteres
- [ ] **JWT_REFRESH_SECRET** = Otro secreto diferente de 64+ caracteres
- [ ] **AWS_S3_BUCKET** = Bucket de producción (no de dev)
- [ ] **CORS_ORIGIN** = URL de tu frontend en producción
- [ ] **DB_LOGGING** = `false` (mejor performance)
- [ ] **LOG_LEVEL** = `error` (solo errores)
- [ ] **.env** en `.gitignore`

### **Después de Desplegar:**

- [ ] Verificar conexión a RDS
- [ ] Probar login (JWT funcionando)
- [ ] Probar subida de archivos (S3 funcionando)
- [ ] Verificar CORS (frontend puede conectar)
- [ ] Revisar logs en CloudWatch
- [ ] Probar endpoints críticos

---

## 🆚 **Comparación: Development vs Production**

| Variable | Development | Production |
|----------|-------------|------------|
| `NODE_ENV` | `development` | `production` |
| `PORT` | `3001` | `8080` |
| `DB_HOST` | `localhost` | `xxx.rds.amazonaws.com` |
| `DB_LOGGING` | `true` | `false` |
| `JWT_SECRET` | Simple | 64+ caracteres random |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://tu-dominio.com` |
| `LOG_LEVEL` | `info` / `debug` | `error` |
| `AWS_S3_BUCKET` | `bucket-dev` | `bucket-prod` |

---

## 🚀 **Comandos Útiles para Despliegue**

### **1. Verificar variables locales:**
```bash
cat .env
```

### **2. Verificar variables en EB:**
```bash
eb printenv
```

### **3. Configurar variable en EB:**
```bash
eb setenv NODE_ENV=production
```

### **4. Ver logs del servidor:**
```bash
eb logs
```

### **5. Desplegar cambios:**
```bash
eb deploy
```

---

## 📞 **Troubleshooting**

### **Error: "Cannot connect to database"**
```bash
# Verificar que RDS permite conexiones desde EB
# Security Group debe permitir puerto 3306
# DB_HOST debe ser el endpoint correcto
```

### **Error: "CORS policy"**
```bash
# Verificar CORS_ORIGIN
eb setenv CORS_ORIGIN=https://tu-frontend.com
```

### **Error: "JWT invalid"**
```bash
# Verificar que JWT_SECRET está configurado
eb printenv | grep JWT_SECRET
```

---

## 📚 **Recursos Adicionales**

- [Elastic Beanstalk Environment Properties](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html)
- [AWS RDS Security Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)

---

**¿Necesitas ayuda configurando alguna variable específica?** 🚀

