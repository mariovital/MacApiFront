# 🔐 Credenciales DEMO - Sistema de Tickets

## 🚨 **CONTRASEÑA UNIVERSAL: `demo123`**

Todos los usuarios del sistema DEMO tienen la misma contraseña: **`demo123`**

---

## 👥 **Usuarios Disponibles**

### 🔴 **ADMINISTRADORES** (Acceso Total)

| Usuario | Email | Contraseña | Permisos |
|---------|-------|------------|----------|
| `admin` | admin@maccomputadoras.com | `demo123` | ✅ TODOS los módulos |
| `admin.sistemas` | sistemas@maccomputadoras.com | `demo123` | ✅ TODOS los módulos |

**Funcionalidades:**
- ✅ Dashboard completo con métricas
- ✅ Gestión de Tickets (crear, editar, asignar, cerrar)
- ✅ Gestión de Usuarios (crear, editar, desactivar)
- ✅ Reportes y Analytics
- ✅ Configuración del Sistema
- ✅ Ver todos los tickets del sistema
- ✅ Asignar técnicos a tickets
- ✅ Cambiar prioridades y estados

---

### 🔵 **TÉCNICOS** (Resolver Tickets)

| Usuario | Email | Contraseña | Tickets Asignados |
|---------|-------|------------|-------------------|
| `juan.perez` | juan.perez@maccomputadoras.com | `demo123` | 2 tickets |
| `maria.gonzalez` | maria.gonzalez@maccomputadoras.com | `demo123` | 2 tickets |
| `carlos.ruiz` | carlos.ruiz@maccomputadoras.com | `demo123` | 1 ticket |
| `ana.torres` | ana.torres@maccomputadoras.com | `demo123` | 1 ticket |
| `pedro.ramirez` | pedro.ramirez@maccomputadoras.com | `demo123` | 1 ticket |

**Funcionalidades:**
- ✅ Dashboard personal con métricas
- ✅ Ver tickets asignados
- ✅ Aceptar/Rechazar tickets
- ✅ Actualizar estado de tickets
- ✅ Agregar comentarios (públicos e internos)
- ✅ Subir archivos adjuntos
- ✅ Marcar tickets como resueltos
- ❌ NO pueden ver tickets de otros técnicos
- ❌ NO pueden gestionar usuarios
- ❌ NO pueden ver reportes globales

---

### 🟢 **MESA DE TRABAJO** (Crear Tickets)

| Usuario | Email | Contraseña | Tickets Creados |
|---------|-------|------------|-----------------|
| `lucia.mesa` | lucia.mesa@maccomputadoras.com | `demo123` | 5 tickets |
| `diego.soporte` | diego.soporte@maccomputadoras.com | `demo123` | 2 tickets |
| `carmen.ventas` | carmen.ventas@maccomputadoras.com | `demo123` | 1 ticket |
| `roberto.admin` | roberto.admin@maccomputadoras.com | `demo123` | 1 ticket |

**Funcionalidades:**
- ✅ Dashboard personal
- ✅ Crear nuevos tickets
- ✅ Ver solo SUS tickets creados
- ✅ Agregar comentarios en sus tickets
- ✅ Cerrar sus tickets resueltos
- ✅ Subir archivos adjuntos
- ❌ NO pueden ver tickets de otros usuarios
- ❌ NO pueden asignar técnicos
- ❌ NO pueden gestionar usuarios
- ❌ NO pueden ver reportes

---

### ⚪ **USUARIOS INACTIVOS** (Para Pruebas)

| Usuario | Email | Contraseña | Estado |
|---------|-------|------------|--------|
| `usuario.inactivo` | inactivo@maccomputadoras.com | `demo123` | ❌ INACTIVO |

**Funcionalidad:**
- Este usuario **NO puede iniciar sesión**
- Útil para probar la gestión de usuarios inactivos
- Los admins pueden reactivarlo desde el módulo de usuarios

---

## 🎫 **Datos DEMO en el Sistema**

### **Tickets Disponibles: 20**

#### Por Estado:
- 🆕 **Nuevos** (Sin asignar): 3 tickets
- 📋 **Asignados** (Pendiente técnico): 3 tickets
- ⏳ **En Proceso** (Técnico trabajando): 4 tickets
- 🎯 **Pendiente Cliente**: 0 tickets
- ✅ **Resueltos** (Esperando confirmación): 5 tickets
- 🔒 **Cerrados** (Finalizados): 5 tickets

#### Por Prioridad:
- 🔴 **Crítica** (SLA: 4h): 3 tickets
- 🟠 **Alta** (SLA: 8h): 4 tickets
- 🟡 **Media** (SLA: 24h): 8 tickets
- 🟢 **Baja** (SLA: 72h): 5 tickets

#### Por Categoría:
- 💻 **Hardware**: 5 tickets
- 🖥️ **Software**: 7 tickets
- 🌐 **Red/Conectividad**: 4 tickets
- 🆘 **Soporte General**: 4 tickets

---

## 💬 **Comentarios y Actividad**

- **25+ comentarios** distribuidos en los tickets
- **Comentarios públicos** (visibles para todos)
- **Comentarios internos** (solo técnicos y admins)
- **30+ entradas de historial** de cambios
- **12 notificaciones** activas para usuarios

---

## 📎 **Archivos Adjuntos**

- **7 archivos** adjuntos simulados
- Incluyen logs, capturas de pantalla, reportes
- Metadatos completos (tamaño, tipo MIME, S3 key)

---

## 🧪 **Escenarios de Prueba Recomendados**

### **Escenario 1: Flujo Básico de Ticket**
1. Login como **Mesa de Trabajo** (`lucia.mesa`)
2. Crear un nuevo ticket
3. Login como **Admin** (`admin`)
4. Asignar el ticket a un técnico
5. Login como **Técnico** (`juan.perez`)
6. Aceptar y resolver el ticket
7. Login como **Mesa de Trabajo** nuevamente
8. Confirmar solución y cerrar ticket

### **Escenario 2: Gestión de Usuarios (Admin)**
1. Login como **Admin** (`admin`)
2. Ir a módulo de Usuarios
3. Ver lista completa de 12 usuarios
4. Editar información de un usuario
5. Desactivar un usuario
6. Crear un nuevo usuario

### **Escenario 3: Tickets Críticos (Técnico)**
1. Login como **Técnico** (`juan.perez`)
2. Ver ticket crítico ID-2025-001
3. Agregar comentario de diagnóstico
4. Subir archivo adjunto (evidencia)
5. Actualizar estado a "En Proceso"
6. Resolver ticket con comentario final

### **Escenario 4: Reportes y Analytics (Admin)**
1. Login como **Admin** (`admin`)
2. Ir a módulo de Reportes
3. Ver métricas de rendimiento
4. Analizar distribución por categoría
5. Revisar rendimiento de técnicos
6. Exportar reporte (funcionalidad futura)

---

## 🔗 **Endpoints para Pruebas con Postman**

### **Base URL Local:**
```
http://localhost:3001/api
```

### **Base URL con ngrok:**
```
https://tu-url-ngrok.ngrok-free.app/api
```

### **Endpoints Principales:**

#### **Autenticación**
```http
POST /api/auth/login
Body: { "email": "admin@maccomputadoras.com", "password": "demo123" }
```

#### **Tickets**
```http
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PUT    /api/tickets/:id
PATCH  /api/tickets/:id/status
POST   /api/tickets/:id/assign
```

#### **Usuarios (Solo Admin)**
```http
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

#### **Comentarios**
```http
GET  /api/tickets/:id/comments
POST /api/tickets/:id/comments
```

Consulta `/Docs/POSTMAN-ENDPOINTS.md` para la documentación completa.

---

## ⚠️ **IMPORTANTE - Seguridad**

### **Este es un entorno DEMO**
- ❌ **NO usar en producción**
- ❌ Contraseñas débiles (`demo123`)
- ❌ Datos ficticios
- ✅ Solo para pruebas y demostraciones

### **Para Producción:**
1. Cambiar TODAS las contraseñas
2. Usar contraseñas seguras (mínimo 12 caracteres)
3. Habilitar autenticación de dos factores
4. Configurar HTTPS
5. Implementar políticas de seguridad
6. Rotar tokens JWT regularmente

---

## 📞 **Soporte**

Si encuentras problemas:
1. Verifica que ejecutaste el script `/Docs/DEMO-DATA.sql`
2. Confirma que el backend esté corriendo (`npm run dev`)
3. Revisa los logs en la consola del backend
4. Consulta `/Docs/SETUP-DEMO-ENVIRONMENT.md` para configuración detallada

---

## ✅ **Checklist Rápido**

Antes de compartir con tu equipo, verifica:

- [ ] Base de datos creada y poblada con DEMO-DATA.sql
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 5173
- [ ] ngrok configurado y exponiendo el API
- [ ] CORS_ORIGIN actualizado en .env con URL de ngrok
- [ ] Probado login con al menos 1 usuario de cada rol
- [ ] Compartida la URL de ngrok con el equipo

**¡Listo para demostración! 🚀**

---

**Última actualización:** 15 de Enero 2025  
**Versión:** 1.0.0 DEMO
