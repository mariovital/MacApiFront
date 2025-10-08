# ⚡ Referencia Rápida - AWS Deployment

Comandos esenciales para gestionar tu sistema MAC Tickets en AWS.

---

## 🔑 Conexión a EC2

```bash
# Conectar via SSH
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67

# Copiar archivo a EC2
scp -i ~/.ssh/mactickets-key.pem archivo.txt ec2-user@54.123.45.67:~/

# Copiar carpeta a EC2
scp -i ~/.ssh/mactickets-key.pem -r carpeta/ ec2-user@54.123.45.67:~/
```

---

## 🔄 PM2 (Backend)

```bash
# Ver status
pm2 status

# Ver logs en tiempo real
pm2 logs mactickets-api

# Ver últimas 50 líneas
pm2 logs mactickets-api --lines 50

# Reiniciar
pm2 restart mactickets-api

# Detener
pm2 stop mactickets-api

# Iniciar
pm2 start src/server.js --name mactickets-api

# Ver info detallada
pm2 show mactickets-api

# Ver uso de recursos
pm2 monit

# Guardar configuración actual
pm2 save

# Ver logs guardados
pm2 logs --lines 100
```

---

## 🗄️ MySQL (RDS)

```bash
# Conectar desde tu Mac
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets

# Conectar desde EC2
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets

# Ejecutar query directa
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets \
      -e "SELECT COUNT(*) FROM users;"

# Backup
mysqldump -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
          -u admin \
          -p \
          mactickets > backup-$(date +%Y%m%d).sql

# Restaurar
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets < backup-20250108.sql

# Ver todas las tablas
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets \
      -e "SHOW TABLES;"

# Ver estructura de tabla
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets \
      -e "DESCRIBE users;"
```

---

## ☁️ S3 (Frontend)

```bash
# Listar archivos
aws s3 ls s3://mactickets-frontend/

# Subir archivo
aws s3 cp index.html s3://mactickets-frontend/

# Subir carpeta completa
aws s3 sync dist/ s3://mactickets-frontend/ --delete

# Descargar todo el bucket
aws s3 sync s3://mactickets-frontend/ ./backup-frontend/

# Eliminar archivo
aws s3 rm s3://mactickets-frontend/old-file.js

# Eliminar carpeta
aws s3 rm s3://mactickets-frontend/old-folder/ --recursive

# Ver tamaño del bucket
aws s3 ls s3://mactickets-frontend/ --recursive --human-readable --summarize
```

---

## 🌐 CloudFront

```bash
# Listar distribuciones
aws cloudfront list-distributions \
  --query 'DistributionList.Items[*].[Id,DomainName,Enabled]' \
  --output table

# Invalidar cache (todos los archivos)
aws cloudfront create-invalidation \
  --distribution-id E123456ABCDEF \
  --paths "/*"

# Invalidar archivos específicos
aws cloudfront create-invalidation \
  --distribution-id E123456ABCDEF \
  --paths "/index.html" "/assets/*"

# Ver invalidaciones activas
aws cloudfront list-invalidations \
  --distribution-id E123456ABCDEF

# Ver info de distribución
aws cloudfront get-distribution \
  --id E123456ABCDEF \
  --output json
```

---

## 🔐 Security Groups

```bash
# Listar Security Groups
aws ec2 describe-security-groups \
  --query 'SecurityGroups[*].[GroupId,GroupName]' \
  --output table

# Ver reglas de un Security Group
aws ec2 describe-security-groups \
  --group-ids sg-123456 \
  --query 'SecurityGroups[0].IpPermissions'

# Agregar regla SSH desde tu IP
aws ec2 authorize-security-group-ingress \
  --group-id sg-123456 \
  --protocol tcp \
  --port 22 \
  --cidr $(curl -s ifconfig.me)/32

# Agregar regla HTTP desde cualquier IP
aws ec2 authorize-security-group-ingress \
  --group-id sg-123456 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Eliminar regla
aws ec2 revoke-security-group-ingress \
  --group-id sg-123456 \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

---

## 🚀 Deployment Rápido

```bash
# Frontend completo
cd MAC/mac-tickets-front
npm run build
aws s3 sync dist/ s3://mactickets-frontend/ --delete
aws cloudfront create-invalidation --distribution-id E123456ABCDEF --paths "/*"

# Backend completo
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 << 'EOF'
  cd ~/apps/MacApiFront/MAC/mac-tickets-api
  git pull origin main
  npm install --production
  pm2 restart mactickets-api
EOF

# Usando scripts automatizados
cd Docs/AWS-Deployment/scripts/
./deploy-frontend.sh
./deploy-backend.sh
```

---

## 🔍 Monitoreo y Logs

```bash
# Ver logs de EC2 (dentro de EC2)
sudo tail -f /var/log/messages
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Ver logs de PM2 (dentro de EC2)
pm2 logs mactickets-api --lines 100

# Ver uso de recursos EC2 (dentro de EC2)
top
htop  # Si está instalado
free -h  # Memoria
df -h    # Disco

# Ver procesos de Node (dentro de EC2)
ps aux | grep node

# Ver puertos abiertos (dentro de EC2)
netstat -tulpn | grep LISTEN
```

---

## 🧪 Testing

```bash
# Health check API
curl https://api.tu-dominio.com/health

# Test login
curl -X POST https://api.tu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maccomputadoras.com","password":"admin123"}'

# Test con auth token
curl https://api.tu-dominio.com/api/tickets \
  -H "Authorization: Bearer TU_TOKEN_JWT"

# Test frontend
curl -I https://tu-dominio.com

# Test desde EC2
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 \
  'curl http://localhost:3001/health'
```

---

## 📊 Información del Sistema

```bash
# Info de EC2
aws ec2 describe-instances \
  --instance-ids i-123456 \
  --query 'Reservations[0].Instances[0].[InstanceId,InstanceType,State.Name,PublicIpAddress]'

# Info de RDS
aws rds describe-db-instances \
  --db-instance-identifier mactickets-db \
  --query 'DBInstances[0].[DBInstanceIdentifier,DBInstanceClass,Engine,Endpoint.Address]'

# Info de S3 Bucket
aws s3api head-bucket --bucket mactickets-frontend
aws s3api get-bucket-location --bucket mactickets-frontend

# Tamaño del bucket
aws s3 ls s3://mactickets-frontend --recursive --summarize

# Tu IP pública actual
curl ifconfig.me

# IP de EC2
aws ec2 describe-instances \
  --instance-ids i-123456 \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text
```

---

## 🔄 Git en EC2

```bash
# Dentro de EC2
cd ~/apps/MacApiFront/MAC/mac-tickets-api

# Ver status
git status

# Pull último código
git pull origin main

# Ver historial
git log --oneline -10

# Ver cambios
git diff

# Ver branch actual
git branch

# Ver remotes
git remote -v
```

---

## 💾 Backups

```bash
# Backup de Base de Datos
mysqldump -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
          -u admin \
          -p \
          --single-transaction \
          --routines \
          --triggers \
          mactickets > backup-full-$(date +%Y%m%d-%H%M).sql

# Backup de Frontend (S3)
aws s3 sync s3://mactickets-frontend/ \
            ./backups/frontend-$(date +%Y%m%d)/ \
            --delete

# Backup de código backend (desde EC2)
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 \
  'cd ~/apps && tar -czf MacApiFront-backup-$(date +%Y%m%d).tar.gz MacApiFront/'

# Descargar backup
scp -i ~/.ssh/mactickets-key.pem \
    ec2-user@54.123.45.67:~/apps/MacApiFront-backup-*.tar.gz \
    ./backups/
```

---

## 🛠️ Solución Rápida de Problemas

### API no responde

```bash
# Verificar que PM2 está corriendo
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'pm2 status'

# Ver logs
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'pm2 logs --lines 50'

# Reiniciar
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'pm2 restart mactickets-api'
```

### Frontend muestra versión vieja

```bash
# Invalidar cache de CloudFront
aws cloudfront create-invalidation \
  --distribution-id E123456ABCDEF \
  --paths "/*"

# Limpiar cache del navegador: Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
```

### Error de conexión a base de datos

```bash
# Verificar Security Group de RDS
aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=mactickets-db-sg"

# Test de conexión desde EC2
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 \
  'mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com -u admin -p -e "SELECT 1"'
```

### Disco lleno en EC2

```bash
# Verificar espacio
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'df -h'

# Limpiar logs de PM2
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'pm2 flush'

# Limpiar cache de npm
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'npm cache clean --force'

# Ver archivos grandes
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'du -h --max-depth=1 ~/ | sort -hr'
```

---

## 📱 Comandos desde el Móvil

Si necesitas hacer algo urgente desde tu teléfono, instala una app de SSH (ej: Termius) y usa estos comandos cortos:

```bash
# Ver status
pm2 status

# Reiniciar API
pm2 restart mactickets-api

# Ver últimas 20 líneas de log
pm2 logs --lines 20 --nostream

# Ver uso de CPU/RAM
pm2 monit
```

---

## 🎯 Variables de Entorno Importantes

### Frontend (.env.production)
```env
VITE_API_URL=https://api.tu-dominio.com/api
VITE_SOCKET_URL=https://api.tu-dominio.com
```

### Backend (.env en EC2)
```env
DB_HOST=mactickets-db.xxxxx.us-east-1.rds.amazonaws.com
DB_PASSWORD=tu-password-seguro
JWT_SECRET=tu-secret-key-32-chars-min
CORS_ORIGIN=https://tu-dominio.com
```

---

## 📞 Información de Contacto AWS

- **Soporte AWS**: https://console.aws.amazon.com/support/
- **Documentación**: https://docs.aws.amazon.com/
- **Status Page**: https://status.aws.amazon.com/

---

## ✅ Checklist de Deployment

Antes de cada deployment:

```
□ Backup de base de datos realizado
□ Tests locales pasando
□ Variables de entorno verificadas
□ Security Groups correctos
□ Commit y push a GitHub
□ Notificar al equipo del deployment
```

Después de cada deployment:

```
□ Health check API: ✅
□ Frontend carga correctamente: ✅
□ Login funciona: ✅
□ Base de datos accesible: ✅
□ Logs sin errores: ✅
□ Notificar éxito al equipo: ✅
```

---

## 🎉 ¡Listo!

Guarda esta referencia para consultarla cuando necesites gestionar tu sistema en AWS.
