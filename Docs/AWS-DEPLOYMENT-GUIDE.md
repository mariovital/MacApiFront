# ☁️ Guía Completa de Deploy a AWS

**Sistema de Gestión de Tickets - MAC Computadoras**

Esta guía te llevará paso a paso para desplegar el sistema completo en AWS, incluyendo base de datos, backend API y frontend web.

---

## 📋 **ÍNDICE**

1. [Resumen de Arquitectura AWS](#1-resumen-de-arquitectura-aws)
2. [Prerrequisitos](#2-prerrequisitos)
3. [Paso 1: Configurar RDS (MySQL)](#paso-1-configurar-rds-mysql)
4. [Paso 2: Configurar EC2 para Backend](#paso-2-configurar-ec2-para-backend)
5. [Paso 3: Deploy del Backend API](#paso-3-deploy-del-backend-api)
6. [Paso 4: Configurar S3 + CloudFront (Frontend)](#paso-4-configurar-s3--cloudfront-frontend)
7. [Paso 5: Deploy del Frontend](#paso-5-deploy-del-frontend)
8. [Paso 6: Configurar Dominio Personalizado (Opcional)](#paso-6-configurar-dominio-personalizado-opcional)
9. [Paso 7: Configurar HTTPS con Certificate Manager](#paso-7-configurar-https-con-certificate-manager)
10. [Monitoreo y Logs](#8-monitoreo-y-logs)
11. [Costos Estimados](#9-costos-estimados)
12. [Troubleshooting](#10-troubleshooting)
13. [Scripts de Deploy Automatizado](#11-scripts-de-deploy-automatizado)

---

## 🏗️ **1. RESUMEN DE ARQUITECTURA AWS**

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIOS                             │
│                    (Web + Android App)                       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               │                              │
        ┌──────▼──────┐              ┌────────▼────────┐
        │  CloudFront │              │  API Gateway    │
        │   (CDN)     │              │  (Opcional)     │
        └──────┬──────┘              └────────┬────────┘
               │                              │
        ┌──────▼──────┐              ┌────────▼────────┐
        │  S3 Bucket  │              │   EC2 Instance  │
        │  (Frontend) │              │   (Backend API) │
        └─────────────┘              └────────┬────────┘
                                              │
                                     ┌────────▼────────┐
                                     │   RDS MySQL     │
                                     │   (Database)    │
                                     └─────────────────┘
```

**Componentes:**
- **RDS MySQL**: Base de datos gestionada
- **EC2 Instance**: Servidor Node.js con Express API
- **S3 Bucket**: Almacenamiento del frontend React (build estático)
- **CloudFront**: CDN para distribución global del frontend
- **API Gateway** (Opcional): Para rate limiting y caching adicional
- **Route 53** (Opcional): Gestión de dominio personalizado
- **Certificate Manager**: Certificados SSL/TLS gratuitos

---

## 🔧 **2. PRERREQUISITOS**

### **2.1. Cuenta AWS**
- ✅ Cuenta AWS activa (https://aws.amazon.com)
- ✅ Tarjeta de crédito válida registrada
- ✅ Acceso a AWS Console

### **2.2. Herramientas Locales**
```bash
# 1. AWS CLI
# macOS
brew install awscli

# Verificar instalación
aws --version

# 2. Node.js y npm (ya instalado)
node --version  # >= 18.0.0
npm --version

# 3. Git (ya instalado)
git --version
```

### **2.3. Configurar AWS CLI**
```bash
# Configurar credenciales AWS
aws configure

# Te pedirá:
# AWS Access Key ID: [Tu Access Key]
# AWS Secret Access Key: [Tu Secret Key]
# Default region name: us-east-1
# Default output format: json
```

**Obtener Access Keys:**
1. Ve a AWS Console → IAM
2. Users → Tu usuario → Security credentials
3. Create access key → CLI
4. Descarga y guarda las credenciales

---

## 📦 **PASO 1: CONFIGURAR RDS (MySQL)**

### **1.1. Crear Instancia RDS MySQL**

**Por Consola Web:**

1. **Ir a RDS**
   - AWS Console → Services → RDS
   - Click "Create database"

2. **Elegir Método**
   - ✅ Standard create
   - Engine type: **MySQL**
   - Version: **MySQL 8.0.35** (o la más reciente 8.0.x)

3. **Templates**
   - ✅ **Free tier** (para desarrollo)
   - O **Dev/Test** (para producción)

4. **Settings**
   ```
   DB instance identifier: mactickets-db
   Master username: admin
   Master password: [Contraseña segura - GUÁRDALA]
   Confirm password: [Repetir contraseña]
   ```

5. **Instance Configuration**
   - DB instance class: **db.t3.micro** (Free tier) o **db.t3.small** (producción)
   - Storage type: General Purpose (SSD)
   - Allocated storage: **20 GB** (gratis hasta 20GB)
   - ✅ Enable storage autoscaling (max: 100 GB)

6. **Connectivity**
   - Virtual Private Cloud (VPC): Default VPC
   - ✅ **Public access: YES** (para desarrollo)
   - VPC security group: Create new
     - Name: `mactickets-db-sg`
   - Availability Zone: No preference

7. **Database Authentication**
   - ✅ Password authentication

8. **Additional Configuration**
   - Initial database name: **mactickets**
   - ✅ Enable automated backups (retention: 7 days)
   - Backup window: Default
   - ✅ Enable Enhanced monitoring
   - Log exports: ✅ Error log, ✅ General log, ✅ Slow query log

9. **Click "Create database"**
   - Espera 5-10 minutos hasta que Status = "Available"

### **1.2. Configurar Security Group de RDS**

1. **Ir a EC2 → Security Groups**
2. Buscar: `mactickets-db-sg`
3. **Editar Inbound Rules**
   - Click "Edit inbound rules"
   - Add rule:
     ```
     Type: MySQL/Aurora
     Protocol: TCP
     Port Range: 3306
     Source: My IP (para desarrollo)
     Description: MySQL access from my IP
     ```
   - **IMPORTANTE para producción**: Cambiar source a "Security Group de EC2"

4. **Obtener Endpoint de RDS**
   - RDS Console → Databases → mactickets-db
   - Copiar **Endpoint**: `mactickets-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`
   - Copiar **Port**: `3306`

### **1.3. Conectar y Crear Schema**

**Desde tu Mac:**
```bash
# Conectar a RDS
mysql -h mactickets-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p

# Ingresar password cuando se solicite

# Verificar base de datos
SHOW DATABASES;
USE mactickets;

# Ejecutar schema
# Copiar y pegar TODO el contenido de Docs/Schemas/Schema-Improved.sql
# O ejecutar desde archivo:
```

```bash
# Desde terminal local
mysql -h mactickets-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p mactickets < Docs/Schemas/Schema-Improved.sql

# Verificar que se crearon las tablas
mysql -h mactickets-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p mactickets -e "SHOW TABLES;"
```

**✅ Output esperado:**
```
+-------------------------+
| Tables_in_mactickets    |
+-------------------------+
| categories              |
| notifications           |
| priorities              |
| roles                   |
| system_settings         |
| ticket_attachments      |
| ticket_comments         |
| ticket_history          |
| ticket_status_transitions|
| ticket_statuses         |
| tickets                 |
| users                   |
+-------------------------+
```

---

## 🖥️ **PASO 2: CONFIGURAR EC2 PARA BACKEND**

### **2.1. Crear Instancia EC2**

1. **Ir a EC2**
   - AWS Console → Services → EC2
   - Click "Launch Instance"

2. **Name and Tags**
   ```
   Name: mactickets-api-server
   ```

3. **Application and OS Images**
   - Quick Start: **Ubuntu**
   - AMI: **Ubuntu Server 22.04 LTS (Free tier eligible)**
   - Architecture: **64-bit (x86)**

4. **Instance Type**
   - **t2.micro** (Free tier - 1 vCPU, 1GB RAM) para desarrollo
   - **t2.small** (2 vCPU, 2GB RAM) para producción

5. **Key Pair (Login)**
   - Click "Create new key pair"
   - Key pair name: `mactickets-key`
   - Key pair type: RSA
   - Private key format: `.pem`
   - **Download key** → Guardar en lugar seguro

6. **Network Settings**
   - VPC: Default VPC
   - Auto-assign public IP: ✅ Enable
   - Firewall (security groups): **Create security group**
     - Security group name: `mactickets-api-sg`
     - Description: Security group for MAC Tickets API
     - **Inbound rules:**
       ```
       Rule 1:
       Type: SSH
       Protocol: TCP
       Port: 22
       Source: My IP
       Description: SSH access
       
       Rule 2:
       Type: Custom TCP
       Protocol: TCP
       Port: 3001
       Source: 0.0.0.0/0
       Description: API access
       
       Rule 3:
       Type: HTTPS
       Protocol: TCP
       Port: 443
       Source: 0.0.0.0/0
       Description: HTTPS access (future)
       ```

7. **Configure Storage**
   - Size: **20 GB** gp3 (Free tier elegible)

8. **Advanced Details** (Opcional pero recomendado)
   - User data (script de inicialización):
   ```bash
   #!/bin/bash
   apt-get update
   apt-get upgrade -y
   
   # Instalar Node.js 18.x
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt-get install -y nodejs
   
   # Instalar Git
   apt-get install -y git
   
   # Instalar PM2 (process manager)
   npm install -g pm2
   
   # Instalar MySQL client
   apt-get install -y mysql-client
   
   # Crear usuario para la app
   useradd -m -s /bin/bash mactickets
   ```

9. **Click "Launch Instance"**

10. **Configurar Key Pair en tu Mac**
```bash
# Mover key a directorio .ssh
mv ~/Downloads/mactickets-key.pem ~/.ssh/

# Cambiar permisos (IMPORTANTE)
chmod 400 ~/.ssh/mactickets-key.pem

# Probar conexión (reemplazar IP pública)
ssh -i ~/.ssh/mactickets-key.pem ubuntu@<EC2-PUBLIC-IP>
```

### **2.2. Configurar Servidor EC2**

**Conectar por SSH:**
```bash
# Obtener IP pública de EC2
# EC2 Console → Instances → mactickets-api-server → Public IPv4 address

# Conectar
ssh -i ~/.ssh/mactickets-key.pem ubuntu@<EC2-PUBLIC-IP>
```

**Configurar Servidor:**
```bash
# Verificar instalaciones
node --version  # v18.x.x
npm --version
pm2 --version
git --version

# Si no se ejecutó el user data script, instalar manualmente:
sudo apt-get update
sudo apt-get upgrade -y

# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# Git
sudo apt-get install -y git

# MySQL client
sudo apt-get install -y mysql-client

# Crear usuario
sudo useradd -m -s /bin/bash mactickets
sudo su - mactickets
```

---

## 🚀 **PASO 3: DEPLOY DEL BACKEND API**

### **3.1. Clonar Repositorio**

**En el servidor EC2 (como usuario mactickets):**
```bash
# Cambiar a usuario mactickets
sudo su - mactickets

# Clonar repositorio
git clone https://github.com/mariovital/MacApiFront.git
cd MacApiFront/MAC/mac-tickets-api

# Instalar dependencias
npm install --production
```

### **3.2. Configurar Variables de Entorno**

```bash
# Crear archivo .env en el servidor
nano .env
```

**Contenido del .env (ADAPTAR CON TUS DATOS):**
```env
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database Configuration (RDS)
DB_HOST=mactickets-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=mactickets
DB_USER=admin
DB_PASSWORD=TU_PASSWORD_RDS_AQUI
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=tu-super-secret-key-minimo-32-caracteres-muy-segura-production
JWT_REFRESH_SECRET=tu-refresh-secret-key-tambien-minimo-32-chars-segura
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 Configuration (para archivos adjuntos - futuro)
AWS_ACCESS_KEY_ID=tu-access-key-id
AWS_SECRET_ACCESS_KEY=tu-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=mactickets-attachments

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://tu-dominio-frontend.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

### **3.3. Poblar Base de Datos con Datos Demo**

```bash
# Ejecutar seed
npm run seed

# Deberías ver:
# ✅ Conexión exitosa
# ✅ Base de datos limpiada completamente
# ✅ Total usuarios DEMO: 12
# ✅ Total tickets DEMO: 4
```

### **3.4. Iniciar API con PM2**

```bash
# Iniciar con PM2
pm2 start src/server.js --name mactickets-api

# Verificar que está corriendo
pm2 status

# Ver logs
pm2 logs mactickets-api

# Configurar PM2 para auto-inicio en reboot
pm2 startup
# Ejecutar el comando que PM2 te muestra

pm2 save
```

### **3.5. Probar API desde Internet**

**Desde tu Mac:**
```bash
# Obtener IP pública del EC2
EC2_IP="<TU-IP-PUBLICA-EC2>"

# Probar health
curl http://$EC2_IP:3001/health | jq .

# Probar login
curl -X POST http://$EC2_IP:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@maccomputadoras.com", "password": "demo123"}' \
  | jq .

# Si funciona, deberías ver el token JWT
```

**✅ API Desplegado y Funcionando!**

**URL del API:** `http://<EC2-PUBLIC-IP>:3001/api`

---

## 🌐 **PASO 4: CONFIGURAR S3 + CLOUDFRONT (FRONTEND)**

### **4.1. Crear Bucket S3**

**Por Consola Web:**

1. **Ir a S3**
   - AWS Console → Services → S3
   - Click "Create bucket"

2. **General Configuration**
   ```
   Bucket name: mactickets-frontend
   AWS Region: us-east-1 (mismo que RDS y EC2)
   ```

3. **Object Ownership**
   - ✅ ACLs disabled (recommended)

4. **Block Public Access**
   - ❌ **DESMARCAR** "Block all public access"
   - ✅ Confirmar "I acknowledge..."

5. **Bucket Versioning**
   - ✅ Enable (recomendado para rollback)

6. **Tags** (Opcional)
   ```
   Key: Project
   Value: MAC Tickets
   ```

7. **Default encryption**
   - ✅ Enable
   - Encryption type: Amazon S3-managed keys (SSE-S3)

8. **Click "Create bucket"**

### **4.2. Configurar Bucket para Static Website Hosting**

1. **Ir a tu bucket** → mactickets-frontend
2. **Properties tab**
3. Scroll hasta **Static website hosting**
4. Click "Edit"
   ```
   ✅ Enable
   Hosting type: Host a static website
   Index document: index.html
   Error document: index.html (para React Router)
   ```
5. **Save changes**
6. **Copiar URL del website**: `http://mactickets-frontend.s3-website-us-east-1.amazonaws.com`

### **4.3. Configurar Bucket Policy (Acceso Público)**

1. **Permissions tab**
2. **Bucket policy** → Edit
3. Pegar esta policy (reemplazar nombre del bucket):

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

4. **Save changes**

### **4.4. Crear Distribución CloudFront**

**CloudFront** es un CDN que:
- ✅ Mejora velocidad de carga global
- ✅ Provee HTTPS gratis
- ✅ Cachea contenido
- ✅ Protege contra DDoS

**Configurar:**

1. **Ir a CloudFront**
   - AWS Console → CloudFront
   - Click "Create Distribution"

2. **Origin Settings**
   ```
   Origin domain: mactickets-frontend.s3.us-east-1.amazonaws.com
   Origin path: (dejar vacío)
   Name: mactickets-frontend-origin
   ```

3. **Origin Access**
   - ✅ Legacy access identities
   - Origin access identity: **Create new OAI**
   - Bucket policy: ✅ Yes, update the bucket policy

4. **Default Cache Behavior**
   ```
   Viewer protocol policy: Redirect HTTP to HTTPS
   Allowed HTTP methods: GET, HEAD, OPTIONS
   Cached HTTP methods: ✅ GET, HEAD, ✅ OPTIONS
   Cache key and origin requests: CachingOptimized
   ```

5. **Function Associations** (Opcional - para React Router)
   - Dejar por ahora, configuraremos después

6. **Settings**
   ```
   Price class: Use all edge locations (best performance)
   AWS WAF: Do not enable (por ahora)
   Alternate domain name (CNAME): (vacío por ahora, agregaremos después)
   Custom SSL certificate: (vacío por ahora)
   Default root object: index.html
   ```

7. **Click "Create Distribution"**
   - Espera 10-15 minutos hasta Status = "Deployed"

8. **Copiar Domain Name**: `d1234abcd5678.cloudfront.net`

### **4.5. Configurar Error Pages para React Router**

1. **Ir a tu distribución CloudFront**
2. **Error Pages tab**
3. **Create Custom Error Response**
   ```
   HTTP error code: 403
   Customize error response: Yes
   Response page path: /index.html
   HTTP response code: 200
   ```
4. **Crear otro para 404:**
   ```
   HTTP error code: 404
   Customize error response: Yes
   Response page path: /index.html
   HTTP response code: 200
   ```

---

## 📱 **PASO 5: DEPLOY DEL FRONTEND**

### **5.1. Preparar Build del Frontend**

**En tu Mac (local):**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Configurar variables de entorno para producción
nano .env.production
```

**Contenido de `.env.production`:**
```env
# API URL (usar IP pública o dominio del backend)
VITE_API_URL=http://<EC2-PUBLIC-IP>:3001/api
VITE_SOCKET_URL=http://<EC2-PUBLIC-IP>:3001

# AWS Configuration (si necesitas uploads directos)
VITE_AWS_REGION=us-east-1

# App Configuration
VITE_APP_NAME=Sistema de Gestión de Tickets
VITE_APP_VERSION=1.0.0
```

**Guardar y crear build:**
```bash
# Instalar dependencias si no lo has hecho
npm install

# Crear build de producción
npm run build

# Se creará carpeta dist/ con archivos estáticos
ls -la dist/
```

### **5.2. Subir Build a S3**

**Opción 1: AWS CLI (Recomendado)**
```bash
# Desde el directorio del frontend
cd dist/

# Sync a S3
aws s3 sync . s3://mactickets-frontend/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# index.html sin cache (para actualizaciones inmediatas)
aws s3 cp index.html s3://mactickets-frontend/ \
  --cache-control "no-cache, no-store, must-revalidate"

# Verificar archivos subidos
aws s3 ls s3://mactickets-frontend/
```

**Opción 2: Consola Web**
1. Ir a S3 → mactickets-frontend
2. Click "Upload"
3. Arrastrar TODOS los archivos de `dist/`
4. Click "Upload"

### **5.3. Invalidar Cache de CloudFront**

Después de cada actualización del frontend:

```bash
# Obtener ID de la distribución
aws cloudfront list-distributions | jq '.DistributionList.Items[0].Id'

# Invalidar cache
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION-ID> \
  --paths "/*"
```

**O por Consola:**
1. CloudFront → Distributions → Tu distribución
2. **Invalidations tab**
3. Click "Create invalidation"
4. Object paths: `/*`
5. Click "Create invalidation"

### **5.4. Probar Frontend**

**URL de CloudFront:**
```
https://d1234abcd5678.cloudfront.net
```

**Probar:**
1. Abrir en navegador
2. Debería cargar el login
3. Probar login con: `admin@maccomputadoras.com` / `demo123`
4. Verificar que se conecta al backend

**✅ Frontend Desplegado y Funcionando!**

---

## 🌍 **PASO 6: CONFIGURAR DOMINIO PERSONALIZADO (OPCIONAL)**

Si tienes un dominio (ej: `tickets.miempresa.com`):

### **6.1. Comprar o Transferir Dominio a Route 53**

1. **Route 53** → Registered domains
2. Register domain o Transfer domain
3. Seguir proceso de compra/transferencia

### **6.2. Crear Hosted Zone**

1. **Route 53** → Hosted zones
2. Click "Create hosted zone"
   ```
   Domain name: miempresa.com
   Type: Public hosted zone
   ```
3. **Copiar los Name Servers (NS)** si tu dominio no está en Route 53

### **6.3. Configurar Subdominios**

**Para API:**
```
Type: A
Name: api.miempresa.com
Value: <EC2-PUBLIC-IP>
TTL: 300
```

**Para Frontend (con CloudFront):**
1. Primero necesitas certificado SSL (ver Paso 7)
2. Luego crear registro CNAME:
   ```
   Type: A (Alias)
   Name: tickets.miempresa.com
   Value: CloudFront distribution
   ```

---

## 🔒 **PASO 7: CONFIGURAR HTTPS CON CERTIFICATE MANAGER**

### **7.1. Solicitar Certificado SSL**

1. **Certificate Manager** → Request certificate
2. Request a public certificate
3. **Domain names:**
   ```
   *.miempresa.com
   miempresa.com
   ```
4. Validation method: **DNS validation**
5. Click "Request"

### **7.2. Validar Certificado**

1. Click en el certificado pendiente
2. **Create records in Route 53** (botón)
3. Espera 5-10 minutos
4. Status cambiará a "Issued"

### **7.3. Asociar Certificado a CloudFront**

1. **CloudFront** → Distributions → Tu distribución
2. **Edit**
3. **Alternate domain names (CNAMEs):**
   ```
   tickets.miempresa.com
   ```
4. **Custom SSL certificate:** Seleccionar tu certificado
5. **Save changes**
6. Esperar que se propague (10-15 min)

### **7.4. Configurar HTTPS en Backend (EC2)**

**Opción 1: Nginx Reverse Proxy (Recomendado)**

```bash
# En EC2
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Configurar Nginx
sudo nano /etc/nginx/sites-available/mactickets-api
```

**Contenido:**
```nginx
server {
    listen 80;
    server_name api.miempresa.com;

    location / {
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
}
```

**Activar y obtener certificado:**
```bash
# Crear symlink
sudo ln -s /etc/nginx/sites-available/mactickets-api /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Obtener certificado SSL con Let's Encrypt
sudo certbot --nginx -d api.miempresa.com

# Auto-renovación
sudo certbot renew --dry-run
```

**Actualizar CORS en backend `.env`:**
```env
CORS_ORIGIN=https://tickets.miempresa.com
```

**Reiniciar API:**
```bash
pm2 restart mactickets-api
```

---

## 📊 **8. MONITOREO Y LOGS**

### **8.1. CloudWatch Logs para EC2**

**Instalar CloudWatch Agent:**
```bash
# En EC2
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configurar
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### **8.2. Monitorear con PM2**

```bash
# Ver logs en tiempo real
pm2 logs mactickets-api

# Ver métricas
pm2 monit

# Ver información detallada
pm2 show mactickets-api

# Ver lista de procesos
pm2 status
```

### **8.3. CloudWatch Dashboard**

1. **CloudWatch** → Dashboards → Create dashboard
2. Agregar widgets para:
   - EC2 CPU utilization
   - RDS connections
   - CloudFront requests
   - API error rate

---

## 💰 **9. COSTOS ESTIMADOS**

### **Configuración Free Tier (12 meses gratis):**

| Servicio | Free Tier | Costo después Free Tier |
|----------|-----------|------------------------|
| **EC2 t2.micro** | 750 horas/mes | ~$8.50/mes |
| **RDS db.t3.micro** | 750 horas/mes | ~$13/mes |
| **S3** | 5 GB | $0.023/GB/mes |
| **CloudFront** | 50 GB salida | $0.085/GB |
| **Route 53** | - | $0.50/mes + $0.40/millón queries |
| **Certificate Manager** | Gratis | Gratis |

**Total estimado (después free tier): ~$25-35/mes**

### **Optimización de Costos:**

1. **Usar Reserved Instances** (1 año): Ahorro 30-40%
2. **Detener instancias EC2 fuera de horario** (dev/staging)
3. **Usar S3 Intelligent-Tiering** para archivos
4. **Configurar CloudFront cache** agresivo
5. **RDS: Usar Read Replicas** solo si necesario

---

## 🔧 **10. TROUBLESHOOTING**

### **Problema: No puedo conectar a RDS**

**Solución:**
```bash
# 1. Verificar Security Group
# EC2 Console → Security Groups → mactickets-db-sg
# Asegurar que puerto 3306 esté abierto desde tu IP o EC2

# 2. Probar conexión
telnet mactickets-db.xxxxxxxxx.us-east-1.rds.amazonaws.com 3306

# 3. Verificar credenciales
mysql -h <RDS-ENDPOINT> -P 3306 -u admin -p
```

### **Problema: API no responde**

**Solución:**
```bash
# 1. Verificar que PM2 esté corriendo
pm2 status

# 2. Ver logs
pm2 logs mactickets-api --lines 100

# 3. Verificar puerto
sudo netstat -tulpn | grep 3001

# 4. Verificar Security Group
# Asegurar que puerto 3001 esté abierto

# 5. Reiniciar API
pm2 restart mactickets-api
```

### **Problema: Frontend muestra página en blanco**

**Solución:**
```bash
# 1. Verificar que archivos están en S3
aws s3 ls s3://mactickets-frontend/

# 2. Verificar consola del navegador (F12)
# Buscar errores de CORS o API connection

# 3. Verificar .env.production
# VITE_API_URL debe apuntar a backend correcto

# 4. Rebuild y redeploy
npm run build
aws s3 sync dist/ s3://mactickets-frontend/ --delete

# 5. Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

### **Problema: CORS errors**

**Solución:**
```bash
# En backend .env, verificar:
CORS_ORIGIN=https://tickets.miempresa.com

# Si usas CloudFront, usar domain de CloudFront:
CORS_ORIGIN=https://d1234abcd5678.cloudfront.net

# Reiniciar API
pm2 restart mactickets-api
```

---

## 🤖 **11. SCRIPTS DE DEPLOY AUTOMATIZADO**

### **11.1. Script de Deploy Backend**

Crear `deploy-backend.sh`:

```bash
#!/bin/bash

# Variables
EC2_IP="<TU-IP-EC2>"
KEY_PATH="~/.ssh/mactickets-key.pem"
REPO_URL="https://github.com/mariovital/MacApiFront.git"

echo "🚀 Deploying backend to AWS EC2..."

# SSH y ejecutar comandos
ssh -i $KEY_PATH ubuntu@$EC2_IP << 'ENDSSH'
  # Cambiar a usuario mactickets
  sudo su - mactickets << 'ENDSU'
    cd ~/MacApiFront/MAC/mac-tickets-api
    
    # Pull latest changes
    git pull origin main
    
    # Install dependencies
    npm install --production
    
    # Restart with PM2
    pm2 restart mactickets-api
    
    # Show status
    pm2 status
ENDSU
ENDSSH

echo "✅ Backend deployed successfully!"
echo "📊 Check logs: ssh -i $KEY_PATH ubuntu@$EC2_IP 'pm2 logs mactickets-api'"
```

**Usar:**
```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

### **11.2. Script de Deploy Frontend**

Crear `deploy-frontend.sh`:

```bash
#!/bin/bash

# Variables
BUCKET_NAME="mactickets-frontend"
CLOUDFRONT_ID="<TU-DISTRIBUTION-ID>"

echo "🚀 Deploying frontend to AWS S3 + CloudFront..."

# Build
echo "📦 Building..."
cd MAC/mac-tickets-front
npm run build

# Upload to S3
echo "☁️  Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://$BUCKET_NAME/ \
  --cache-control "no-cache, no-store, must-revalidate"

# Invalidate CloudFront
echo "♻️  Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"

echo "✅ Frontend deployed successfully!"
echo "🌐 URL: https://<TU-CLOUDFRONT-URL>"
```

**Usar:**
```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

---

## 📝 **RESUMEN DE URLs Y CREDENCIALES**

### **URLs de Producción:**
```
Frontend (CloudFront): https://d1234abcd5678.cloudfront.net
API (EC2):            http://<EC2-IP>:3001/api
RDS Endpoint:         mactickets-db.xxxxxxxxx.us-east-1.rds.amazonaws.com:3306

Con dominio:
Frontend:             https://tickets.miempresa.com
API:                  https://api.miempresa.com
```

### **Credenciales Demo:**
```
Email: admin@maccomputadoras.com
Password: demo123

Email: juan.perez@maccomputadoras.com
Password: demo123

Email: lucia.mesa@maccomputadoras.com
Password: demo123
```

### **Accesos AWS:**
```
SSH EC2: ssh -i ~/.ssh/mactickets-key.pem ubuntu@<EC2-IP>
RDS: mysql -h <RDS-ENDPOINT> -u admin -p
```

---

## ✅ **CHECKLIST FINAL**

- [ ] RDS MySQL creado y accesible
- [ ] Schema aplicado y datos demo poblados
- [ ] EC2 instance creada con Node.js
- [ ] Backend API desplegado y corriendo con PM2
- [ ] Security Groups configurados correctamente
- [ ] S3 Bucket creado para frontend
- [ ] CloudFront distribution configurada
- [ ] Frontend build subido a S3
- [ ] HTTPS configurado (certificado SSL)
- [ ] Dominio personalizado configurado (opcional)
- [ ] CORS configurado correctamente
- [ ] Logs y monitoreo funcionando
- [ ] Scripts de deploy creados

---

## 🎉 **¡FELICIDADES!**

Tu **Sistema de Gestión de Tickets** está completamente desplegado en AWS y listo para producción.

**Próximos pasos:**
1. Configurar backups automáticos de RDS
2. Implementar CI/CD con GitHub Actions
3. Configurar alertas de CloudWatch
4. Agregar WAF para seguridad adicional
5. Configurar Auto Scaling para EC2

**Soporte:**
- Documentación AWS: https://docs.aws.amazon.com
- PM2 Documentation: https://pm2.keymetrics.io
- Troubleshooting: Revisar sección 10 de este documento

---

**Última actualización:** 2 de octubre, 2025  
**Versión:** 1.0.0

