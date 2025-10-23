# ⚠️ Errores al Subir ZIP Incorrecto a AWS Elastic Beanstalk

## 🔴 **SI SOLO SUBES `src/` y `package.json`**

### **Errores que tendrás:**

---

## **Error #1: Carpeta `uploads/` No Existe** 📁

### **Síntoma:**
```javascript
Error: ENOENT: no such file or directory, open '/var/app/current/uploads/1729638472000-file.pdf'
```

### **Por qué pasa:**
- Multer intenta guardar el archivo en `/uploads/`
- La carpeta no existe porque no la incluiste en el ZIP
- Node.js no puede crear archivos en carpetas inexistentes

### **Consecuencia:**
```
❌ Error 500 al subir archivos
❌ "Error subiendo adjunto"
❌ Archivos no se guardan
```

---

## **Error #2: Versiones de Dependencias Incorrectas** 📦

### **Síntoma:**
```
npm WARN invalid package.json
Module 'sequelize' version mismatch
```

### **Por qué pasa:**
- Sin `package-lock.json`, npm instala las versiones MÁS RECIENTES
- Pueden tener breaking changes
- Diferencias entre local y AWS

### **Consecuencia:**
```
⚠️ Posibles errores de compatibilidad
⚠️ Comportamiento inesperado
⚠️ Módulos incompatibles
```

---

## **Error #3: Columnas `s3_url` y `s3_key` en BD** 🗄️

### **Síntoma:**
```
SequelizeDatabaseError: Unknown column 's3_url' in 'field list'
```

### **Por qué pasa:**
- Si subiste código viejo, el modelo todavía tiene `s3_url` y `s3_key`
- La base de datos AWS RDS NO tiene esas columnas
- Sequelize falla al insertar

### **Consecuencia:**
```
❌ Error 500 al subir archivos
❌ "Error subiendo adjunto"
❌ SQL query falla
```

---

## **Error #4: Permisos de Carpeta** 🔒

### **Síntoma:**
```
Error: EACCES: permission denied, mkdir '/var/app/current/uploads'
```

### **Por qué pasa:**
- Aunque la carpeta exista, puede no tener permisos de escritura
- El usuario `webapp` no puede escribir en ella

### **Consecuencia:**
```
❌ Error 500 al guardar archivo
❌ "Permission denied"
```

---

## ✅ **SOLUCIÓN: ZIP CORRECTO**

### **Usar el archivo generado por el script:**

```bash
cd MAC/mac-tickets-api
./prepare-aws-deploy.sh

# Resultado:
✅ mac-tickets-api-aws.zip
```

### **Este ZIP incluye:**

```
✅ src/                    - Código fuente ACTUALIZADO
   ├── models/
   │   └── TicketAttachment.js  ← SIN s3_url/s3_key
   ├── controllers/
   │   └── ticketController.js  ← Con funciones completas
   └── ...

✅ .ebextensions/          - Configuración de EB
   └── 01-uploads-folder.config  ← Crea carpeta uploads

✅ uploads/                - Carpeta vacía inicial
   └── .gitkeep

✅ package.json            - Dependencias
✅ package-lock.json       - Versiones EXACTAS
✅ .ebignore              - Archivos a ignorar
```

---

## 📊 **COMPARACIÓN**

### **❌ ZIP Incorrecto (Solo src + package.json)**

```
Estructura:
├── src/
└── package.json

Errores al desplegar:
❌ Error #1: Carpeta uploads no existe
❌ Error #2: Versiones de dependencias incorrectas
❌ Error #3: Posible código viejo con s3_url/s3_key
❌ Error #4: Sin permisos en uploads

Resultado:
🔴 Error 500 al subir archivos
```

### **✅ ZIP Correcto (Generado por script)**

```
Estructura:
├── .ebextensions/
│   └── 01-uploads-folder.config  ← Crea uploads con permisos
├── src/
│   └── ...                       ← Código actualizado
├── uploads/                      ← Carpeta inicial
├── package.json
├── package-lock.json             ← Versiones exactas
└── .ebignore

Beneficios:
✅ Carpeta uploads creada automáticamente
✅ Permisos correctos (777)
✅ Versiones de dependencias exactas
✅ Código actualizado sin s3_url/s3_key
✅ Configuración completa

Resultado:
🟢 Subir archivos funciona perfectamente
```

---

## 🎯 **RESUMEN VISUAL**

### **Tu ZIP Anterior:**
```
┌─────────────────┐
│ ❌ Solo src/     │
│ ❌ package.json  │
└─────────────────┘
        ↓
🔴 Error 500: Carpeta uploads no existe
🔴 Error 500: Unknown column 's3_url'
```

### **ZIP Correcto (Generado):**
```
┌──────────────────────────────┐
│ ✅ src/ (actualizado)         │
│ ✅ package.json               │
│ ✅ package-lock.json          │
│ ✅ uploads/ (vacía)           │
│ ✅ .ebextensions/ (config)    │
└──────────────────────────────┘
        ↓
🟢 Todo funciona correctamente
```

---

## 📝 **CHECKLIST ANTES DE SUBIR**

Verifica que el ZIP tenga:

- [ ] ✅ Carpeta `src/` completa
- [ ] ✅ `package.json`
- [ ] ✅ `package-lock.json` ← **CRÍTICO**
- [ ] ✅ Carpeta `uploads/` (puede estar vacía)
- [ ] ✅ Carpeta `.ebextensions/` con configuración
- [ ] ✅ Archivo `.ebignore`

### **Verificación rápida:**

```bash
# Ver contenido del ZIP
unzip -l MAC/mac-tickets-api/mac-tickets-api-aws.zip | grep -E "package-lock|uploads|ebextensions"

# Deberías ver:
# package-lock.json
# uploads/
# .ebextensions/01-uploads-folder.config
```

---

## 🚀 **ACCIÓN INMEDIATA**

### **HAZ ESTO AHORA:**

```
1. ⏳ Espera que el update actual de EB termine
   (el que ves en la barra azul)

2. 📤 Cuando esté listo (Health: OK):
   - Click en "Upload and deploy"
   - Selecciona: mac-tickets-api-aws.zip
   - Version label: "v1.0-fix-uploads"
   - Click en "Deploy"

3. ⏱️ Espera 3-5 minutos

4. ✅ Prueba subir un archivo desde el dashboard

5. 🎉 ¡Debe funcionar sin errores!
```

---

## 📍 **UBICACIÓN DEL ZIP**

**Ruta completa:**
```
/Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api/mac-tickets-api-aws.zip
```

**Para encontrarlo en Finder:**
```
1. Abrir Finder
2. Cmd + Shift + G (Go to folder)
3. Pegar la ruta de arriba
4. Verás el archivo: mac-tickets-api-aws.zip
```

---

## 🎊 **RESULTADO FINAL ESPERADO**

Después de subir el ZIP correcto:

✅ **Carpeta uploads existirá** en `/var/app/current/uploads`  
✅ **Permisos correctos** (777)  
✅ **Modelo actualizado** (sin s3_url/s3_key)  
✅ **Dependencias exactas** instaladas  
✅ **Subir archivos funcionará** sin error 500  
✅ **Descargar archivos funcionará**  
✅ **Eliminar archivos funcionará**  
✅ **Sistema completo operativo** 🎉

---

**Fecha:** 23 de Octubre, 2025  
**Estado:** ✅ ZIP LISTO PARA SUBIR  
**Archivo:** `mac-tickets-api-aws.zip`  
**Siguiente:** Subir a AWS Elastic Beanstalk

