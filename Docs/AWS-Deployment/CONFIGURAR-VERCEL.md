# 🚀 Configurar Frontend en Vercel con Backend AWS

## 📋 Resumen

Tu frontend está en Vercel y necesita conectarse al backend de AWS Elastic Beanstalk.

**Backend AWS:** `http://macticketsv.us-east-1.elasticbeanstalk.com`  
**Frontend Vercel:** `https://[tu-app].vercel.app`

---

## ⚡ Paso 1: Configurar Variables de Entorno en Vercel

### Opción A: Desde Vercel Dashboard (Web)

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** > **Environment Variables**
4. Agrega estas variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `http://macticketsv.us-east-1.elasticbeanstalk.com/api` | Production, Preview, Development |
| `VITE_SOCKET_URL` | `http://macticketsv.us-east-1.elasticbeanstalk.com` | Production, Preview, Development |
| `VITE_AWS_REGION` | `us-east-1` | Production, Preview, Development |
| `VITE_APP_NAME` | `Sistema de Gestión de Tickets - MAC` | Production, Preview, Development |
| `VITE_APP_VERSION` | `1.0.0` | Production, Preview, Development |
| `VITE_DEBUG` | `false` | Production |
| `VITE_DEBUG` | `true` | Development |

5. Click **Save**

---

### Opción B: Desde Vercel CLI (Terminal)

```bash
# Instalar Vercel CLI si no lo tienes
npm install -g vercel

# Login
vercel login

# Ir a la carpeta del frontend
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Configurar variables de entorno
vercel env add VITE_API_URL
# Valor: http://macticketsv.us-east-1.elasticbeanstalk.com/api
# Selecciona: Production, Preview, Development

vercel env add VITE_SOCKET_URL
# Valor: http://macticketsv.us-east-1.elasticbeanstalk.com
# Selecciona: Production, Preview, Development

vercel env add VITE_AWS_REGION
# Valor: us-east-1
# Selecciona: Production, Preview, Development

vercel env add VITE_APP_NAME
# Valor: Sistema de Gestión de Tickets - MAC
# Selecciona: Production, Preview, Development

vercel env add VITE_APP_VERSION
# Valor: 1.0.0
# Selecciona: Production, Preview, Development

vercel env add VITE_DEBUG
# Valor: false
# Selecciona: Production
```

---

## ⚡ Paso 2: Configurar CORS en el Backend

El backend necesita permitir requests desde tu dominio de Vercel.

### Actualizar Variables de Entorno en Elastic Beanstalk

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

# Configurar CORS_ORIGIN para permitir Vercel
eb setenv CORS_ORIGIN="https://tu-app.vercel.app,http://localhost:5173"

# O permitir todos los orígenes (solo para desarrollo)
eb setenv CORS_ORIGIN="*"

# Reiniciar aplicación
eb restart
```

**Nota:** Reemplaza `tu-app.vercel.app` con tu URL real de Vercel.

---

## ⚡ Paso 3: Hacer Redeploy en Vercel

### Opción A: Desde Vercel Dashboard

1. Ve a tu proyecto en Vercel
2. Ve a la pestaña **Deployments**
3. Click en el menú de 3 puntos del último deployment
4. Click en **Redeploy**
5. Selecciona **Use existing Build Cache** ❌ (desmarcado)
6. Click **Redeploy**

---

### Opción B: Desde Git (Recomendado)

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront

# Commit de los cambios
git add .
git commit -m "Configure AWS backend endpoints for production"

# Push a tu rama principal
git push origin main
```

Vercel detectará el cambio y hará deploy automáticamente.

---

### Opción C: Desde Vercel CLI

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Deploy a producción
vercel --prod
```

---

## ⚡ Paso 4: Verificar la Configuración

### 1. Verificar Variables en Vercel

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Ver todas las variables
vercel env ls
```

### 2. Verificar CORS en Backend

```bash
# Probar desde tu dominio de Vercel
curl -X OPTIONS http://macticketsv.us-east-1.elasticbeanstalk.com/api/auth/login \
  -H "Origin: https://tu-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Debe responder con headers:
```
Access-Control-Allow-Origin: https://tu-app.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### 3. Verificar Frontend

1. Abre tu app en Vercel: `https://tu-app.vercel.app`
2. Abre DevTools (F12) > Console
3. Verifica la URL:
```javascript
// En la consola del navegador
console.log(import.meta.env.VITE_API_URL)
// Debe mostrar: http://macticketsv.us-east-1.elasticbeanstalk.com/api
```

4. Intenta hacer login con:
   - Email: `admin@maccomputadoras.com`
   - Password: `demo123`

---

## 🔧 Paso 5: Actualizar .env Local (Desarrollo)

Para trabajar en local con el backend de AWS:

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Crear/actualizar .env para desarrollo local
cat > .env << 'EOF'
VITE_API_URL=http://macticketsv.us-east-1.elasticbeanstalk.com/api
VITE_SOCKET_URL=http://macticketsv.us-east-1.elasticbeanstalk.com
VITE_AWS_REGION=us-east-1
VITE_APP_NAME=Sistema de Gestión de Tickets - MAC Computadoras
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov
EOF

# Reiniciar servidor de desarrollo
npm run dev
```

---

## 📊 Resumen de URLs

| Ambiente | Frontend | Backend API |
|----------|----------|-------------|
| **Producción (Vercel)** | `https://tu-app.vercel.app` | `http://macticketsv.us-east-1.elasticbeanstalk.com/api` |
| **Desarrollo (Local)** | `http://localhost:5173` | `http://macticketsv.us-east-1.elasticbeanstalk.com/api` |

---

## 🚨 Troubleshooting

### Error: "Network Error" o "ERR_CONNECTION_REFUSED"

**Causa:** El backend no está accesible desde Vercel

**Solución:**
```bash
# Verificar que el backend esté corriendo
curl http://macticketsv.us-east-1.elasticbeanstalk.com/health

# Ver logs de Elastic Beanstalk
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api
eb logs
```

---

### Error: "CORS Policy: No 'Access-Control-Allow-Origin'"

**Causa:** El backend no permite requests desde Vercel

**Solución:**
```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

# Opción 1: Permitir tu dominio específico de Vercel
eb setenv CORS_ORIGIN="https://tu-app.vercel.app"

# Opción 2: Permitir múltiples dominios
eb setenv CORS_ORIGIN="https://tu-app.vercel.app,https://tu-app-git-main.vercel.app,http://localhost:5173"

# Opción 3: Permitir todos (solo para desarrollo)
eb setenv CORS_ORIGIN="*"

# Reiniciar
eb restart
```

---

### Error: "401 Unauthorized" después de login

**Causa:** Token no se está guardando correctamente

**Solución:** Verifica en DevTools > Application > Local Storage que el token se guarde.

---

### Las variables no se aplican

**Causa:** Variables no se recargan automáticamente

**Solución:**
1. Vercel Dashboard > Settings > Environment Variables
2. Verifica que las variables estén en **Production**
3. Deployments > Redeploy (sin cache)

---

## 🔐 Configuración de Seguridad (Producción)

### 1. HTTPS en Backend (Opcional pero Recomendado)

Para producción real, tu backend debería usar HTTPS:

```bash
# En Elastic Beanstalk, configura un Load Balancer con certificado SSL
# O usa CloudFront frente a tu API
```

### 2. Variables Sensibles

**❌ NO pongas en variables VITE_:**
- API Keys privadas
- Secrets
- Tokens de servicios

**✅ Solo variables públicas:**
- URLs de API
- Configuraciones de UI
- Feature flags públicos

---

## 📋 Checklist Final

Verifica estos puntos antes de considerar completado:

- [ ] Variables de entorno configuradas en Vercel
- [ ] `VITE_API_URL` apunta a AWS Elastic Beanstalk
- [ ] CORS configurado en el backend para permitir Vercel
- [ ] Redeploy realizado en Vercel
- [ ] Login funciona desde Vercel
- [ ] Dashboard carga correctamente
- [ ] Lista de tickets funciona
- [ ] Crear ticket funciona
- [ ] Subir archivos funciona (si aplica)
- [ ] Notificaciones funcionan (si aplica)

---

## 🎯 Comandos Rápidos

### Todo en Uno - Configurar Vercel CLI

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Login
vercel login

# Agregar todas las variables
vercel env add VITE_API_URL production preview development
# Valor: http://macticketsv.us-east-1.elasticbeanstalk.com/api

vercel env add VITE_SOCKET_URL production preview development
# Valor: http://macticketsv.us-east-1.elasticbeanstalk.com

# Deploy
vercel --prod
```

### Todo en Uno - Configurar CORS en Backend

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

# Obtener tu URL de Vercel y configurar CORS
VERCEL_URL="https://tu-app.vercel.app"

eb setenv \
  CORS_ORIGIN="$VERCEL_URL,http://localhost:5173" \
  NODE_ENV=production

# Reiniciar
eb restart

# Verificar
eb printenv | grep CORS_ORIGIN
```

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu stack completo estará funcionando:

```
Usuario → Vercel (Frontend) → AWS Elastic Beanstalk (Backend) → AWS RDS (Database)
```

**Frontend:** https://tu-app.vercel.app  
**Backend:** http://macticketsv.us-east-1.elasticbeanstalk.com  
**Database:** AWS RDS MySQL

---

## 📞 Siguientes Pasos

### Corto Plazo
- [ ] Probar todas las funcionalidades en producción
- [ ] Configurar dominio personalizado en Vercel
- [ ] Configurar HTTPS en el backend (Load Balancer)

### Mediano Plazo
- [ ] Monitoreo con Vercel Analytics
- [ ] Logs con Sentry o similar
- [ ] CI/CD con GitHub Actions

### Largo Plazo
- [ ] CDN para assets estáticos
- [ ] Backup automático de base de datos
- [ ] Escalado horizontal

---

**Última actualización:** 2025-01-21  
**Backend:** http://macticketsv.us-east-1.elasticbeanstalk.com  
**Frontend:** Vercel (Configuración completada)

