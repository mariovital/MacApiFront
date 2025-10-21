# 🚀 Inicio Rápido: Configurar Frontend con AWS

## ¿Qué se hizo?

Se configuró completamente el frontend y se generó toda la documentación necesaria para conectar tu aplicación MAC Tickets con AWS Elastic Beanstalk y opcionalmente con API Gateway.

---

## ⚡ Pasos Inmediatos (5 minutos)

### 1. Configurar el Frontend

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Crear archivo .env desde la plantilla de producción
cp .env.production .env

# Verificar que contenga el endpoint de AWS
cat .env
```

Deberías ver:
```
VITE_API_URL=http://macticketsv.us-east-1.elasticbeanstalk.com/api
VITE_SOCKET_URL=http://macticketsv.us-east-1.elasticbeanstalk.com
```

### 2. Reiniciar el Servidor de Desarrollo

```bash
# Detener el servidor actual (Ctrl+C si está corriendo)

# Reiniciar
npm run dev
```

### 3. Probar la Conexión

1. Abre tu navegador en: http://localhost:5173
2. Ve a la página de login
3. Abre DevTools (F12) > Console
4. Verifica la URL:
```javascript
console.log(import.meta.env.VITE_API_URL)
// Debe mostrar: http://macticketsv.us-east-1.elasticbeanstalk.com/api
```
5. Intenta hacer login con tus credenciales demo

✅ Si funciona, ya estás conectado a AWS!

---

## 📦 Archivos Creados

### Configuración del Frontend

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| `.env.production` | `MAC/mac-tickets-front/` | Config para producción (AWS) |
| `.env.example` | `MAC/mac-tickets-front/` | Plantilla para crear tu `.env` |

### Documentación para API Gateway

| Archivo | Ubicación | Contenido |
|---------|-----------|-----------|
| `API-Gateway-Endpoints.json` | `Docs/` | 43 endpoints en formato OpenAPI 2.0 |

### Guías y Documentación

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| `CONFIG-FRONTEND-AWS.md` | `Docs/AWS-Deployment/` | Cómo configurar el frontend |
| `IMPORTAR-API-GATEWAY.md` | `Docs/AWS-Deployment/` | Cómo importar en API Gateway |
| `RESUMEN-CAMBIO-AWS.md` | `Docs/AWS-Deployment/` | Resumen ejecutivo de todo |
| `00-INICIO-RAPIDO.md` | `Docs/AWS-Deployment/` | Este archivo |
| `ENDPOINTS-REFERENCE.md` | `Docs/` | Referencia rápida de todos los endpoints |
| `QUICK-SWITCH-ENV.md` | `Docs/` | Cambiar entre local ↔ AWS |

### Actualizaciones

| Archivo | Cambio |
|---------|--------|
| `.gitignore` | Agregado `.env` para seguridad |

---

## 🎯 ¿Qué Hacer Ahora?

### Opción A: Usar Elastic Beanstalk Directamente (Recomendado para empezar) ✅

**Ya está listo!** Solo sigue los pasos de "Pasos Inmediatos" arriba.

**Ventajas:**
- ✅ Cero configuración adicional
- ✅ Sin costos extra
- ✅ Funciona inmediatamente

**Endpoint:**
```
http://macticketsv.us-east-1.elasticbeanstalk.com/api
```

---

### Opción B: Usar API Gateway (Para producción profesional)

**Requiere:** 15-30 minutos de configuración

**Ventajas:**
- ✅ Rate limiting avanzado
- ✅ API keys y autenticación
- ✅ Caching de respuestas
- ✅ Monitoreo en CloudWatch
- ✅ Versionamiento de API

**Pasos:**
1. Lee: `Docs/AWS-Deployment/IMPORTAR-API-GATEWAY.md`
2. Importa: `Docs/API-Gateway-Endpoints.json` en AWS Console
3. Configura integraciones HTTP
4. Deploy a stage `prod`
5. Actualiza `.env` con la nueva URL

---

## 📚 Documentación Completa

### Para Configurar el Frontend
```bash
cat Docs/AWS-Deployment/CONFIG-FRONTEND-AWS.md
```

### Para API Gateway
```bash
cat Docs/AWS-Deployment/IMPORTAR-API-GATEWAY.md
```

### Resumen Ejecutivo
```bash
cat Docs/AWS-Deployment/RESUMEN-CAMBIO-AWS.md
```

### Referencia de Endpoints
```bash
cat Docs/ENDPOINTS-REFERENCE.md
```

### Cambiar Entre Local y AWS
```bash
cat Docs/QUICK-SWITCH-ENV.md
```

---

## 🔍 Verificar que Todo Funciona

### 1. Verificar Backend de AWS

```bash
curl http://macticketsv.us-east-1.elasticbeanstalk.com/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "data": {
    "server": "Online",
    "database": "Connected",
    ...
  }
}
```

### 2. Verificar Frontend

```bash
# Ver configuración actual
cd MAC/mac-tickets-front
cat .env | grep VITE_API_URL

# Iniciar servidor
npm run dev
```

### 3. Probar Login

1. Ir a http://localhost:5173/login
2. Usar credenciales demo (ver `Docs/DEMO-CREDENTIALS.md`)
3. Si muestra el dashboard ✅ Todo funciona!

### 4. Probar Funcionalidades

- [ ] Ver lista de tickets
- [ ] Crear nuevo ticket
- [ ] Ver detalle de ticket
- [ ] Agregar comentario
- [ ] Subir archivo adjunto
- [ ] Generar PDF
- [ ] Ver reportes

---

## 🛠️ Comandos Útiles

### Cambiar a AWS
```bash
cd MAC/mac-tickets-front && cp .env.production .env && npm run dev
```

### Cambiar a Local
```bash
cd MAC/mac-tickets-front && cp .env.example .env && npm run dev
```

### Ver URL Actual
```bash
cd MAC/mac-tickets-front && cat .env | grep VITE_API_URL
```

### Build para Producción
```bash
cd MAC/mac-tickets-front && npm run build
```

---

## 📊 Resumen de Endpoints

**Total de endpoints disponibles:** 43

| Categoría | Cantidad | Ejemplos |
|-----------|----------|----------|
| Health | 2 | /, /health |
| Autenticación | 3 | /auth/login, /auth/profile |
| Tickets | 13 | /tickets, /tickets/:id/assign |
| Comentarios | 2 | /tickets/:id/comments |
| Archivos | 6 | /attachments/:id/download |
| Usuarios | 6 | /users, /users/:id |
| Catálogos | 4 | /catalog/categories |
| Reportes | 2 | /reports/dashboard |
| PDF | 2 | /pdf/ticket/:id |
| Password Reset | 3 | /password-resets |

Ver detalles completos en: `Docs/ENDPOINTS-REFERENCE.md`

---

## ⚠️ Notas Importantes

### Seguridad
- ✅ `.env` está en `.gitignore` (no se hará commit)
- ✅ Puedes hacer commit de `.env.example` y `.env.production`
- ⚠️ **NUNCA** hacer commit de tu archivo `.env` local con credenciales

### CORS
- ✅ El backend ya tiene CORS configurado
- Si tienes errores CORS, verifica `CORS_ORIGIN` en el backend

### WebSockets
- ✅ Socket.IO está configurado para AWS
- Notificaciones en tiempo real funcionarán automáticamente

---

## 🚧 Troubleshooting

### "Cannot connect to server"
```bash
# Verificar que AWS esté corriendo
curl http://macticketsv.us-east-1.elasticbeanstalk.com/health
```

### "CORS Error"
1. Verifica `CORS_ORIGIN` en el backend
2. Temporalmente usa `*` para pruebas

### "401 Unauthorized"
- Token expiró
- Hacer logout y login de nuevo

### "Los cambios no se reflejan"
```bash
# IMPORTANTE: Reiniciar después de cambiar .env
npm run dev
```

### "ERR_CONNECTION_REFUSED"
- Verifica que el endpoint de AWS esté correcto
- Verifica que Elastic Beanstalk esté corriendo

---

## 📋 Checklist de Configuración

### Configuración Básica
- [ ] ✅ Archivo `.env` creado
- [ ] ✅ Contiene endpoint de AWS
- [ ] ✅ Servidor reiniciado
- [ ] ✅ Login funciona
- [ ] ✅ Tickets se cargan

### Testing Completo
- [ ] Crear ticket
- [ ] Editar ticket
- [ ] Asignar técnico
- [ ] Agregar comentario
- [ ] Subir archivo
- [ ] Generar PDF
- [ ] Cerrar ticket
- [ ] Ver reportes

### Opcional: API Gateway
- [ ] Archivo JSON importado
- [ ] Integraciones configuradas
- [ ] CORS habilitado
- [ ] Deploy a prod
- [ ] Frontend actualizado con nueva URL

---

## 🎓 Próximos Pasos

### Corto Plazo (Esta Semana)
1. [ ] Probar todas las funcionalidades con AWS
2. [ ] Verificar que archivos se suban correctamente
3. [ ] Probar generación de PDFs
4. [ ] Verificar WebSockets/notificaciones

### Mediano Plazo (Este Mes)
1. [ ] Decidir: ¿Elastic Beanstalk o API Gateway?
2. [ ] Si API Gateway: Importar y configurar
3. [ ] Configurar dominio personalizado (Route 53)
4. [ ] HTTPS con certificado SSL (ACM)

### Largo Plazo (Próximos Meses)
1. [ ] Deploy frontend a producción
   - S3 + CloudFront
   - Vercel
   - Netlify
2. [ ] CI/CD con GitHub Actions
3. [ ] Monitoreo con CloudWatch
4. [ ] Backup automático de base de datos

---

## 📞 ¿Necesitas Ayuda?

### Documentación Disponible
- `CONFIG-FRONTEND-AWS.md` - Setup detallado del frontend
- `IMPORTAR-API-GATEWAY.md` - Guía completa de API Gateway
- `ENDPOINTS-REFERENCE.md` - Referencia de todos los endpoints
- `QUICK-SWITCH-ENV.md` - Cambiar entre ambientes

### Logs y Debug
- **Frontend:** DevTools > Console
- **Backend AWS:** CloudWatch Logs en AWS Console
- **Elastic Beanstalk:** Environment > Logs

---

## ✅ Todo Listo!

Si seguiste los "Pasos Inmediatos" de arriba, tu aplicación ya debería estar conectada a AWS.

**Próximo comando:**
```bash
cd MAC/mac-tickets-front && npm run dev
```

**Luego abre:** http://localhost:5173

---

**Última actualización:** 2025-01-21  
**Endpoint AWS:** http://macticketsv.us-east-1.elasticbeanstalk.com/  
**Archivos creados:** 8  
**Endpoints documentados:** 43

