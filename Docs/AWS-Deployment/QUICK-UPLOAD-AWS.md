# ⚡ GUÍA RÁPIDA: Subir ZIP a AWS Elastic Beanstalk

## 🎯 **OBJETIVO**
Subir el archivo `mac-tickets-api-aws.zip` a tu ambiente de Elastic Beanstalk para corregir el error de archivos adjuntos.

---

## 📦 **ARCHIVO LISTO**

✅ **Ubicación del ZIP:**
```
/Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api/mac-tickets-api-aws.zip
```

✅ **Contenido incluido:**
- ✅ Código fuente actualizado (`src/`)
- ✅ Modelo corregido (sin `s3_url`/`s3_key`)
- ✅ Configuración `.ebextensions` (crea carpeta uploads)
- ✅ `package.json` y `package-lock.json`
- ✅ Carpeta `uploads/` vacía inicial

---

## 🚀 **PASOS PARA SUBIR (5 minutos)**

### **Paso 1: Abrir AWS Console**

```
🌐 Ir a: https://console.aws.amazon.com/elasticbeanstalk
```

**Login con tus credenciales de AWS**

---

### **Paso 2: Seleccionar la Aplicación**

```
1. En la lista de aplicaciones, busca: "TicketSystem"
2. Click en "TicketSystem"
```

---

### **Paso 3: Seleccionar el Ambiente**

```
1. Verás el ambiente: "TicketSystem-env"
2. Click en "TicketSystem-env"
```

Deberías ver la pantalla que compartiste con:
- ⏳ "Elastic Beanstalk is updating your environment..."

---

### **Paso 4: Esperar que Termine el Update Actual**

```
⚠️ IMPORTANTE: Espera que el update actual termine
   (puede tardar 3-5 minutos más)

✅ Cuando esté listo, verás:
   - Health: OK (verde)
   - No más mensaje azul de "updating"
```

---

### **Paso 5: Upload and Deploy**

```
1. Click en el botón "Upload and deploy" (arriba a la derecha)

2. Se abrirá un diálogo con:
   ┌────────────────────────────────────┐
   │  Choose file: [Browse...]          │
   │                                    │
   │  Version label: [opcional]         │
   │                                    │
   │  [Cancel]  [Deploy]                │
   └────────────────────────────────────┘

3. Click en "Choose file"

4. Navega a:
   /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api/

5. Selecciona: mac-tickets-api-aws.zip

6. Version label (opcional): 
   "v1.0-fix-uploads-final"

7. Click en "Deploy"
```

---

### **Paso 6: Esperar el Deploy**

```
⏳ Tiempo estimado: 3-5 minutos

Verás mensajes como:
- "Environment update is starting"
- "Running command..."
- "Performing application deployment"
- "New application version deployed"
```

**Estados esperados:**
```
1. 🔵 Updating (0-2 min)
2. 🟡 Warning (2-3 min) - Es normal durante deploy
3. 🟢 OK (3-5 min) - ✅ Deploy completado
```

---

### **Paso 7: Verificar que Funcionó**

#### **Opción A: Desde la UI**

```
1. Ir a: https://mac-api-front.vercel.app
2. Login como admin
3. Abrir un ticket
4. Ir a "Archivos Adjuntos"
5. Seleccionar un archivo (imagen o PDF)
6. Click en "Subir Archivos"
7. ✅ Debe subir SIN error 500
8. ✅ Archivo debe aparecer en la lista
```

#### **Opción B: Verificar Logs**

```
1. En Elastic Beanstalk Console
2. Ve a la pestaña "Logs"
3. Click en "Request Logs" → "Last 100 Lines"
4. Espera 10-20 segundos
5. Click en "Download"
6. Abre el archivo y busca:

✅ Deberías ver:
   "Archivo adjuntado exitosamente"

❌ NO deberías ver:
   "Unknown column 's3_url'"
```

---

## 🐛 **SI ALGO SALE MAL**

### **Error: "Application update is aborting"**

**Solución:**
```
1. En la barra azul de arriba, click en "Abort Current Operation"
2. Espera 5 minutos
3. Intenta el deploy de nuevo
```

### **Error: Health sigue en "Warning" después de 10 minutos**

**Solución:**
```
1. Ve a la pestaña "Health"
2. Mira qué instancias están fallando
3. Ve a "Logs" → "Request Logs" → "Last 100 Lines"
4. Descarga y revisa los errores
5. Comparte los errores conmigo para ayudarte
```

### **Error: Sigue sin poder subir archivos**

**Verificar:**
```
1. Ve a Configuration → Software
2. Busca: Environment properties
3. Verifica que exista: UPLOAD_DIR=./uploads
4. Si no existe, agrégala
5. Haz otro deploy
```

---

## 📋 **CHECKLIST RÁPIDO**

Antes de subir:
- [x] ✅ ZIP creado: `mac-tickets-api-aws.zip`
- [x] ✅ Modelo corregido (sin s3_url/s3_key)
- [x] ✅ Configuración .ebextensions incluida
- [ ] ⏳ Ambiente actual terminó de actualizar
- [ ] ⏳ Listo para hacer "Upload and deploy"

Después de subir:
- [ ] ⏳ Deploy en progreso (3-5 min)
- [ ] ⏳ Health: OK (verde)
- [ ] ⏳ Probar subir archivo desde dashboard
- [ ] ⏳ Verificar que no hay error 500

---

## 🎯 **LO QUE VA A PASAR**

### **Durante el Deploy:**

```
Minuto 0-1:  🔵 Environment update is starting...
Minuto 1-2:  🔵 Installing dependencies (npm install)
Minuto 2-3:  🔵 Creating uploads folder with .ebextensions
Minuto 3-4:  🟡 Application deployment
Minuto 4-5:  🟢 Health checks passing
Minuto 5:    ✅ Deploy completado!
```

### **Después del Deploy:**

```
✅ Carpeta uploads/ existirá en: /var/app/current/uploads
✅ Permisos: drwxrwxrwx (777)
✅ Modelo sin s3_url/s3_key
✅ Subir archivos funcionará correctamente
✅ No más error 500
```

---

## 🎉 **RESULTADO ESPERADO**

**Antes:**
```
❌ Error 500: Unknown column 's3_url' in 'field list'
❌ Carpeta uploads no existe
❌ No se pueden subir archivos
```

**Después:**
```
✅ Subir archivos funciona perfectamente
✅ Archivos se guardan en /uploads
✅ Descargar archivos funciona
✅ Eliminar archivos funciona
✅ Sistema completo operativo
```

---

## 📞 **SIGUIENTE PASO INMEDIATO**

### **AHORA MISMO:**

1. ⏳ **Espera** que el update actual termine (veo que está en progreso)
2. 🌐 **Ve a:** https://console.aws.amazon.com/elasticbeanstalk
3. 📤 **Click en** "Upload and deploy"
4. 📁 **Selecciona:** `mac-tickets-api-aws.zip`
5. 🚀 **Deploy** y espera 5 minutos
6. ✅ **Prueba** subir un archivo

---

**¿El ambiente actual ya terminó de actualizar? Si sí, puedes subir el ZIP ahora mismo. Si no, espera que diga "Health: OK" y luego sube el ZIP.** 🚀

**¿Necesitas que te guíe en algo específico del proceso?**

