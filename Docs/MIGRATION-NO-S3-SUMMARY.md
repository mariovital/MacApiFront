# 🔄 Migración a Almacenamiento Local (Sin S3)

## 📋 **Resumen Ejecutivo**

Eliminamos la dependencia de AWS S3 del sistema, migrando a almacenamiento local en el servidor. Los archivos se guardarán en `/uploads` (desarrollo) o `/var/app/current/uploads` (producción AWS).

---

## ✅ **Cambios Implementados**

### **1. Schema de Base de Datos**

#### **Campos AGREGADOS a `ticket_attachments`:**
- ✅ `file_path` VARCHAR(500) NOT NULL - Ruta local del archivo
- ✅ `storage_type` ENUM('local', 'external') DEFAULT 'local' - Tipo de almacenamiento

#### **Campos DEPRECADOS (mantener por compatibilidad):**
- ⚠️ `s3_url` VARCHAR(500) - Ahora NULLABLE, valor NULL por defecto
- ⚠️ `s3_key` VARCHAR(500) - Ahora NULLABLE, valor NULL por defecto

---

### **2. Modelos de Sequelize**

#### **TicketAttachment.js - ACTUALIZADO** ✅
```javascript
file_path: { type: DataTypes.STRING(500), allowNull: false },
storage_type: { type: DataTypes.ENUM('local', 'external'), defaultValue: 'local' },
s3_url: { type: DataTypes.STRING(500), allowNull: true, comment: 'DEPRECATED' },
s3_key: { type: DataTypes.STRING(500), allowNull: true, comment: 'DEPRECATED' }
```

#### **TicketHistory.js - CREADO** ✅
Modelo completamente nuevo para historial de tickets:
- Campos: `action_type`, `old_value`, `new_value`, `description`
- Relaciones: `belongsTo(Ticket)`, `belongsTo(User)`

---

### **3. Controladores**

#### **ticketController.js - ACTUALIZADO** ✅
```javascript
// ANTES (S3):
s3_url: fileUrl,
s3_key: req.file.filename

// AHORA (Local):
file_path: `${uploadDir}/${req.file.filename}`,
storage_type: 'local',
s3_url: null,
s3_key: null
```

---

### **4. Servicios**

#### **pdfService.js - MEJORADO** ✅
- Ahora usa `TicketHistory` para historial real de cambios
- Agrega sección "HISTORIAL DE CAMBIOS" en el PDF
- Muestra tipo de acción, usuario, descripción y valores cambiados

---

### **5. Variables de Entorno**

#### **.env LOCAL (Desarrollo):**
```bash
UPLOAD_DIR=./uploads
```

#### **.env PRODUCCIÓN (AWS):**
```bash
UPLOAD_DIR=/var/app/current/uploads
NODE_ENV=production
```

#### **ELIMINADAS:**
```bash
# YA NO SE USAN:
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_REGION
# AWS_S3_BUCKET
```

---

## 🚀 **Pasos de Migración**

### **Paso 1: Backup de Base de Datos** ⚠️ **CRÍTICO**
```bash
mysqldump -u root -p mactickets ticket_attachments > backup_attachments_$(date +%Y%m%d).sql
```

### **Paso 2: Ejecutar Migración SQL**
```sql
-- Agregar nuevos campos
ALTER TABLE ticket_attachments 
ADD COLUMN file_path VARCHAR(500) NULL AFTER file_type,
ADD COLUMN storage_type ENUM('local', 'external') DEFAULT 'local' NOT NULL AFTER file_path;

-- Hacer s3_url y s3_key opcionales
ALTER TABLE ticket_attachments 
MODIFY COLUMN s3_url VARCHAR(500) NULL,
MODIFY COLUMN s3_key VARCHAR(500) NULL;

-- Migrar datos existentes (OPCIÓN DESARROLLO - marcar como eliminados)
UPDATE ticket_attachments 
SET deleted_at = NOW(), 
    deleted_by = 1,
    file_path = CONCAT('/uploads/', file_name)
WHERE deleted_at IS NULL;
```

### **Paso 3: Actualizar Código** ✅ **YA HECHO**
- ✅ Modelo `TicketAttachment.js` actualizado
- ✅ Modelo `TicketHistory.js` creado
- ✅ `/models/index.js` actualizado con asociaciones
- ✅ Controlador `ticketController.js` actualizado
- ✅ Servicio `pdfService.js` mejorado

### **Paso 4: Verificar Directorio de Uploads**
```bash
# En desarrollo
mkdir -p ./uploads
chmod 755 ./uploads

# En producción (Elastic Beanstalk)
# Crear .ebextensions/create-uploads.config
```

### **Paso 5: Reiniciar Servidor**
```bash
# Desarrollo
npm run dev

# Producción
eb deploy
```

---

## ⚠️ **Limitaciones de Elastic Beanstalk**

### **Problema:**
Elastic Beanstalk **NO persiste archivos** entre deployments:
- ❌ Archivos en `/uploads` se pierden al redesplegar
- ❌ No hay almacenamiento persistente por defecto

### **Soluciones Disponibles:**

#### **Opción 1: EFS (Elastic File System)** ⭐ Recomendado
- ✅ Los archivos persisten entre deployments
- ✅ Compartido entre todas las instancias
- ✅ Escalable automáticamente
- 💰 Costo: ~$10-15/mes

**Configuración requerida:**
```yaml
# .ebextensions/efs-mount.config
option_settings:
  aws:elasticbeanstalk:application:environment:
    UPLOAD_DIR: /efs/uploads
```

#### **Opción 2: Base de Datos (BLOB)**
- ✅ Simple, sin configuración extra
- ✅ Sin costo adicional
- ❌ Base de datos más grande
- ❌ Más lento para archivos grandes

**Requiere:**
```sql
ALTER TABLE ticket_attachments 
ADD COLUMN file_data LONGBLOB,
ADD COLUMN file_size INT;
```

#### **Opción 3: Reconsiderar S3** 💡
- ✅ Más barato (~$1-2/mes)
- ✅ Sin riesgo de pérdida
- ✅ Más fácil de configurar
- ✅ Estándar de la industria

---

## 📊 **Comparación de Opciones**

| Característica | Local + EFS | Base de Datos | S3 |
|---|---|---|---|
| **Costo Mensual** | $10-15 | $0 | $1-2 |
| **Configuración** | Media | Simple | Simple |
| **Performance** | Excelente | Media | Excelente |
| **Persistencia** | ✅ 100% | ✅ 100% | ✅ 100% |
| **Escalabilidad** | ✅ Auto | ⚠️ Limitada | ✅ Ilimitada |
| **Backups** | Manual | Con DB | Automático |

---

## 🔧 **Archivos Actualizados**

### **Schema y Migraciones:**
- ✅ `/Docs/Schemas/Schema-No-S3.sql` - Schema completo sin S3
- ✅ `/Docs/Schemas/Migration-Remove-S3.sql` - Script de migración

### **Backend:**
- ✅ `/MAC/mac-tickets-api/src/models/TicketAttachment.js`
- ✅ `/MAC/mac-tickets-api/src/models/TicketHistory.js` (NUEVO)
- ✅ `/MAC/mac-tickets-api/src/models/index.js`
- ✅ `/MAC/mac-tickets-api/src/controllers/ticketController.js`
- ✅ `/MAC/mac-tickets-api/src/services/pdfService.js`

### **Documentación:**
- ✅ `/Docs/AWS-ENV-NO-S3.md` - Variables de entorno sin S3
- ✅ `/Docs/MIGRATION-NO-S3-SUMMARY.md` (Este archivo)

---

## 📋 **Checklist de Verificación**

### **Pre-Deploy:**
- [ ] Backup de base de datos realizado
- [ ] Script de migración probado en desarrollo
- [ ] Archivos existentes respaldados (si aplica)
- [ ] Variables de entorno configuradas sin S3

### **Post-Deploy:**
- [ ] Migración SQL ejecutada exitosamente
- [ ] Directorio `/uploads` creado y con permisos
- [ ] Subida de archivos funciona correctamente
- [ ] Descarga de archivos funciona correctamente
- [ ] PDFs se generan con historial completo
- [ ] Sin referencias a S3 en logs de error

### **Validación:**
```sql
-- Ver estado de archivos migrados
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN file_path IS NOT NULL THEN 1 ELSE 0 END) as con_file_path,
    SUM(CASE WHEN storage_type = 'local' THEN 1 ELSE 0 END) as storage_local,
    SUM(CASE WHEN s3_url IS NULL THEN 1 ELSE 0 END) as sin_s3
FROM ticket_attachments
WHERE deleted_at IS NULL;
```

---

## 🎯 **Siguientes Pasos Recomendados**

1. **Ejecutar migración en base de datos local** ✅
2. **Probar subida y descarga de archivos** 🔄
3. **Generar PDF y verificar historial completo** 🔄
4. **Decidir estrategia de persistencia para AWS:**
   - Opción A: Implementar EFS ($10-15/mes)
   - Opción B: Guardar en base de datos como BLOB
   - Opción C: Reconsiderar S3 ($1-2/mes, más simple)
5. **Deploy a AWS Elastic Beanstalk** ⏳

---

## ❓ **FAQ - Preguntas Frecuentes**

### **¿Necesito eliminar columnas s3_url y s3_key ahora?**
❌ **NO**. Se mantienen como NULLABLE para compatibilidad. Se pueden eliminar en el futuro cuando se confirme que todo funciona.

### **¿Qué pasa con archivos ya subidos a S3?**
⚠️ Debes **descargarlos manualmente** de S3 y colocarlos en `/uploads` con el mismo `file_name`, o marcarlos como eliminados.

### **¿Funciona en desarrollo local?**
✅ **SÍ**. Los archivos se guardan en `./uploads` sin problemas.

### **¿Cómo manejo archivos en producción AWS sin EFS?**
⚠️ **NO se recomienda**. Sin EFS o S3, los archivos se perderán en cada deploy. Considera EFS o volver a S3.

### **¿El PDF incluye el historial ahora?**
✅ **SÍ**. El PDF ahora incluye una sección completa de "HISTORIAL DE CAMBIOS" con todas las acciones realizadas en el ticket.

---

## 🔗 **Enlaces Útiles**

- [Schema completo sin S3](/Docs/Schemas/Schema-No-S3.sql)
- [Script de migración](/Docs/Schemas/Migration-Remove-S3.sql)
- [Variables de entorno AWS](/Docs/AWS-ENV-NO-S3.md)
- [Configuración EFS (si decides usarlo)](/Docs/AWS-Deployment/EFS-SETUP.md) *(crear si es necesario)*

---

**Fecha de migración:** 2025-01-21  
**Versión:** 2.0 (Sin S3)  
**Estado:** ✅ Código actualizado - ⏳ Pendiente deploy

