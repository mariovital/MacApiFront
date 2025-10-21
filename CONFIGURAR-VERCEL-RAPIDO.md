# ⚡ Configurar Vercel con AWS - Guía Rápida

## 🎯 Tu Configuración

**Backend AWS:** `http://macticketsv.us-east-1.elasticbeanstalk.com`  
**Frontend Vercel:** Tu app en Vercel (gratuito)

---

## 🚀 Método 1: Script Automático (RECOMENDADO)

### Paso 1: Configurar Vercel

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/AWS-Deployment
./setup-vercel.sh
```

El script:
- ✅ Te logea en Vercel
- ✅ Configura todas las variables de entorno automáticamente
- ✅ Hace deploy a producción (opcional)

---

### Paso 2: Configurar CORS en Backend

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/AWS-Deployment
./setup-cors-backend.sh
```

El script te pedirá:
- URL de tu app en Vercel (ejemplo: `https://mac-tickets.vercel.app`)
- Configurará CORS automáticamente
- Reiniciará el backend

---

## 🔧 Método 2: Manual (Paso a Paso)

### Paso 1: Variables en Vercel Dashboard

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. **Settings** > **Environment Variables**
4. Agrega estas 5 variables:

```
VITE_API_URL = http://macticketsv.us-east-1.elasticbeanstalk.com/api
VITE_SOCKET_URL = http://macticketsv.us-east-1.elasticbeanstalk.com
VITE_AWS_REGION = us-east-1
VITE_APP_NAME = Sistema de Gestión de Tickets - MAC
VITE_DEBUG = false
```

5. **Selecciona:** Production, Preview, Development para todas

---

### Paso 2: CORS en Backend

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

# Configura tu URL de Vercel
eb setenv CORS_ORIGIN="https://tu-app.vercel.app,http://localhost:5173"

# Reinicia
eb restart
```

---

### Paso 3: Redeploy en Vercel

**Opción A:** Desde Dashboard
1. **Deployments** > último deploy > **Redeploy**
2. Desmarca "Use existing Build Cache"
3. Click **Redeploy**

**Opción B:** Push a Git
```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront
git add .
git commit -m "Configure AWS backend"
git push origin main
```

---

## ✅ Verificación

### 1. Verificar Variables en Vercel

Abre tu app en Vercel y en la consola del navegador (F12):

```javascript
console.log(import.meta.env.VITE_API_URL)
// Debe mostrar: http://macticketsv.us-east-1.elasticbeanstalk.com/api
```

### 2. Probar Login

En tu app de Vercel, intenta login con:
- **Email:** `admin@maccomputadoras.com`
- **Password:** `demo123`

✅ Si funciona, todo está configurado correctamente!

---

## 🚨 Problemas Comunes

### Error: "CORS Policy"

```bash
# Solución: Configurar CORS en backend
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api
eb setenv CORS_ORIGIN="*"  # Temporal para pruebas
eb restart
```

### Error: "Network Error"

```bash
# Verificar que backend esté corriendo
curl http://macticketsv.us-east-1.elasticbeanstalk.com/health
```

### Variables no se aplican

```bash
# Redeploy en Vercel sin cache
# Dashboard > Deployments > Redeploy (sin cache)
```

---

## 📋 Archivos de Ayuda

| Archivo | Para qué |
|---------|----------|
| `setup-vercel.sh` | Configurar Vercel automáticamente |
| `setup-cors-backend.sh` | Configurar CORS automáticamente |
| `CONFIGURAR-VERCEL.md` | Guía completa detallada |
| `vercel.env.example` | Ejemplo de variables |

---

## 🎯 Checklist

- [ ] Variables configuradas en Vercel
- [ ] CORS configurado en backend  
- [ ] Redeploy en Vercel completado
- [ ] Login funciona desde Vercel
- [ ] Dashboard carga correctamente
- [ ] Tickets se listan correctamente

---

## 🎉 ¡Listo!

Tu stack completo está funcionando:

```
Usuario
  ↓
Vercel (Frontend)
  ↓
AWS Elastic Beanstalk (Backend)
  ↓
AWS RDS (Database)
```

---

**URL Backend:** http://macticketsv.us-east-1.elasticbeanstalk.com  
**Credenciales:** admin@maccomputadoras.com / demo123  
**Documentación completa:** `Docs/AWS-Deployment/CONFIGURAR-VERCEL.md`

