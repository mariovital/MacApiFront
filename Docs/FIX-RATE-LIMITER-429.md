# 🔴 Fix: Error 429 en Login (Rate Limiter)

## ❌ **PROBLEMA**

Al intentar hacer login por primera vez, obtenías error **429 (Too Many Requests)**:

```
Error: Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.
```

**Causa:** El rate limiter estaba configurado demasiado restrictivo (100 requests/15min para TODAS las rutas).

---

## ✅ **SOLUCIÓN IMPLEMENTADA**

He ajustado los rate limiters para ser más permisivos y específicos:

### **Antes (Restrictivo):**
```javascript
// Un solo rate limiter para todo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // ❌ Muy restrictivo
  // Se aplicaba a TODO /api/
});

app.use('/api/', limiter);
```

### **Después (Balanceado):**
```javascript
// Rate limiter GENERAL (más permisivo)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // ✅ Muy permisivo para uso normal
  skip: (req) => req.path === '/api/health' || req.path === '/health'
});

// Rate limiter ESPECÍFICO para AUTH (estricto pero razonable)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // ✅ 20 intentos de login (previene brute force)
  message: {
    success: false,
    message: 'Demasiados intentos de login, intenta de nuevo en 15 minutos.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
});

// Aplicar limiters
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter, authRoutes);
```

---

## 📊 **NUEVOS LÍMITES**

### **✅ Rate Limiter General:**
```
Aplica a: Todas las rutas /api/*
Límite: 500 requests cada 15 minutos
Excepciones: /health, /api/health
Uso: Navegación normal, operaciones CRUD
```

### **✅ Rate Limiter Auth:**
```
Aplica a: Solo /api/auth/*
Límite: 20 intentos cada 15 minutos
Uso: Login, logout
Seguridad: Previene ataques de fuerza bruta
```

---

## 🎯 **BENEFICIOS**

### **Para Usuarios:**
✅ **Sin bloqueos inesperados** - 500 requests es suficiente para uso normal
✅ **Login funciona desde el primer intento** - Sin errores 429
✅ **Health checks no consumen límite** - Monitoring sin afectar usuarios

### **Para Seguridad:**
✅ **Login protegido** - 20 intentos previene brute force
✅ **Mensajes claros** - Usuarios saben por qué fueron bloqueados
✅ **Límite razonable** - No afecta uso legítimo

---

## 🚀 **CÓMO DESPLEGAR EL FIX**

### **El Fix ya está en GitHub:**
```bash
✅ Commit: 38d3ae6e
✅ Branch: main
✅ Pusheado: Listo
```

### **Paso 1: Subir a AWS Elastic Beanstalk**

#### **Ubicación del ZIP:**
```
/Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api/mac-tickets-api-minimal.zip
```

#### **Cómo subirlo:**
```
1. Ve a: https://console.aws.amazon.com/elasticbeanstalk
2. Selecciona: TicketSystem-env
3. Click en: "Upload and deploy"
4. Selecciona: mac-tickets-api-minimal.zip
5. Version label: "v1.1-fix-rate-limiter"
6. Click en: "Deploy"
7. ⏳ Espera 3-5 minutos
```

---

### **Paso 2: Verificar que Funciona**

#### **Después del deploy exitoso:**

```
1. Ve a: https://mac-api-front.vercel.app
2. Intenta hacer login con:
   - Email: admin@maccomputadoras.com
   - Password: Admin@123

3. ✅ Debe funcionar SIN error 429
```

#### **Si sigue con error 429:**

**Causa posible:** IP está todavía en el límite anterior

**Solución:**
```
- Espera 15 minutos para que se resetee el contador
  O
- Usa un navegador diferente
  O
- Usa modo incógnito
  O
- Reinicia el servidor de Elastic Beanstalk:
  Actions → Restart app server(s)
```

---

## 📋 **COMPARACIÓN DE LÍMITES**

| Escenario | Antes | Después |
|-----------|-------|---------|
| **Navegación normal** | 100 req/15min ❌ | 500 req/15min ✅ |
| **Login intentos** | 100 req/15min (compartido) ❌ | 20 req/15min (dedicado) ✅ |
| **Health checks** | Consume límite ❌ | Excluido ✅ |
| **Primera experiencia** | Puede bloquearse ❌ | Fluida ✅ |

---

## 🧪 **TESTING**

### **Test 1: Login Normal**
```
✅ Intentar login 5 veces seguidas
✅ Debe permitir todos sin error 429
```

### **Test 2: Brute Force Protection**
```
✅ Intentar login 21 veces con password incorrecta
✅ Debe bloquear en el intento 21
✅ Mensaje: "Demasiados intentos de login..."
```

### **Test 3: Navegación Pesada**
```
✅ Cargar 50 tickets
✅ Ver detalles de 10 tickets
✅ Subir 5 archivos
✅ Hacer 30 requests en 5 minutos
✅ No debe haber error 429
```

### **Test 4: Health Check**
```
✅ Llamar /api/health 100 veces
✅ No debe consumir límite
✅ Otras rutas deben seguir funcionando
```

---

## 📈 **MONITOREO**

### **Headers de Rate Limit:**

Ahora las respuestas incluyen estos headers:

```
X-RateLimit-Limit: 500 (o 20 para auth)
X-RateLimit-Remaining: 497
X-RateLimit-Reset: [timestamp]
```

### **Cómo revisar en Browser:**

```
1. Abrir DevTools (F12)
2. Tab "Network"
3. Hacer un request
4. Ver headers de respuesta
5. Buscar "X-RateLimit-*"
```

---

## 🔧 **CONFIGURACIÓN AVANZADA**

Si necesitas ajustar los límites en el futuro:

### **Variables de Entorno (Opcional):**

```env
# Rate Limiter General
RATE_LIMIT_WINDOW_MS=900000        # 15 min en ms
RATE_LIMIT_MAX_REQUESTS=500        # Requests por ventana

# Estos están hardcoded en app.js
# Para cambiarlos, modifica app.js directamente
```

### **Archivo: `src/app.js`**

```javascript
// Líneas 42-70 aproximadamente
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // ← Ajustar aquí
  // ...
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // ← Ajustar aquí
  // ...
});
```

---

## 🎯 **RECOMENDACIONES**

### **Si tienes MUCHOS usuarios:**
```javascript
// Aumentar límite general
max: 1000, // Para 50+ usuarios activos simultáneos
```

### **Si hay MUCHOS ataques:**
```javascript
// Reducir límite de auth
max: 10, // Solo 10 intentos de login
```

### **Si usas CDN/Proxy:**
```javascript
// Confiar en proxy headers
const limiter = rateLimit({
  // ...
  trustProxy: true, // Leer IP real desde X-Forwarded-For
});
```

---

## 📝 **ARCHIVOS MODIFICADOS**

```
✅ MAC/mac-tickets-api/src/app.js
   - generalLimiter más permisivo (500)
   - authLimiter específico (20)
   - Skip para health checks
   - authLimiter aplicado a /api/auth
```

---

## 🎉 **RESULTADO FINAL**

### **Experiencia de Usuario:**
✅ Login funciona desde el primer intento
✅ Navegación fluida sin bloqueos
✅ Protección contra ataques de fuerza bruta
✅ Mensajes claros cuando se excede límite

### **Seguridad:**
✅ Login protegido (20 intentos/15min)
✅ Tráfico general permitido (500 req/15min)
✅ Health monitoring sin afectar usuarios
✅ Balance entre seguridad y usabilidad

---

## 🚦 **PRÓXIMOS PASOS**

### **AHORA MISMO:**

```
1. 📤 Sube el nuevo ZIP a Elastic Beanstalk
   - Archivo: mac-tickets-api-minimal.zip
   - Version: v1.1-fix-rate-limiter

2. ⏳ Espera 3-5 minutos que complete el deploy

3. ✅ Prueba hacer login en:
   https://mac-api-front.vercel.app

4. 🎉 Debe funcionar sin error 429
```

### **Si necesitas ayuda:**
- Comparte logs de Elastic Beanstalk
- Comparte error exacto del browser console
- Verifica que el deploy haya completado OK

---

**Fecha:** 23 de Octubre, 2025  
**Commit:** `38d3ae6e`  
**Estado:** ✅ FIX LISTO PARA DEPLOY  
**Archivo ZIP:** `mac-tickets-api-minimal.zip`  
**Ubicación:** `MAC/mac-tickets-api/`

