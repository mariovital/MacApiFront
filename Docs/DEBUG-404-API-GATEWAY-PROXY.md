# 🔍 Debug: Error 404 en Imágenes con API Gateway {+proxy}

## ❌ **PROBLEMA ACTUAL**

Las imágenes no cargan, se quedan en "loading" y aparece error **404** en console.

```
Failed to load resource: the server responded with a status of 404 ()
Error descargando imagen: 404
```

---

## 🔍 **DIAGNÓSTICO CON LOGS**

He agregado logs detallados para identificar el problema exacto.

### **PASO 1: Redeploy en Vercel**

```
1. Ve a: https://vercel.com/dashboard
2. Selecciona: mac-api-front
3. Redeploy (auto o manual)
4. ⏳ Espera 2-3 minutos
```

---

### **PASO 2: Verificar Logs en Console**

```
1. Ve a: https://mac-api-front.vercel.app
2. Login
3. Abrir ticket con imagen (#13 o #14)
4. F12 → Console tab
5. Buscar logs con 🔍 DEBUG
```

---

### **PASO 3: Interpretar Logs**

#### **Los logs se verán así:**

```javascript
🔍 DEBUG - Intentando descargar imagen:
   API_BASE_URL: "https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api"
   Ticket ID: 13
   File ID: 7
   URL completa: "https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api/tickets/13/attachments/7/download"
   Token presente: true
   Response status: 404
   Response URL: "https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api/tickets/13/attachments/7/download"
❌ Error descargando imagen: 404
   Error body: "..."
```

---

## 🎯 **POSIBLES CAUSAS Y SOLUCIONES**

### **Causa 1: VITE_API_URL Incorrecta**

#### **Verificar en Vercel:**

```
1. Vercel Dashboard → mac-api-front
2. Settings → Environment Variables
3. Buscar: VITE_API_URL
```

#### **¿Cuál es el valor correcto?**

Depende de cómo configuraste API Gateway:

##### **Opción A: API Gateway con `/prod/{proxy+}`**

Si API Gateway está configurado como:
```
Resource: /{proxy+}
Stage: prod
```

Y tu backend en Elastic Beanstalk tiene rutas como:
```
/api/tickets/:id/attachments/:attachmentId/download
```

Entonces `VITE_API_URL` debe ser:
```
https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api
```

---

##### **Opción B: API Gateway con `/prod/api/{proxy+}`**

Si API Gateway está configurado como:
```
Resource: /api/{proxy+}
Stage: prod
```

Entonces `VITE_API_URL` debe ser:
```
https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api
```

---

##### **Opción C: Elastic Beanstalk sin `/api` prefix**

Si tu backend NO tiene `/api` en las rutas:
```
/tickets/:id/attachments/:attachmentId/download
```

Entonces `VITE_API_URL` debe ser:
```
https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod
```

---

### **Causa 2: Ruta No Existe en Backend**

#### **Verificar que el endpoint existe:**

```bash
# Probar con cURL (reemplaza TOKEN con tu token real)
curl -X GET \
  "https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api/tickets/13/attachments/7/download" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -v
```

**Respuesta esperada:**
```
< HTTP/1.1 200 OK
< Content-Type: image/png
< Content-Disposition: attachment; filename="..."
```

**Si recibes 404:**
```
< HTTP/1.1 404 Not Found
{
  "message": "Endpoint not found"
}
```

Entonces la ruta NO está configurada correctamente.

---

### **Causa 3: API Gateway No Reenvía Correctamente**

#### **Verificar configuración de API Gateway:**

```
1. AWS Console → API Gateway
2. Selecciona tu API
3. Resources → Verifica la estructura
```

**Configuración correcta:**
```
/
  /{proxy+}
    - ANY method
    - Integration: HTTP Proxy
    - Endpoint URL: http://macticketsv.us-east-1.elasticbeanstalk.com/{proxy}
```

**IMPORTANTE:** El `{proxy}` en la URL del endpoint debe coincidir.

---

## 🔧 **SOLUCIONES RÁPIDAS**

### **Solución 1: Ajustar VITE_API_URL**

#### **Basado en los logs, identifica la URL completa:**

```
Si la URL completa es:
https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api/tickets/13/attachments/7/download

Y devuelve 404, prueba cambiar VITE_API_URL a:
https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod

(Sin el /api al final)
```

#### **Cómo cambiar en Vercel:**

```
1. Vercel Dashboard → mac-api-front
2. Settings → Environment Variables
3. Edit VITE_API_URL
4. Nuevo valor: https://jw7hkby3r2...../prod
5. Save
6. Redeploy (IMPORTANTE!)
```

---

### **Solución 2: Verificar Backend Route**

#### **Verificar en Elastic Beanstalk:**

```bash
# SSH a tu instancia (si tienes acceso)
eb ssh

# Verificar logs
sudo tail -f /var/log/nodejs/nodejs.log

# Buscar: GET /api/tickets/13/attachments/7/download
```

**Si no aparece en los logs:**
- API Gateway NO está reenviando correctamente
- Revisar configuración de {proxy+}

**Si aparece con 404:**
- El endpoint NO existe en el backend
- Verificar rutas en `src/routes/tickets.js`

---

### **Solución 3: Temporalmente Usar Elastic Beanstalk Directo**

Si API Gateway tiene problemas, puedes temporalmente usar Elastic Beanstalk directamente:

```
VITE_API_URL=http://macticketsv.us-east-1.elasticbeanstalk.com/api
```

**Nota:** Esto solo funciona si configuraste CORS correctamente en el backend.

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

### **Backend (Elastic Beanstalk):**

```
✅ Endpoint existe: GET /api/tickets/:id/attachments/:attachmentId/download
✅ Route configurada en src/routes/tickets.js
✅ Controller exporta downloadTicketAttachment
✅ Middleware auth aplica
✅ CORS configurado para Vercel origin
```

---

### **API Gateway:**

```
✅ Resource /{proxy+} configurado
✅ ANY method activado
✅ Integration tipo HTTP Proxy
✅ Endpoint URL usa {proxy} variable
✅ Stage prod deployed
✅ CORS habilitado (si aplica)
```

---

### **Frontend (Vercel):**

```
✅ VITE_API_URL configurada correctamente
✅ Incluye stage (/prod)
✅ Incluye /api si el backend lo usa
✅ NO tiene / al final
✅ Redeploy después de cambiar
```

---

## 🧪 **TESTING PASO A PASO**

### **Test 1: Verificar Variable de Entorno**

```javascript
// En browser console (F12):
console.log(import.meta.env.VITE_API_URL);

// Debe mostrar:
"https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api"

// Si muestra undefined:
// Variable NO configurada en Vercel
```

---

### **Test 2: Probar Endpoint Manualmente**

```bash
# Obtener token del localStorage:
# F12 → Application → Local Storage
# Copiar valor de "token"

# Probar endpoint:
curl -X GET \
  "https://TU_URL_COMPLETA_DESDE_LOGS" \
  -H "Authorization: Bearer TU_TOKEN" \
  -o test_image.png

# Si funciona: archivo test_image.png se descarga
# Si 404: problema con la ruta
# Si 401: problema con token
```

---

### **Test 3: Verificar en Network Tab**

```
1. F12 → Network tab
2. Abrir ticket con imagen
3. Filtrar: "download"
4. Click en petición fallida
5. Headers tab:
   - Request URL: ¿es correcta?
   - Authorization: ¿está presente?
   - Status Code: ¿404, 401, 500?
6. Response tab:
   - ¿Qué dice el error?
   - ¿Es de API Gateway o del backend?
```

---

## 💡 **CONFIGURACIÓN RECOMENDADA**

### **Para API Gateway con {+proxy}:**

#### **API Gateway:**
```yaml
Resource Path: /{proxy+}
Integration Type: HTTP_PROXY
Endpoint URL: http://macticketsv.us-east-1.elasticbeanstalk.com/{proxy}
Stage: prod
```

#### **Backend (app.js):**
```javascript
// Todas las rutas con /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
```

#### **Vercel Environment Variables:**
```
VITE_API_URL=https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api
```

#### **URL Final Construida:**
```
https://jw7hkby3r2.execute-api.us-east-1.amazonaws.com/prod/api/tickets/13/attachments/7/download
```

#### **Flujo:**
```
1. Frontend: fetch(https://.../prod/api/tickets/13/attachments/7/download)
   ↓
2. API Gateway: recibe /prod/api/tickets/13/attachments/7/download
   ↓
3. {proxy+} captura: api/tickets/13/attachments/7/download
   ↓
4. Reenvía a: http://elastic-beanstalk.com/api/tickets/13/attachments/7/download
   ↓
5. Backend: app.use('/api/tickets', ...) → /api/tickets/13/attachments/7/download
   ↓
6. Route: router.get('/:ticketId/attachments/:attachmentId/download', ...)
   ↓
7. Controller: downloadTicketAttachment(req, res)
   ↓
8. ✅ Devuelve archivo
```

---

## 🚦 **PRÓXIMOS PASOS**

### **AHORA MISMO:**

```
1. 📤 Redeploy en Vercel (cambios ya pusheados)

2. 🔍 Abrir Console y ver logs:
   - F12 → Console
   - Buscar: 🔍 DEBUG
   - Copiar TODA la salida del log

3. 📋 Compartir conmigo:
   - URL completa que se construye
   - API_BASE_URL
   - Response status
   - Error body

4. 🔧 Basado en eso, ajustaremos:
   - VITE_API_URL en Vercel
   - O rutas en API Gateway
   - O lo que sea necesario
```

---

### **COMPARTIR ESTA INFO:**

```
🔍 Logs de Console:
[pegar aquí los logs completos]

🌐 Variables de Vercel:
VITE_API_URL = [valor actual]

⚙️ Configuración API Gateway:
- Resource: /{proxy+} o /api/{proxy+} ?
- Integration URL: [URL completa]
- Stage: prod ?

🖥️ Backend Routes:
- ¿Usan /api prefix? (sí/no)
- Endpoint existe: GET /api/tickets/:id/attachments/:attachmentId/download
```

---

**Con esta información podré identificar el problema exacto y darte la solución precisa!** 🎯

---

**Fecha:** 23 de Octubre, 2025  
**Commit:** `aea4926c`  
**Estado:** 🔍 DEBUGGING EN PROGRESO  
**Requiere:** Redeploy en Vercel + Compartir logs

