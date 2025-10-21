# Cambio Rápido: Local ↔ AWS

## Resumen

Guía ultrarrápida para cambiar entre desarrollo local y producción AWS.

---

## Cambiar a AWS (Producción)

```bash
cd MAC/mac-tickets-front

# Opción 1: Copiar archivo de producción
cp .env.production .env

# Opción 2: Editar directamente
cat > .env << 'EOF'
VITE_API_URL=http://macticketsv.us-east-1.elasticbeanstalk.com/api
VITE_SOCKET_URL=http://macticketsv.us-east-1.elasticbeanstalk.com
VITE_AWS_REGION=us-east-1
VITE_APP_NAME=Sistema de Gestión de Tickets - MAC Computadoras
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov
EOF

# Reiniciar servidor
npm run dev
```

✅ Ahora apunta a AWS

---

## Cambiar a Local (Desarrollo)

```bash
cd MAC/mac-tickets-front

# Opción 1: Copiar archivo de ejemplo
cp .env.example .env

# Opción 2: Editar directamente
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
VITE_AWS_REGION=us-east-1
VITE_APP_NAME=Sistema de Gestión de Tickets - MAC Computadoras
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mov
EOF

# Reiniciar servidor
npm run dev
```

✅ Ahora apunta a localhost

---

## Verificar Configuración Actual

```bash
cd MAC/mac-tickets-front

# Ver archivo .env actual
cat .env | grep VITE_API_URL

# Desde el navegador (DevTools Console)
# console.log(import.meta.env.VITE_API_URL)
```

---

## One-Liner Para Cambiar

### A AWS
```bash
cd MAC/mac-tickets-front && cp .env.production .env && npm run dev
```

### A Local
```bash
cd MAC/mac-tickets-front && cp .env.example .env && npm run dev
```

---

## Script Automático (Avanzado)

Guarda esto como `switch-env.sh` en `MAC/mac-tickets-front/`:

```bash
#!/bin/bash

if [ "$1" == "aws" ]; then
    echo "🌐 Cambiando a AWS..."
    cp .env.production .env
    echo "✅ Ahora apunta a: http://macticketsv.us-east-1.elasticbeanstalk.com"
elif [ "$1" == "local" ]; then
    echo "💻 Cambiando a Local..."
    cp .env.example .env
    echo "✅ Ahora apunta a: http://localhost:3001"
else
    echo "❌ Uso: ./switch-env.sh [aws|local]"
    exit 1
fi

echo ""
echo "🔄 Reinicia el servidor con: npm run dev"
```

Uso:
```bash
chmod +x switch-env.sh
./switch-env.sh aws    # Cambiar a AWS
./switch-env.sh local  # Cambiar a Local
```

---

## Checklist Rápido

### Antes de Cambiar
- [ ] Detener servidor actual (Ctrl+C)
- [ ] Verificar que backend esté corriendo (AWS o Local)

### Después de Cambiar
- [ ] Reiniciar servidor (`npm run dev`)
- [ ] Verificar en DevTools que la URL sea correcta
- [ ] Probar login

---

## URLs de Referencia

| Ambiente | Backend API | Frontend Dev |
|----------|-------------|--------------|
| **AWS** | `http://macticketsv.us-east-1.elasticbeanstalk.com/api` | `http://localhost:5173` |
| **Local** | `http://localhost:3001/api` | `http://localhost:5173` |

---

**Última actualización:** 2025-01-21

