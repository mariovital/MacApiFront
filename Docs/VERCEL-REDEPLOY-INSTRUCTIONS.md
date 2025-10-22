# 🚀 Instrucciones para Redeploy en Vercel - Solución Error 404

## ⚠️ **Problema Actual**

Seguimos viendo el error **404: NOT_FOUND** después de crear los archivos de configuración.

**Causa:** Vercel no ha detectado los cambios automáticamente o necesita un redeploy manual.

---

## ✅ **SOLUCIÓN RÁPIDA (5 minutos)**

### **Opción 1: Redeploy Manual en Vercel Dashboard** (Más Rápido)

#### **Paso 1: Ir a Vercel Dashboard**
```
1. Abre: https://vercel.com/dashboard
2. Inicia sesión con tu cuenta
```

#### **Paso 2: Seleccionar el Proyecto**
```
3. Click en tu proyecto: "mac-api-front" o similar
```

#### **Paso 3: Forzar Redeploy**
```
4. Ve a la pestaña "Deployments"
5. Encuentra el deployment más reciente
6. Click en los tres puntos (•••) a la derecha
7. Selecciona "Redeploy"
8. Confirma "Redeploy"
```

#### **Paso 4: Esperar Build**
```
9. Espera 1-2 minutos
10. El status debe cambiar a "Ready"
11. ✅ ¡Listo!
```

---

### **Opción 2: Deploy desde Terminal con Vercel CLI**

```bash
# Paso 1: Instalar Vercel CLI (si no está instalado)
npm install -g vercel

# Paso 2: Login a Vercel
vercel login

# Paso 3: Ir al proyecto
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Paso 4: Deploy a producción (forzar)
vercel --prod --force

# Espera que termine el build...
# ✅ Listo cuando veas: "Production: https://tu-url.vercel.app"
```

---

### **Opción 3: Trigger Deploy desde GitHub**

```bash
# Hacer un cambio pequeño para triggear deploy
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront

# Opción A: Crear un commit vacío
git commit --allow-empty -m "trigger: forzar redeploy en Vercel"
git push origin main

# Opción B: Modificar un archivo
echo "# Trigger deploy" >> MAC/mac-tickets-front/README.md
git add .
git commit -m "trigger: forzar redeploy"
git push origin main
```

---

## 🔧 **CONFIGURACIÓN ADICIONAL EN VERCEL DASHBOARD**

Si después del redeploy SIGUE sin funcionar, necesitas configurar manualmente en Vercel:

### **Paso 1: Settings del Proyecto**

```
1. Ve a tu proyecto en Vercel
2. Click en "Settings"
3. Ve a "General"
```

### **Paso 2: Verificar Build Settings**

```
Framework Preset: Vite
Build Command: npm run build  (o vite build)
Output Directory: dist
Install Command: npm install
Root Directory: MAC/mac-tickets-front  (⚠️ IMPORTANTE)
```

### **Paso 3: Verificar que Root Directory esté correcto**

⚠️ **MUY IMPORTANTE:** Si tu proyecto frontend está en una subcarpeta:

```
Root Directory: MAC/mac-tickets-front

(NO dejar en blanco si el proyecto no está en la raíz)
```

### **Paso 4: Verificar Environment Variables**

```
1. Ve a Settings → Environment Variables
2. Verifica que estén configuradas:
   
   VITE_API_URL=https://tu-api-backend.com/api
   VITE_SOCKET_URL=https://tu-api-backend.com
```

### **Paso 5: Limpiar Caché y Redeploy**

```
1. Ve a Settings → General
2. Busca "Build & Output Settings"
3. Click en "Clear Build Cache"
4. Luego ve a Deployments → Redeploy
```

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

Verifica que estos archivos existan:

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Verificar vercel.json
cat vercel.json
# Debe mostrar configuración de routes

# Verificar _redirects
cat public/_redirects
# Debe mostrar: /*    /index.html   200

# Verificar estructura
ls -la
# Debe tener: src/, public/, dist/ (después de build), vercel.json
```

---

## 🐛 **TROUBLESHOOTING AVANZADO**

### **Problema 1: Vercel no detecta vercel.json**

**Causa:** El archivo está en el lugar incorrecto.

**Solución:**
```bash
# Debe estar en la RAÍZ del frontend
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Verificar ubicación
pwd
# Debe mostrar: .../MAC/mac-tickets-front

ls vercel.json
# Debe existir aquí
```

### **Problema 2: Root Directory incorrecto en Vercel**

**Síntomas:** Vercel no encuentra package.json o muestra error de build.

**Solución:**
1. Settings → General → Root Directory
2. Cambiar a: `MAC/mac-tickets-front`
3. Save
4. Redeploy

### **Problema 3: Archivos no se subieron a GitHub**

**Verificar:**
```bash
# Ver última commit
git log -1 --name-only

# Debe incluir:
# MAC/mac-tickets-front/vercel.json
# MAC/mac-tickets-front/public/_redirects
```

**Si NO aparecen:**
```bash
git add MAC/mac-tickets-front/vercel.json
git add MAC/mac-tickets-front/public/_redirects
git commit -m "fix: agregar archivos de configuración de Vercel"
git push origin main
```

### **Problema 4: Caché del Navegador**

**Solución:**
```bash
# Limpiar caché del navegador
Chrome: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
Firefox: Ctrl+F5
Safari: Cmd+Option+R

# O abrir en ventana incógnita
Ctrl+Shift+N (Windows) o Cmd+Shift+N (Mac)
```

### **Problema 5: Vercel usa configuración antigua**

**Solución:**
```bash
# Eliminar .vercel local y reconectar
cd MAC/mac-tickets-front
rm -rf .vercel

# Redeploy forzado
vercel --prod --force
```

---

## 🔍 **LOGS Y DEBUGGING**

### **Ver Logs de Build en Vercel**

```
1. Vercel Dashboard → tu proyecto
2. Click en el deployment más reciente
3. Ve a la pestaña "Logs"
4. Busca errores:
   - "Build failed"
   - "Cannot find..."
   - Errores de configuración
```

### **Ver Logs en Terminal**

```bash
cd MAC/mac-tickets-front

# Ver logs del último deployment
vercel logs --prod

# Ver logs en tiempo real
vercel logs --prod --follow
```

---

## 📝 **SCRIPT AUTOMATIZADO DE VERIFICACIÓN**

Copia y pega esto en tu terminal para verificar TODO:

```bash
#!/bin/bash

echo "🔍 Verificando configuración de Vercel..."

cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

echo ""
echo "✅ Verificando archivos..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json existe"
    cat vercel.json
else
    echo "❌ vercel.json NO EXISTE"
fi

echo ""
if [ -f "public/_redirects" ]; then
    echo "✅ public/_redirects existe"
    cat public/_redirects
else
    echo "❌ public/_redirects NO EXISTE"
fi

echo ""
echo "✅ Verificando Git..."
git status

echo ""
echo "✅ Último commit:"
git log -1 --oneline

echo ""
echo "✅ Archivos en último commit:"
git show --name-only --pretty="" HEAD | grep -E "vercel|_redirects" || echo "⚠️  Archivos no encontrados en último commit"

echo ""
echo "✅ Verificación completa!"
echo ""
echo "📝 Siguiente paso:"
echo "1. Si los archivos existen: Haz redeploy en Vercel Dashboard"
echo "2. Si NO existen: Ejecuta los comandos de la sección anterior"
```

---

## ✅ **SOLUCIÓN DEFINITIVA - HACER ESTO AHORA**

### **PASOS EXACTOS A SEGUIR:**

#### **1. Hacer commit de los cambios actualizados**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront

git add MAC/mac-tickets-front/vercel.json
git commit -m "fix: actualizar vercel.json con configuracion routes"
git push origin main
```

#### **2. Ir a Vercel y Redeploy**

```
1. Abrir: https://vercel.com/dashboard
2. Click en tu proyecto
3. Deployments → Click en el último deployment
4. Click en "..." → "Redeploy"
5. Esperar 1-2 minutos
```

#### **3. Probar**

```
1. Ir a tu URL: https://mac-api-front-d54ux8r1t-vitalagencys-projects.vercel.app
2. Navegar a /login o cualquier ruta
3. Presionar F5
4. ✅ Debe funcionar (no más 404)
```

---

## 🎯 **SI NADA FUNCIONA - ÚLTIMO RECURSO**

### **Opción: Crear un nuevo proyecto en Vercel**

```bash
cd MAC/mac-tickets-front

# 1. Desconectar proyecto actual
rm -rf .vercel

# 2. Crear nuevo proyecto
vercel

# Responde:
# - Set up and deploy? Y
# - Which scope? (tu cuenta)
# - Link to existing project? N
# - What's your project's name? mac-tickets-dashboard
# - In which directory is your code located? ./
# - Want to override settings? N

# 3. Deploy a producción
vercel --prod

# ✅ Te dará una nueva URL
```

---

## 📞 **SOPORTE ADICIONAL**

Si después de TODO esto sigue sin funcionar:

1. **Capturas de pantalla:**
   - Vercel Dashboard → Settings → General
   - Vercel Dashboard → Deployments (último deployment)
   - Logs del deployment

2. **Información a proporcionar:**
   - URL de Vercel
   - Contenido de vercel.json
   - Logs del último deployment

3. **Contacto:**
   - Email: soporte@maccomputadoras.com
   - Vercel Support: https://vercel.com/support

---

## 🎉 **RESULTADO ESPERADO**

Después de seguir estos pasos:

✅ Refresh en `/login` funciona  
✅ Refresh en `/dashboard` funciona  
✅ URLs directas funcionan  
✅ No más error 404  
✅ React Router maneja todas las rutas  

---

**¡Aplica estos pasos AHORA y el problema se solucionará!** 🚀

