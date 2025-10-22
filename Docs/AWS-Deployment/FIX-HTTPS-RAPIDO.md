# ⚡ Solución Rápida: Mixed Content HTTPS

## 🚨 Tu Problema

```
Frontend (Vercel): https://mac-api-front.vercel.app ✅
Backend (AWS):     http://macticketsv...elasticbeanstalk.com ❌
```

**Navegadores bloquean HTTP desde HTTPS** por seguridad.

---

## 🚀 Solución MÁS RÁPIDA (5 minutos)

### Opción A: Permitir HTTP en tu Backend (TEMPORAL)

Agregar header CORS especial y probar desde navegador con configuración especial.

**NO RECOMENDADO** - Inseguro.

---

### Opción B: API Gateway con HTTPS (MEJOR - 15 min)

**Ya tienes el archivo JSON listo!** Solo importarlo.

#### Paso 1: Ir a API Gateway

```bash
# 1. AWS Console > API Gateway
# 2. Create API > REST API (Import)
# 3. Sube el archivo:
open /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/API-Gateway-Endpoints.json
```

#### Paso 2: Configurar Integración

1. Para cada endpoint, configura:
   - **Integration type:** HTTP Proxy
   - **Endpoint URL:** `http://macticketsv.us-east-1.elasticbeanstalk.com{proxy}`
   - **HTTP method:** ANY

2. **Deploy API** > Stage: "prod"

3. Copia la URL que te da (HTTPS automático):
   ```
   https://abc12345.execute-api.us-east-1.amazonaws.com/prod
   ```

#### Paso 3: Actualizar Vercel

```
VITE_API_URL=https://abc12345.execute-api.us-east-1.amazonaws.com/prod/api
```

---

## 🎯 Opción C: CloudFront (SIN DOMINIO - 10 min)

La más simple si no tienes dominio:

### Crear CloudFront Distribution

```bash
# AWS Console > CloudFront > Create Distribution
```

**Configuración:**
- **Origin domain:** `macticketsv.us-east-1.elasticbeanstalk.com`
- **Protocol:** HTTP only
- **Viewer protocol policy:** Redirect HTTP to HTTPS
- **Allowed HTTP Methods:** GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- **Cache policy:** CachingDisabled

**Click:** Create Distribution

Espera 5-10 minutos → CloudFront te da:
```
https://d1a2b3c4d5e6f7.cloudfront.net
```

### Actualizar Vercel

```
VITE_API_URL=https://d1a2b3c4d5e6f7.cloudfront.net/api
VITE_SOCKET_URL=https://d1a2b3c4d5e6f7.cloudfront.net
```

Redeploy en Vercel → ¡Listo!

---

## 📊 Comparación

| Método | Tiempo | Costo | Complejidad | HTTPS |
|--------|--------|-------|-------------|-------|
| **CloudFront** | 10 min | $0-3/mes | ⭐ Fácil | ✅ Gratis |
| **API Gateway** | 15 min | $3.50/millón | ⭐⭐ Media | ✅ Gratis |
| **Load Balancer** | 30 min | $20/mes | ⭐⭐⭐ Difícil | ✅ Requiere dominio |

---

## ✅ Mi Recomendación: CloudFront

**Es la más fácil y no necesitas dominio.**

### Script Automatizado (AWS CLI)

Si tienes AWS CLI instalado:

```bash
# Crear CloudFront Distribution
aws cloudfront create-distribution \
  --origin-domain-name macticketsv.us-east-1.elasticbeanstalk.com \
  --default-root-object index.html

# Ver el dominio generado
aws cloudfront list-distributions --query 'DistributionList.Items[0].DomainName'
```

---

## 🎯 Siguiente Paso

1. **Elige una opción** (recomiendo CloudFront)
2. **Configúrala** (sigue los pasos arriba)
3. **Actualiza variables en Vercel**
4. **Redeploy**
5. **Prueba login**

---

## 🚨 Alternativa TEMPORAL (Solo para Pruebas)

Si quieres probar YA sin configurar nada:

### Usar HTTP en local

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Crear .env.local
cat > .env.local << 'EOF'
VITE_API_URL=http://macticketsv.us-east-1.elasticbeanstalk.com/api
VITE_SOCKET_URL=http://macticketsv.us-east-1.elasticbeanstalk.com
EOF

# Correr en local (permite HTTP)
npm run dev
```

Abre `http://localhost:5173` (NO https) → El login funcionará.

**PERO:** Esto solo funciona en local, no en Vercel producción.

---

## 📞 ¿Cuál Prefieres?

- **Rápido y temporal:** Local HTTP
- **Rápido y producción:** CloudFront (10 min)
- **Completo:** API Gateway (15 min)
- **Profesional:** Load Balancer (30 min + dominio)

---

**Te recomiendo empezar con CloudFront. ¿Quieres que te guíe paso a paso?** 🚀

