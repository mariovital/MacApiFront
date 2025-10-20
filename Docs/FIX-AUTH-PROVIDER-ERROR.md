# Fix: Error "useAuth debe ser usado dentro de AuthProvider"

## Error
```
Uncaught Error: useAuth debe ser usado dentro de AuthProvider
    at useAuth (AuthContext.jsx:211:11)
    at ProtectedRoute (App.jsx:23:40)
```

## Causa
Este error típicamente ocurre por:
1. Datos corruptos en localStorage del desarrollo anterior
2. Hot Module Replacement (HMR) no actualizó correctamente
3. Cambios en AuthContext no se aplicaron completamente

## Solución Rápida

### Paso 1: Limpiar localStorage
Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

O visita: `http://localhost:5173/clear-storage.html`

### Paso 2: Hard Refresh
- **Chrome/Edge**: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
- **Firefox**: `Ctrl + F5` o `Cmd + Shift + R`

### Paso 3: Reiniciar Dev Server
```bash
# Terminal 1 - Frontend
cd MAC/mac-tickets-front
# Ctrl+C para detener
npm run dev

# Terminal 2 - Backend (si aplica)
cd MAC/mac-tickets-api
# Ctrl+C para detener
npm run dev
```

## Cambios Aplicados

### 1. AuthContext.jsx
```javascript
// Cambiado de null a undefined
const AuthContext = createContext(undefined);

// Optimizado contextValue con useMemo
const contextValue = React.useMemo(() => ({
  user,
  loading,
  error,
  login,
  logout,
  refreshUserProfile,
  isAuthenticated: !!user,
  setError
}), [user, loading, error]);
```

### 2. Estructura Correcta en App.jsx
```jsx
<CustomThemeProvider>
  <CssBaseline />
  <AuthProvider>  {/* ✅ Correcto */}
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedLayout>  {/* ✅ useAuth disponible aquí */}
            <Dashboard />
          </ProtectedLayout>
        } />
      </Routes>
    </Router>
  </AuthProvider>
</CustomThemeProvider>
```

## Verificación

Después de aplicar la solución, verifica:

1. **Console sin errores:**
```
✅ AUTH INIT: { hasToken: false, hasStoredUser: false }
✅ Loading set to FALSE - UI should render
```

2. **Login funciona:**
- Ingresa credenciales correctas
- Debe redirigir a dashboard
- No debe haber errores en consola

3. **Popup de error funciona:**
- Ingresa credenciales incorrectas
- Debe aparecer popup "Usuario o Contraseña Incorrectos"
- Click "Entendido" cierra el popup

## Si el Problema Persiste

### Opción 1: Eliminar node_modules y reinstalar
```bash
cd MAC/mac-tickets-front
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Opción 2: Verificar imports manualmente
```bash
# Buscar imports de AuthContext
grep -r "import.*AuthContext" MAC/mac-tickets-front/src/
```

Debe mostrar:
```
src/App.jsx:import { AuthProvider } from './contexts/AuthContext';
src/App.jsx:import { useAuth } from './contexts/AuthContext';
src/pages/auth/Login.jsx:import { useAuth } from '../../contexts/AuthContext';
src/components/layout/Sidebar/Sidebar.jsx:import { useAuth } from '../../../contexts/AuthContext';
```

### Opción 3: Modo Incógnito
Abre el sitio en una ventana de incógnito para evitar cache:
```
http://localhost:5173/login
```

## Prevención

Para evitar este error en el futuro:

1. **Siempre limpiar storage al cambiar AuthContext:**
```javascript
localStorage.clear();
sessionStorage.clear();
```

2. **Hard refresh después de cambios en Contexts:**
```
Ctrl + Shift + R (o Cmd + Shift + R en Mac)
```

3. **Reiniciar dev server después de cambios estructurales**

## Status

✅ **AuthContext corregido y optimizado**
✅ **Login restaurado a versión funcional**
✅ **Popup simple agregado**

Si sigues estos pasos, el error debe desaparecer y todo debe funcionar correctamente.

