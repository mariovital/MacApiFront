# 🗺️ Configuración de Google Maps en el Dashboard

## 📋 **Resumen**

El dashboard web ahora integra **Google Maps** para mostrar la ubicación de los tickets, usando la misma lógica de geocodificación que la aplicación Android.

## 🔧 **Componentes Implementados**

### 1. **geocodeService.js**
Servicio de geocodificación usando **OpenStreetMap Nominatim API** (sin costo):
- ✅ Convierte direcciones de texto a coordenadas (lat, lng)
- ✅ Cache inteligente para evitar llamadas repetidas
- ✅ Fallback automático agregando ", México" si falla
- ✅ Misma lógica que la app Android

### 2. **GoogleMapComponent.jsx**
Componente reutilizable de Google Maps:
- ✅ Muestra el mapa con marcador personalizado (color rojo corporativo)
- ✅ Estados de carga y error
- ✅ Soporte para modo oscuro
- ✅ Totalmente personalizable (altura, zoom, etc.)

### 3. **Integración en TicketList.jsx**
- ✅ Reemplaza el placeholder con mapa real
- ✅ Geocodifica automáticamente cada dirección
- ✅ Muestra el mapa en cada tarjeta de ticket

---

## 🚀 **Configuración Paso a Paso**

### **Paso 1: Obtener Google Maps API Key**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Maps JavaScript API**
   - **Geocoding API** (opcional, usamos OpenStreetMap)
4. Ve a **Credenciales** → **Crear credenciales** → **Clave de API**
5. Copia la API Key generada

### **Paso 2: Restringir la API Key (Seguridad)**

**IMPORTANTE**: Restringe la API Key para evitar uso no autorizado:

1. En Google Cloud Console, ve a tu API Key
2. En **Restricciones de aplicación**, selecciona:
   - **Referentes HTTP (sitios web)**
3. Agrega los dominios permitidos:
   ```
   http://localhost:5173/*
   http://localhost/*
   https://tudominio.com/*
   ```
4. En **Restricciones de API**, selecciona:
   - Maps JavaScript API

### **Paso 3: Configurar Variable de Entorno**

1. Abre el archivo `.env` en `MAC/mac-tickets-front/`
2. Agrega tu API Key:

```bash
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

3. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

### **Paso 4: Verificar Funcionamiento**

1. Navega a `http://localhost:5173/tickets`
2. Verifica que los mapas se muestren en las tarjetas de tickets
3. Comprueba que el marcador aparece en la ubicación correcta

---

## 🌍 **API de Geocodificación**

### **OpenStreetMap Nominatim** (Usado actualmente)
- ✅ **GRATIS** - Sin límite de costo
- ✅ Misma API que usa la app Android
- ⚠️ Rate limit: 1 solicitud por segundoimage.png

- ✅ Cache implementado para optimizar

**Endpoint usado:**
```
https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1&addressdetails=0&countrycodes=mx
```

**Headers requeridos:**
```javascript
{
  'User-Agent': 'MAC-Tickets/1.0 (web-dashboard)',
  'Accept-Language': 'es-MX,es;q=0.9'
}
```

### **Alternativa: Google Geocoding API** (Opcional)
Si en el futuro necesitas mayor precisión:
1. Habilita **Geocoding API** en Google Cloud Console
2. Actualiza `geocodeService.js` para usar Google Geocoding

---

## 📝 **Uso del Componente**

### **Uso Básico**
```jsx
import { GoogleMapComponent } from '../../components/common';

<GoogleMapComponent 
  address="Zapote, 200 metros al norte de la Shell, San José"
  height="200px"
  zoom={15}
/>
```

### **Props Disponibles**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `address` | `string` | **requerido** | Dirección a geocodificar |
| `height` | `string` | `'200px'` | Altura del mapa |
| `width` | `string` | `'100%'` | Ancho del mapa |
| `zoom` | `number` | `15` | Nivel de zoom (1-20) |
| `showLoadingState` | `boolean` | `true` | Mostrar spinner al cargar |
| `className` | `string` | `''` | Clases CSS adicionales |

### **Ejemplo Avanzado**
```jsx
<GoogleMapComponent 
  address={ticket.location}
  height="300px"
  zoom={17}
  showLoadingState={true}
  className="rounded-xl shadow-lg"
/>
```

---

## 🎨 **Características del Diseño**

### **Marcador Personalizado**
- Color rojo corporativo: `#E31E24`
- Icono de pin de ubicación
- Borde blanco para contraste

### **Estados del Componente**

1. **Cargando**: Muestra spinner con mensaje
2. **Error**: Muestra icono de alerta cuando no se puede geocodificar
3. **Mapa**: Muestra el mapa con marcador cuando tiene éxito

### **Soporte de Modo Oscuro**
- Fondo oscuro en estados de carga/error
- Texto adaptativo según el tema
- Colores consistentes con el diseño global

---

## 🔍 **Solución de Problemas**

### **El mapa no se muestra**
1. Verifica que la API Key esté correctamente configurada en `.env`
2. Comprueba que `VITE_GOOGLE_MAPS_API_KEY` tenga el prefijo `VITE_`
3. Reinicia el servidor de desarrollo (`npm run dev`)
4. Revisa la consola del navegador para errores

### **Error: "Invalid API Key"**
1. Verifica que la API Key sea correcta
2. Asegúrate de haber habilitado **Maps JavaScript API**
3. Revisa las restricciones de la API Key (deben incluir localhost)

### **Error: "Google Maps JavaScript API error: RefererNotAllowedMapError"**
1. Ve a Google Cloud Console → Tu API Key
2. En **Restricciones de aplicación**, agrega `http://localhost:5173/*`
3. Guarda y espera unos minutos para que se aplique

### **El marcador no aparece en la ubicación correcta**
1. Verifica que la dirección sea válida y completa
2. Revisa la consola para ver la respuesta de geocodificación
3. Prueba agregando más detalles a la dirección (ciudad, país)

### **Error: "Geocoding failed"**
1. OpenStreetMap Nominatim tiene rate limiting (1 req/seg)
2. El cache debería manejar esto automáticamente
3. Si persiste, espera unos segundos e intenta de nuevo

---

## 📊 **Rendimiento y Optimización**

### **Cache de Geocodificación**
- ✅ Almacena hasta 100 direcciones geocodificadas
- ✅ Evita llamadas repetidas a la API
- ✅ Se limpia automáticamente cuando alcanza el límite
- ✅ Persiste durante la sesión del navegador

### **Lazy Loading**
- ✅ Google Maps solo se carga cuando el componente se monta
- ✅ Optimización automática de recursos
- ✅ Mejor rendimiento en la carga inicial

### **Recomendaciones**
1. Considera implementar lazy loading de tickets para reducir llamadas a geocodificación
2. Para producción, usa un proxy/backend para ocultar la API Key
3. Monitorea el uso de Google Maps API en Google Cloud Console

---

## 🌐 **Diferencias con la App Android**

| Aspecto | Android | Web Dashboard |
|---------|---------|---------------|
| **Geocodificación** | Geocoder del dispositivo + Nominatim | Solo Nominatim |
| **Librería Maps** | Google Maps Compose | @react-google-maps/api |
| **Cache** | LinkedHashMap en memoria | Map de JavaScript |
| **Timeout** | 1.8s dispositivo, 2.5s web | Sin timeout (API es rápida) |
| **Fallback** | Agrega ", México" | Mismo comportamiento |

---

## 📚 **Referencias**

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [@react-google-maps/api Documentation](https://react-google-maps-api-docs.netlify.app/)
- [OpenStreetMap Nominatim](https://nominatim.org/release-docs/latest/api/Search/)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

---

## ✅ **Checklist de Implementación**

- [x] Instalar `@react-google-maps/api`
- [x] Crear `geocodeService.js`
- [x] Crear `GoogleMapComponent.jsx`
- [x] Integrar en `TicketList.jsx`
- [x] Soporte de modo oscuro
- [ ] Obtener Google Maps API Key
- [ ] Configurar variable de entorno `VITE_GOOGLE_MAPS_API_KEY`
- [ ] Restringir API Key para seguridad
- [ ] Probar en navegador
- [ ] Verificar funcionamiento en producción

---

## 🚧 **Próximas Mejoras (Opcional)**

1. **Integrar en TicketDetail**: Mapa más grande en vista de detalle
2. **Integrar en TicketHistory**: Mapas en tickets pasados
3. **Ruta entre tickets**: Mostrar ruta óptima entre múltiples tickets
4. **Geolocalización**: Botón para centrar mapa en ubicación actual del técnico
5. **Clusters de marcadores**: Agrupar tickets cercanos en el mapa
6. **Street View**: Integrar Street View para ver la ubicación en 360°

---

**Fecha de actualización**: 20 de Octubre, 2025
**Versión**: 1.0.0

