# 📚 Documentación de Deployment AWS - MAC Tickets

Documentación completa para desplegar el sistema MAC Tickets en AWS.

---

## 📋 Archivos Disponibles

### 📘 Guías Principales

1. **[01-GUIA-COMPLETA-AWS.md](01-GUIA-COMPLETA-AWS.md)**
   - ✅ Guía paso a paso completa
   - ✅ Configuración de RDS, EC2, S3, CloudFront
   - ✅ Dominio y SSL
   - ✅ Variables de entorno
   - ✅ Testing y troubleshooting
   - ✅ Costos estimados
   - ⏱️ **Tiempo estimado**: 2-4 horas para setup completo
   - 📊 **Nivel**: Principiante a intermedio

2. **[02-REFERENCIA-RAPIDA.md](02-REFERENCIA-RAPIDA.md)**
   - ✅ Comandos esenciales
   - ✅ PM2, MySQL, S3, CloudFront
   - ✅ Monitoreo y logs
   - ✅ Troubleshooting rápido
   - ✅ Backups
   - ⏱️ **Tiempo de consulta**: 1-5 minutos
   - 📊 **Nivel**: Todos

### 🤖 Scripts Automatizados

3. **[scripts/deploy-frontend.sh](scripts/deploy-frontend.sh)**
   - Build y deploy automático del frontend
   - Sube a S3 e invalida CloudFront
   
4. **[scripts/deploy-backend.sh](scripts/deploy-backend.sh)**
   - Deploy automático del backend
   - Pull, install, restart con PM2

5. **[scripts/README.md](scripts/README.md)**
   - Guía de uso de los scripts
   - Configuración y troubleshooting

---

## 🚀 Quick Start

### Para Primera Vez (Setup Inicial)

```bash
# 1. Lee la guía completa
open 01-GUIA-COMPLETA-AWS.md

# 2. Sigue TODOS los pasos del 1 al 7
# Tiempo estimado: 2-4 horas

# 3. Al terminar, tendrás:
✅ Base de datos RDS funcionando
✅ API en EC2 corriendo con PM2
✅ Frontend en S3 + CloudFront
✅ Dominio y SSL configurados
```

### Para Deployments Regulares

```bash
# 1. Hacer cambios en código
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 2. Deploy con scripts
cd Docs/AWS-Deployment/scripts/
./deploy-backend.sh    # Deploy API
./deploy-frontend.sh   # Deploy Frontend

# 3. Verificar
curl https://api.tu-dominio.com/health
open https://tu-dominio.com
```

### Para Consultas Rápidas

```bash
# Ver referencia rápida
open 02-REFERENCIA-RAPIDA.md

# Buscar comando específico (ej: backup)
grep -n "backup" 02-REFERENCIA-RAPIDA.md
```

---

## 📊 Estructura de la Carpeta

```
AWS-Deployment/
├── README.md                      # Este archivo
├── 01-GUIA-COMPLETA-AWS.md       # Guía paso a paso
├── 02-REFERENCIA-RAPIDA.md       # Comandos de referencia
└── scripts/
    ├── README.md                  # Guía de scripts
    ├── deploy-frontend.sh         # Script de frontend
    └── deploy-backend.sh          # Script de backend
```

---

## 🎯 Casos de Uso

### 1. Setup Inicial (Primera Vez)
**Archivo**: `01-GUIA-COMPLETA-AWS.md`
```bash
# Seguir pasos 1-7 de la guía
# Tiempo: 2-4 horas
```

### 2. Deploy de Cambios Normales
**Archivo**: `scripts/deploy-*.sh`
```bash
cd Docs/AWS-Deployment/scripts/
./deploy-backend.sh && ./deploy-frontend.sh
# Tiempo: 3-5 minutos
```

### 3. Troubleshooting Urgente
**Archivo**: `02-REFERENCIA-RAPIDA.md`
```bash
# Buscar en sección "Solución Rápida de Problemas"
# Tiempo: 1-5 minutos
```

### 4. Consulta de Comandos
**Archivo**: `02-REFERENCIA-RAPIDA.md`
```bash
# Buscar comando específico
# Ejemplo: "pm2 logs"
# Tiempo: < 1 minuto
```

### 5. Backup Antes de Cambios Críticos
**Archivo**: `02-REFERENCIA-RAPIDA.md`
```bash
# Ver sección "Backups"
mysqldump -h RDS_HOST -u admin -p mactickets > backup.sql
# Tiempo: 2-5 minutos
```

---

## ✅ Checklist de Pre-requisitos

Antes de empezar, asegúrate de tener:

### Cuenta y Acceso
- [ ] Cuenta de AWS activa
- [ ] Tarjeta de crédito registrada
- [ ] AWS CLI instalado y configurado
- [ ] Acceso a consola de AWS

### Herramientas Locales
- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] MySQL client instalado
- [ ] Editor de texto (VS Code, nano, etc.)

### Código
- [ ] Repositorio clonado localmente
- [ ] Frontend building correctamente
- [ ] Backend corriendo en local
- [ ] Tests pasando

### Información Necesaria
- [ ] Dominio comprado (opcional)
- [ ] Email para certificado SSL
- [ ] Password seguro para RDS
- [ ] JWT secrets generados

---

## 💰 Costos Aproximados

### Opción 1: Free Tier (Primer Año)
```
RDS t3.micro:     $0/mes
EC2 t2.micro:     $0/mes
S3 (5GB):         $0/mes
CloudFront:       $0/mes (50GB)
Route 53:         $0.50/mes
---
Total:            ~$6/año
```

### Opción 2: Post Free Tier
```
RDS t3.micro:     ~$15/mes
EC2 t3.small:     ~$15/mes
S3 (10GB):        ~$0.30/mes
CloudFront:       ~$8/mes (100GB)
Route 53:         $0.50/mes
---
Total:            ~$39/mes (~$468/año)
```

### Opción 3: Producción Profesional
```
RDS t3.medium:    ~$60/mes
EC2 t3.medium:    ~$30/mes
S3 (50GB):        ~$1.50/mes
CloudFront:       ~$40/mes (500GB)
Load Balancer:    ~$16/mes
---
Total:            ~$147/mes (~$1,764/año)
```

---

## 🕐 Tiempos Estimados

| Actividad | Primera Vez | Subsecuentes |
|-----------|-------------|--------------|
| Setup completo AWS | 2-4 horas | - |
| Deploy backend | 15-30 min | 2-3 min |
| Deploy frontend | 10-20 min | 3-5 min |
| Configurar dominio | 30-60 min | - |
| Configurar SSL | 20-40 min | - |
| Testing completo | 30 min | 10 min |
| **Total inicial** | **4-6 horas** | **5-10 min** |

---

## 📞 Soporte y Recursos

### Documentación AWS
- [AWS Console](https://console.aws.amazon.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/)
- [AWS Free Tier](https://aws.amazon.com/free/)

### Herramientas
- [PM2 Docs](https://pm2.keymetrics.io/docs/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Nginx Docs](https://nginx.org/en/docs/)

### Estado de Servicios
- [AWS Status](https://status.aws.amazon.com/)
- [GitHub Status](https://www.githubstatus.com/)

---

## 🎓 Recomendaciones

### Para el Equipo de Desarrollo
1. **Leer la guía completa** antes del primer deployment
2. **Hacer el setup inicial en viernes** (por si hay issues)
3. **Tener backups** antes de cualquier cambio importante
4. **Documentar** cualquier cambio en configuración
5. **Usar los scripts automatizados** para deployments regulares

### Para Producción
1. ✅ Configurar **monitoreo** con CloudWatch
2. ✅ Habilitar **backups automáticos** de RDS
3. ✅ Configurar **alertas** para errores críticos
4. ✅ Implementar **Auto Scaling** para EC2
5. ✅ Usar **Load Balancer** para alta disponibilidad
6. ✅ Configurar **CI/CD** con GitHub Actions

### Seguridad
1. 🔐 **Cambiar passwords** default inmediatamente
2. 🔐 **Rotar JWT secrets** cada 3-6 meses
3. 🔐 **Restringir Security Groups** a IPs específicas
4. 🔐 **Habilitar MFA** en cuenta AWS
5. 🔐 **No commitear** keys ni secrets a Git
6. 🔐 **Usar variables de entorno** para todo

---

## 📝 Notas Importantes

### ⚠️ Antes de Empezar
- AWS cobrará después del Free Tier (12 meses)
- Los dominios tienen costo anual (~$12/año)
- CloudFront puede tardar 15 min en propagarse
- DNS puede tardar 24-48h en propagarse completamente

### ✅ Después de Deployment
- Guardar todas las URLs y endpoints
- Documentar passwords y secrets (en lugar seguro)
- Configurar monitoreo desde el día 1
- Hacer backup inicial de la base de datos

### 🔄 Mantenimiento Regular
- Actualizar dependencias mensualmente
- Revisar logs semanalmente
- Hacer backups semanales
- Rotar secrets cada 3-6 meses
- Revisar costos mensualmente

---

## 🎉 ¡Éxito!

Con esta documentación, tu equipo puede:
- ✅ Desplegar el sistema completo a AWS
- ✅ Mantenerlo actualizado fácilmente
- ✅ Resolver problemas rápidamente
- ✅ Escalarlo cuando sea necesario
- ✅ Presentarlo profesionalmente a clientes

---

## 📅 Próximos Pasos Recomendados

Después del deployment inicial:

1. **Semana 1**: Testing intensivo con el equipo
2. **Semana 2**: Monitoreo y ajustes de performance
3. **Semana 3**: Implementar features adicionales
4. **Semana 4**: Presentación al cliente

---

**¿Dudas?** Consulta:
1. La guía completa para setup inicial
2. La referencia rápida para comandos
3. Los scripts README para automatización

**¡Buena suerte con el deployment!** 🚀
