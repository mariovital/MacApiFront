# 🧪 Script de Testing Automatizado - MAC Tickets API

Script Node.js para probar **TODOS** los endpoints del sistema de manera automática y rápida.

---

## 🚀 Quick Start

```bash
# Desde la raíz del proyecto backend
cd MAC/mac-tickets-api

# Ejecutar tests
node test-all-endpoints.js

# Con URL personalizada
node test-all-endpoints.js --url=http://localhost:3001

# Modo verbose (más detalles)
node test-all-endpoints.js --verbose

# Probar API en AWS
node test-all-endpoints.js --url=https://api.tu-dominio.com
```

---

## 📋 ¿Qué Prueba el Script?

### 1. Health Check ✅
- `GET /health` - Verificar que el servidor está activo

### 2. Authentication 🔐
- `POST /api/auth/login` - Login con credenciales demo
- `GET /api/auth/profile` - Obtener perfil del usuario
- `POST /api/auth/logout` - Cerrar sesión
- Re-login automático para continuar tests

### 3. Catalogs 📚
- `GET /api/catalog/categories` - Obtener categorías
- `GET /api/catalog/priorities` - Obtener prioridades
- `GET /api/catalog/ticket-statuses` - Obtener estados
- `GET /api/catalog/technicians` - Obtener técnicos

### 4. Tickets 🎫
- `GET /api/tickets` - Listar tickets
- `GET /api/tickets/stats` - Obtener estadísticas
- `POST /api/tickets` - Crear ticket nuevo
- `GET /api/tickets/:id` - Obtener ticket individual
- `PUT /api/tickets/:id` - Actualizar ticket
- `POST /api/tickets/:id/assign` - Asignar ticket a técnico
- `PATCH /api/tickets/:id/status` - Cambiar estado de ticket

### 5. Users 👥
- `GET /api/users` - Listar usuarios (admin only)
- `GET /api/users/:id` - Obtener usuario individual

### 6. Filters & Pagination 🔍
- `GET /api/tickets?status=1` - Filtrar por estado
- `GET /api/tickets?priority=2` - Filtrar por prioridad
- `GET /api/tickets?page=1&limit=5` - Paginación
- `GET /api/tickets?search=test` - Búsqueda

### 7. Error Handling ⚠️
- `GET /api/invalid-endpoint` - Test 404
- `GET /api/tickets` (sin auth) - Test 401
- `POST /api/auth/login` (credenciales inválidas) - Test 401
- `GET /api/tickets/999999` - Test ticket no existe

---

## 📊 Output del Script

### Modo Normal
```
╔════════════════════════════════════════════════════════════════════╗
║     MAC TICKETS API - TEST AUTOMATIZADO DE ENDPOINTS             ║
╚════════════════════════════════════════════════════════════════════╝

API URL: http://localhost:3001
Modo: Normal
Iniciando tests: 2025-10-08 15:30:00

======================================================================
  1. HEALTH CHECK
======================================================================
✅ [GET   ] /health

======================================================================
  2. AUTHENTICATION
======================================================================

2.1 Login
✅ [POST  ] /api/auth/login
  Token obtenido: eyJhbGciOiJIUzI1NiIs...

2.2 Get Profile
✅ [GET   ] /api/auth/profile
  User ID: 1
  User: Super Admin

2.3 Logout
✅ [POST  ] /api/auth/logout

2.4 Re-login para continuar tests
  Re-autenticado exitosamente

======================================================================
  3. CATALOGS
======================================================================

3.1 Categories
✅ [GET   ] /api/catalog/categories
  Total categorías: 2

3.2 Priorities
✅ [GET   ] /api/catalog/priorities
  Total prioridades: 4

... (continúa con todos los endpoints)

======================================================================
  RESUMEN FINAL
======================================================================

📊 Estadísticas:
   Total de tests: 25
   ✅ Pasados: 23
   ❌ Fallidos: 2
   ⏱️  Duración: 3.45s
   📈 Tasa de éxito: 92.0%

⚠️  Algunos tests fallaron. Revisa los logs arriba.

Finalizado: 2025-10-08 15:30:03
```

### Modo Verbose
Incluye toda la información anterior más:
- Response status de cada request
- Primeros 200 caracteres del response body
- Mensajes de error detallados

---

## 🎯 Casos de Uso

### 1. Testing Rápido Durante Desarrollo
```bash
# Después de hacer cambios en el código
node test-all-endpoints.js

# Ver si todos los endpoints siguen funcionando
```

### 2. Testing Antes de Commit
```bash
# En tu workflow de git
git add .
node test-all-endpoints.js && git commit -m "feat: nueva funcionalidad"
```

### 3. Testing de API en AWS
```bash
# Probar API deployada
node test-all-endpoints.js --url=https://api.tu-dominio.com --verbose
```

### 4. Integración en CI/CD
```yaml
# .github/workflows/test.yml
- name: Test API Endpoints
  run: |
    cd MAC/mac-tickets-api
    node test-all-endpoints.js --url=${{ secrets.API_URL }}
```

### 5. Testing de Diferentes Ambientes
```bash
# Desarrollo
node test-all-endpoints.js --url=http://localhost:3001

# Staging
node test-all-endpoints.js --url=https://staging-api.tu-dominio.com

# Producción
node test-all-endpoints.js --url=https://api.tu-dominio.com
```

---

## ⚙️ Configuración

### Credenciales de Prueba
El script usa las credenciales demo por defecto:
```javascript
const TEST_CREDENTIALS = {
  email: 'admin@maccomputadoras.com',
  password: 'admin123'
};
```

Para cambiar las credenciales, edita el archivo `test-all-endpoints.js`.

### URL de la API
```bash
# Por defecto: http://localhost:3001
node test-all-endpoints.js

# Personalizada
node test-all-endpoints.js --url=http://tu-servidor:3000

# Con protocolo seguro
node test-all-endpoints.js --url=https://api.produccion.com
```

---

## 🔧 Requisitos

- **Node.js 18+** (usa fetch nativo)
- **API corriendo** en la URL especificada
- **Base de datos** con datos demo cargados

### Verificar Node.js
```bash
node --version
# Debe mostrar v18.x.x o superior
```

---

## 📝 Notas Importantes

### 1. Tests Secuenciales
Los tests se ejecutan en orden secuencial para:
- ✅ Mantener el token JWT entre requests
- ✅ Usar IDs creados en tests anteriores
- ✅ Simular un flujo real de usuario

### 2. Datos de Prueba
El script:
- ✅ Crea un ticket de prueba
- ✅ Lo actualiza
- ✅ Lo asigna a un técnico
- ✅ Cambia su estado
- ⚠️ **NO limpia** los datos después (para debugging)

### 3. Exit Codes
```bash
# Exit code 0: Todos los tests pasaron
# Exit code 1: Al menos un test falló
```

Útil para CI/CD:
```bash
node test-all-endpoints.js || echo "Tests fallaron!"
```

---

## 🐛 Troubleshooting

### Error: `fetch is not defined`
```bash
# Actualizar Node.js a v18+
nvm install 18
nvm use 18
```

### Error: `ECONNREFUSED`
```bash
# Verificar que el API está corriendo
curl http://localhost:3001/health

# Iniciar el API
npm run dev
# o
pm2 start src/server.js --name mactickets-api
```

### Todos los tests fallan con 401
```bash
# Verificar credenciales en el script
# Verificar que el usuario existe en la base de datos
mysql -h HOST -u USER -p mactickets -e "SELECT * FROM users WHERE email='admin@maccomputadoras.com';"
```

### Tests pasan localmente pero fallan en AWS
```bash
# Verificar Security Groups (puerto 3001 abierto)
# Verificar CORS en backend (.env)
# Verificar que el dominio es correcto
node test-all-endpoints.js --url=https://api.tu-dominio.com --verbose
```

---

## 🎨 Personalización

### Agregar Más Tests
```javascript
// En test-all-endpoints.js

async function testCustomEndpoint() {
  logSection('X. CUSTOM TEST');
  
  const result = await makeRequest('GET', '/api/custom-endpoint', null, true);
  logTest('GET', '/api/custom-endpoint', result.success ? 'PASS' : 'FAIL');
}

// Agregar a runAllTests()
async function runAllTests() {
  // ... tests existentes
  await testCustomEndpoint();
}
```

### Cambiar Colores
```javascript
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',     // Cambiar código ANSI
  green: '\x1b[32m',
  // ...
};
```

### Agregar Logs a Archivo
```javascript
const fs = require('fs');

function log(message, color = 'white') {
  const output = `${colors[color]}${message}${colors.reset}`;
  console.log(output);
  
  // También guardar en archivo
  fs.appendFileSync('test-results.log', `${message}\n`);
}
```

---

## 📊 Ejemplo de Salida Completa

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

2.1 Login
✅ [POST  ] /api/auth/login
  Token obtenido: eyJhbGciOiJIUzI1NiIs...

2.2 Get Profile
✅ [GET   ] /api/auth/profile
  User ID: 1
  User: Super Admin

2.3 Logout
✅ [POST  ] /api/auth/logout

2.4 Re-login para continuar tests
  Re-autenticado exitosamente

======================================================================
  3. CATALOGS
======================================================================

3.1 Categories
✅ [GET   ] /api/catalog/categories
  Total categorías: 2

3.2 Priorities
✅ [GET   ] /api/catalog/priorities
  Total prioridades: 4

3.3 Ticket Statuses
✅ [GET   ] /api/catalog/ticket-statuses
  Total estados: 7

3.4 Technicians
✅ [GET   ] /api/catalog/technicians
  Total técnicos: 5

======================================================================
  4. TICKETS
======================================================================

4.1 Get All Tickets
✅ [GET   ] /api/tickets
  Total tickets: 4
  Test Ticket ID: 1

4.2 Get Ticket Stats
✅ [GET   ] /api/tickets/stats
  Stats: {"total":4,"new":1,"inProgress":2,"resolved":1}

4.3 Create Ticket
✅ [POST  ] /api/tickets
  Ticket creado: ID 5
  Ticket Number: ID-2025-005

4.4 Get Single Ticket
✅ [GET   ] /api/tickets/1

4.5 Update Ticket
✅ [PUT   ] /api/tickets/5

4.6 Assign Ticket
✅ [POST  ] /api/tickets/5/assign

4.7 Update Ticket Status
✅ [PATCH ] /api/tickets/5/status

======================================================================
  5. USERS (Admin only)
======================================================================

5.1 Get All Users
✅ [GET   ] /api/users
  Total usuarios: 12

5.2 Get Single User
✅ [GET   ] /api/users/1

======================================================================
  6. FILTERS AND PAGINATION
======================================================================

6.1 Filter by Status
✅ [GET   ] /api/tickets?status=1

6.2 Filter by Priority
✅ [GET   ] /api/tickets?priority=2

6.3 Pagination
✅ [GET   ] /api/tickets?page=1&limit=5
  Items en página: 5

6.4 Search
✅ [GET   ] /api/tickets?search=test

======================================================================
  7. ERROR HANDLING
======================================================================

7.1 Invalid Endpoint (404)
✅ [GET   ] /api/invalid-endpoint

7.2 Unauthorized (401)
✅ [GET   ] /api/tickets (no auth)

7.3 Invalid Login (401)
✅ [POST  ] /api/auth/login (invalid)

7.4 Invalid Ticket ID (404)
✅ [GET   ] /api/tickets/999999

======================================================================
  RESUMEN FINAL
======================================================================

📊 Estadísticas:
   Total de tests: 28
   ✅ Pasados: 28
   ❌ Fallidos: 0
   ⏱️  Duración: 4.23s
   📈 Tasa de éxito: 100.0%

🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!

Finalizado: 2025-10-08 16:00:04

======================================================================
```

---

## 🎯 Tips y Best Practices

### 1. Ejecutar Antes de Cada Commit
```bash
# Crear alias en ~/.bashrc o ~/.zshrc
alias test-api="cd MAC/mac-tickets-api && node test-all-endpoints.js"

# Usar
test-api
```

### 2. Integrar con Git Hooks
```bash
# .git/hooks/pre-commit
#!/bin/bash
echo "Running API tests..."
cd MAC/mac-tickets-api
node test-all-endpoints.js || exit 1
```

### 3. Testing Continuo Durante Desarrollo
```bash
# Usar nodemon para ejecutar en cada cambio
npx nodemon --exec "node test-all-endpoints.js" --watch src/
```

### 4. Crear Reporte HTML
```javascript
// Agregar al final del script
const html = `
<html>
  <body>
    <h1>Test Results</h1>
    <p>Passed: ${passedTests}</p>
    <p>Failed: ${failedTests}</p>
  </body>
</html>
`;
fs.writeFileSync('test-report.html', html);
```

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica que Node.js es v18+
2. Verifica que el API está corriendo
3. Verifica las credenciales de prueba
4. Ejecuta con `--verbose` para más detalles
5. Revisa los logs del backend

---

## 🎉 ¡Listo para Testear!

Ahora puedes probar todos tus endpoints con un solo comando:

```bash
node test-all-endpoints.js
```

**Tiempo estimado**: 3-5 segundos  
**Tests ejecutados**: 25-30  
**Cobertura**: Todos los endpoints principales  

¡Happy Testing! 🧪✨
