# 🚀 Configurar API Gateway con HTTPS - Guía Completa

## 🎯 Objetivo

Configurar API Gateway para:
- ✅ Tener HTTPS automático
- ✅ Conectar con tu backend HTTP de Elastic Beanstalk
- ✅ Solucionar el problema de Mixed Content
- ✅ Tener una URL profesional para tu API

---

## 📋 Requisitos Previos

- ✅ Archivo: `Docs/API-Gateway-Endpoints.json` (Ya lo tienes)
- ✅ Backend: `http://macticketsv.us-east-1.elasticbeanstalk.com`
- ✅ AWS Account con acceso a API Gateway

---

## 🚀 Paso 1: Ir a API Gateway

### 1.1 Abrir AWS Console

1. Ve a: https://console.aws.amazon.com
2. Login con tu cuenta
3. Busca **"API Gateway"** en la barra de búsqueda
4. Click en **API Gateway**

### 1.2 Verificar Región

**MUY IMPORTANTE:** Verifica que estés en **us-east-1** (arriba a la derecha)

---

## 📤 Paso 2: Importar el API

### 2.1 Crear API desde Archivo

1. En API Gateway Dashboard, click en **"Create API"**

2. Selecciona **"REST API"** (NO REST API Private)

3. Click en **"Import"** (pestaña superior)

4. **Import from OpenAPI:**
   - Selecciona **"Select OpenAPI file"**
   - Click en **"Choose File"**
   - Navega a:
     ```
     /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/API-Gateway-Endpoints.json
     ```
   - Selecciona el archivo

5. **Endpoint Type:** Regional

6. Click en **"Import"**

**Espera 10-15 segundos** mientras AWS procesa el archivo.

---

## ⚙️ Paso 3: Configurar Integración con Backend

### 3.1 Configurar Proxy Integration

Después de importar, verás todos tus endpoints. Necesitas configurar la integración:

#### Opción A: Configuración Manual (Una por una)

1. Click en cualquier método (ej: **POST /auth/login**)
2. Click en **"Integration Request"**
3. Configura:
   - **Integration type:** HTTP Proxy
   - **HTTP method:** POST (mismo que el endpoint)
   - **Endpoint URL:** 
     ```
     http://macticketsv.us-east-1.elasticbeanstalk.com/api/auth/login
     ```
4. Click **"Save"**

**Repite para cada endpoint** (tedioso - usa Opción B)

---

#### Opción B: Configuración con Proxy + Variable (RECOMENDADO)

**Mejor forma:** Usar un proxy catch-all.

1. En API Gateway, ve a **"Resources"**

2. Click en **"Actions"** > **"Create Resource"**

3. Configura:
   - **Configure as proxy resource:** ✅ Marcado
   - **Resource Name:** `proxy`
   - **Resource Path:** `{proxy+}`
   - **Enable API Gateway CORS:** ✅ Marcado

4. Click **"Create Resource"**

5. Se creará un método **ANY** automáticamente

6. Click en **ANY** > **Integration Request**

7. Configura:
   - **Integration type:** HTTP Proxy
   - **HTTP method:** ANY
   - **Endpoint URL:**
     ```
     http://macticketsv.us-east-1.elasticbeanstalk.com/{proxy}
     ```
   - **Use Path Override:** Desmarcado

8. Click **"Save"**

**¡Listo!** Ahora todos los endpoints pasarán por el proxy.

---

## 🔧 Paso 4: Habilitar CORS

Para que el frontend pueda hacer requests:

1. En **"Resources"**, selecciona **"/"** (root)

2. Click en **"Actions"** > **"Enable CORS"**

3. Configura:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
   Access-Control-Allow-Methods: DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT
   ```

4. Click **"Enable CORS and replace existing CORS headers"**

5. Click **"Yes, replace existing values"**

---

## 🚀 Paso 5: Desplegar el API

### 5.1 Crear Stage de Producción

1. Click en **"Actions"** > **"Deploy API"**

2. **Deployment stage:** [New Stage]

3. **Stage name:** `prod`

4. **Stage description:** `Production environment`

5. **Deployment description:** `Initial deployment with HTTPS`

6. Click **"Deploy"**

---

## 🎉 Paso 6: Obtener URL HTTPS

Después de desplegar, verás:

```
Invoke URL: https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

**¡Esta es tu URL HTTPS!** 🎉

### 6.1 Verificar que Funciona

Prueba en tu navegador o con curl:

```bash
# Verificar health endpoint
curl https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/health

# Debería responder con el status del backend
```

---

## 🔄 Paso 7: Actualizar Variables en Vercel

### 7.1 Ir a Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. **Settings** > **Environment Variables**

### 7.2 Actualizar Variables

**Edita estas 2 variables:**

| Variable | Nuevo Valor |
|----------|-------------|
| `VITE_API_URL` | `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/api` |
| `VITE_SOCKET_URL` | `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod` |

**Reemplaza `abc123xyz`** con tu ID real de API Gateway.

**¡IMPORTANTE!** Nota que agregamos `/api` al final de `VITE_API_URL`.

### 7.3 Redeploy

1. Ve a **"Deployments"**
2. Click en **"Redeploy"**
3. **NO marques** "Use existing Build Cache"
4. Click **"Redeploy"**

**Espera 2-3 minutos** mientras hace el build.

---

## ✅ Paso 8: Verificar que Funciona

### 8.1 Abrir App en Vercel

Una vez que el deploy termine:

1. Abre tu app: `https://mac-api-front.vercel.app`
2. Hard reload: `Ctrl + Shift + R`
3. Abre DevTools (F12) > Console
4. Verifica la URL:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   // Debe mostrar: https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/api
   ```

### 8.2 Probar Login

Intenta login con:
- **Email:** `admin@maccomputadoras.com`
- **Password:** `demo123`

**¡Debería funcionar!** ✅

---

## 🔍 Troubleshooting

### Error: 403 Forbidden

**Causa:** CORS no configurado correctamente.

**Solución:**
1. Ve a API Gateway > tu API > Resources
2. Actions > Enable CORS
3. Asegúrate que `Access-Control-Allow-Origin: *`
4. Redeploy el API

---

### Error: 502 Bad Gateway

**Causa:** API Gateway no puede conectarse al backend.

**Solución:**
```bash
# Verifica que el backend esté corriendo
curl http://macticketsv.us-east-1.elasticbeanstalk.com/health

# Si responde 404 o error, revisa Elastic Beanstalk
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api
eb health
```

---

### Error: 429 Too Many Requests

**Causa:** Límite de rate alcanzado (poco probable en pruebas).

**Solución:**
1. Ve a API Gateway > tu API > Stages > prod
2. Settings > Default Method Throttling
3. Aumenta los límites si es necesario

---

### Las variables no se aplican en Vercel

**Solución:**
1. Verifica que las variables estén en **Production**
2. Haz redeploy **SIN CACHE**
3. Hard reload en el navegador

---

## 📊 Costos de API Gateway

API Gateway cobra por:
- **Requests:** $3.50 por millón
- **Data transfer:** $0.09 por GB (después de 1 GB gratis/mes)

**Ejemplo para tu app:**
- 10,000 requests/mes = $0.035
- 1 GB transfer = Gratis
- **Total:** ~$0.04/mes (prácticamente gratis)

**Free Tier (12 meses):**
- 1 millón de requests/mes gratis
- 1 GB transfer gratis

---

## 🎯 Ventajas de API Gateway

✅ **HTTPS automático** - Sin certificados ni configuración  
✅ **Escalable** - Maneja millones de requests  
✅ **Rate limiting** - Protección contra abuso  
✅ **Logging** - CloudWatch logs integrados  
✅ **Caché** - Opcionalmente puedes habilitar caché  
✅ **Monitoreo** - CloudWatch metrics automáticos  
✅ **Versioning** - Stages para dev/staging/prod  

---

## 🔄 Actualizar Endpoints

Si agregas nuevos endpoints al backend:

### Opción 1: Reimportar JSON

1. Actualiza `Docs/API-Gateway-Endpoints.json`
2. API Gateway > tu API > Actions > Import
3. Selecciona "Merge" o "Overwrite"
4. Redeploy

### Opción 2: Proxy Catch-All (Ya configurado)

Si usaste la Opción B (proxy), **no necesitas hacer nada**.  
Todos los endpoints nuevos funcionarán automáticamente.

---

## 📋 Checklist Final

Verifica que completaste todo:

- [ ] Importaste el JSON en API Gateway
- [ ] Configuraste integración con backend (HTTP Proxy)
- [ ] Habilitaste CORS
- [ ] Desplegaste a stage "prod"
- [ ] Copiaste la URL HTTPS
- [ ] Actualizaste variables en Vercel
- [ ] Hiciste redeploy sin cache
- [ ] Verificaste que la URL se aplica en la consola
- [ ] Probaste el login exitosamente
- [ ] ✅ ¡Todo funciona!

---

## 🎉 Próximos Pasos (Opcional)

### Mejorar Seguridad

1. **Custom Domain:** Configura `api.tudominio.com`
2. **API Keys:** Protege endpoints sensibles
3. **WAF:** AWS Web Application Firewall
4. **Usage Plans:** Límites por cliente

### Mejorar Performance

1. **Caché:** Habilita caché en respuestas GET
2. **CloudFront:** CDN frente a API Gateway
3. **Throttling:** Configurar límites apropiados

---

**¡Listo! Sigue esta guía paso a paso y tendrás HTTPS funcionando en 15 minutos!** 🚀

**Si tienes algún error, consulta la sección de Troubleshooting arriba.** 📞

