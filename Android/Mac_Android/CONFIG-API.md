# 🔧 Configuración del API para Android

## 📋 Resumen

La aplicación Android ahora usa **datos reales** del backend Node.js/Express. Este documento explica cómo configurar la conexión según tu entorno de desarrollo.

---

## 🚀 Configuración Rápida

### Paso 1: Identificar tu entorno

Primero, determina dónde vas a ejecutar la app:

| Entorno | Descripción | URL Base |
|---------|-------------|----------|
| **Emulador** | Android Studio Emulator | `http://10.0.2.2:3001/api/` |
| **Dispositivo Físico** | Teléfono/tablet en la misma red | `http://TU_IP_LOCAL:3001/api/` |
| **Producción** | Servidor en AWS/producción | `https://api.mactickets.com/api/` |

### Paso 2: Editar ApiConfig.kt

Abre el archivo: `app/src/main/java/mx/tec/prototipo_01/config/ApiConfig.kt`

Cambia esta línea según tu entorno:

```kotlin
// ===== CAMBIAR AQUÍ SEGÚN TU ENTORNO =====
private val CURRENT_ENVIRONMENT = Environment.EMULATOR  // <-- Cambiar esta línea
```

Opciones disponibles:
- `Environment.EMULATOR` - Para emulador de Android Studio
- `Environment.PHYSICAL_DEVICE` - Para dispositivo físico
- `Environment.PRODUCTION` - Para servidor en producción

---

## 📱 Para Dispositivo Físico

Si vas a ejecutar en un dispositivo físico (teléfono/tablet), necesitas configurar tu IP local:

### 1. Encuentra tu IP Local

#### En Windows:
```bash
ipconfig
```
Busca: **IPv4 Address** (ejemplo: `192.168.1.100`)

#### En Mac/Linux:
```bash
ifconfig
```
Busca: **inet** (ejemplo: `192.168.1.100`)

### 2. Actualiza ApiConfig.kt

Reemplaza la IP en esta línea:

```kotlin
private const val PHYSICAL_DEVICE_BASE_URL = "http://192.168.1.100:3001/api/"
//                                                    ^^^^^^^^^^^^^^^^
//                                                    Cambiar esta IP
```

### 3. Asegúrate de que el backend esté corriendo

En tu computadora, inicia el servidor:

```bash
cd MAC/mac-tickets-api
npm start
```

Deberías ver:
```
🚀 Servidor corriendo en: http://0.0.0.0:3001
```

### 4. Verifica que estén en la misma red

- Tu computadora y tu dispositivo deben estar conectados a la **misma red WiFi**
- Desactiva cualquier firewall que pueda bloquear el puerto 3001

---

## 🔌 Verificar Conexión

### Probar desde el navegador del dispositivo

En el navegador de tu teléfono, abre:
```
http://TU_IP_LOCAL:3001/api/tickets
```

Si ves un JSON con error 401 (sin token), **la conexión funciona** ✅

Si no carga o da timeout, verifica:
- ❌ IP incorrecta
- ❌ Backend no está corriendo
- ❌ Firewall bloqueando
- ❌ No están en la misma red

---

## 🛠️ Endpoints Actuales

Todos los endpoints ahora usan **datos reales** del backend:

### Autenticación
- `POST /auth/login` - Login con email/password
- `GET /auth/profile` - Obtener perfil del usuario

### Tickets
- `GET /tickets` - Lista de tickets (filtrada por rol)
- `GET /tickets/:id` - Detalle de ticket
- `POST /tickets` - Crear ticket
- `POST /tickets/:id/accept` - Aceptar ticket (técnico)
- `POST /tickets/:id/reject` - Rechazar ticket (técnico)
- `PATCH /tickets/:id/status` - Cambiar estado
- `POST /tickets/:id/assign` - Asignar técnico

### Catálogos
- `GET /catalog/categories` - Categorías
- `GET /catalog/priorities` - Prioridades
- `GET /catalog/technicians` - Lista de técnicos

### Adjuntos
- `POST /tickets/:id/attachments` - Subir archivo
- `GET /tickets/:id/attachments` - Listar archivos

---

## 🐛 Solución de Problemas

### Error: "Unable to resolve host"
**Problema:** No puede conectar al servidor

**Soluciones:**
1. Verifica que el backend esté corriendo
2. Verifica la IP en `ApiConfig.kt`
3. Asegúrate de estar en la misma red WiFi
4. Verifica que no haya firewall bloqueando

### Error: "401 Unauthorized"
**Problema:** Token no válido o expirado

**Solución:**
- Cierra sesión y vuelve a iniciar sesión
- El token se guarda en `TokenStore`

### Error: "Network timeout"
**Problema:** El servidor no responde a tiempo

**Solución:**
- Aumenta los timeouts en `ApiConfig.kt`:
```kotlin
const val CONNECT_TIMEOUT = 30L // aumentar si es necesario
const val READ_TIMEOUT = 30L
```

### Los datos no se actualizan
**Problema:** La app muestra datos viejos

**Solución:**
- Limpia la app: Settings → Apps → MAC Tickets → Clear Data
- O desinstala y reinstala

---

## 📦 Estructura de Respuestas

Todas las respuestas del backend siguen este formato:

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación completada",
  "data": {
    // datos aquí
  }
}
```

### Respuesta con Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE"
}
```

---

## 🔐 Autenticación

La app usa **JWT tokens** almacenados en memoria (`TokenStore`):

```kotlin
// Al hacer login exitoso:
TokenStore.save(token, refreshToken)

// El token se envía automáticamente en cada request:
Authorization: Bearer <token>
```

---

## 📝 Notas Importantes

1. **Emulador vs Dispositivo Físico:**
   - Emulador: usa `10.0.2.2` (alias del localhost del host)
   - Dispositivo: usa la IP local de tu computadora

2. **Producción:**
   - Cambia la URL en `ApiConfig.kt`
   - Asegúrate de usar HTTPS en producción

3. **Permisos:**
   - La app requiere permiso de INTERNET
   - Ya está configurado en `AndroidManifest.xml`

4. **Logs:**
   - Todos los requests se loguean en Logcat
   - Busca por "RetrofitClient" o "ApiService"

---

## 🎯 Checklist de Configuración

Antes de ejecutar la app, verifica:

- [ ] Backend está corriendo (`npm start`)
- [ ] IP configurada correctamente en `ApiConfig.kt`
- [ ] `CURRENT_ENVIRONMENT` está configurado
- [ ] Dispositivo y computadora en la misma red (si usas físico)
- [ ] Puerto 3001 no está bloqueado por firewall
- [ ] Variables de entorno del backend configuradas

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en Logcat
2. Verifica que el backend responda en Postman
3. Asegúrate de que las credenciales sean correctas
4. Verifica que el usuario tenga el rol adecuado

**Credenciales de prueba:**
```
Admin:
- Email: admin@maccomputadoras.com
- Password: Admin123!

Técnico:
- Email: tecnico1@maccomputadoras.com
- Password: Tecnico123!

Mesa de Trabajo:
- Email: mesa1@maccomputadoras.com
- Password: Mesa123!
```

---

¡Listo! Ahora la app Android usa datos reales del backend 🎉

