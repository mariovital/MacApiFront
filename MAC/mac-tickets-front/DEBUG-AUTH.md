# 🐛 DEBUG: Problema de Sesión al Refresh

## 📋 **Síntomas**
- La sesión se cierra al hacer refresh (F5)
- El usuario es redirigido al login

## 🔍 **Diagnóstico Paso a Paso**

### **Paso 1: Verificar localStorage**

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver si hay token guardado
console.log('Token:', localStorage.getItem('token'));

// Ver si hay usuario guardado
console.log('User:', localStorage.getItem('user'));

// Ver si hay refresh token
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
```

**Resultado Esperado:**
```
Token: "eyJhbGciOiJIUzI1NiIs..."  (un JWT largo)
User: "{\"id\":1,\"email\":...}"   (JSON con datos de usuario)
Refresh Token: "eyJhbGciOiJIUzI1NiIs..."
```

**Si NO aparecen:**
- El problema es que el login no está guardando los datos

### **Paso 2: Verificar que el código nuevo se cargó**

En la consola, ejecuta:

```javascript
// Forzar recarga sin caché
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

Luego inicia sesión de nuevo y prueba el refresh.

### **Paso 3: Verificar AuthContext en acción**

Abre la consola ANTES de hacer login y mantén abierta.

Cuando hagas login, deberías ver en la consola:

```
✅ Token guardado
✅ User guardado
✅ Header Authorization configurado
```

Si al hacer refresh ves:

```
⚠️ No se pudo obtener perfil, manteniendo sesión local
```

Eso es **NORMAL** y la sesión debe mantenerse.

### **Paso 4: Verificar el flujo de AuthContext**

El nuevo flujo es:

1. **Al hacer refresh:**
   - ✅ Leer token de localStorage
   - ✅ Leer user de localStorage
   - ✅ Configurar header Authorization
   - ✅ Restaurar user inmediatamente (UI carga)
   - ⚠️ Intentar obtener profile (opcional)
   - ✅ Mantener sesión aunque falle profile

2. **Si profile falla:**
   - ✅ Console.warn (no error)
   - ✅ Mantener token
   - ✅ Mantener user
   - ✅ NO hacer logout

3. **Solo hacer logout si:**
   - ❌ Error 401 Unauthorized

## 🔧 **Soluciones**

### **Solución 1: Hard Refresh Total**

```bash
# En tu terminal
cd MAC/mac-tickets-front

# Detener Vite (Ctrl+C)
# Limpiar caché de Vite
rm -rf node_modules/.vite

# Reiniciar
npm run dev
```

Luego en el navegador:
1. Cerrar todas las pestañas de localhost:5173
2. Abrir consola (F12)
3. Ejecutar: `localStorage.clear(); location.reload(true);`
4. Cerrar consola
5. Iniciar sesión de nuevo
6. Probar refresh

### **Solución 2: Verificar API**

El endpoint `/api/auth/profile` debe estar funcionando. Verifica en el backend:

```bash
# Terminal del backend
cd MAC/mac-tickets-api
npm run dev

# Debería ver:
# ✅ Servidor escuchando en puerto 3001
```

Prueba el endpoint manualmente:

```bash
# Obtener token (reemplaza EMAIL y PASSWORD)
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maccomputadoras.com","password":"demo123"}' \
  | jq -r '.data.token')

# Probar profile
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Debería responder con datos del usuario
```

### **Solución 3: Verificar que el código se actualizó**

Busca en el código fuente del navegador (Sources tab en DevTools):

```
localhost:5173 → src → contexts → AuthContext.jsx
```

Línea ~87-92 debe decir:

```javascript
// Intentar restaurar usuario desde localStorage primero
if (storedUser) {
  try {
    setUser(JSON.parse(storedUser));
```

Si NO aparece este código, el archivo no se actualizó.

## 🎯 **Quick Fix**

Ejecuta esto en la consola del navegador (F12):

```javascript
// Limpiar todo y recargar
console.log('🧹 Limpiando...');
localStorage.clear();
sessionStorage.clear();
console.log('🔄 Recargando...');
setTimeout(() => {
  location.reload(true);
}, 500);
```

Luego:
1. Inicia sesión
2. Abre DevTools (F12)
3. Ve a Application → Local Storage → http://localhost:5173
4. Deberías ver: `token`, `user`, `refreshToken`
5. Haz refresh (F5)
6. Los valores deben seguir ahí
7. La sesión debe mantenerse

## ❓ **¿Sigue sin funcionar?**

Si después de TODO esto sigue fallando, ejecuta:

```javascript
// En la consola, DESPUÉS de hacer login
console.log('=== DEBUG AUTH ===');
console.log('Token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
console.log('User:', localStorage.getItem('user') ? 'EXISTS' : 'MISSING');
console.log('User Data:', JSON.parse(localStorage.getItem('user') || '{}'));
console.log('==================');
```

Copia el resultado y compártelo conmigo.

## 🎉 **Debería funcionar después de:**

✅ Hard refresh del navegador
✅ Limpiar localStorage  
✅ Reiniciar Vite
✅ Login nuevo
✅ Verificar localStorage tiene los 3 valores
✅ Hacer refresh
✅ Sesión se mantiene

