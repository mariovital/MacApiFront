# 🚀 Scripts de Deployment Automatizados

Scripts para automatizar el deployment del sistema MAC Tickets a AWS.

---

## 📋 Scripts Disponibles

### 1. `deploy-frontend.sh`
Despliega el frontend (React) a S3 + CloudFront.

**Lo que hace**:
- ✅ Build del frontend con Vite
- ✅ Sube archivos a S3
- ✅ Invalida cache de CloudFront
- ✅ Muestra resultados

### 2. `deploy-backend.sh`
Despliega el backend (Node.js) a EC2.

**Lo que hace**:
- ✅ Conecta via SSH a EC2
- ✅ Pull del código desde GitHub
- ✅ Instala dependencias
- ✅ Reinicia API con PM2
- ✅ Muestra logs recientes

---

## ⚙️ Configuración Inicial

### 1. Configurar Variables

#### Frontend (`deploy-frontend.sh`):
```bash
# Editar el archivo
nano deploy-frontend.sh

# Cambiar estas líneas:
S3_BUCKET="mactickets-frontend"           # Tu bucket S3
CLOUDFRONT_ID="E123456ABCDEF"              # Tu CloudFront ID
```

#### Backend (`deploy-backend.sh`):
```bash
# Editar el archivo
nano deploy-backend.sh

# Cambiar estas líneas:
EC2_HOST="ec2-user@54.123.45.67"          # Tu EC2 IP
EC2_KEY="~/.ssh/mactickets-key.pem"       # Ruta a tu key
```

### 2. Dar Permisos de Ejecución

```bash
chmod +x deploy-frontend.sh
chmod +x deploy-backend.sh
```

---

## 🚀 Uso

### Desplegar Frontend

```bash
# Desde la carpeta scripts/
./deploy-frontend.sh

# Output esperado:
# 🚀 Desplegando Frontend a AWS...
# 📦 Building frontend...
# ✅ Build completado
# ☁️  Subiendo a S3...
# ✅ Archivos subidos a S3
# 🔄 Invalidando cache de CloudFront...
# ✅ Cache invalidado
# 🎉 ¡Deployment completado!
```

### Desplegar Backend

```bash
# Desde la carpeta scripts/
./deploy-backend.sh

# Output esperado:
# 🚀 Desplegando Backend a AWS EC2...
# 📡 Conectando a EC2...
# 📥 Pulling latest code...
# 📦 Installing dependencies...
# 🔄 Restarting API with PM2...
# ✅ Deployment completed on EC2
# 🎉 ¡Deployment completado!
```

### Desplegar Todo (Frontend + Backend)

```bash
# Opción 1: Ejecutar ambos scripts
./deploy-backend.sh && ./deploy-frontend.sh

# Opción 2: Crear un script combinado
cat > deploy-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Desplegando sistema completo..."
./deploy-backend.sh
./deploy-frontend.sh
echo "✅ ¡Todo desplegado!"
EOF

chmod +x deploy-all.sh
./deploy-all.sh
```

---

## 🔧 Troubleshooting

### Error: Permission denied (publickey)

```bash
# Verificar que el key tiene los permisos correctos
chmod 400 ~/.ssh/mactickets-key.pem

# Verificar que la IP de EC2 es correcta
# EC2 Console → Instances → Tu instancia → Public IPv4
```

### Error: aws: command not found

```bash
# Instalar AWS CLI
brew install awscli

# Configurar credenciales
aws configure
```

### Error: Distribution ID not found

```bash
# Obtener tu Distribution ID
aws cloudfront list-distributions \
  --query 'DistributionList.Items[*].[Id,DomainName]' \
  --output table

# Copiar el ID y actualizar en el script
```

### Build del frontend falla

```bash
# Verificar que tienes todas las dependencias
cd ../../MAC/mac-tickets-front
npm install

# Intentar build manual
npm run build
```

---

## 📝 Pre-requisitos

### Frontend
- ✅ Node.js 18+ instalado
- ✅ AWS CLI configurado
- ✅ Credenciales AWS con permisos para S3 y CloudFront
- ✅ `.env.production` configurado

### Backend
- ✅ SSH key de EC2 descargado
- ✅ Permisos 400 en el key
- ✅ EC2 con Git y PM2 configurados
- ✅ Repositorio clonado en EC2

---

## 🎯 Comandos Útiles

### Ver logs del backend en tiempo real

```bash
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'pm2 logs mactickets-api'
```

### Ver status de PM2

```bash
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'pm2 status'
```

### Reiniciar API sin deploy

```bash
ssh -i ~/.ssh/mactickets-key.pem ec2-user@54.123.45.67 'pm2 restart mactickets-api'
```

### Ver archivos en S3

```bash
aws s3 ls s3://mactickets-frontend/
```

### Invalidar cache manualmente

```bash
aws cloudfront create-invalidation \
  --distribution-id E123456ABCDEF \
  --paths "/*"
```

---

## 🔄 Workflow Recomendado

### Desarrollo Normal

1. Hacer cambios en local
2. Commit a GitHub
3. Push a `main` branch
4. Ejecutar scripts de deployment

```bash
# En tu Mac
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Deploy backend (pull desde EC2)
./deploy-backend.sh

# Deploy frontend (build local + upload)
./deploy-frontend.sh
```

### Hotfix Urgente

```bash
# Fix rápido en código
git add .
git commit -m "fix: bug crítico"
git push origin main

# Deploy solo backend (más rápido)
./deploy-backend.sh

# Verificar
curl https://api.tu-dominio.com/health
```

### Update Solo Frontend

```bash
# Cambios en UI
cd MAC/mac-tickets-front
# ... hacer cambios ...

# Deploy solo frontend
cd ../../Docs/AWS-Deployment/scripts/
./deploy-frontend.sh
```

---

## 📊 Tiempos Estimados

| Acción | Tiempo |
|--------|--------|
| Build frontend | ~30s |
| Upload a S3 | ~1-2 min |
| Invalidar CloudFront | ~5-15 min (propagación) |
| Deploy backend | ~1-2 min |
| Total (ambos) | ~3-5 min |

---

## 🔐 Seguridad

### Mejores Prácticas

1. **Nunca commitear las claves SSH**
   ```bash
   # Verificar que .gitignore incluye:
   *.pem
   *.key
   .ssh/
   ```

2. **Rotar credenciales AWS regularmente**
   ```bash
   aws iam create-access-key --user-name tu-usuario
   ```

3. **Usar variables de entorno**
   ```bash
   export EC2_HOST="ec2-user@54.123.45.67"
   export S3_BUCKET="mactickets-frontend"
   ```

---

## 🎉 ¡Todo Listo!

Ahora puedes desplegar tu sistema a AWS con un solo comando.

**Próximos pasos**:
1. Configurar CI/CD con GitHub Actions (opcional)
2. Agregar monitoreo con CloudWatch
3. Configurar alertas para errores
4. Implementar backups automáticos

---

## 📞 Soporte

Si tienes problemas:
1. Verificar la guía principal: `01-GUIA-COMPLETA-AWS.md`
2. Revisar logs de PM2 en EC2
3. Verificar Security Groups
4. Comprobar variables de entorno
