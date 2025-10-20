# 🔧 Fix: Error de Login - Puerto Incorrecto

## ❌ Error Reportado

```
Error de red: Failed to connect to /10.0.2.2:3004
```

## 🔍 Causa

La aplicación está intentando conectarse al puerto **3004**, pero el backend corre en el puerto **3001**.

Esto ocurre porque el sistema está usando una **configuración en caché** de una compilación anterior.

## ✅ Solución: Limpiar Build Completamente

### Método 1: Desde Android Studio (RECOMENDADO)

1. **Cerrar el emulador** (si está abierto)

2. **Limpiar proyecto:**
   ```
   Build → Clean Project
   ```
   Espera a que termine (verás en la barra de progreso inferior)

3. **Invalidar caché:**
   ```
   File → Invalidate Caches / Restart...
   Selecciona: "Invalidate and Restart"
   ```
   Android Studio se reiniciará

4. **Después del reinicio, rebuild:**
   ```
   Build → Rebuild Project
   ```

5. **Desinstalar app del emulador manualmente:**
   - Inicia el emulador
   - Ve a Settings → Apps
   - Busca "Mac Tickets" o "Prototipo"
   - Presiona "Uninstall"

6. **Instalar de nuevo:**
   ```
   Run → Run 'app'
   ```

### Método 2: Limpieza desde Terminal (ALTERNATIVO)

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Android/Mac_Android

# Limpiar gradlew
./gradlew clean

# Borrar carpetas de build manualmente
rm -rf app/build
rm -rf build
rm -rf .gradle

# Rebuild desde Android Studio después
```

### Método 3: Verificación Manual de Puerto

Si después de los pasos anteriores sigue fallando, verifica manualmente:

1. **Abre `ApiConfig.kt`:**
   ```
   Android/Mac_Android/app/src/main/java/mx/tec/prototipo_01/config/ApiConfig.kt
   ```

2. **Verifica que diga:**
   ```kotlin
   private const val EMULATOR_BASE_URL = "http://10.0.2.2:3001/api/"
   ```

3. **NO debe haber ningún "3004" en el código**

## 🧪 Verificación

Después de aplicar la solución:

1. **Verifica que el backend esté corriendo en el puerto correcto:**
   ```bash
   cd MAC/mac-tickets-api
   npm start
   ```
   
   Debes ver:
   ```
   🚀 Servidor corriendo en: http://0.0.0.0:3001
   ```

2. **Prueba en el navegador:**
   ```
   http://localhost:3001/api/auth/health
   ```
   
   Debe devolver algo como:
   ```json
   {
     "status": "OK",
     "timestamp": "..."
   }
   ```

3. **Inicia la app Android y prueba login:**
   - Usuario: `tecnico1@maccomputadoras.com`
   - Password: `Tecnico123!`

4. **Verifica en Logcat:**
   Filtra por: `LoginViewModel`
   
   **Debe mostrar:**
   ```
   LoginViewModel: Login exitoso
   ```
   
   **NO debe mostrar:**
   ```
   Error de red: Failed to connect to /10.0.2.2:3004
   ```

## 🔍 Debugging Adicional

Si el problema persiste, verifica:

### 1. URL que está usando la app

Agrega este log temporal en `RetrofitClient.kt`:

```kotlin
object RetrofitClient {
    
    init {
        // Log temporal para debugging
        Log.d("RetrofitClient", "BASE_URL configurada: ${ApiConfig.BASE_URL}")
    }
    
    // ... resto del código
}
```

Busca en Logcat:
```
RetrofitClient: BASE_URL configurada: http://10.0.2.2:3001/api/
```

### 2. Verifica conectividad desde el emulador

Abre el navegador del emulador y prueba:
```
http://10.0.2.2:3001/api/auth/health
```

Si no carga, el problema es de red/firewall.

### 3. Verifica que el backend acepte conexiones externas

En `mac-tickets-api/src/server.js`, debe tener:

```javascript
const HOST = process.env.HOST || '0.0.0.0'; // NO 'localhost'
const PORT = process.env.PORT || 3001;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en: http://${HOST}:${PORT}`);
});
```

## 📝 Prevención

Para evitar problemas futuros:

1. **Siempre usa `ApiConfig.kt`** para URLs
2. **NO hardcodees URLs** en otros archivos
3. **Limpia build** después de cambiar configuraciones
4. **Desinstala la app** del emulador cuando cambies configuraciones importantes

## 🆘 Si Nada Funciona

Como última opción:

1. **Cierra Android Studio completamente**
2. **Borra carpetas de build:**
   ```bash
   cd Android/Mac_Android
   rm -rf .gradle
   rm -rf app/build
   rm -rf build
   ```
3. **Reinicia tu computadora** (libera puertos y caché)
4. **Abre Android Studio de nuevo**
5. **File → Sync Project with Gradle Files**
6. **Build → Rebuild Project**
7. **Desinstala la app del emulador**
8. **Run → Run 'app'**

## ✅ Confirmación de Éxito

Sabrás que el problema está resuelto cuando:

✅ La app se conecta sin errores
✅ El login funciona correctamente
✅ Logcat muestra: "Login exitoso"
✅ Los tickets se cargan desde el backend
✅ NO hay mensajes de "Failed to connect to 3004"

---

**TL;DR:** Limpia el build de Android Studio (Clean Project + Invalidate Caches + Restart), desinstala la app del emulador, y vuelve a instalar.

