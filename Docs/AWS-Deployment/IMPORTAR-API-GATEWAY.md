# Guía: Importar Endpoints en AWS API Gateway

## Resumen

Esta guía te ayudará a importar todos los endpoints del backend de MAC Tickets en AWS API Gateway usando el archivo Swagger/OpenAPI generado.

---

## Archivo Generado

Se ha creado el archivo: `Docs/API-Gateway-Endpoints.json`

Este archivo contiene:
- ✅ Todos los endpoints del backend (40+ endpoints)
- ✅ Formato OpenAPI 2.0 (Swagger) compatible con API Gateway
- ✅ Métodos HTTP correctos (GET, POST, PUT, PATCH, DELETE)
- ✅ Parámetros y request bodies documentados
- ✅ Autenticación JWT configurada
- ✅ Tags para organización

---

## Métodos de Importación

### Método 1: Importar desde Consola de AWS (Recomendado)

#### Paso 1: Acceder a API Gateway

1. Inicia sesión en AWS Console
2. Busca el servicio "API Gateway"
3. Haz clic en "Create API"

#### Paso 2: Seleccionar Tipo de API

1. Selecciona **"REST API"** (no Private)
2. Haz clic en "Build"

#### Paso 3: Importar el Archivo

1. Selecciona **"Import from Swagger or OpenAPI 3"**
2. Haz clic en "Select Swagger File"
3. Sube el archivo `API-Gateway-Endpoints.json`
4. Click en "Import"

#### Paso 4: Configurar

1. **API name:** `mac-tickets-api`
2. **Description:** Sistema de Gestión de Tickets - MAC Computadoras
3. **Endpoint Type:** Regional
4. Haz clic en "Create API"

---

### Método 2: Importar con AWS CLI

Si prefieres usar la línea de comandos:

```bash
# Navega al directorio del proyecto
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront

# Importar el archivo
aws apigateway import-rest-api \
  --body file://Docs/API-Gateway-Endpoints.json \
  --fail-on-warnings \
  --region us-east-1
```

---

## Configuración Post-Importación

### 1. Configurar el Backend (Integration)

Para cada endpoint, necesitas configurar la integración con tu backend de Elastic Beanstalk:

#### Configuración de Integración HTTP

1. Selecciona un endpoint (ej: GET /tickets)
2. Click en "Integration Request"
3. Configuración:
   - **Integration type:** HTTP
   - **HTTP method:** [Mismo que el endpoint]
   - **Endpoint URL:** `http://macticketsv.us-east-1.elasticbeanstalk.com/api/tickets`
   - **Content Handling:** Passthrough

4. Guarda los cambios

#### Hacer esto para TODOS los endpoints

Puedes automatizar con script (ver más abajo).

---

### 2. Configurar CORS

Si el frontend hace llamadas directas desde el navegador:

1. Selecciona el recurso (ej: /tickets)
2. Click en "Actions" > "Enable CORS"
3. Configura:
   - **Access-Control-Allow-Origin:** `*` (o tu dominio del frontend)
   - **Access-Control-Allow-Headers:** `Content-Type,Authorization`
   - **Access-Control-Allow-Methods:** `GET,POST,PUT,PATCH,DELETE,OPTIONS`

---

### 3. Configurar Autenticación

#### Opción A: Lambda Authorizer

1. Crear función Lambda que valide JWT
2. En API Gateway > Authorizers > Create
3. Configurar Lambda Authorizer
4. Aplicar a endpoints protegidos

#### Opción B: Pass-through (Más Simple)

Dejar que el backend maneje la autenticación JWT (como está ahora):
- API Gateway solo hace proxy
- El backend valida el token JWT
- **Esta es la opción recomendada inicialmente**

---

### 4. Deploy de la API

1. Click en "Actions" > "Deploy API"
2. **Deployment stage:** prod (o crear nuevo: `production`)
3. **Stage description:** Producción - Versión 1.0.0
4. Click "Deploy"

#### Obtendrás una URL como:

```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

Esta será tu nueva URL base para el frontend.

---

## Script de Configuración Automática

Para configurar las integraciones automáticamente, usa este script AWS CLI:

```bash
#!/bin/bash

API_ID="[TU-API-ID]"  # Obtener después de crear la API
BACKEND_URL="http://macticketsv.us-east-1.elasticbeanstalk.com"
REGION="us-east-1"

# Obtener recursos de la API
RESOURCES=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION)

# Iterar y configurar integraciones
# (Este es un ejemplo, necesitarás expandirlo)

echo "✅ Configuración completada"
```

---

## Actualizar el Frontend

Una vez que tengas la URL de API Gateway, actualiza el frontend:

```bash
# MAC/mac-tickets-front/.env
VITE_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/api
```

---

## Estructura del Archivo JSON

El archivo `API-Gateway-Endpoints.json` incluye:

### Endpoints Principales

| Categoría | Cantidad | Ejemplos |
|-----------|----------|----------|
| **Autenticación** | 3 | /auth/login, /auth/profile, /auth/logout |
| **Tickets** | 13 | /tickets, /tickets/:id, /tickets/:id/assign |
| **Comentarios** | 2 | /tickets/:id/comments [GET, POST] |
| **Archivos** | 6 | /attachments/:id/download, /tickets/:id/attachments |
| **Usuarios** | 6 | /users, /users/:id, /users/:id/reset-password |
| **Catálogos** | 4 | /catalog/categories, /catalog/priorities |
| **Reportes** | 2 | /reports/dashboard, /reports/export |
| **PDF** | 2 | /pdf/ticket/:id, /pdf/ticket/:id/info |
| **Password Reset** | 3 | /password-resets [GET, POST], /:id/process |
| **Health** | 2 | /, /health |

**Total:** 43 endpoints

### Tags de Organización

Los endpoints están organizados en 10 categorías:
1. Health
2. Autenticación
3. Tickets
4. Comentarios
5. Archivos
6. Usuarios
7. Catálogos
8. Reportes
9. PDF
10. Password Reset

---

## Ventajas de Usar API Gateway

### Seguridad
- ✅ Rate limiting integrado
- ✅ API keys opcionales
- ✅ WAF (Web Application Firewall) disponible
- ✅ Logs detallados en CloudWatch

### Performance
- ✅ Caching de respuestas
- ✅ Edge locations (CloudFront)
- ✅ Throttling configurable

### Monitoreo
- ✅ Métricas en tiempo real
- ✅ CloudWatch Logs
- ✅ X-Ray tracing

### Gestión
- ✅ Versionamiento de API
- ✅ Múltiples stages (dev, staging, prod)
- ✅ Documentación auto-generada

---

## Consideraciones de Costos

### Pricing de API Gateway
- **Primeros 333 millones de requests:** $3.50 por millón
- **Siguientes requests:** $2.80 por millón
- **Caching:** ~$0.02/hora por GB
- **Incluido en Free Tier:** 1 millón de requests/mes (12 meses)

### Alternativa Sin Costos Adicionales

Si quieres evitar costos de API Gateway por ahora:
- ✅ Usa Elastic Beanstalk directamente
- ✅ El endpoint actual ya funciona
- ✅ Implementa rate limiting en el backend (Express)

---

## Troubleshooting

### "Execution failed due to configuration error"
- Verifica que el backend URL sea correcto
- Verifica que el backend esté accesible desde AWS

### "Missing Authentication Token"
- El endpoint está esperando autenticación
- Configura Lambda Authorizer o usa Pass-through

### "CORS Policy Error"
- Habilita CORS en API Gateway
- Verifica headers en el backend

### "Timeout Error"
- Aumenta el timeout en Integration Request (default: 29s)
- Optimiza las consultas lentas en el backend

---

## Siguientes Pasos

### Opción A: Usar API Gateway (Recomendado para Producción)
1. ⬜ Importar archivo JSON en API Gateway
2. ⬜ Configurar integraciones HTTP
3. ⬜ Habilitar CORS
4. ⬜ Deploy a stage de producción
5. ⬜ Actualizar frontend con nueva URL

### Opción B: Usar Elastic Beanstalk Directo (Rápido para Pruebas)
1. ✅ Ya tienes el endpoint funcionando
2. ✅ Frontend configurado con `.env.production`
3. ⬜ Solo falta probar funcionalidades

---

## Recursos Adicionales

- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [OpenAPI Specification](https://swagger.io/specification/v2/)
- [Import REST API in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-import-api.html)

---

**Última actualización:** 2025-01-21  
**Archivo:** `Docs/API-Gateway-Endpoints.json`  
**Elastic Beanstalk:** http://macticketsv.us-east-1.elasticbeanstalk.com/

