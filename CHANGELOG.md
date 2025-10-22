# 📝 Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-01-22

### 🎉 Lanzamiento Inicial

Primera versión completa del sistema MAC Tickets.

### ✨ Agregado

#### **Dashboard Web**
- Sistema completo de gestión de tickets
- Autenticación JWT con refresh tokens
- 3 roles de usuario (Admin, Técnico, Mesa de Trabajo)
- Dashboard con métricas en tiempo real
- CRUD completo de usuarios (Admin)
- Gestión de tickets con 7 estados
- 4 niveles de prioridad con SLA
- 7 categorías predefinidas
- Sistema de comentarios internos y públicos
- Subida de archivos adjuntos
- Historial completo de cambios en tickets
- Búsqueda y filtros avanzados
- Exportación de reportes a Excel
- Generación de PDFs con firma digital
- Tema claro y oscuro
- Notificaciones en tiempo real (WebSockets)
- Diseño responsive (móvil, tablet, escritorio)

#### **API Backend**
- API REST con 43 endpoints
- Autenticación y autorización basada en roles
- Validación de datos con Joi
- Rate limiting para seguridad
- WebSocket con Socket.IO
- Manejo de archivos con Multer
- ORM Sequelize para MySQL
- Middleware de autenticación JWT
- Logging de requests con Morgan
- CORS configurado
- Generación de PDFs del lado del servidor
- Exportación de reportes a Excel

#### **Aplicación Android**
- App nativa en Kotlin
- Arquitectura Clean + MVVM
- UI con Jetpack Compose
- Autenticación JWT
- Lista de tickets asignados
- Detalle de tickets
- Cambio de estado en tiempo real
- Agregar comentarios
- Subir fotos desde cámara o galería
- Resolución de tickets con firma digital
- Base de datos local con Room
- Sincronización automática
- Modo offline
- Notificaciones push

#### **Infraestructura**
- Deployment en AWS Elastic Beanstalk
- Base de datos MySQL en AWS RDS
- Almacenamiento de archivos (local o S3)
- Scripts de deployment automatizados
- Schemas SQL completos
- Seed data para pruebas

#### **Documentación**
- README completo del proyecto
- Guía de desarrollo (DEVELOPMENT-RULES.md)
- Referencia completa de endpoints
- Guías de deployment en AWS
- Scripts de setup automatizados
- Documentación de troubleshooting
- Guía de contribución

### 🔧 Configuración

- Node.js 18+ como runtime backend
- React 18+ con Vite para frontend
- MySQL 8.0+ como base de datos
- Kotlin 1.9+ para Android
- AWS como infraestructura cloud

### 🐛 Corregido

- Error de categorías vacías en AWS RDS
- Columnas incorrectas en schema SQL
- Error 404 en rutas sin prefijo /api/
- Problemas de autenticación en Android
- Issues de sincronización offline

### 📊 Estadísticas

- 43 endpoints API documentados
- 20+ tablas en base de datos
- 7 categorías de tickets
- 4 niveles de prioridad
- 7 estados de tickets
- 3 roles de usuario
- 6 usuarios de prueba

---

## [0.9.0] - 2025-01-15 - Beta

### ✨ Agregado
- Versión beta funcional del dashboard web
- Endpoints básicos de API
- Autenticación JWT
- CRUD de tickets básico

### 🔧 Cambiado
- Migración de Vue a React
- Cambio de PostgreSQL a MySQL

---

## [0.5.0] - 2024-12-10 - Alpha

### ✨ Agregado
- Prototipo inicial del dashboard
- Estructura básica del backend
- Modelos de base de datos
- Login básico

---

## 🚀 Roadmap

### [1.1.0] - Próxima versión

#### Planeado
- [ ] Notificaciones push en Android
- [ ] Chat en tiempo real entre usuarios
- [ ] Integración con WhatsApp
- [ ] Escaneo de códigos QR
- [ ] Geolocalización de tickets
- [ ] Templates de tickets
- [ ] Automatización de asignación
- [ ] Métricas avanzadas con gráficos
- [ ] Exportación a PDF mejorada
- [ ] Sistema de etiquetas (tags)
- [ ] Adjuntar múltiples archivos simultáneamente
- [ ] Vista de calendario
- [ ] Recordatorios automáticos
- [ ] Integración con LDAP/Active Directory

### [1.2.0] - Futuro

#### En Consideración
- [ ] App iOS (Swift)
- [ ] Integración con Slack
- [ ] API pública con rate limiting por API key
- [ ] Webhooks para integraciones
- [ ] Modo oscuro en Android
- [ ] Temas personalizables
- [ ] Multi-idioma (i18n)
- [ ] Módulo de facturación
- [ ] Inventario de equipos
- [ ] Base de conocimiento (KB)
- [ ] SLA personalizables por cliente
- [ ] Campos personalizados en tickets

---

## 📝 Notas

### Versiones

El versionado sigue el formato `MAJOR.MINOR.PATCH`:

- **MAJOR:** Cambios incompatibles con versiones anteriores
- **MINOR:** Nueva funcionalidad compatible con versiones anteriores
- **PATCH:** Correcciones de bugs compatibles con versiones anteriores

### Enlaces

- [Repositorio](https://github.com/tu-usuario/MacApiFront)
- [Documentación](Docs/)
- [Issues](https://github.com/tu-usuario/MacApiFront/issues)
- [Releases](https://github.com/tu-usuario/MacApiFront/releases)

---

**Última actualización:** 2025-01-22

