# 🚀 Guía Completa: Desplegar MAC Tickets a AWS

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Arquitectura AWS](#arquitectura-aws)
3. [Paso 1: Configurar RDS (Base de Datos)](#paso-1-configurar-rds)
4. [Paso 2: Configurar EC2 (Backend)](#paso-2-configurar-ec2-backend)
5. [Paso 3: Configurar S3 + CloudFront (Frontend)](#paso-3-configurar-s3--cloudfront-frontend)
6. [Paso 4: Configurar Dominio y SSL](#paso-4-configurar-dominio-y-ssl)
7. [Paso 5: Variables de Entorno](#paso-5-variables-de-entorno)
8. [Paso 6: Deployment Inicial](#paso-6-deployment-inicial)
9. [Paso 7: Testing y Verificación](#paso-7-testing-y-verificación)
10. [Mantenimiento y Actualizaciones](#mantenimiento-y-actualizaciones)
11. [Troubleshooting](#troubleshooting)
12. [Costos Estimados](#costos-estimados)

---

## 🎯 Requisitos Previos

### Cuenta AWS
- ✅ Cuenta de AWS activa
- ✅ Acceso a la consola de AWS
- ✅ Tarjeta de crédito/débito registrada
- ✅ Verificación de cuenta completa

### Herramientas Locales
```bash
# Node.js y npm (ya lo tienes)
node --version  # v18+
npm --version   # v9+

# AWS CLI
brew install awscli  # macOS
aws --version

# Git (ya lo tienes)
git --version
```

### Configurar AWS CLI
```bash
# Configurar credenciales
aws configure

# Ingresar:
# AWS Access Key ID: [Tu access key]
# AWS Secret Access Key: [Tu secret key]
# Default region name: us-east-1
# Default output format: json

# Verificar
aws sts get-caller-identity
```

---

## 🏗️ Arquitectura AWS

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET                              │
└────────────────────┬────────────────────────────────────┘
                     │
            ┌────────┴────────┐
            │   Route 53      │ (Dominio)
            │  DNS + SSL      │
            └────────┬────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
┌───────▼────────┐      ┌─────────▼───────┐
│  CloudFront    │      │   API Gateway   │
│  (Frontend)    │      │   (opcional)    │
└───────┬────────┘      └─────────┬───────┘
        │                         │
┌───────▼────────┐      ┌─────────▼───────┐
│  S3 Bucket     │      │   EC2 Instance  │
│  React App     │      │   Node.js API   │
└────────────────┘      └─────────┬───────┘
                                  │
                        ┌─────────▼───────┐
                        │   RDS MySQL     │
                        │   Database      │
                        └─────────────────┘
```

### Componentes:
- **RDS MySQL**: Base de datos principal
- **EC2**: Servidor Node.js para el backend
- **S3**: Almacenamiento del frontend (React build)
- **CloudFront**: CDN para distribución global del frontend
- **Route 53**: DNS y gestión de dominios
- **Certificate Manager**: Certificados SSL gratuitos
- **Security Groups**: Firewall de red

---

## 📊 Paso 1: Configurar RDS (Base de Datos)

### 1.1 Crear Base de Datos RDS

1. **Ir a la consola RDS**:
   - Servicios → RDS → Create database

2. **Configuración inicial**:
   ```
   ✅ Engine type: MySQL
   ✅ Version: MySQL 8.0.35 (o la más reciente)
   ✅ Templates: Free tier (para pruebas) o Production
   ```

3. **Settings**:
   ```
   DB instance identifier: mactickets-db
   Master username: admin
   Master password: [TU_PASSWORD_SEGURO] (Guárdalo bien!)
   Confirmar password
   ```

4. **DB instance size**:
   ```
   Free Tier: db.t3.micro (1 vCPU, 1 GB RAM)
   Producción: db.t3.small o db.t3.medium
   ```

5. **Storage**:
   ```
   Storage type: General Purpose SSD (gp3)
   Allocated storage: 20 GB (Free Tier)
   ✅ Enable storage autoscaling
   Maximum storage threshold: 100 GB
   ```

6. **Connectivity**:
   ```
   ✅ Don't connect to an EC2 compute resource (lo haremos manual)
   VPC: Default VPC
   Subnet group: default
   Public access: Yes (para setup inicial, luego No)
   VPC security group: Create new
   Security group name: mactickets-db-sg
   Availability Zone: No preference
   ```

7. **Database authentication**:
   ```
   ✅ Password authentication
   ```

8. **Additional configuration**:
   ```
   Initial database name: mactickets
   ✅ Enable automated backups
   Backup retention: 7 days
   Backup window: Default
   ✅ Enable encryption
   ✅ Enable deletion protection (para producción)
   ```

9. **Crear**:
   - Click "Create database"
   - ⏱️ Espera ~10-15 minutos

### 1.2 Configurar Security Group de RDS

1. **Ir a EC2 → Security Groups**
2. **Buscar** `mactickets-db-sg`
3. **Editar Inbound Rules**:
   ```
   Type: MySQL/Aurora
   Protocol: TCP
   Port: 3306
   Source: 0.0.0.0/0 (temporal, para setup)
   Description: MySQL access for setup
   ```
   > ⚠️ Después del setup, cambiar Source a la IP de tu EC2

### 1.3 Obtener Endpoint de RDS

1. **RDS → Databases → mactickets-db**
2. **Copiar** el **Endpoint**:
   ```
   mactickets-db.xxxxx.us-east-1.rds.amazonaws.com
   ```
3. **Guardar** para configurar el backend

### 1.4 Cargar el Schema

```bash
# Desde tu Mac, conectar a RDS
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets

# Cuando pida password, ingresar tu Master password

# Cargar schema
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets < Docs/Schemas/Schema-Improved.sql

# Verificar
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets -e "SHOW TABLES;"

# Cargar datos demo
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets < Docs/DEMO-DATA.sql
```

✅ **Base de datos lista!**

---

## 💻 Paso 2: Configurar EC2 (Backend)

### 2.1 Crear Instancia EC2

1. **Ir a EC2 → Launch Instance**

2. **Name and tags**:
   ```
   Name: mactickets-api
   ```

3. **Application and OS Images**:
   ```
   ✅ Amazon Linux 2023 AMI (Free tier eligible)
   Architecture: 64-bit (x86)
   ```

4. **Instance type**:
   ```
   Free Tier: t2.micro (1 vCPU, 1 GB RAM)
   Producción: t3.small (2 vCPU, 2 GB RAM)
   ```

5. **Key pair**:
   ```
   Create new key pair:
   - Name: mactickets-key
   - Type: RSA
   - Format: .pem
   ⬇️ Descargar y guardar en ~/.ssh/mactickets-key.pem
   ```
   
   ```bash
   # Dar permisos al key
   chmod 400 ~/.ssh/mactickets-key.pem
   ```

6. **Network settings**:
   ```
   VPC: Default
   Subnet: Default
   Auto-assign public IP: Enable
   
   Firewall (Security Group):
   ✅ Create security group
   Security group name: mactickets-api-sg
   Description: API server security group
   
   Inbound rules:
   ✅ SSH (22) from My IP
   ✅ HTTP (80) from Anywhere (0.0.0.0/0)
   ✅ HTTPS (443) from Anywhere (0.0.0.0/0)
   ✅ Custom TCP (3001) from Anywhere (0.0.0.0/0) - API
   ```

7. **Configure storage**:
   ```
   Size: 8 GB (Free Tier) o 20 GB
   Volume type: gp3
   ✅ Delete on termination
   ```

8. **Advanced details** (opcional):
   ```
   IAM instance profile: None (por ahora)
   ```

9. **Launch instance** ✅

### 2.2 Conectar a EC2

```bash
# Obtener IP pública de tu instancia EC2 (ej: 54.123.45.67)
# EC2 → Instances → mactickets-api → Public IPv4 address

# Conectar via SSH
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67

# Si da error "Connection refused", espera 1-2 minutos
```

### 2.3 Configurar Servidor (Dentro de EC2)

```bash
# Actualizar sistema
sudo yum update -y

# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar
node --version  # v18.x
npm --version   # 9.x

# Instalar Git
sudo yum install -y git

# Instalar PM2 (Process Manager)
sudo npm install -g pm2

# Instalar MySQL client
sudo yum install -y mysql

# Crear directorio para la app
mkdir -p ~/apps
cd ~/apps
```

### 2.4 Clonar Repositorio

```bash
# Dentro de EC2
cd ~/apps

# Clonar desde GitHub
git clone https://github.com/mariovital/MacApiFront.git
cd MacApiFront/MAC/mac-tickets-api

# Instalar dependencias
npm install --production

# Verificar
ls -la
```

### 2.5 Configurar Variables de Entorno

```bash
# Dentro de EC2, en el directorio del API
cd ~/apps/MacApiFront/MAC/mac-tickets-api

# Crear .env
nano .env

# Copiar y pegar (ajustar valores):
```

```env
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database Configuration (RDS)
DB_HOST=mactickets-db.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=mactickets
DB_USER=admin
DB_PASSWORD=TU_PASSWORD_RDS_AQUI
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=tu-super-secret-key-cambiar-en-produccion-32-chars-min
JWT_REFRESH_SECRET=tu-refresh-secret-key-cambiar-en-produccion-32-chars-min
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 Configuration (para uploads)
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=mactickets-attachments

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

```bash
# Guardar: Ctrl+O, Enter, Ctrl+X

# Verificar
cat .env
```

### 2.6 Iniciar API con PM2

```bash
# Dentro de EC2
cd ~/apps/MacApiFront/MAC/mac-tickets-api

# Iniciar con PM2
pm2 start src/server.js --name mactickets-api

# Ver logs
pm2 logs mactickets-api

# Ver status
pm2 status

# Configurar PM2 para auto-start
pm2 startup
# Copiar y ejecutar el comando que te da

pm2 save

# Verificar que funciona
curl http://localhost:3001/health
# Debe retornar: {"success":true,"message":"API is healthy"}
```

### 2.7 Configurar Nginx (Opcional pero Recomendado)

```bash
# Instalar Nginx
sudo yum install -y nginx

# Configurar
sudo nano /etc/nginx/conf.d/mactickets.conf
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
    }
}
```

```bash
# Guardar y salir

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar
sudo systemctl status nginx

# Verificar desde tu Mac
curl http://54.123.45.67/health
```

✅ **Backend API funcionando en AWS!**

---

## 🌐 Paso 3: Configurar S3 + CloudFront (Frontend)

### 3.1 Build del Frontend

```bash
# En tu Mac (no en EC2)
cd MAC/mac-tickets-front

# Crear .env.production
nano .env.production
```

```env
VITE_API_URL=http://54.123.45.67:3001/api
VITE_SOCKET_URL=http://54.123.45.67:3001
VITE_APP_NAME=Sistema de Gestión de Tickets
VITE_APP_VERSION=1.0.0
```

```bash
# Build
npm run build

# Verificar
ls -la dist/
# Debe tener: index.html, assets/, etc.
```

### 3.2 Crear S3 Bucket

1. **Ir a S3 → Create bucket**

2. **Configuración**:
   ```
   Bucket name: mactickets-frontend
   AWS Region: us-east-1
   
   ❌ Block all public access (desmarcar)
   ⚠️ Acknowledge that the bucket will be public
   
   ✅ Bucket Versioning: Enable
   ✅ Server-side encryption: Enable
   ```

3. **Create bucket** ✅

### 3.3 Configurar Bucket para Website Hosting

1. **S3 → mactickets-frontend → Properties**
2. **Scroll down → Static website hosting → Edit**:
   ```
   ✅ Enable
   Hosting type: Host a static website
   Index document: index.html
   Error document: index.html (para SPA routing)
   ```
3. **Save changes**
4. **Copiar** el "Bucket website endpoint":
   ```
   http://mactickets-frontend.s3-website-us-east-1.amazonaws.com
   ```

### 3.4 Configurar Bucket Policy

1. **S3 → mactickets-frontend → Permissions**
2. **Bucket Policy → Edit**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mactickets-frontend/*"
    }
  ]
}
```

3. **Save changes** ✅

### 3.5 Subir Build a S3

```bash
# En tu Mac
cd MAC/mac-tickets-front

# Método 1: AWS CLI (recomendado)
aws s3 sync dist/ s3://mactickets-frontend/ --delete

# Método 2: Consola web
# S3 → mactickets-frontend → Upload → Add files/folders
# Seleccionar TODO el contenido de dist/ y subir

# Verificar
aws s3 ls s3://mactickets-frontend/

# Probar en navegador
# http://mactickets-frontend.s3-website-us-east-1.amazonaws.com
```

### 3.6 Configurar CloudFront (CDN)

1. **Ir a CloudFront → Create Distribution**

2. **Origin**:
   ```
   Origin domain: mactickets-frontend.s3-website-us-east-1.amazonaws.com
   (NO usar el dropdown, escribir manualmente el website endpoint)
   
   Name: S3-mactickets-frontend
   Origin path: (dejar vacío)
   
   ✅ Enable Origin Shield: No (para ahorrar costos)
   ```

3. **Default cache behavior**:
   ```
   Viewer protocol policy: Redirect HTTP to HTTPS
   Allowed HTTP methods: GET, HEAD
   Cache policy: CachingOptimized
   ✅ Compress objects automatically
   ```

4. **Settings**:
   ```
   Price class: Use all edge locations (mejor rendimiento)
   Alternate domain name (CNAME): tu-dominio.com, www.tu-dominio.com
   Custom SSL certificate: (configurar después)
   Default root object: index.html
   ```

5. **Create distribution** ✅
   - ⏱️ Espera ~10-15 minutos para deployment

6. **Copiar Domain Name**:
   ```
   d123456abcdef.cloudfront.net
   ```

### 3.7 Configurar Error Pages (para SPA)

1. **CloudFront → Distributions → Tu distribución → Error pages**
2. **Create custom error response**:
   ```
   HTTP error code: 404
   Customize error response: Yes
   Response page path: /index.html
   HTTP Response code: 200
   ```
3. **Create** ✅

✅ **Frontend desplegado en CloudFront!**

---

## 🔐 Paso 4: Configurar Dominio y SSL

### 4.1 Solicitar Certificado SSL (Certificate Manager)

1. **Ir a Certificate Manager (ACM)**
   > ⚠️ **IMPORTANTE**: Cambiar región a **us-east-1** (N. Virginia) para CloudFront

2. **Request certificate**:
   ```
   ✅ Request a public certificate
   
   Domain names:
   - tu-dominio.com
   - www.tu-dominio.com
   - *.tu-dominio.com (opcional, para subdominios)
   
   Validation method: DNS validation (recomendado)
   ```

3. **Request** ✅

4. **Validar certificado**:
   - Copiar los **CNAME records** que te da AWS
   - Ir a tu proveedor de dominios (GoDaddy, Namecheap, etc.)
   - Agregar los registros CNAME
   - ⏱️ Esperar 5-30 minutos para validación

### 4.2 Configurar Route 53 (Opcional)

Si quieres gestionar DNS con AWS:

1. **Ir a Route 53 → Hosted zones → Create hosted zone**
2. **Domain name**: `tu-dominio.com`
3. **Create hosted zone**
4. **Copiar los Name Servers (NS)** que te da AWS
5. **Ir a tu proveedor de dominio** y cambiar los NS a los de AWS

### 4.3 Asignar SSL a CloudFront

1. **CloudFront → Distributions → Tu distribución → Edit**
2. **Settings**:
   ```
   Alternate domain names (CNAMEs):
   - tu-dominio.com
   - www.tu-dominio.com
   
   Custom SSL certificate:
   - Seleccionar el certificado que creaste
   
   Supported HTTP versions: HTTP/2 and HTTP/3
   ```
3. **Save changes** ✅

### 4.4 Crear Registros DNS

En Route 53 o tu proveedor DNS:

```
# Frontend
Type: A (Alias)
Name: tu-dominio.com
Value: d123456abcdef.cloudfront.net (tu CloudFront domain)

Type: A (Alias)
Name: www.tu-dominio.com
Value: d123456abcdef.cloudfront.net

# API
Type: A
Name: api.tu-dominio.com
Value: 54.123.45.67 (IP de tu EC2)
```

✅ **SSL y dominio configurados!**

---

## ⚙️ Paso 5: Variables de Entorno

### 5.1 Frontend (.env.production)

```bash
# En tu Mac
cd MAC/mac-tickets-front
nano .env.production
```

```env
# Actualizar con dominio real
VITE_API_URL=https://api.tu-dominio.com/api
VITE_SOCKET_URL=https://api.tu-dominio.com
VITE_APP_NAME=Sistema de Gestión de Tickets
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

### 5.2 Backend (.env en EC2)

```bash
# En EC2
cd ~/apps/MacApiFront/MAC/mac-tickets-api
nano .env
```

```env
# Actualizar CORS_ORIGIN
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
```

---

## 🚀 Paso 6: Deployment Inicial

### 6.1 Rebuild y Redeploy Frontend

```bash
# En tu Mac
cd MAC/mac-tickets-front

# Rebuild con nuevas variables
npm run build

# Subir a S3
aws s3 sync dist/ s3://mactickets-frontend/ --delete

# Invalidar cache de CloudFront
aws cloudfront create-invalidation \
  --distribution-id E123456ABCDEF \
  --paths "/*"
```

### 6.2 Restart Backend

```bash
# En EC2
pm2 restart mactickets-api
pm2 logs mactickets-api
```

---

## ✅ Paso 7: Testing y Verificación

### 7.1 Verificar Backend

```bash
# Health check
curl https://api.tu-dominio.com/health

# Login test
curl -X POST https://api.tu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@maccomputadoras.com",
    "password": "admin123"
  }'
```

### 7.2 Verificar Frontend

1. Abrir `https://tu-dominio.com`
2. Verificar que carga sin errores
3. Intentar login con credenciales demo
4. Verificar que redirige al dashboard
5. Probar navegación entre páginas
6. Verificar que no hay errores en consola

### 7.3 Verificar Base de Datos

```bash
# En EC2
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets -e "SELECT COUNT(*) FROM users;"
```

✅ **Sistema completo funcionando!**

---

## 🔄 Mantenimiento y Actualizaciones

### Actualizar Backend

```bash
# En tu Mac
git add .
git commit -m "Update backend"
git push origin main

# En EC2
cd ~/apps/MacApiFront/MAC/mac-tickets-api
git pull origin main
npm install --production
pm2 restart mactickets-api
pm2 logs mactickets-api
```

### Actualizar Frontend

```bash
# En tu Mac
cd MAC/mac-tickets-front
npm run build
aws s3 sync dist/ s3://mactickets-frontend/ --delete
aws cloudfront create-invalidation --distribution-id E123456ABCDEF --paths "/*"
```

### Ver Logs del Backend

```bash
# En EC2
pm2 logs mactickets-api
pm2 logs mactickets-api --lines 100
```

### Backup de Base de Datos

```bash
# Desde tu Mac
mysqldump -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
          -u admin \
          -p \
          mactickets > backup-$(date +%Y%m%d).sql

# Restaurar
mysql -h mactickets-db.xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets < backup-20250108.sql
```

---

## 🔧 Troubleshooting

### Error: Cannot connect to RDS

```bash
# Verificar Security Group
# EC2 → Security Groups → mactickets-db-sg
# Inbound rules debe permitir 3306 desde la IP de EC2

# Obtener IP de EC2
curl ifconfig.me

# Agregar a Security Group de RDS
```

### Error: 502 Bad Gateway

```bash
# En EC2, verificar que API está corriendo
pm2 status

# Ver logs
pm2 logs mactickets-api --lines 50

# Reiniciar
pm2 restart mactickets-api
```

### Error: CORS

```bash
# En EC2, verificar .env
cat .env | grep CORS_ORIGIN

# Debe incluir tu dominio
CORS_ORIGIN=https://tu-dominio.com
```

### CloudFront no muestra cambios

```bash
# Invalidar cache
aws cloudfront create-invalidation \
  --distribution-id E123456ABCDEF \
  --paths "/*"

# O esperar 24 horas para TTL natural
```

---

## 💰 Costos Estimados

### Free Tier (Primer año)
```
RDS t3.micro:           $0/mes (750 horas)
EC2 t2.micro:           $0/mes (750 horas)
S3 (5GB storage):       $0/mes
CloudFront (50GB):      $0/mes
Route 53:               $0.50/mes (por hosted zone)
---
Total primer año:       ~$6/año
```

### Después del Free Tier
```
RDS t3.micro:           ~$15/mes
EC2 t3.small:           ~$15/mes
S3 (10GB):              ~$0.30/mes
CloudFront (100GB):     ~$8/mes
Route 53:               $0.50/mes
---
Total:                  ~$39/mes (~$468/año)
```

### Producción (Recomendado)
```
RDS t3.medium:          ~$60/mes
EC2 t3.medium:          ~$30/mes
S3 (50GB):              ~$1.50/mes
CloudFront (500GB):     ~$40/mes
Load Balancer:          ~$16/mes
---
Total:                  ~$147/mes (~$1,764/año)
```

---

## 📝 Notas Finales

### Security Best Practices

1. **Cambiar passwords default** de admin
2. **Rotar JWT secrets** regularmente
3. **Restringir Security Groups** a IPs específicas
4. **Habilitar MFA** en cuenta AWS
5. **Configurar CloudWatch** para alertas
6. **Hacer backups** regulares de RDS
7. **Actualizar dependencias** regularmente

### Optimizaciones

1. **Configurar Auto Scaling** para EC2
2. **Agregar Load Balancer** para alta disponibilidad
3. **Configurar CloudWatch Logs**
4. **Implementar CI/CD** con GitHub Actions
5. **Agregar ElastiCache** para Redis
6. **Configurar WAF** para seguridad adicional

---

## 🎉 ¡Listo para Producción!

Tu sistema MAC Tickets ahora está funcionando en AWS y listo para que tu equipo lo pruebe y lo presentes a tu cliente.

**URLs finales**:
- Frontend: `https://tu-dominio.com`
- API: `https://api.tu-dominio.com`
- Dashboard: `https://tu-dominio.com/dashboard`

**Credenciales demo**:
- Email: `admin@maccomputadoras.com`
- Password: `admin123`

---

## 📞 Soporte

Si tienes problemas, verifica:
1. Logs de PM2: `pm2 logs mactickets-api`
2. Security Groups correctos
3. Variables de entorno configuradas
4. CloudFront invalidation ejecutada
5. DNS propagado (puede tardar 24-48h)

**¡Éxito con el deployment!** 🚀
