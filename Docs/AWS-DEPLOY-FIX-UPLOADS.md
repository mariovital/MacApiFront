# 🚀 Fix: Deploy Correcto para AWS Elastic Beanstalk

## 🔴 **PROBLEMA IDENTIFICADO**

Al subir solo `src/` y `package.json` a AWS Elastic Beanstalk, el sistema de archivos adjuntos falla porque:

1. ❌ **Carpeta `uploads/` no existe** → Error al guardar archivos
2. ❌ **Sin `package-lock.json`** → Versiones de dependencias incorrectas
3. ❌ **Sin configuración de permisos** → Carpeta uploads sin permisos de escritura

---

## ✅ **SOLUCIÓN IMPLEMENTADA**

### **1. Script de Deploy Automatizado**
**Archivo:** `MAC/mac-tickets-api/prepare-aws-deploy.sh`

Este script crea automáticamente un ZIP con la estructura correcta:

```
mac-tickets-api-aws.zip
├── .ebextensions/
│   └── 01-uploads-folder.config  ← Crea carpeta uploads
├── src/                          ← Todo el código fuente
├── uploads/                      ← Carpeta vacía inicial
├── package.json                  ← Dependencias
├── package-lock.json             ← Versiones exactas
└── .ebignore                     ← Archivos a ignorar
```

### **2. Configuración de Elastic Beanstalk**
**Archivo:** `.ebextensions/01-uploads-folder.config`

Asegura que:
- ✅ La carpeta `uploads/` se cree automáticamente
- ✅ Tenga permisos `777` (lectura/escritura/ejecución)
- ✅ El propietario sea `webapp:webapp`

### **3. Modelo de Base de Datos Corregido**
- ✅ Eliminadas columnas `s3_url` y `s3_key`
- ✅ Ahora coincide con el esquema de AWS RDS

---

## 📦 **CÓMO USAR EL SCRIPT**

### **Paso 1: Ejecutar el Script**

```bash
cd MAC/mac-tickets-api
./prepare-aws-deploy.sh
```

**Salida esperada:**
```
🚀 Preparando deploy para AWS Elastic Beanstalk...
📁 Creando carpeta temporal...
📦 Copiando archivos necesarios...
   ✅ Configuración .ebextensions copiada
🗜️  Creando archivo ZIP...
✅ ¡Listo! Archivo creado: mac-tickets-api-aws.zip
```

### **Paso 2: Subir a AWS Elastic Beanstalk**

#### **Opción A: Desde la Consola Web**
```
1. Ve a: https://console.aws.amazon.com/elasticbeanstalk
2. Selecciona tu aplicación: "TicketSystem"
3. Selecciona el ambiente: "TicketSystem-env"
4. Click en "Upload and deploy"
5. Click en "Choose file"
6. Selecciona: mac-tickets-api-aws.zip
7. Version label: "v1.0-fix-uploads" (o similar)
8. Click en "Deploy"
9. Espera 3-5 minutos ⏳
```

#### **Opción B: Desde Terminal (EB CLI)**
```bash
cd MAC/mac-tickets-api

# Instalar EB CLI si no está instalado
# pip install awsebcli

# Inicializar EB (solo primera vez)
# eb init

# Deploy
eb deploy

# Ver logs en tiempo real
eb logs --follow
```

### **Paso 3: Verificar Deploy**

```bash
# Ver eventos del deploy
eb events

# Ver estado de salud
eb health

# Ver logs
eb logs
```

---

## 🧪 **PROBAR QUE FUNCIONA**

### **1. Verificar que la carpeta uploads existe**

Conéctate por SSH a tu instancia:
```bash
eb ssh

# Verificar carpeta uploads
ls -la /var/app/current/uploads
# Debe mostrar: drwxrwxrwx webapp webapp

# Probar escribir un archivo
touch /var/app/current/uploads/test.txt
# Debe funcionar sin error

# Salir
exit
```

### **2. Probar subida de archivo desde el dashboard**

```
1. Ir a: https://mac-api-front.vercel.app
2. Login como admin
3. Abrir cualquier ticket
4. Ir a "Archivos Adjuntos"
5. Seleccionar un archivo (imagen o PDF)
6. Click en "Subir Archivos"
7. ✅ Debe subir exitosamente (sin error 500)
```

### **3. Verificar en logs**

```bash
# Ver logs en tiempo real
eb logs --follow

# Buscar confirmación de subida exitosa
# Deberías ver algo como:
# "Archivo adjuntado exitosamente"
# Y NO ver: "Unknown column 's3_url'"
```

---

## 📋 **CONTENIDO DEL ZIP**

### **Archivos Principales**
```
✅ package.json            - Dependencias del proyecto
✅ package-lock.json       - Versiones exactas (CRÍTICO)
✅ .ebignore              - Archivos a ignorar en deploy
✅ src/                   - Todo el código fuente
✅ uploads/               - Carpeta para archivos (vacía inicial)
✅ .ebextensions/         - Configuración de Elastic Beanstalk
```

### **Qué NO incluye (correcto)**
```
❌ node_modules/          - Se instala automáticamente
❌ .env                   - Variables de entorno van en EB Console
❌ .git/                  - No necesario
❌ *.log                  - Logs locales
```

---

## 🔧 **CONFIGURACIÓN DE .ebextensions**

### **Archivo: `.ebextensions/01-uploads-folder.config`**

```yaml
# Crea la carpeta uploads durante el deploy
commands:
  01_create_uploads_directory:
    command: "mkdir -p /var/app/current/uploads"
    ignoreErrors: true
  
  02_set_uploads_permissions:
    command: "chmod 777 /var/app/current/uploads"
    ignoreErrors: true
  
  03_set_uploads_owner:
    command: "chown -R webapp:webapp /var/app/current/uploads"
    ignoreErrors: true

container_commands:
  01_ensure_uploads_exists:
    command: "mkdir -p uploads && chmod 777 uploads"
    leader_only: false
```

**Lo que hace:**
1. Crea `/var/app/current/uploads` si no existe
2. Le da permisos `777` (rwxrwxrwx)
3. Cambia el propietario a `webapp:webapp`
4. Se ejecuta en CADA deploy automáticamente

---

## 🐛 **TROUBLESHOOTING**

### **Error: "ENOENT: no such file or directory, open '/uploads/...'"**

**Causa:** Carpeta uploads no existe o no tiene permisos

**Solución:**
```bash
# Conectarse por SSH
eb ssh

# Crear carpeta manualmente
sudo mkdir -p /var/app/current/uploads
sudo chmod 777 /var/app/current/uploads
sudo chown webapp:webapp /var/app/current/uploads

# Reiniciar servidor
sudo systemctl restart web.service
```

### **Error: "Unknown column 's3_url' in 'field list'"**

**Causa:** Código viejo todavía desplegado

**Solución:**
1. Asegúrate de usar el ZIP generado por el script
2. Verifica que el modelo `TicketAttachment.js` NO tenga `s3_url` ni `s3_key`
3. Haz un nuevo deploy

### **Error: "Application update is aborting (running for 15 minutes)"**

**Causa:** Deploy timeout

**Solución:**
```bash
# Abortar deploy actual
eb abort

# Esperar 5 minutos

# Intentar de nuevo
eb deploy --timeout 20
```

### **Error: "No module found" al iniciar**

**Causa:** `package-lock.json` no incluido

**Solución:**
1. Verificar que `package-lock.json` esté en el ZIP
2. Ejecutar el script nuevamente
3. Deploy otra vez

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

Antes de hacer deploy, verifica:

- [ ] Script ejecutado: `./prepare-aws-deploy.sh`
- [ ] Archivo creado: `mac-tickets-api-aws.zip`
- [ ] ZIP contiene `.ebextensions/`
- [ ] ZIP contiene `uploads/` (vacía)
- [ ] ZIP contiene `package-lock.json`
- [ ] Modelo `TicketAttachment.js` sin `s3_url`/`s3_key`
- [ ] Variables de entorno configuradas en EB Console
- [ ] Backup de versión anterior hecho

Después del deploy, verifica:

- [ ] Deploy completado (sin errores)
- [ ] Health: OK (verde)
- [ ] Carpeta `/var/app/current/uploads` existe
- [ ] Permisos correctos: `drwxrwxrwx`
- [ ] Subir archivo funciona (sin error 500)
- [ ] Archivo aparece en la lista

---

## 📊 **COMPARACIÓN**

### **Antes (Deploy Incorrecto):**
```
❌ Solo src/ y package.json
❌ Sin carpeta uploads/
❌ Sin package-lock.json
❌ Sin configuración de permisos
❌ Modelo con s3_url/s3_key

Resultado: Error 500 al subir archivos
```

### **Después (Deploy Correcto):**
```
✅ ZIP completo con script
✅ Carpeta uploads/ creada automáticamente
✅ package-lock.json incluido
✅ Permisos configurados en .ebextensions
✅ Modelo sin s3_url/s3_key

Resultado: ✅ Subida de archivos funciona perfectamente
```

---

## 🚀 **DESPLIEGUE RÁPIDO (RESUMEN)**

```bash
# 1. Crear ZIP correcto
cd MAC/mac-tickets-api
./prepare-aws-deploy.sh

# 2. Subir a AWS EB
# Opción A: Consola Web (recomendado)
# - Ve a: https://console.aws.amazon.com/elasticbeanstalk
# - Upload and deploy → mac-tickets-api-aws.zip

# Opción B: EB CLI
eb deploy

# 3. Esperar 3-5 minutos ⏳

# 4. Verificar
eb health
eb logs

# 5. Probar subir archivo desde dashboard
# ✅ Debe funcionar sin error 500
```

---

## 📅 **HISTORIAL DE CAMBIOS**

### **v1.0 - Fix Uploads (23/Oct/2025)**
- ✅ Eliminadas columnas `s3_url` y `s3_key` del modelo
- ✅ Creado script de deploy automatizado
- ✅ Agregada configuración `.ebextensions`
- ✅ Documentación completa

---

## 📞 **SOPORTE**

### **Logs Útiles**

```bash
# Ver logs de Elastic Beanstalk
eb logs

# Ver logs en tiempo real
eb logs --follow

# Ver logs de eventos
eb events

# Ver estado de salud
eb health --refresh
```

### **Variables de Entorno**

Verificar en EB Console → Configuration → Software:
```
DB_HOST=macticketsdb.xxxx.us-east-1.rds.amazonaws.com
DB_NAME=macTickets
DB_USER=admin
DB_PASSWORD=xxxxx
JWT_SECRET=xxxxx
UPLOAD_DIR=./uploads
NODE_ENV=production
```

---

**Fecha:** 23 de Octubre, 2025  
**Estado:** ✅ LISTO PARA DEPLOY  
**Archivo ZIP:** `mac-tickets-api-aws.zip`  
**Ubicación:** `MAC/mac-tickets-api/`

