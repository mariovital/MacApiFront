# 📁 Fix: Aumentar Límite de Tamaño de Archivos (50 MB)

**Problema:** Archivos mayores a ~1 MB no se pueden subir en la aplicación.

**Solución:** Aumentar límites en múltiples capas del stack.

---

## 🔍 **PROBLEMA DIAGNOSTICADO**

### **Capas con Límites:**

```
1. ❌ Express (body-parser): 10 MB por defecto
2. ❌ Multer (file upload): Sin límite explícito
3. ❌ Nginx (Elastic Beanstalk): 1 MB por defecto
4. ⚠️  API Gateway: 10 MB (límite de AWS, no configurable)
```

### **Resultado:**
- ✅ Archivos < 1 MB: Funcionan
- ❌ Archivos > 1 MB: Rechazados por nginx
- ❌ Archivos > 10 MB: Rechazados por API Gateway (límite de AWS)

---

## ✅ **SOLUCIÓN IMPLEMENTADA**

### **Cambios Realizados:**

#### **1. Backend - Express Limits**
```javascript
// src/app.js
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

#### **2. Backend - Multer Configuration**
```javascript
// src/routes/tickets.js
const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB máximo
    files: 10 // Máximo 10 archivos simultáneos
  },
  fileFilter: (_req, file, cb) => {
    // Tipos de archivo permitidos
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'video/mp4', 'video/quicktime'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
    }
  }
});
```

#### **3. Backend - Error Handling**
```javascript
// src/controllers/ticketController.js
catch (error) {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ 
      success: false, 
      message: 'Archivo demasiado grande. Máximo permitido: 50 MB',
      code: 'FILE_TOO_LARGE'
    });
  }
  
  if (error.message && error.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ 
      success: false, 
      message: error.message,
      code: 'INVALID_FILE_TYPE'
    });
  }
}
```

#### **4. Elastic Beanstalk - Nginx Configuration**
```yaml
# .ebextensions/02-nginx-file-upload.config
files:
  "/etc/nginx/conf.d/proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      client_max_body_size 50M;
      client_body_timeout 300s;
      proxy_connect_timeout 300s;
      proxy_send_timeout 300s;
      proxy_read_timeout 300s;

container_commands:
  01_reload_nginx:
    command: "sudo service nginx reload"
```

#### **5. Frontend - Client-Side Validation**
```javascript
// src/pages/tickets/TicketDetail.jsx
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);

if (oversizedFiles.length > 0) {
  const fileNames = oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n');
  alert(`❌ Los siguientes archivos exceden el límite de 50 MB:\n\n${fileNames}`);
  return;
}
```

---

## 🚀 **DEPLOYMENT**

### **Opción A: Deploy con .ebextensions (RECOMENDADO)**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

# Generar ZIP completo
./prepare-full-deploy.sh

# Salida esperada:
# ✅ mac-tickets-api-full.zip creado
```

**Subir a AWS:**
```
1. AWS Elastic Beanstalk Console
2. Environment: TicketSystem-env
3. Upload and Deploy
4. Archivo: mac-tickets-api-full.zip
5. Version label: v1.3-increase-file-limits
6. Deploy
7. ⏳ Espera 5-8 minutos
```

**Pros:**
- ✅ Todo configurado automáticamente
- ✅ Nginx configurado correctamente
- ✅ Persistente en futuros deploys

**Contras:**
- ⚠️  Deploy más lento (5-8 min vs 3-5 min)
- ⚠️  Posible timeout si tarda >10 min

---

### **Opción B: Deploy sin .ebextensions + Configuración Manual**

Si la Opción A falla o toma >10 minutos:

#### **Paso 1: Deploy Minimal**
```bash
./prepare-minimal-deploy.sh

# Upload mac-tickets-api-minimal.zip
```

#### **Paso 2: Configurar Nginx Manualmente (SSH)**

```bash
# Conectar por SSH
eb ssh

# O usar AWS Session Manager desde Console

# Crear archivo de configuración de nginx
sudo tee /etc/nginx/conf.d/proxy.conf > /dev/null <<EOF
client_max_body_size 50M;
client_body_timeout 300s;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
EOF

# Verificar sintaxis de nginx
sudo nginx -t

# Recargar nginx
sudo service nginx reload

# Verificar que nginx está corriendo
sudo service nginx status

# Salir
exit
```

**Verificar:**
```bash
# Desde tu computadora
curl -I https://[TU-URL]/api/health

# Buscar en headers:
# HTTP/1.1 200 OK
```

---

## 🧪 **TESTING**

### **Test 1: Archivo de 5 MB**

```
1. Login en https://mac-api-front.vercel.app
2. Crear o abrir ticket
3. Sección "Archivos Adjuntos"
4. Subir archivo de ~5 MB
5. ✅ Debe subir exitosamente
6. ✅ Preview debe aparecer
7. ✅ Descarga debe funcionar
```

### **Test 2: Archivo de 25 MB**

```
1. Mismo proceso
2. Archivo de ~25 MB
3. ⏳ Barra de progreso debe mostrarse
4. ✅ Debe subir sin errores
5. Tiempo estimado: 30-60 segundos
```

### **Test 3: Archivo de 60 MB (Debe Fallar)**

```
1. Intentar subir archivo >50 MB
2. ❌ Frontend debe mostrar alert ANTES de subir
3. Mensaje: "Los siguientes archivos exceden el límite de 50 MB"
4. ✅ No se hace request al servidor
```

### **Test 4: Múltiples Archivos**

```
1. Seleccionar 3 archivos:
   - imagen.png (2 MB)
   - documento.pdf (10 MB)
   - video.mp4 (30 MB)
2. Total: 42 MB
3. ✅ Todos deben subir correctamente
4. Progreso: 33%, 66%, 100%
```

---

## 📊 **LÍMITES FINALES**

### **Configuración Actual:**

```
✅ Express JSON/URL: 50 MB
✅ Multer: 50 MB por archivo
✅ Nginx: 50 MB
✅ Frontend validation: 50 MB
⚠️  API Gateway: 10 MB (límite de AWS)
```

### **Límites Prácticos:**

```
Frontend (Vercel) → API Gateway → Elastic Beanstalk

Directo a Elastic Beanstalk:
  ✅ Archivos hasta 50 MB
  
A través de API Gateway:
  ❌ Archivos >10 MB bloqueados por AWS
  
Solución para >10 MB:
  - Usar upload directo a S3 (futuro)
  - O bypass API Gateway (dominio directo)
```

---

## 🔧 **TROUBLESHOOTING**

### **Error 1: "413 Payload Too Large"**

**Causa:** Nginx no configurado correctamente

**Solución:**
```bash
eb ssh
sudo cat /etc/nginx/conf.d/proxy.conf
# Debe mostrar: client_max_body_size 50M;

# Si no existe:
sudo tee /etc/nginx/conf.d/proxy.conf > /dev/null <<EOF
client_max_body_size 50M;
EOF

sudo service nginx reload
```

---

### **Error 2: "LIMIT_FILE_SIZE" en logs**

**Causa:** Multer rechazando archivo

**Verificar:**
```javascript
// Backend logs deben mostrar:
✅ Archivo subido: archivo.mp4 (45.23 MB)

// O error:
❌ Error: Archivo demasiado grande. Máximo permitido: 50 MB
```

**Solución:**
- Verificar que backend tenga cambios de multer
- Redeploy si es necesario

---

### **Error 3: Archivo sube pero no aparece en lista**

**Causa:** Falta await loadTicketData()

**Verificar en frontend:**
```javascript
await ticketService.uploadAttachment(id, file, '');
// Después del loop:
await loadTicketData(); // ✅ Debe estar presente
```

---

### **Error 4: Deploy de .ebextensions tarda >10 min**

**Síntomas:**
- Deploy en "In Progress" por más de 10 minutos
- Logs muestran "Running command 01_reload_nginx"
- EventStream sin actualizaciones

**Solución:**
1. Cancelar deploy actual
2. Usar Opción B (deploy minimal + configuración manual)
3. Funciona igual, solo requiere 1 paso extra de SSH

---

## 📋 **TIPOS DE ARCHIVO PERMITIDOS**

```javascript
✅ Imágenes:
   - JPEG/JPG
   - PNG
   - GIF
   - WebP

✅ Documentos:
   - PDF
   - Word (.doc, .docx)
   - Excel (.xls, .xlsx)
   - Text (.txt)

✅ Videos:
   - MP4
   - QuickTime (.mov)

❌ Bloqueados:
   - Ejecutables (.exe, .sh, .bat)
   - Scripts (.js, .py, .php)
   - Archivos de sistema
```

---

## 🎯 **RESUMEN**

### **Antes:**
```
❌ Máximo: ~1 MB (nginx default)
❌ Sin validación frontend
❌ Sin mensajes claros de error
```

### **Después:**
```
✅ Máximo: 50 MB
✅ Validación frontend antes de subir
✅ Mensajes claros de error
✅ Tipos de archivo restringidos
✅ Progress bar durante upload
✅ Logs detallados en backend
```

---

## 🚦 **PRÓXIMOS PASOS**

### **AHORA (Deployment):**

```bash
1. cd MAC/mac-tickets-api
2. ./prepare-full-deploy.sh
3. Subir mac-tickets-api-full.zip a AWS
4. Esperar 5-8 minutos
5. Probar con archivo de 25 MB
```

### **Frontend (Vercel):**

```
1. Los cambios ya están en GitHub
2. Vercel autodeploy en ~3 minutos
3. Verificar que esté en producción
4. Probar validación de 50 MB
```

### **Futuro (Opcional):**

```
- Implementar upload directo a S3 para archivos >10 MB
- Bypass API Gateway con dominio directo a Elastic Beanstalk
- Implementar compresión de imágenes en frontend
- Agregar soporte para más tipos de archivo
```

---

## ✅ **CHECKLIST FINAL**

```
Backend Changes:
✅ Express limits aumentados a 50mb
✅ Multer configurado con 50MB limit
✅ File filter para tipos permitidos
✅ Error handling mejorado
✅ Logs detallados

Frontend Changes:
✅ Validación de 50MB antes de upload
✅ Mensajes de error claros
✅ Progress indicator
✅ Logs de upload

Infrastructure:
✅ .ebextensions/02-nginx-file-upload.config
✅ Script prepare-full-deploy.sh
✅ Documentación completa

Testing:
⏳ Pendiente: Deploy y probar con archivos grandes
⏳ Pendiente: Verificar en todos los tipos de archivo
⏳ Pendiente: Probar múltiples archivos simultáneos
```

---

**¡Ya está todo listo para el deploy!** 🚀

Sube el archivo `mac-tickets-api-full.zip` a AWS Elastic Beanstalk y prueba con archivos de hasta 50 MB.

