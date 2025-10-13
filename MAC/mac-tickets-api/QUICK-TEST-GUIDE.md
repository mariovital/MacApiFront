# ⚡ Guía Rápida - Test de Endpoints

## 🚀 Uso Rápido

```bash
# 1. Asegúrate que el API está corriendo
npm run dev
# o
pm2 start src/server.js --name mactickets-api

# 2. Ejecuta el script de testing
node test-all-endpoints.js
```

## 📊 ¿Qué hace?

Prueba **TODOS** los endpoints del sistema automáticamente:
- ✅ 28 endpoints diferentes
- ✅ Login automático
- ✅ CRUD completo de tickets
- ✅ Filtros y paginación
- ✅ Manejo de errores

## ⏱️ Tiempo

- **3-5 segundos** para ejecutar todos los tests
- **Feedback instantáneo** con colores

## 📈 Output Esperado

```
╔════════════════════════════════════════════════════════════════════╗
║     MAC TICKETS API - TEST AUTOMATIZADO DE ENDPOINTS             ║
╚════════════════════════════════════════════════════════════════════╝

API URL: http://localhost:3001
Modo: Normal
Iniciando tests: 2025-10-08 16:00:00

======================================================================
  1. HEALTH CHECK
======================================================================
✅ [GET   ] /health

======================================================================
  2. AUTHENTICATION
======================================================================
✅ [POST  ] /api/auth/login
  Token obtenido: eyJhbGciOiJIUzI1NiIs...
✅ [GET   ] /api/auth/profile
  User ID: 1
  User: Super Admin

... (todos los endpoints)

======================================================================
  RESUMEN FINAL
======================================================================

📊 Estadísticas:
   Total de tests: 28
   ✅ Pasados: 28
   ❌ Fallidos: 0
   ⏱️  Duración: 3.45s
   📈 Tasa de éxito: 100.0%

🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!
```

## 🎯 Opciones

```bash
# Con URL personalizada
node test-all-endpoints.js --url=http://localhost:3001

# Modo verbose (más detalles)
node test-all-endpoints.js --verbose

# Probar API en AWS
node test-all-endpoints.js --url=https://api.tu-dominio.com
```

## 🔧 Troubleshooting

### ❌ Todos fallan

```bash
# 1. Verifica que el API está corriendo
curl http://localhost:3001/health

# 2. Si no está, inícialo
npm run dev
```

### ⚠️ Algunos fallan

```bash
# Ejecuta en modo verbose para ver detalles
node test-all-endpoints.js --verbose
```

---

Para más detalles, consulta `README-TESTING.md`
