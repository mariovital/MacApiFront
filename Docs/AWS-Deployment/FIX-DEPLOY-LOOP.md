# 🔄 Fix: Bucle de Deploy en AWS Elastic Beanstalk

## 🔴 **PROBLEMA ACTUAL**

El ambiente está en un **bucle de deploys fallidos** con estos errores:

```
❌ ERROR: Failed to deploy application
❌ ERROR: Unsuccessful command execution on instance
❌ WARN: Command execution completed: [Successful: 0, TimedOut: 1]
⚠️  Environment was reverted to previous configuration
```

### **Causa del Bucle:**
La configuración `.ebextensions` está ejecutando comandos que:
1. Tardan demasiado (Timeout)
2. Fallan en la instancia
3. Elastic Beanstalk aborta el deploy
4. Se revierte a la configuración anterior
5. El ciclo se repite ♻️

---

## ✅ **SOLUCIÓN INMEDIATA**

### **Paso 1: ABORTAR el Deploy Actual**

```
1. Ve a: https://console.aws.amazon.com/elasticbeanstalk
2. Selecciona: TicketSystem-env
3. Verás barra azul: "Elastic Beanstalk is updating..."
4. Click en: "Actions" (arriba derecha)
5. Click en: "Abort Current Operation"
6. Espera 2-3 minutos
7. ✅ Debe cambiar a Health: Warning o No Data
```

---

### **Paso 2: Esperar Estabilización**

```
⏳ Espera 5-10 minutos después de abortar
✅ Health debe cambiar a: "No Data" o "Warning"
✅ NO debe decir: "Updating" o "Environment update is starting"
```

---

### **Paso 3: Deploy con ZIP MÍNIMO**

He creado un ZIP **SIN `.ebextensions`** que no causará timeouts:

#### **Ubicación del nuevo ZIP:**
```
/Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api/mac-tickets-api-minimal.zip
```

#### **Características:**
```
✅ Solo código fuente (src/)
✅ package.json y package-lock.json
✅ uploads/ vacía
❌ SIN .ebextensions (evita timeouts)
```

#### **Cómo subirlo:**
```
1. Ve a AWS EB Console
2. Click en "Upload and deploy"
3. Selecciona: mac-tickets-api-minimal.zip
4. Version label: "v1.0-minimal-fix"
5. Click en "Deploy"
6. ⏳ Espera 3-5 minutos
7. ✅ Debe completar SIN errores
```

---

### **Paso 4: Crear Carpeta Uploads Manualmente**

Después de que el deploy **termine exitosamente**:

#### **Opción A: Desde AWS Console** (MÁS FÁCIL)

```
1. Ve a EC2 Console: https://console.aws.amazon.com/ec2
2. Instances → Busca instancia de TicketSystem
3. Connect → Session Manager → Connect
4. Ejecuta:

sudo mkdir -p /var/app/current/uploads
sudo chmod 777 /var/app/current/uploads
sudo chown webapp:webapp /var/app/current/uploads
ls -la /var/app/current/uploads

# Deberías ver: drwxrwxrwx webapp webapp
```

#### **Opción B: Con EB CLI** (Requiere instalación)

```bash
# Instalar EB CLI (si no está instalado)
pip install awsebcli

# Conectar por SSH
cd MAC/mac-tickets-api
eb ssh

# Crear carpeta
sudo mkdir -p /var/app/current/uploads
sudo chmod 777 /var/app/current/uploads
sudo chown webapp:webapp /var/app/current/uploads

# Verificar
ls -la /var/app/current/uploads

# Salir
exit
```

---

## 🎯 **SECUENCIA COMPLETA (5-10 minutos)**

### **Timeline:**

```
Minuto 0:    🛑 Abort Current Operation
Minuto 0-2:  ⏳ Esperando que aborte...
Minuto 2:    ✅ Health: Warning/No Data
Minuto 2-7:  ⏳ Esperando estabilización...
Minuto 7:    📤 Upload and deploy (ZIP mínimo)
Minuto 7-12: ⏳ Deploy en progreso...
Minuto 12:   ✅ Deploy completado!
Minuto 12-15: 🔧 Conectar por SSH y crear uploads/
Minuto 15:   🎉 ¡Sistema funcionando!
```

---

## 📊 **DIAGNÓSTICO DEL PROBLEMA**

### **Por qué falló el deploy anterior:**

#### **1. Comandos de `.ebextensions` muy agresivos:**
```yaml
# ESTO CAUSÓ EL PROBLEMA:
commands:
  01_create_uploads_directory:
    command: "mkdir -p /var/app/current/uploads"  # ❌ Ruta no existe aún
  02_set_uploads_permissions:
    command: "chmod 777 /var/app/current/uploads"  # ❌ Puede fallar
  03_set_uploads_owner:
    command: "chown -R webapp:webapp /var/app/current/uploads"  # ❌ Usuario puede no existir
```

#### **2. Timeouts en ejecución:**
```
❌ Command execution completed: [Successful: 0, TimedOut: 1]
   → Los comandos tardaron más de 3 minutos
   → Elastic Beanstalk aborta el deploy
```

#### **3. Instancia no respondió:**
```
❌ The following instances have not responded in the allowed command timeout time
   → La instancia se quedó colgada ejecutando comandos
```

### **Solución aplicada:**

```
✅ ZIP MÍNIMO sin .ebextensions
   → Deploy rápido (< 3 min)
   → Sin comandos que fallen
   → Sin timeouts

✅ Crear carpeta manualmente después
   → Control total del proceso
   → Sin riesgos de timeout
   → Permisos correctos garantizados
```

---

## 🐛 **TROUBLESHOOTING**

### **Si el ABORT no funciona:**

```
1. Espera 15 minutos
2. El deploy eventualmente fallará solo
3. Se revertirá automáticamente
4. Luego haz el deploy mínimo
```

### **Si el nuevo deploy también falla:**

```
1. Ve a: Configuration → Software
2. Verifica variables de entorno:
   - DB_HOST
   - DB_NAME
   - DB_USER
   - DB_PASSWORD
   - JWT_SECRET
3. Si faltan, agrégalas
4. Intenta deploy de nuevo
```

### **Si la carpeta uploads no se crea:**

```
# Verificar que estás en el directorio correcto
cd /var/app/current
pwd
# Debe mostrar: /var/app/current

# Si no existe, probar:
cd /var/app/staging
# Si existe, crear ahí:
sudo mkdir -p uploads
sudo chmod 777 uploads
```

### **Si sigue sin funcionar después de TODO:**

```
1. Ve a: Actions → Rebuild Environment
2. Espera 10-15 minutos
3. Cuando termine, haz deploy del ZIP mínimo
4. Crear carpeta uploads manualmente
```

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

### **Antes de subir el nuevo ZIP:**

- [ ] ⏳ Deploy actual abortado
- [ ] ⏳ Health: No Data / Warning (NO "Updating")
- [ ] ⏳ Esperado 5 minutos de estabilización
- [ ] ✅ ZIP mínimo creado: `mac-tickets-api-minimal.zip`
- [ ] ✅ Variables de entorno verificadas

### **Durante el deploy:**

- [ ] ⏳ Upload completado
- [ ] ⏳ "Deploying new version" en eventos
- [ ] ⏳ Sin errores en logs
- [ ] ⏳ Health: OK (verde)

### **Después del deploy:**

- [ ] ✅ Deploy completado exitosamente
- [ ] ✅ Health: OK
- [ ] ✅ Conectado por SSH
- [ ] ✅ Carpeta `/var/app/current/uploads` creada
- [ ] ✅ Permisos: `drwxrwxrwx`
- [ ] ✅ Subir archivo funciona

---

## 📁 **ARCHIVOS DISPONIBLES**

### **Opción 1: ZIP Mínimo (RECOMENDADO para bucle)**
```
📍 Ubicación: MAC/mac-tickets-api/mac-tickets-api-minimal.zip
✅ Sin .ebextensions
✅ Deploy rápido
✅ Sin riesgo de timeout
⚠️  Requiere crear uploads manualmente
```

### **Opción 2: ZIP Completo (Para deploy limpio)**
```
📍 Ubicación: MAC/mac-tickets-api/mac-tickets-api-aws.zip
✅ Con .ebextensions simplificado
✅ Crea uploads automáticamente
⚠️  Puede causar timeout si el ambiente está inestable
```

### **Recomendación:**
```
🎯 SI ESTÁS EN BUCLE → Usa ZIP MÍNIMO
🎯 SI AMBIENTE ESTÁ OK → Usa ZIP COMPLETO
```

---

## 🚀 **ACCIÓN INMEDIATA**

### **HAZ ESTO AHORA:**

```
1. 🛑 ABORT el deploy actual en AWS Console
   → Actions → Abort Current Operation

2. ⏳ ESPERA 5-10 minutos
   → Hasta que Health: No Data / Warning

3. 📤 SUBE el ZIP mínimo
   → mac-tickets-api-minimal.zip
   → Version: "v1.0-minimal-fix"

4. ⏳ ESPERA 3-5 minutos
   → Deploy debe completar OK

5. 🔧 CONECTA por SSH
   → Session Manager desde EC2 Console
   → Crea carpeta uploads

6. ✅ PRUEBA subir archivo
   → Dashboard → Ticket → Adjuntar archivo

7. 🎉 ¡LISTO!
```

---

## 📞 **SI NECESITAS AYUDA**

### **Logs útiles para debug:**

```bash
# Ver eventos del deploy
eb events

# Ver logs completos
eb logs --all

# Ver solo errores
eb logs --all | grep ERROR

# Ver health detallado
eb health --refresh
```

### **Compartir conmigo:**

Si sigue fallando, comparte:
1. Screenshot de los eventos más recientes
2. Output de `eb logs --all` (últimas 50 líneas)
3. Variables de entorno (sin mostrar passwords)

---

**Fecha:** 23 de Octubre, 2025  
**Estado:** 🔴 EN BUCLE → ✅ SOLUCIÓN LISTA  
**Archivo:** `mac-tickets-api-minimal.zip`  
**Siguiente:** Abortar deploy actual y subir ZIP mínimo

