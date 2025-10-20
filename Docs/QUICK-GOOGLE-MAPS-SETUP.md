# ⚡ Configuración Rápida de Google Maps

## 🎯 **3 Pasos para Activar los Mapas**

### **1. Obtener API Key (2 minutos)**

1. Ir a: https://console.cloud.google.com/
2. Crear proyecto o usar uno existente
3. Habilitar **Maps JavaScript API**
4. Ir a **Credenciales** → **Crear credenciales** → **Clave de API**
5. **Copiar la API Key**

### **2. Configurar en el Proyecto (30 segundos)**

Abre `MAC/mac-tickets-front/.env` y agrega:

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSy... (tu API Key aquí)
```

### **3. Reiniciar el Servidor (10 segundos)**

```bash
# Detener el servidor (Ctrl+C)
# Iniciar de nuevo:
npm run dev
```

---

## ✅ **Verificar que Funciona**

1. Navega a: `http://localhost:5173/tickets`
2. Deberías ver mapas reales en lugar de placeholders
3. Los marcadores rojos deben aparecer en las ubicaciones correctas

---

## 🔒 **Seguridad (IMPORTANTE)**

**DESPUÉS de verificar que funciona**, restringe tu API Key:

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu API Key
3. En **Restricciones de aplicación**, selecciona **Referentes HTTP**
4. Agrega estos dominios:
   ```
   http://localhost:5173/*
   http://localhost/*
   https://tu-dominio.com/*
   ```
5. En **Restricciones de API**, selecciona solo: **Maps JavaScript API**
6. **Guardar**

---

## 💡 **Nota Sobre Costos**

- Google Maps tiene **$200 USD de crédito mensual GRATIS**
- Esto equivale a ~28,000 cargas de mapa al mes
- Para tu uso (equipo pequeño), **siempre será GRATIS**
- La geocodificación usa OpenStreetMap (100% gratis)

---

## 🐛 **Si algo no funciona**

### El mapa muestra un error gris:
```bash
# Verifica que la API Key esté correctamente en .env
cat MAC/mac-tickets-front/.env | grep GOOGLE

# Debe mostrar:
# VITE_GOOGLE_MAPS_API_KEY=AIza...
```

### Error "RefererNotAllowedMapError":
- Tu API Key está restringida pero no incluye `localhost:5173`
- Sigue los pasos de **Seguridad** arriba

### El mapa no se muestra (placeholder sigue ahí):
```bash
# Reinicia el servidor completamente
# Ctrl+C para detener
npm run dev
```

---

## 📱 **Compatibilidad con Android**

Los mapas web usan la **misma lógica de geocodificación** que la app Android:
- ✅ OpenStreetMap Nominatim API
- ✅ Cache inteligente
- ✅ Fallback con ", México"
- ✅ Mismas direcciones geocodificadas

---

**¿Necesitas ayuda?** Revisa `Docs/GOOGLE-MAPS-SETUP.md` para documentación completa.

