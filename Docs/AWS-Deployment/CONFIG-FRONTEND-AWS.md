# Configuración del Frontend para AWS

## Resumen

Este documento detalla cómo configurar el frontend de MAC Tickets para usar el endpoint de AWS Elastic Beanstalk.

---

## Pasos para Configurar

### 1. Copiar el Archivo de Variables de Entorno

El archivo `.env` está en `.gitignore` por seguridad (correcto). Necesitas crear tu propio archivo `.env`:

```bash
cd MAC/mac-tickets-front
cp .env.example .env
```

### 2. Editar el Archivo .env

Abre el archivo `.env` y verifica que tenga el endpoint de AWS:

```bash
# Para PRODUCCIÓN (AWS)
VITE_API_URL=http://macticketsv.us-east-1.elasticbeanstalk.com/api
VITE_SOCKET_URL=http://macticketsv.us-east-1.elasticbeanstalk.com

# Para DESARROLLO LOCAL
# VITE_API_URL=http://localhost:3001/api
# VITE_SOCKET_URL=http://localhost:3001
```

### 3. Reiniciar el Servidor de Desarrollo

Las variables de entorno de Vite solo se cargan al iniciar el servidor:

```bash
# Detener el servidor actual (Ctrl+C)
# Reiniciar:
npm run dev
```

### 4. Verificar la Configuración

Puedes verificar que el frontend esté usando la URL correcta:

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña Console
3. Ejecuta:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

Debería mostrar: `http://macticketsv.us-east-1.elasticbeanstalk.com/api`

---

## Build para Producción

### Usando .env.production

Si prefieres tener configuraciones separadas:

```bash
# El archivo .env.production ya está creado con el endpoint de AWS
npm run build
```

Vite usará automáticamente `.env.production` al hacer build.

### Verificar el Build

Después de hacer build, puedes probar localmente:

```bash
npm run preview
```

---

## Estructura de Archivos

```
MAC/mac-tickets-front/
├── .env                    # Tu configuración local (NO en git)
├── .env.example           # Plantilla (SÍ en git)
├── .env.production        # Config de producción (SÍ en git)
└── src/
    └── services/
        └── api.js         # Lee VITE_API_URL automáticamente
```

---

## Notas Importantes

### Seguridad
- ❌ **NUNCA** hacer commit del archivo `.env`
- ✅ El `.gitignore` ya lo tiene incluido
- ✅ Puedes hacer commit de `.env.example` y `.env.production`

### Variables de Entorno
- Todas las variables para el frontend deben empezar con `VITE_`
- Son accesibles mediante `import.meta.env.VITE_*`
- Se evalúan en **build time**, no en runtime

### CORS
Si el frontend tiene problemas de CORS al conectarse a AWS:
1. Verifica que el backend tenga configurado el dominio del frontend en `CORS_ORIGIN`
2. O usa `*` temporalmente para pruebas (NO recomendado en producción)

---

## Troubleshooting

### "ERR_CONNECTION_REFUSED"
- El endpoint de AWS no está disponible
- Verifica que Elastic Beanstalk esté corriendo

### "CORS Error"
- El backend no tiene configurado el origin del frontend
- Configura `CORS_ORIGIN` en el `.env` del backend

### "404 Not Found" en API calls
- Verifica que `VITE_API_URL` termine en `/api`
- Las rutas en el frontend no deben incluir `/api` (se agrega automáticamente)

### Los cambios no se reflejan
- Reinicia el servidor de desarrollo después de cambiar `.env`
- Limpia la caché: `npm run build --force`

---

## Siguientes Pasos

Después de configurar el frontend:
1. ✅ Crear archivo `.env` local
2. ✅ Configurar endpoint de AWS
3. ⬜ Probar login y funcionalidades
4. ⬜ Hacer build para producción
5. ⬜ Deploy a hosting (Vercel, Netlify, S3, etc.)

---

**Última actualización:** 2025-01-21  
**Endpoint AWS:** http://macticketsv.us-east-1.elasticbeanstalk.com/

