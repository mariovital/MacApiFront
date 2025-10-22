# 🗺️ Guía de Configuración de Google Maps

## 📋 Resumen

Esta guía te ayudará a configurar Google Maps correctamente en el Sistema de Gestión de Tickets MAC, tanto para desarrollo local como para producción en Vercel.

---

## ⚡ **CONFIGURACIÓN RÁPIDA (5 minutos)**

### **Paso 1: Obtener API Key de Google Maps**

1. **Ve a Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Crea o selecciona un proyecto:**
   - Click en el selector de proyecto (arriba)
   - "Proyecto nuevo" o selecciona uno existente
   - Nombra tu proyecto: "MAC Tickets System"

3. **Habilita las APIs necesarias:**
   ```
   Ve a: APIs & Services > Library
   
   Busca y habilita:
   ✓ Maps JavaScript API
   ✓ Geocoding API
   ✓ Places API (opcional)
   ```

4. **Crea una API Key:**
   ```
   Ve a: APIs & Services > Credentials
   Click: "Create Credentials" > "API Key"
   Copia tu API key: AIza...
   ```

5. **Configura restricciones (RECOMENDADO):**
   ```
   Click en tu API key recién creada
   
   Restricción de aplicación:
   - Tipo: Sitios web
   - Referentes permitidos:
     * http://localhost:5173/*
     * http://localhost:3000/*
     * https://tu-dominio.vercel.app/*
   
   Restricción de API:
   - Maps JavaScript API
   - Geocoding API
   ```

---

### **Paso 2: Configurar Desarrollo Local**

```bash
# 1. Ve al directorio del frontend
cd MAC/mac-tickets-front

# 2. Crea archivo .env desde la plantilla
cp env.example.txt .env

# 3. Edita .env y agrega tu API key
# Abre .env con tu editor favorito y reemplaza:
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...tu-api-key-real...XYZ

# 4. Reinicia el servidor de desarrollo
npm run dev
```

---

### **Paso 3: Configurar Producción (Vercel)**

#### **Opción A: Vercel Dashboard (Más Fácil)**

1. **Ve a tu proyecto en Vercel:**
   ```
   https://vercel.com/tu-usuario/mac-tickets-front
   ```

2. **Settings → Environment Variables:**
   ```
   Click: "Add New"
   
   Name: VITE_GOOGLE_MAPS_API_KEY
   Value: AIzaSyC...tu-api-key-real...XYZ
   
   Apply to: Production (✓)
             Preview (✓ opcional)
             Development (✓ opcional)
   
   Click: "Save"
   ```

3. **Redeploy:**
   ```
   Deployments → Latest Deployment → "..." → Redeploy
   ```

#### **Opción B: Vercel CLI**

```bash
# 1. Instalar Vercel CLI (si no está instalado)
npm install -g vercel

# 2. Login
vercel login

# 3. Ir al proyecto
cd MAC/mac-tickets-front

# 4. Agregar variable de entorno
vercel env add VITE_GOOGLE_MAPS_API_KEY
# Pega tu API key cuando te lo pida
# Selecciona: Production

# 5. Deploy
vercel --prod
```

---

## ✅ **VERIFICACIÓN**

### **Desarrollo Local**

1. **Inicia el servidor:**
   ```bash
   cd MAC/mac-tickets-front
   npm run dev
   ```

2. **Ve a la lista de tickets:**
   ```
   http://localhost:5173/tickets
   ```

3. **Verifica el mapa:**
   - Debe aparecer un mapa con marcador rojo
   - Debe mostrar la ubicación del ticket
   - No debe haber errores en consola

### **Producción (Vercel)**

1. **Ve a tu URL de Vercel:**
   ```
   https://tu-proyecto.vercel.app/tickets
   ```

2. **Verifica:**
   - Mapa se carga correctamente
   - Marcador aparece en la ubicación
   - No hay errores de "API key inválida"

---

## 🔧 **ARCHIVOS CREADOS/MODIFICADOS**

### **Nuevos Archivos:**

```
MAC/mac-tickets-front/
├── src/
│   ├── config/
│   │   └── googleMapsConfig.js         ✅ Configuración centralizada
│   ├── components/
│   │   └── common/
│   │       └── GoogleMapComponent.jsx  ✅ Componente mejorado
│   └── services/
│       └── geocodeService.js           ✅ Servicio actualizado
├── env.example.txt                     ✅ Plantilla de variables
└── vercel.env.example                  ✅ Actualizado con Google Maps
```

### **Archivos Modificados:**

```
✓ GoogleMapComponent.jsx   - Reescrito con useLoadScript
✓ geocodeService.js        - Migrado de OpenStreetMap a Google Maps
✓ vercel.env.example       - Agregada variable VITE_GOOGLE_MAPS_API_KEY
```

---

## 📊 **CARACTERÍSTICAS IMPLEMENTADAS**

### **1. Componente GoogleMapComponent**

✅ **Carga optimizada con useLoadScript**
- Evita múltiples cargas del script
- Manejo de estados (loading, error, loaded)
- Cleanup automático de recursos

✅ **Geocodificación robusta**
- Validación de direcciones
- Sanitización de entrada
- Formato automático para México
- Cache de resultados
- Reintentos automáticos

✅ **Marcador personalizado**
- Color rojo MAC (#E31E24)
- Animación de caída (DROP)
- Círculo con borde blanco

✅ **Estados visuales claros**
- Loading: Spinner con mensaje
- Error: Icono y mensaje descriptivo
- Success: Mapa con marcador y dirección

✅ **Optimización de rendimiento**
- Memoización de opciones
- Referencias (useRef) para mapa y marcador
- Prevención de re-renders innecesarios

### **2. Servicio de Geocodificación**

✅ **Google Maps Geocoding API**
- Migrado de OpenStreetMap
- Mejor precisión en México
- Más confiable

✅ **Cache inteligente**
- Evita llamadas duplicadas
- Límite de 100 entradas
- Cleanup automático

✅ **Validación de direcciones**
- Rechaza direcciones muy cortas
- Rechaza direcciones genéricas (—, N/A, etc.)
- Verifica caracteres válidos

✅ **Funciones auxiliares**
- `geocodeAddress()` - Geocodificación simple
- `geocodeAddressWithRetry()` - Con reintentos
- `geocodeBatch()` - Múltiples direcciones
- `clearCache()` - Limpiar cache
- `getCacheStats()` - Estadísticas

### **3. Configuración Centralizada**

✅ **googleMapsConfig.js**
- Constantes reutilizables
- Opciones del mapa
- Configuración de marcador
- Funciones de validación
- Centro por defecto (Ciudad de México)

✅ **Variables de entorno**
- `VITE_GOOGLE_MAPS_API_KEY` - API key
- Validación de existencia
- Mensajes de error claros

---

## 🎨 **USO DEL COMPONENTE**

### **Básico:**

```jsx
import { GoogleMapComponent } from '../../components/common';

<GoogleMapComponent 
  address="Av. Paseo de la Reforma 123, Ciudad de México"
  height="300px"
  zoom={15}
/>
```

### **Con todas las opciones:**

```jsx
import { GoogleMapComponent } from '../../components/common';

<GoogleMapComponent 
  address={ticket.location}
  height="400px"
  width="100%"
  zoom={17}
  showLoadingState={true}
  className="shadow-lg"
  onCoordinatesChange={(coords) => {
    console.log('Coordenadas:', coords);
  }}
/>
```

### **Props disponibles:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `address` | string | - | Dirección a geocodificar (requerido) |
| `height` | string | '200px' | Altura del mapa |
| `width` | string | '100%' | Ancho del mapa |
| `zoom` | number | 15 | Nivel de zoom (1-20) |
| `showLoadingState` | boolean | true | Mostrar estado de carga |
| `className` | string | '' | Clases CSS adicionales |
| `onCoordinatesChange` | function | null | Callback con coordenadas |

---

## 🐛 **TROUBLESHOOTING**

### **Problema 1: "Google Maps API no está cargada"**

**Síntomas:**
- Mapa no aparece
- Console: "Google Maps API no está cargada"

**Soluciones:**

1. **Verifica que la API key esté configurada:**
   ```bash
   # Desarrollo local
   cat MAC/mac-tickets-front/.env | grep VITE_GOOGLE_MAPS_API_KEY
   
   # Vercel
   # Ve a Settings → Environment Variables
   ```

2. **Reinicia el servidor de desarrollo:**
   ```bash
   # Ctrl+C para detener
   npm run dev
   ```

3. **Verifica que las APIs estén habilitadas:**
   ```
   Google Cloud Console → APIs & Services → Enabled APIs
   
   Debe aparecer:
   ✓ Maps JavaScript API
   ✓ Geocoding API
   ```

---

### **Problema 2: "API key inválida" o "RefererNotAllowedMapError"**

**Síntomas:**
- Mapa aparece gris con error
- Console: "Google Maps API error: RefererNotAllowedMapError"

**Soluciones:**

1. **Verifica restricciones de dominio:**
   ```
   Google Cloud Console → Credentials → Tu API Key
   
   Restricción de aplicación: Sitios web
   
   Referentes permitidos debe incluir:
   - http://localhost:5173/*
   - https://tu-dominio.vercel.app/*
   ```

2. **Quita restricciones temporalmente (solo para testing):**
   ```
   Restricción de aplicación: Ninguna
   
   ⚠️ Solo para desarrollo local
   ⚠️ Vuelve a agregar restricciones después
   ```

3. **Verifica la API key en .env:**
   ```bash
   # Debe ser EXACTAMENTE como la de Google Cloud Console
   cat .env | grep VITE_GOOGLE_MAPS_API_KEY
   ```

---

### **Problema 3: "No se pudo geocodificar la dirección"**

**Síntomas:**
- Icono de error en lugar del mapa
- Mensaje: "No se pudo encontrar la ubicación"

**Causas comunes:**

1. **Dirección muy genérica:**
   ```
   ❌ "México"           - Muy general
   ❌ "Casa"             - No específica
   ❌ "—"                - Placeholder
   ✅ "Calle 5 #123, Ciudad de México" - Específica
   ```

2. **Dirección con errores:**
   ```
   ❌ "Cll 5 123"        - Abreviaciones
   ✅ "Calle 5 #123"     - Completa
   ```

3. **Geocoding API no habilitada:**
   ```
   Google Cloud Console → APIs & Services → Library
   Busca: "Geocoding API"
   Click: "Enable"
   ```

**Soluciones:**

1. **Verifica la dirección en la consola:**
   ```javascript
   // Abre DevTools (F12)
   // Ve a Console
   // Busca: "🔍 Geocodificando:"
   ```

2. **Prueba la dirección manualmente:**
   ```javascript
   // En Console del navegador
   import geocodeService from './services/geocodeService';
   const result = await geocodeService.geocodeAddress('tu dirección');
   console.log(result);
   ```

3. **Limpia el cache:**
   ```javascript
   // En Console del navegador
   import geocodeService from './services/geocodeService';
   geocodeService.clearCache();
   ```

---

### **Problema 4: Mapa se carga lento**

**Síntomas:**
- Spinner de carga tarda mucho
- Mapa aparece después de 5-10 segundos

**Soluciones:**

1. **Verifica tu conexión a internet**

2. **Verifica que no haya adblockers:**
   ```
   - Algunos adblockers bloquean Google Maps
   - Desactiva temporalmente
   - O agrega excepción para localhost/tu-dominio
   ```

3. **Verifica la consola del navegador:**
   ```
   F12 → Console
   Busca errores de "Content Security Policy" o "Mixed Content"
   ```

4. **Optimiza la cantidad de mapas:**
   ```
   - No renderices 100 mapas a la vez
   - Usa paginación
   - Lazy loading para mapas fuera de vista
   ```

---

### **Problema 5: Error de facturación**

**Síntomas:**
- Console: "You must enable Billing on the Google Cloud Project"
- Mapa gris con mensaje de error

**Solución:**

1. **Habilita facturación:**
   ```
   Google Cloud Console → Billing
   
   1. Link a una cuenta de facturación
   2. O crea una nueva cuenta
   3. Google ofrece $200 de crédito gratis
   ```

2. **Verifica el proyecto:**
   ```
   Asegúrate de que el proyecto tenga facturación habilitada
   Billing → My Projects → Verifica que tu proyecto aparezca
   ```

---

## 📊 **COSTOS DE GOOGLE MAPS**

### **Crédito Gratis:**
```
Google ofrece $200 USD/mes de crédito gratis
Suficiente para la mayoría de aplicaciones pequeñas/medianas
```

### **Precios (después del crédito):**

| API | Costo por 1000 requests | Crédito cubre |
|-----|-------------------------|---------------|
| Maps JavaScript API | $7.00 | ~28,500 cargas |
| Geocoding API | $5.00 | ~40,000 geocodificaciones |

### **Optimizaciones para reducir costos:**

✅ **Implementadas:**
- Cache de geocodificación (evita requests duplicadas)
- Validación de direcciones (evita requests inútiles)
- Carga única del script (no múltiples cargas)

✅ **Recomendaciones:**
- Usa paginación en listas largas
- Limita el número de mapas simultáneos
- Considera mostrar mapa solo al expandir ticket

---

## 🔒 **SEGURIDAD**

### **✅ Buenas Prácticas Implementadas:**

1. **API Key con restricciones:**
   - Solo dominios autorizados
   - Solo APIs necesarias

2. **Variables de entorno:**
   - API key no hardcodeada
   - .env en .gitignore

3. **Validación de direcciones:**
   - Previene geocodificación de datos inválidos
   - Sanitización de entrada

### **⚠️ Advertencias:**

1. **API Key es pública:**
   ```
   Las variables VITE_* se incluyen en el bundle
   Cualquiera puede ver tu API key en DevTools
   
   Por eso son CRÍTICAS las restricciones de dominio
   ```

2. **Rota la key si se expone:**
   ```
   Si subes .env a git accidentalmente:
   1. Genera nueva API key en Google Cloud Console
   2. Desactiva la key antigua
   3. Actualiza .env y Vercel
   ```

3. **Monitorea el uso:**
   ```
   Google Cloud Console → APIs & Services → Dashboard
   Revisa mensualmente el uso y costos
   ```

---

## 📚 **RECURSOS ADICIONALES**

### **Documentación:**
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)

### **Tutoriales:**
- [Cómo obtener API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Restricciones de API key](https://developers.google.com/maps/api-security-best-practices)
- [Pricing Calculator](https://mapsplatformtransition.withgoogle.com/calculator)

---

## ✅ **CHECKLIST FINAL**

Antes de considerar completa la implementación, verifica:

### **Configuración:**
- [ ] API key obtenida de Google Cloud Console
- [ ] APIs habilitadas (Maps JavaScript + Geocoding)
- [ ] Restricciones configuradas (dominios + APIs)
- [ ] Facturación habilitada (o crédito gratis disponible)

### **Desarrollo Local:**
- [ ] Archivo .env creado con API key
- [ ] Servidor de desarrollo reiniciado
- [ ] Mapa aparece en lista de tickets
- [ ] Marcador se muestra correctamente
- [ ] No hay errores en consola

### **Producción (Vercel):**
- [ ] Variable VITE_GOOGLE_MAPS_API_KEY configurada en Vercel
- [ ] Deploy realizado
- [ ] Mapa funciona en producción
- [ ] Dominio de Vercel agregado a restricciones de Google Cloud

### **Testing:**
- [ ] Probado con dirección válida → mapa se muestra
- [ ] Probado con dirección inválida → mensaje de error claro
- [ ] Probado sin dirección → estado de error apropiado
- [ ] Probado en diferentes navegadores
- [ ] Probado en móvil (responsive)

---

## 🎉 **¡LISTO!**

Si completaste todos los pasos, Google Maps debería estar funcionando perfectamente en tu sistema de tickets.

**¿Problemas?**
Revisa la sección de Troubleshooting o consulta los logs de la consola del navegador.

**¿Funciona?**
¡Excelente! Ahora tienes mapas interactivos en tus tickets. 🗺️✨

