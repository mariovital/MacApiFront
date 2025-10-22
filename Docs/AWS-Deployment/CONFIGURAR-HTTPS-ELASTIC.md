# 🔒 Configurar HTTPS en Elastic Beanstalk

## 🚨 Problema: Mixed Content

Tu frontend (Vercel) usa HTTPS, pero el backend (AWS) usa HTTP.  
Los navegadores bloquean este tipo de requests por seguridad.

---

## ✅ Solución 1: Load Balancer con SSL (RECOMENDADO)

### Paso 1: Crear Certificado SSL (GRATIS con AWS)

```bash
# Ir al directorio del backend
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

# Cambiar el tipo de ambiente a Load Balanced
eb scale 1 --type LoadBalanced

# Esperar a que se cree el Load Balancer (5-10 minutos)
```

### Paso 2: Obtener Certificado SSL con ACM

1. Ve a **AWS Console** > **Certificate Manager** (ACM)
2. Click en **Request a certificate**
3. Selecciona **Request a public certificate**
4. **Domain name:** 
   - Si tienes dominio: `api.tudominio.com`
   - Si NO tienes dominio: Salta a Solución 2 (CloudFront)
5. **Validation method:** DNS validation
6. Click **Request**
7. Sigue las instrucciones para validar el dominio

### Paso 3: Configurar HTTPS en Elastic Beanstalk

1. Ve a **Elastic Beanstalk** > Tu ambiente
2. **Configuration** > **Load balancer** > **Edit**
3. Click en **Add listener**
4. Configura:
   - **Port:** 443
   - **Protocol:** HTTPS
   - **SSL certificate:** Selecciona tu certificado de ACM
5. Click **Save**

**Tu backend ahora tendrá:** `https://macticketsv.us-east-1.elasticbeanstalk.com`

---

## ✅ Solución 2: CloudFront + Certificate (SIN DOMINIO)

Si NO tienes dominio propio:

### Usar CloudFront con certificado

1. Ve a **CloudFront** en AWS Console
2. **Create Distribution**
3. **Origin domain:** `macticketsv.us-east-1.elasticbeanstalk.com`
4. **Protocol:** HTTP only (de momento)
5. **Viewer protocol policy:** Redirect HTTP to HTTPS
6. Click **Create**

CloudFront te dará un dominio HTTPS:
```
https://d1234abcd.cloudfront.net
```

Usa ese en las variables de Vercel:
```
VITE_API_URL=https://d1234abcd.cloudfront.net/api
```

---

## ✅ Solución 3: Desarrollo Rápido (TEMPORAL)

Para probar rápidamente sin configurar HTTPS:

### Desactivar HTTPS en Vercel temporalmente

**NO ES POSIBLE** - Vercel siempre usa HTTPS en producción.

### Usar Preview Deployment (HTTP permitido)

Los deployments de preview a veces permiten HTTP. Prueba creando una rama:

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront
git checkout -b testing
git push origin testing
```

Vercel creará un deployment de preview que *puede* permitir HTTP.

---

## 🚀 Solución 4: API Gateway con HTTPS (MÁS FÁCIL)

Si tienes API Gateway configurado (tienes el JSON listo):

1. Importa `Docs/API-Gateway-Endpoints.json` en API Gateway
2. API Gateway te da HTTPS automáticamente:
   ```
   https://abc123.execute-api.us-east-1.amazonaws.com/prod
   ```
3. Actualiza variables en Vercel:
   ```
   VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod/api
   ```

**Ventaja:** HTTPS gratis, sin configuración adicional.

---

## 📋 Comparación de Soluciones

| Solución | Tiempo | Costo | Dificultad | HTTPS |
|----------|--------|-------|------------|-------|
| **Load Balancer + ACM** | 30 min | ~$20/mes | Media | ✅ Con dominio |
| **CloudFront** | 15 min | $0-5/mes | Fácil | ✅ Sin dominio |
| **API Gateway** | 15 min | $3.50/millón | Fácil | ✅ Automático |
| **Preview Deploy** | 2 min | Gratis | Muy fácil | ⚠️ Temporal |

---

## 🎯 Mi Recomendación

### Para AHORA (Pruebas):
**Usar API Gateway** - Es lo más rápido y ya tienes el JSON listo.

### Para PRODUCCIÓN:
**Load Balancer + ACM** - Más profesional y estable.

---

## ⚡ Quick Start: API Gateway (15 minutos)

```bash
# Ya tienes el archivo JSON listo
cat /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/API-Gateway-Endpoints.json
```

1. AWS Console > **API Gateway**
2. **Create API** > **REST API** > **Import**
3. Sube `API-Gateway-Endpoints.json`
4. Configura integración con tu backend
5. **Deploy** a stage "prod"
6. Copia la URL HTTPS que te da
7. Actualiza variable en Vercel:
   ```
   VITE_API_URL=https://[tu-id].execute-api.us-east-1.amazonaws.com/prod/api
   ```
8. Redeploy en Vercel

---

¿Cuál solución prefieres probar primero? Te recomiendo **API Gateway** por ser la más rápida y ya tener todo listo. 🚀
