# 🎓 Guía Completa: Desplegar MAC Tickets en AWS Academy

> **⚠️ IMPORTANTE**: Esta guía es específica para **AWS Academy** (entorno educativo) sin acceso a AWS CLI. Todo se hace mediante la **consola web**.

---

## 📋 Índice

1. [Diferencias de AWS Academy vs AWS Normal](#diferencias-aws-academy)
2. [Requisitos Previos](#requisitos-previos)
3. [Paso 1: Iniciar Laboratorio AWS Academy](#paso-1-iniciar-laboratorio)
4. [Paso 2: Configurar RDS (Base de Datos)](#paso-2-configurar-rds)
5. [Paso 3: Configurar EC2 (Backend API)](#paso-3-configurar-ec2-backend)
6. [Paso 4: Configurar S3 (Frontend)](#paso-4-configurar-s3-frontend)
7. [Paso 5: Configurar Security Groups](#paso-5-configurar-security-groups)
8. [Paso 6: Testing y Verificación](#paso-6-testing-y-verificación)
9. [Paso 7: Mantener Sesión Activa](#paso-7-mantener-sesión-activa)
10. [Troubleshooting](#troubleshooting)

---

## 🔍 Diferencias AWS Academy vs AWS Normal

### ❌ Lo que NO está disponible en AWS Academy:
- ✗ **AWS CLI** (línea de comandos)
- ✗ **IAM completo** (roles preconfigurados)
- ✗ **Route 53** (DNS management)
- ✗ **Certificate Manager** (SSL automático)
- ✗ **CloudFront** (CDN limitado o no disponible)
- ✗ **Billing** (no se cobra, es gratis)
- ✗ **CloudFormation** (IaC limitado)
- ✗ **Elastic Beanstalk**

### ✅ Lo que SÍ está disponible:
- ✓ **EC2** (máquinas virtuales)
- ✓ **RDS** (bases de datos)
- ✓ **S3** (almacenamiento)
- ✓ **Security Groups** (firewall)
- ✓ **VPC** (red virtual)
- ✓ **Elastic IPs** (IPs estáticas)

### ⚠️ Limitaciones importantes:
- 🕐 **Sesiones limitadas**: 3-4 horas por laboratorio
- 🔄 **Credenciales temporales**: Cambian cada sesión
- 💾 **Datos no permanentes**: Se borran al terminar el lab
- 🌐 **Sin dominios personalizados**: Solo IPs públicas
- 🔒 **Sin HTTPS fácil**: Requiere configuración manual

---

## 🎯 Requisitos Previos

### En tu Mac (Local):
```bash
# Verificar Node.js y npm
node --version  # v18+
npm --version   # v9+

# Verificar Git
git --version

# MySQL client (para conectar a RDS)
brew install mysql-client

# Tener tu proyecto actualizado
cd MacApiFront
git pull origin main
```

### Cuenta AWS Academy:
- ✅ Acceso a AWS Academy Learner Lab
- ✅ Créditos disponibles ($100 generalmente)
- ✅ Lab iniciado y "Ready" (luz verde)

---

## 🚀 Paso 1: Iniciar Laboratorio AWS Academy

### 1.1 Acceder al Laboratorio

1. **Ir a AWS Academy**:
   - Canvas → Módulos → Learner Lab
   - O directamente a: https://awsacademy.instructure.com

2. **Iniciar el Lab**:
   - Click en "Start Lab"
   - ⏱️ Esperar 3-5 minutos
   - Cuando el círculo esté **verde**, está listo

3. **Acceder a la Consola**:
   - Click en el círculo verde
   - Se abrirá la **AWS Management Console**

### 1.2 Verificar Región

1. **Esquina superior derecha** de la consola
2. Verificar que estés en una región disponible:
   - ✅ **us-east-1** (N. Virginia) - **RECOMENDADO**
   - ✅ us-west-2 (Oregon)
3. Si no, cambiar a `us-east-1`

### 1.3 Obtener Credenciales Temporales

1. En el Learner Lab, click en **"AWS Details"**
2. Click en **"Show"** en "AWS CLI"
3. **Copiar** las credenciales (las necesitarás luego):
   ```
   aws_access_key_id=ASIA...
   aws_secret_access_key=...
   aws_session_token=...
   ```
4. Guardar en un archivo temporal (ej: `aws-creds.txt`)

> ⚠️ **IMPORTANTE**: Estas credenciales **expiran** al terminar el lab (3-4 horas)

---

## 📊 Paso 2: Configurar RDS (Base de Datos)

### 2.1 Crear Base de Datos MySQL

1. **En la consola AWS, ir a RDS**:
   - Buscar "RDS" en la barra superior
   - Click en "RDS"

2. **Click en "Create database"**

3. **Configuración - Choose a database creation method**:
   ```
   ✅ Standard create
   ```

4. **Engine options**:
   ```
   ✅ Engine type: MySQL
   ✅ Version: MySQL 8.0.35 (o la más reciente disponible)
   ```

5. **Templates**:
   ```
   ✅ Free tier (si está disponible)
   O Dev/Test (para Academy)
   ```

6. **Settings**:
   ```
   DB instance identifier: mactickets-db
   
   Credentials Settings:
   Master username: admin
   
   ✅ Auto generate a password (recomendado)
   O
   Master password: [TU_PASSWORD_AQUI]
   Confirm password: [REPETIR_PASSWORD]
   
   ⚠️ GUARDAR ESTE PASSWORD - Lo necesitarás después
   ```

7. **DB instance class**:
   ```
   ✅ Burstable classes
   ✅ db.t3.micro (1 vCPU, 1 GB RAM)
   O db.t3.small si está disponible
   ```

8. **Storage**:
   ```
   Storage type: General Purpose SSD (gp3)
   Allocated storage: 20 GB
   
   ❌ Desmarcar "Enable storage autoscaling" (para ahorrar)
   ```

9. **Connectivity**:
   ```
   Compute resource: ❌ Don't connect to an EC2 compute resource
   
   Virtual private cloud (VPC): Default VPC
   DB subnet group: default
   
   ✅ Public access: Yes (IMPORTANTE para conectar desde fuera)
   
   VPC security group:
   ✅ Create new
   New VPC security group name: mactickets-db-sg
   
   Availability Zone: No preference
   ```

10. **Database authentication**:
    ```
    ✅ Password authentication
    ```

11. **Additional configuration** (expandir):
    ```
    Initial database name: mactickets
    
    ❌ Desmarcar "Enable automated backups" (para ahorrar)
    ❌ Desmarcar "Enable encryption" (opcional en Academy)
    ❌ Desmarcar "Enable deletion protection" (para poder borrar después)
    ```

12. **Crear**:
    - Click "Create database"
    - ⏱️ Esperar 5-10 minutos
    - Estado debe cambiar a "Available"

### 2.2 Obtener Endpoint de RDS

1. **RDS → Databases**
2. **Click en "mactickets-db"**
3. **Tab "Connectivity & security"**
4. **Copiar el "Endpoint"**:
   ```
   mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com
   ```
5. **Copiar el "Port"**: `3306`
6. **Guardar en un archivo** (necesitarás esto después)

### 2.3 Configurar Security Group de RDS

1. **En la sección "Connectivity & security"**
2. **Click en el Security Group** (ej: `mactickets-db-sg`)
3. **Tab "Inbound rules"**
4. **Click "Edit inbound rules"**
5. **Agregar regla**:
   ```
   Type: MySQL/Aurora
   Protocol: TCP
   Port range: 3306
   Source: 0.0.0.0/0 (Anywhere IPv4)
   Description: MySQL access for development
   ```
6. **Click "Save rules"**

> ⚠️ **NOTA**: En producción real, restringirías esto a IPs específicas

### 2.4 Conectar y Cargar Schema

Desde tu Mac:

```bash
# Conectar a RDS (usa el endpoint que copiaste)
mysql -h mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p

# Cuando pida password, ingresar el Master password

# Si conecta exitosamente, verás:
# mysql>

# Verificar que la base de datos existe
SHOW DATABASES;
# Debe aparecer 'mactickets'

USE mactickets;
exit;
```

```bash
# Cargar el schema
mysql -h mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p \
      mactickets < Docs/Schemas/Schema-Improved.sql

# Si da error de "file not found", asegúrate de estar en la raíz del proyecto
cd ~/Documents/iCloudDocuments/tec/MacApiFront
```

```bash
# Verificar que las tablas se crearon
mysql -h mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p \
      mactickets -e "SHOW TABLES;"

# Debe mostrar: users, tickets, categories, etc.
```

```bash
# Cargar datos demo (usa el seed script)
# Primero, necesitamos configurar temporalmente las credenciales
cd MAC/mac-tickets-api

# Crear .env temporal para seed
nano .env.seed
```

Pegar esto (ajustar con tu endpoint y password):
```env
DB_HOST=mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=mactickets
DB_USER=admin
DB_PASSWORD=TU_PASSWORD_RDS_AQUI
```

```bash
# Correr seed
npm run seed

# Si funciona, verás:
# ✅ Conexión exitosa
# ✅ Tablas verificadas
# ✅ Total usuarios DEMO: 12
# ✅ Total tickets DEMO: 4
```

✅ **Base de datos configurada y lista!**

---

## 💻 Paso 3: Configurar EC2 (Backend API)

### 3.1 Crear Instancia EC2

1. **En la consola AWS, ir a EC2**:
   - Buscar "EC2" en la barra superior

2. **Click "Launch instance"**

3. **Name and tags**:
   ```
   Name: mactickets-api
   ```

4. **Application and OS Images (AMI)**:
   ```
   ✅ Amazon Linux 2023 AMI
   Architecture: 64-bit (x86)
   ```

5. **Instance type**:
   ```
   ✅ t2.micro (Free tier eligible)
   O t3.small (si tienes créditos)
   ```

6. **Key pair (login)**:
   - **Si ya tienes un key pair**:
     - Seleccionar el existente
   
   - **Si NO tienes key pair**:
     - Click "Create new key pair"
     - Name: `mactickets-key`
     - Key pair type: RSA
     - Private key format: `.pem`
     - Click "Create key pair"
     - ⬇️ Se descargará `mactickets-key.pem`
     - **Mover a ~/.ssh/**:
       ```bash
       mv ~/Downloads/mactickets-key.pem ~/.ssh/
       chmod 400 ~/.ssh/mactickets-key.pem
       ```

7. **Network settings**:
   ```
   VPC: Default VPC
   Subnet: No preference
   ✅ Auto-assign public IP: Enable
   
   Firewall (security groups):
   ✅ Create security group
   Security group name: mactickets-api-sg
   Description: API server security group
   ```

8. **Inbound security group rules**:
   ```
   Agregar estas reglas:
   
   1. SSH
      Type: SSH
      Port: 22
      Source: My IP (o 0.0.0.0/0 si cambia tu IP)
   
   2. HTTP
      Type: HTTP
      Port: 80
      Source: 0.0.0.0/0
   
   3. HTTPS
      Type: HTTPS
      Port: 443
      Source: 0.0.0.0/0
   
   4. Custom TCP (API)
      Type: Custom TCP
      Port: 3001
      Source: 0.0.0.0/0
      Description: Node.js API
   ```

9. **Configure storage**:
   ```
   Size: 8 GB (o 20 GB si está disponible)
   Volume type: gp3
   ✅ Delete on termination
   ```

10. **Advanced details**:
    - Dejar todo por defecto

11. **Summary**:
    - Verificar: 1 instance, t2.micro, 8 GB storage
    - Click "Launch instance" ✅

12. **Esperar**:
    - ⏱️ 1-2 minutos
    - Estado debe cambiar a "Running"

### 3.2 Obtener IP Pública de EC2

1. **EC2 → Instances**
2. **Click en "mactickets-api"**
3. **Copiar "Public IPv4 address"**:
   ```
   ej: 54.123.45.67
   ```
4. **Guardar este IP** (lo usarás mucho)

### 3.3 Conectar a EC2 via SSH

Desde tu Mac:

```bash
# Conectar (usa tu IP pública)
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67

# Si da error "Connection refused", espera 1-2 minutos más

# Cuando conecte, verás algo como:
# [ec2-user@ip-172-31-x-x ~]$
```

### 3.4 Instalar Software en EC2

```bash
# Ya estás dentro de EC2 (via SSH)

# Actualizar sistema
sudo yum update -y

# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar
node --version  # debe mostrar v18.x
npm --version   # debe mostrar v9.x

# Instalar Git
sudo yum install -y git

# Instalar PM2 (Process Manager para Node.js)
sudo npm install -g pm2

# Instalar MySQL client (para testing)
sudo yum install -y mysql

# Crear directorio para la aplicación
mkdir -p ~/apps
cd ~/apps
```

### 3.5 Clonar Repositorio

```bash
# Dentro de EC2

# Si tu repo es privado, necesitas configurar SSH keys
# Si es público, usa HTTPS:

# Opción 1: HTTPS (repo público)
git clone https://github.com/mariovital/MacApiFront.git

# Opción 2: SSH (repo privado)
# Primero, generar SSH key en EC2:
ssh-keygen -t ed25519 -C "tu-email@example.com"
# Presionar Enter 3 veces (sin passphrase)
cat ~/.ssh/id_ed25519.pub
# Copiar la key y agregarla en GitHub → Settings → SSH Keys

git clone git@github.com:mariovital/MacApiFront.git

# Entrar al directorio del API
cd MacApiFront/MAC/mac-tickets-api

# Instalar dependencias
npm install --production

# Esto tomará 2-3 minutos
```

### 3.6 Configurar Variables de Entorno

```bash
# Dentro de EC2, en el directorio del API
cd ~/apps/MacApiFront/MAC/mac-tickets-api

# Crear archivo .env
nano .env

# Copiar y pegar esto (ajustar valores):
```

```env
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database Configuration (RDS)
# ⚠️ CAMBIAR CON TU ENDPOINT Y PASSWORD DE RDS
DB_HOST=mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=mactickets
DB_USER=admin
DB_PASSWORD=TU_PASSWORD_RDS_AQUI
DB_LOGGING=false

# JWT Configuration
# ⚠️ CAMBIAR ESTOS SECRETS EN PRODUCCIÓN
JWT_SECRET=mac-tickets-super-secret-key-cambiar-en-produccion-2025
JWT_REFRESH_SECRET=mac-tickets-refresh-secret-cambiar-en-produccion-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3 Configuration (para uploads - opcional por ahora)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov

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
# Guardar archivo:
# Ctrl+O (Write Out)
# Enter (confirmar nombre)
# Ctrl+X (Exit)

# Verificar que se guardó
cat .env
```

### 3.7 Iniciar la API con PM2

```bash
# Dentro de EC2
cd ~/apps/MacApiFront/MAC/mac-tickets-api

# Iniciar la API
pm2 start src/server.js --name mactickets-api

# Deberías ver:
# [PM2] Starting src/server.js in fork_mode (1 instance)
# [PM2] Done.

# Ver status
pm2 status

# Debe mostrar:
# ┌─────┬──────────────────┬─────────┬─────────┐
# │ id  │ name             │ status  │ cpu     │
# ├─────┼──────────────────┼─────────┼─────────┤
# │ 0   │ mactickets-api   │ online  │ 0%      │
# └─────┴──────────────────┴─────────┴─────────┘

# Ver logs (primeros 30 segundos)
pm2 logs mactickets-api --lines 50

# Debe mostrar algo como:
# 🚀 Servidor corriendo en http://0.0.0.0:3001
# ✅ Base de datos conectada

# Si hay errores, revisar .env
```

### 3.8 Configurar PM2 para Auto-Start

```bash
# Dentro de EC2

# Configurar PM2 para iniciarse al arrancar el servidor
pm2 startup

# Copiará un comando largo, algo como:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Copiar y ejecutar ese comando completo

# Guardar configuración actual de PM2
pm2 save

# Ahora, si el servidor se reinicia, PM2 arrancará automáticamente
```

### 3.9 Verificar que la API funciona

```bash
# Dentro de EC2

# Test local
curl http://localhost:3001/health

# Debe retornar:
# {"success":true,"message":"API is healthy"}

# Test desde afuera (desde tu Mac, nueva terminal)
curl http://54.123.45.67:3001/health

# Si funciona, también debe retornar:
# {"success":true,"message":"API is healthy"}
```

✅ **Backend API funcionando en EC2!**

---

## 🌐 Paso 4: Configurar S3 (Frontend)

### 4.1 Build del Frontend

En tu Mac (no en EC2):

```bash
# Ir al directorio del frontend
cd ~/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Crear archivo de variables de entorno para producción
nano .env.production
```

Pegar esto (ajustar con tu IP de EC2):
```env
# ⚠️ CAMBIAR IP con la de tu EC2
VITE_API_URL=http://54.123.45.67:3001/api
VITE_SOCKET_URL=http://54.123.45.67:3001
VITE_APP_NAME=Sistema de Gestión de Tickets
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

```bash
# Guardar (Ctrl+O, Enter, Ctrl+X)

# Verificar
cat .env.production

# Build del frontend
npm run build

# Esto tardará 1-2 minutos
# Al finalizar, verás:
# ✓ built in XXXms

# Verificar que se creó la carpeta dist/
ls -la dist/

# Debe tener:
# - index.html
# - assets/
# - maccomputadoras_logo.png
```

### 4.2 Crear S3 Bucket

**En la consola AWS**:

1. **Buscar "S3"** en la barra superior

2. **Click "Create bucket"**

3. **Bucket name**:
   ```
   mactickets-frontend-[TU-NOMBRE]-2025
   
   ⚠️ El nombre debe ser ÚNICO en todo AWS
   Ejemplo: mactickets-frontend-mario-2025
   ```

4. **AWS Region**:
   ```
   ✅ US East (N. Virginia) us-east-1
   ```

5. **Object Ownership**:
   ```
   ✅ ACLs disabled (recommended)
   ```

6. **Block Public Access settings**:
   ```
   ❌ DESMARCAR "Block all public access"
   ✅ Marcar "I acknowledge that the current settings..."
   ```

7. **Bucket Versioning**:
   ```
   ❌ Disable (para ahorrar espacio)
   ```

8. **Default encryption**:
   ```
   ✅ Server-side encryption with Amazon S3 managed keys (SSE-S3)
   ```

9. **Click "Create bucket"** ✅

### 4.3 Configurar Bucket para Static Website

1. **S3 → Buckets → mactickets-frontend-mario-2025**

2. **Tab "Properties"**

3. **Scroll hasta "Static website hosting"**

4. **Click "Edit"**:
   ```
   ✅ Enable
   
   Hosting type: Host a static website
   
   Index document: index.html
   Error document: index.html
   ```

5. **Click "Save changes"**

6. **Copiar el "Bucket website endpoint"**:
   ```
   http://mactickets-frontend-mario-2025.s3-website-us-east-1.amazonaws.com
   ```

7. **Guardar este URL** (es tu frontend)

### 4.4 Configurar Permisos del Bucket

1. **Tab "Permissions"**

2. **Scroll hasta "Bucket policy"**

3. **Click "Edit"**

4. **Pegar este JSON** (cambiar nombre del bucket):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mactickets-frontend-mario-2025/*"
    }
  ]
}
```

5. **Click "Save changes"** ✅

### 4.5 Subir Build a S3

**Opción A: Consola Web (Recomendado para Academy)**

1. **S3 → Buckets → mactickets-frontend-mario-2025**

2. **Click "Upload"**

3. **Click "Add files"**:
   - Seleccionar `index.html` de la carpeta `dist/`
   - Seleccionar `maccomputadoras_logo.png`

4. **Click "Add folder"**:
   - Seleccionar la carpeta `assets/` de `dist/`

5. **Click "Upload"** en la parte inferior

6. **Esperar** hasta que diga "Upload succeeded"

7. **Click "Close"**

**Opción B: Desde Terminal (si configuraste credenciales temporales)**

```bash
# En tu Mac
cd ~/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-front

# Configurar AWS CLI temporalmente con las credenciales del lab
export AWS_ACCESS_KEY_ID=ASIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...

# Subir archivos
aws s3 sync dist/ s3://mactickets-frontend-mario-2025/ --delete

# Verificar
aws s3 ls s3://mactickets-frontend-mario-2025/
```

### 4.6 Verificar Frontend

1. **Abrir en navegador el S3 Website Endpoint**:
   ```
   http://mactickets-frontend-mario-2025.s3-website-us-east-1.amazonaws.com
   ```

2. **Debe cargar la pantalla de login**

3. **Intentar login**:
   - Email: `admin@tuempresa.com`
   - Password: `demo123`

4. **Debe redirigir al dashboard** ✅

> ⚠️ **NOTA**: La URL es HTTP (no HTTPS). En AWS Academy, configurar HTTPS es complejo sin CloudFront/Certificate Manager.

✅ **Frontend desplegado en S3!**

---

## 🔒 Paso 5: Configurar Security Groups

### 5.1 Verificar Security Group del API (EC2)

1. **EC2 → Instances → mactickets-api**

2. **Tab "Security"**

3. **Click en el Security Group** (ej: `mactickets-api-sg`)

4. **Tab "Inbound rules"**

5. **Verificar que tengas estas reglas**:
   ```
   SSH (22) - 0.0.0.0/0 o My IP
   HTTP (80) - 0.0.0.0/0
   HTTPS (443) - 0.0.0.0/0
   Custom TCP (3001) - 0.0.0.0/0
   ```

6. **Si falta alguna**, click "Edit inbound rules" y agregarla

### 5.2 Verificar Security Group de RDS

1. **RDS → Databases → mactickets-db**

2. **Tab "Connectivity & security"**

3. **Click en el Security Group**

4. **Tab "Inbound rules"**

5. **Verificar que tengas**:
   ```
   MySQL/Aurora (3306) - 0.0.0.0/0
   O la IP específica de tu EC2
   ```

### 5.3 (Opcional) Restringir RDS a solo EC2

Para mayor seguridad:

1. **Obtener Security Group ID de EC2**:
   - EC2 → Security Groups → mactickets-api-sg
   - Copiar "Security group ID" (ej: `sg-0123456789abcdef0`)

2. **Editar Security Group de RDS**:
   - RDS Security Group → Edit inbound rules
   - Cambiar Source de `0.0.0.0/0` a `sg-0123456789abcdef0`
   - Save rules

Ahora solo tu EC2 puede acceder a RDS (más seguro).

---

## ✅ Paso 6: Testing y Verificación

### 6.1 Verificar Backend (desde tu Mac)

```bash
# Health check
curl http://54.123.45.67:3001/health

# Debe retornar:
# {"success":true,"message":"API is healthy"}

# Test de login
curl -X POST http://54.123.45.67:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tuempresa.com",
    "password": "demo123"
  }'

# Debe retornar un objeto con:
# "success": true
# "data": { "user": {...}, "token": "..." }
```

### 6.2 Verificar Frontend

1. **Abrir navegador** en:
   ```
   http://mactickets-frontend-mario-2025.s3-website-us-east-1.amazonaws.com
   ```

2. **Verificar**:
   - ✓ Pantalla de login se carga
   - ✓ Logo de MAC Computadoras visible
   - ✓ Campos de email y password funcionan
   - ✓ No hay errores en consola del navegador

3. **Iniciar sesión**:
   ```
   Email: admin@tuempresa.com
   Password: demo123
   ```

4. **Verificar dashboard**:
   - ✓ Redirige a `/dashboard`
   - ✓ Sidebar visible con navegación
   - ✓ Métricas se cargan
   - ✓ Tabla de tickets recientes

5. **Probar navegación**:
   - Click en "Tickets" → Debe mostrar lista de tickets
   - Click en "Usuarios" → Debe mostrar lista de usuarios
   - Click en "Reportes" → Debe mostrar gráficas
   - Click en "Configuración" → Debe mostrar perfil

### 6.3 Verificar Conexión a Base de Datos

```bash
# Desde tu Mac
mysql -h mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets -e "SELECT COUNT(*) as total_users FROM users;"

# Debe mostrar:
# +-------------+
# | total_users |
# +-------------+
# |          12 |
# +-------------+

mysql -h mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      mactickets -e "SELECT COUNT(*) as total_tickets FROM tickets;"

# Debe mostrar:
# +---------------+
# | total_tickets |
# +---------------+
# |             4 |
# +---------------+
```

### 6.4 Checklist Final

```
✅ RDS está "Available" y accesible
✅ EC2 está "Running" y accesible via SSH
✅ API responde en http://IP:3001/health
✅ Frontend carga en S3 website endpoint
✅ Login funciona y redirige al dashboard
✅ Navegación entre páginas funciona
✅ No hay errores en consola del navegador
✅ PM2 muestra la API como "online"
```

✅ **Sistema completo funcionando en AWS Academy!**

---

## ⏱️ Paso 7: Mantener Sesión Activa

### 7.1 Extender Sesión del Lab

- El lab de AWS Academy **expira en 3-4 horas**
- Para extender:
  1. Volver a AWS Academy Learner Lab
  2. Si el círculo está naranja/rojo, click "Start Lab" de nuevo
  3. Esperar a que esté verde

- **⚠️ IMPORTANTE**: Los recursos (EC2, RDS, S3) **NO se borran** al expirar la sesión, pero **no podrás acceder** hasta reiniciar el lab

### 7.2 Guardar Información Importante

Crea un archivo `aws-info.txt` con:

```txt
=== AWS ACADEMY - MAC TICKETS DEPLOYMENT ===

🗓️ Fecha: 16 Octubre 2025

📊 RDS (Base de Datos)
- Endpoint: mactickets-db.xxxxxxxx.us-east-1.rds.amazonaws.com
- Port: 3306
- Username: admin
- Password: [TU_PASSWORD_AQUI]
- Database: mactickets

💻 EC2 (Backend API)
- Public IP: 54.123.45.67
- Instance ID: i-0123456789abcdef0
- Key: ~/.ssh/mactickets-key.pem
- SSH: ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67
- API URL: http://54.123.45.67:3001

🌐 S3 (Frontend)
- Bucket: mactickets-frontend-mario-2025
- Website: http://mactickets-frontend-mario-2025.s3-website-us-east-1.amazonaws.com

👤 Credenciales Demo
- Email: admin@tuempresa.com
- Password: demo123

🔐 Security Groups
- API SG: mactickets-api-sg (sg-0abc...)
- DB SG: mactickets-db-sg (sg-0def...)

📝 Notas:
- Lab expira cada 3-4 horas
- Reiniciar lab en: https://awsacademy.instructure.com
- Las IPs pueden cambiar si se detiene EC2
```

### 7.3 Detener Recursos (Opcional)

Si no vas a usar el sistema por un tiempo:

```bash
# En EC2 (via SSH)
pm2 stop mactickets-api

# Salir
exit
```

**En la Consola AWS**:
1. **EC2 → Instances → mactickets-api**
2. **Instance state → Stop instance**

> ⚠️ **NOTA**: Al detener EC2, **cambió la IP pública**. Necesitarás actualizar `.env.production` y rebuild + resubir el frontend.

Para evitar esto:
1. **EC2 → Elastic IPs → Allocate Elastic IP address**
2. **Actions → Associate Elastic IP address**
3. Seleccionar tu instancia EC2

Ahora la IP será fija (pero consume créditos si no está asociada a una instancia running).

---

## 🔧 Troubleshooting

### Problema: No puedo conectar a RDS desde mi Mac

**Causa**: Security Group bloqueando

**Solución**:
```bash
1. RDS → mactickets-db → Connectivity & security
2. Click en Security Group
3. Inbound rules → Edit
4. Cambiar Source a 0.0.0.0/0 (temporal)
5. Save rules
6. Intentar de nuevo
```

### Problema: EC2 no responde en el puerto 3001

**Causa**: Security Group o API no corriendo

**Solución**:
```bash
# Verificar Security Group
EC2 → Security Groups → mactickets-api-sg
Inbound rules debe tener: Custom TCP, Port 3001, Source 0.0.0.0/0

# Conectar a EC2
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67

# Verificar PM2
pm2 status

# Si no está running
pm2 start src/server.js --name mactickets-api

# Ver logs
pm2 logs mactickets-api
```

### Problema: Frontend carga pero no puede conectar al API

**Causa**: CORS o URL incorrecta en .env.production

**Solución**:
```bash
# En tu Mac
cd MAC/mac-tickets-front

# Verificar .env.production
cat .env.production

# Debe tener la IP correcta de EC2:
VITE_API_URL=http://54.123.45.67:3001/api

# Si está mal, corregir y rebuild
nano .env.production
npm run build

# Resubir a S3 (consola web o CLI)
```

### Problema: Error "Connection refused" al hacer SSH

**Causa**: EC2 aún está iniciando o key pair incorrecto

**Solución**:
```bash
# Esperar 2 minutos y reintentar

# Verificar permisos del key
ls -la ~/.ssh/mactickets-key.pem
# Debe mostrar: -r-------- (400)

# Si no
chmod 400 ~/.ssh/mactickets-key.pem

# Verificar que estás usando la IP correcta
# EC2 → Instances → Public IPv4 address
```

### Problema: La sesión del lab expiró

**Solución**:
```bash
1. Ir a AWS Academy Learner Lab
2. Click "Start Lab"
3. Esperar a círculo verde
4. Click en el círculo para abrir consola
5. Todos tus recursos siguen ahí (EC2, RDS, S3)
6. Verificar que EC2 esté "Running"
7. Si está "Stopped", hacer "Start instance"
```

### Problema: Build del frontend falla

**Solución**:
```bash
# Limpiar y reinstalar
cd MAC/mac-tickets-front
rm -rf node_modules dist
npm install
npm run build
```

### Problema: La API no puede conectar a RDS

**Causa**: Credenciales incorrectas en .env o Security Group

**Solución**:
```bash
# En EC2
cd ~/apps/MacApiFront/MAC/mac-tickets-api

# Verificar .env
cat .env | grep DB_

# Probar conexión manual
mysql -h [DB_HOST del .env] -u admin -p mactickets

# Si conecta, el problema es el .env de la API
# Verificar password, endpoint, etc.

# Reiniciar API
pm2 restart mactickets-api
pm2 logs mactickets-api
```

---

## 📝 Notas Finales para AWS Academy

### Limitaciones

1. **Sin dominio personalizado**: Solo tienes IPs públicas y URLs de S3
2. **Sin HTTPS automático**: Configurar SSL manualmente es complejo
3. **Sesiones temporales**: 3-4 horas máximo
4. **Créditos limitados**: $100 típicamente
5. **No permanente**: Los datos pueden borrarse al finalizar el curso

### Recomendaciones

1. **Guardar toda la información**: IPs, endpoints, passwords
2. **Hacer backups regulares** de la base de datos:
   ```bash
   mysqldump -h [RDS_ENDPOINT] -u admin -p mactickets > backup.sql
   ```

3. **Documentar cambios**: Mantén notas de configuraciones
4. **Usar Elastic IP** si necesitas IP fija
5. **No depender de esto para producción real**

### Para Producción Real

Cuando quieras deployment permanente:
1. Crear cuenta AWS normal (no Academy)
2. Configurar Route 53 para dominio
3. Configurar Certificate Manager para HTTPS
4. Usar CloudFront para CDN
5. Configurar Auto Scaling
6. Implementar CI/CD con GitHub Actions

---

## 🎉 ¡Sistema Desplegado!

Tu aplicación MAC Tickets ahora está funcionando en AWS Academy:

**URLs**:
- 🌐 **Frontend**: `http://mactickets-frontend-mario-2025.s3-website-us-east-1.amazonaws.com`
- 🔌 **API**: `http://54.123.45.67:3001`
- 💚 **Health**: `http://54.123.45.67:3001/health`

**Credenciales**:
- 📧 Email: `admin@tuempresa.com`
- 🔑 Password: `demo123`

**Recursos AWS**:
- 📊 RDS MySQL: `mactickets-db`
- 💻 EC2 Instance: `mactickets-api`
- 🪣 S3 Bucket: `mactickets-frontend-mario-2025`

---

## 📞 Siguiente Paso

Comparte estas URLs con tu equipo de desarrollo Android para que puedan:
1. Probar los endpoints de la API
2. Verificar la autenticación
3. Probar creación de tickets
4. Probar subida de archivos

**¡Éxito con tu proyecto!** 🚀

