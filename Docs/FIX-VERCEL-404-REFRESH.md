# 🔧 Solución: Error 404 al Hacer Refresh en Vercel

## 🚨 **Problema**

Al hacer refresh (F5) en cualquier ruta del dashboard web en Vercel (ejemplo: `/dashboard`, `/tickets`, `/users`), aparece un error **404: NOT_FOUND** y la página se queda en blanco.

```
404: NOT_FOUND
Code: "NOT_FOUND"
ID: "sfo1::1942d-1761170676346-6a14640f7915"
```

---

## 🎯 **Causa del Problema**

Este es un problema común en **SPAs (Single Page Applications)** con React Router:

### **¿Qué sucede?**

1. Usuario navega a `/dashboard` desde la aplicación → **Funciona** ✅
   - React Router maneja la navegación del lado del cliente

2. Usuario hace refresh en `/dashboard` → **Error 404** ❌
   - El navegador pide al servidor el archivo `/dashboard`
   - Vercel no encuentra ese archivo porque solo existe `index.html`
   - React Router nunca se carga, no puede manejar la ruta

### **Diagrama del Problema:**

```
Navegación Normal:
Browser → /dashboard (React Router) → Render Component ✅

Refresh en /dashboard:
Browser → Vercel Server → Busca archivo /dashboard.html
                       → No existe → 404 ❌
                       → React Router nunca se ejecuta
```

---

## ✅ **Solución Implementada**

Se han creado **2 archivos de configuración** para que Vercel redirija todas las rutas al `index.html`:

### **1. `vercel.json` (Configuración de Vercel)**

**Ubicación:** `/MAC/mac-tickets-front/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**¿Qué hace?**
- Captura TODAS las rutas (`(.*)` = regex que coincide con cualquier cosa)
- Redirige al `index.html`
- React Router se carga y maneja la ruta correctamente

### **2. `public/_redirects` (Alternativa/Respaldo)**

**Ubicación:** `/MAC/mac-tickets-front/public/_redirects`

```
/*    /index.html   200
```

**¿Qué hace?**
- Funciona como respaldo
- Redirige todas las rutas (`/*`) al `index.html`
- Con código 200 (no 301 o 302) para que la URL no cambie

---

## 🚀 **Cómo Aplicar la Solución**

### **Opción A: Deploy Automático (Recomendado)**

Si tienes Vercel conectado a GitHub:

```bash
# 1. Hacer commit de los archivos de configuración
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront
git add MAC/mac-tickets-front/vercel.json
git add MAC/mac-tickets-front/public/_redirects
git commit -m "fix: agregar configuracion de Vercel para manejar refresh en SPA"
git push origin main

# 2. Vercel detectará el cambio y hará deploy automático
# Espera 1-2 minutos
```

### **Opción B: Redeploy Manual en Vercel**

Si **NO** está conectado a GitHub:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a la pestaña **Deployments**
4. Click en **Redeploy** del último deployment
5. Espera que termine el build

### **Opción C: Deploy desde Terminal**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Instalar Vercel CLI (si no está instalado)
npm install -g vercel

# Login a Vercel
vercel login

# Deploy
vercel --prod
```

---

## ✅ **Verificación de la Solución**

Después de aplicar la solución:

### **Test 1: Página Principal**
```
1. Ir a https://tu-app.vercel.app
2. Debe cargar el dashboard correctamente ✅
```

### **Test 2: Navegación Interna**
```
1. Click en "Tickets" en el menú
2. URL cambia a /tickets
3. Debe mostrar la lista de tickets ✅
```

### **Test 3: Refresh (El Problema Original)**
```
1. Estando en /tickets
2. Presionar F5 o Ctrl+R
3. La página debe recargar y mostrar tickets ✅ (No más 404)
```

### **Test 4: Ruta Directa**
```
1. En nueva pestaña, ir directamente a https://tu-app.vercel.app/dashboard
2. Debe cargar el dashboard correctamente ✅
```

### **Test 5: Ruta Inexistente**
```
1. Ir a https://tu-app.vercel.app/ruta-que-no-existe
2. Debe cargar el index.html
3. React Router debe mostrar tu página 404 personalizada ✅
```

---

## 🐛 **Si Sigue Sin Funcionar**

### **Problema 1: Vercel no detecta `vercel.json`**

**Solución:**
```bash
# Verificar que el archivo esté en la raíz del proyecto
cd MAC/mac-tickets-front
ls -la vercel.json

# Debe mostrar:
# -rw-r--r--  1 user  staff  78 Jan 22 12:00 vercel.json
```

Si no existe, crearlo:
```bash
cat > vercel.json << 'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
```

### **Problema 2: Caché de Vercel**

**Solución:**
```bash
# Limpiar caché en el navegador
# Chrome: Ctrl+Shift+R (hard reload)
# Firefox: Ctrl+F5
# Safari: Cmd+Option+R

# O borrar caché de Vercel
vercel --prod --force
```

### **Problema 3: Configuración de Build en Vercel**

Verifica en Vercel Dashboard:

1. **Settings** → **General**
2. **Build & Development Settings**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### **Problema 4: Variables de Entorno Faltantes**

Verifica que estén configuradas en Vercel:

1. **Settings** → **Environment Variables**
2. Agregar:
   ```
   VITE_API_URL=https://tu-api-backend.com/api
   VITE_SOCKET_URL=https://tu-api-backend.com
   ```

---

## 📋 **Archivos Creados/Modificados**

| Archivo | Ubicación | Estado |
|---------|-----------|--------|
| `vercel.json` | `/MAC/mac-tickets-front/` | ✅ Creado |
| `public/_redirects` | `/MAC/mac-tickets-front/public/` | ✅ Creado |

---

## 🎯 **Cómo Funciona Ahora**

### **Antes (Con Error):**
```
1. Usuario hace refresh en /tickets
2. Navegador pide /tickets al servidor
3. Vercel busca archivo /tickets
4. No existe → 404 NOT_FOUND ❌
```

### **Después (Solucionado):**
```
1. Usuario hace refresh en /tickets
2. Navegador pide /tickets al servidor
3. Vercel detecta la regla en vercel.json
4. Redirige a /index.html (código 200)
5. index.html carga React y React Router
6. React Router lee la URL /tickets
7. Renderiza el componente de tickets ✅
```

---

## 📚 **Recursos Adicionales**

### **Documentación Oficial**
- [Vercel - Handling Redirects](https://vercel.com/docs/project-configuration#rewrites)
- [React Router - Deployment](https://reactrouter.com/en/main/start/faq#what-is-client-side-routing)
- [Vite - Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html#vercel)

### **Alternativas (Si Vercel No Funciona)**

#### **Netlify**
Archivo: `public/_redirects`
```
/*    /index.html   200
```

#### **GitHub Pages**
Archivo: `public/404.html` (copia de `index.html`)

#### **AWS S3 + CloudFront**
Configurar error pages: `404 → /index.html`

---

## ✅ **Checklist de Verificación**

Después de aplicar la solución:

- [ ] Archivo `vercel.json` creado en la raíz del proyecto frontend
- [ ] Archivo `public/_redirects` creado
- [ ] Commit realizado en Git
- [ ] Push a GitHub (si aplica)
- [ ] Deploy/Redeploy en Vercel completado
- [ ] Test: Refresh en página principal funciona
- [ ] Test: Refresh en `/dashboard` funciona
- [ ] Test: Refresh en `/tickets` funciona
- [ ] Test: URL directa a cualquier ruta funciona
- [ ] No hay errores 404 en la consola del navegador

---

## 🎉 **Resultado Esperado**

Después de aplicar esta solución:

✅ Refresh funciona en TODAS las rutas  
✅ URLs directas funcionan  
✅ Navegación interna funciona  
✅ No más error 404: NOT_FOUND  
✅ React Router maneja todas las rutas correctamente  

---

## 📞 **Soporte**

Si sigues teniendo problemas:

1. Verifica los logs de Vercel: **Deployments** → Click en deployment → **Logs**
2. Verifica la consola del navegador (F12) para errores
3. Contacta al equipo: soporte@maccomputadoras.com

---

**Problema resuelto! 🎉**

Tu SPA en Vercel ahora maneja correctamente los refreshes y rutas directas.

