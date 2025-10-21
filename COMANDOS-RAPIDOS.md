# ⚡ Comandos Rápidos - MAC Tickets AWS

## 🚀 Configurar Frontend para AWS (3 comandos)

```bash
# 1. Ir a la carpeta del frontend
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# 2. Copiar configuración de AWS
cp .env.production .env

# 3. Reiniciar servidor
npm run dev
```

**¡Listo!** Abre http://localhost:5173

---

## 🔍 Verificar que Funciona

### 1. Ver URL configurada
```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front
cat .env | grep VITE_API_URL
```

Debe mostrar:
```
VITE_API_URL=http://macticketsv.us-east-1.elasticbeanstalk.com/api
```

### 2. Probar backend de AWS
```bash
curl http://macticketsv.us-east-1.elasticbeanstalk.com/health
```

Debe responder con JSON de éxito.

### 3. Probar en el navegador
1. Abrir: http://localhost:5173
2. DevTools (F12) > Console
3. Ejecutar:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Debe mostrar: `http://macticketsv.us-east-1.elasticbeanstalk.com/api`

---

## 🔄 Cambiar Entre Local y AWS

### Cambiar a AWS
```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front
cp .env.production .env
npm run dev
```

### Cambiar a Local
```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front
cp .env.example .env
npm run dev
```

---

## 📚 Leer Documentación

### Guía completa (5 min)
```bash
cat /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/AWS-Deployment/00-INICIO-RAPIDO.md
```

### Ver todos los endpoints
```bash
cat /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/ENDPOINTS-REFERENCE.md
```

### Resumen de todo
```bash
cat /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/RESUMEN-CONFIGURACION-AWS.md
```

---

## 🛠️ Build para Producción

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# El archivo .env.production se usa automáticamente
npm run build

# Preview del build
npm run preview
```

---

## 🆘 Solución Rápida de Problemas

### Problema: "Cannot connect to server"
```bash
# Verificar que AWS esté funcionando
curl http://macticketsv.us-east-1.elasticbeanstalk.com/health
```

### Problema: "Los cambios no se reflejan"
```bash
# Reiniciar servidor
cd MAC/mac-tickets-front
npm run dev
```

### Problema: "CORS Error"
- Verificar que el backend tenga `CORS_ORIGIN` configurado
- Revisar logs de CloudWatch en AWS Console

---

## 📋 Archivos Importantes

| Archivo | Ubicación | Para qué |
|---------|-----------|----------|
| `.env.production` | `MAC/mac-tickets-front/` | Config de AWS |
| `.env.example` | `MAC/mac-tickets-front/` | Config local |
| `API-Gateway-Endpoints.json` | `Docs/` | Importar en API Gateway |
| `00-INICIO-RAPIDO.md` | `Docs/AWS-Deployment/` | Guía completa |
| `ENDPOINTS-REFERENCE.md` | `Docs/` | Todos los endpoints |

---

## ✅ Eso es Todo

Con esos 3 comandos del inicio, tu frontend ya está conectado a AWS.

**Endpoint:** http://macticketsv.us-east-1.elasticbeanstalk.com/api  
**Total endpoints:** 43  
**Estado:** ✅ Funcionando

