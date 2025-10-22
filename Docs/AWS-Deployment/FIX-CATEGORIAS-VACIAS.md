# 🔧 Solución: Categorías Vacías en AWS

## 🚨 **Problema**

En AWS, al intentar crear un ticket, **no aparecen categorías** en el dropdown, pero en local sí funcionan.

**Causa:** La base de datos en AWS RDS no tiene datos iniciales (categorías, prioridades, estados, usuarios).

---

## ✅ **Solución Rápida (3 Pasos)**

### **PASO 1: Ejecutar Script Automatizado** ⏱️ 3 minutos

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas

./insert-seed-data.sh
```

El script te pedirá:
- RDS endpoint
- Usuario (admin)
- Contraseña
- Nombre de DB (macTickets)

**¿Qué hace?**
- ✅ Inserta 7 categorías (Hardware, Software, Red, etc.)
- ✅ Inserta 4 prioridades (Baja, Media, Alta, Crítica)
- ✅ Inserta 7 estados de tickets
- ✅ Inserta 3 roles
- ✅ Crea usuarios de prueba (admin + técnicos + mesa de trabajo)

---

### **PASO 2: Reiniciar Elastic Beanstalk** ⏱️ 1 minuto

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api
eb restart
```

---

### **PASO 3: Probar en Frontend** ⏱️ 1 minuto

1. Recargar la página de crear ticket
2. Abrir el dropdown de Categoría
3. Deberías ver las 7 categorías

---

## 📋 **Datos que se Insertarán**

### **🗂️ Categorías (7)**
```
1. Hardware (Rojo #EF4444)
2. Software (Azul #3B82F6)
3. Red (Verde #10B981)
4. Cuenta (Naranja #F59E0B)
5. Periféricos (Morado #8B5CF6)
6. Sistema (Rosa #EC4899)
7. Otro (Gris #6B7280)
```

### **⚡ Prioridades (4)**
```
1. Baja (72h SLA)
2. Media (24h SLA)
3. Alta (8h SLA)
4. Crítica (4h SLA)
```

### **📊 Estados (7)**
```
1. Nuevo
2. Asignado
3. En Proceso
4. Pendiente Cliente
5. Resuelto
6. Cerrado (Final)
7. Reabierto
```

### **👥 Usuarios Creados**

#### **Administrador**
- Username: `admin`
- Password: `Admin123`
- Email: admin@maccomputadoras.com

#### **Técnicos (Password: Tecnico123)**
- jtecnico@maccomputadoras.com
- mtecnico@maccomputadoras.com
- ctecnico@maccomputadoras.com

#### **Mesa de Trabajo (Password: Usuario123)**
- lperez@maccomputadoras.com
- agomez@maccomputadoras.com

---

## 🛠️ **Opción Manual (Si prefieres SQL directo)**

### **Método 1: Desde Terminal**

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas

mysql -h tu-rds-endpoint.rds.amazonaws.com \
      -u admin \
      -p \
      macTickets < SEED-DATA-AWS.sql
```

### **Método 2: Copiar y Pegar en Cliente MySQL**

1. Abrir el archivo `SEED-DATA-AWS.sql`
2. Copiar todo el contenido
3. Conectarse a RDS con cliente MySQL
4. Pegar y ejecutar

---

## 🔍 **Verificación**

### **1. Verificar en Base de Datos**
```bash
mysql -h tu-rds-endpoint -u admin -p macTickets

# Ver categorías
SELECT * FROM categories;

# Resultado esperado:
# +----+-------------+----------------------------------+----------+-----------+
# | id | name        | description                      | color    | is_active |
# +----+-------------+----------------------------------+----------+-----------+
# |  1 | Hardware    | Problemas con equipos físicos... | #EF4444  |         1 |
# |  2 | Software    | Instalación y problemas...       | #3B82F6  |         1 |
# ...
```

### **2. Verificar en API**

```bash
# Login
TOKEN=$(curl -s -X POST http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}' | jq -r '.data.token')

# Obtener categorías
curl -s http://tu-app.elasticbeanstalk.com/api/catalog/categories \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Hardware",
      "description": "Problemas con equipos físicos...",
      "color": "#EF4444",
      "is_active": true
    },
    ...
  ]
}
```

### **3. Verificar en Frontend**

1. Ir a "Crear Ticket"
2. Click en dropdown "Categoría"
3. Deberías ver:
   - Hardware
   - Software
   - Red
   - Cuenta
   - Periféricos
   - Sistema
   - Otro

---

## 📊 **Comparación: Antes vs Después**

### **ANTES (AWS sin datos):**
```
Dropdown Categoría: [Selecciona una categoría]
  → (vacío, sin opciones)
  
Console del navegador:
  → GET /api/catalog/categories
  → Response: { data: [] }
```

### **DESPUÉS (Con datos):**
```
Dropdown Categoría: [Selecciona una categoría]
  ▼ Hardware
  ▼ Software
  ▼ Red
  ▼ Cuenta
  ▼ Periféricos
  ▼ Sistema
  ▼ Otro
  
Console del navegador:
  → GET /api/catalog/categories
  → Response: { data: [7 categorías] }
```

---

## ❓ **Troubleshooting**

### **Error: "Tabla 'categories' no existe"**

```bash
# Primero debes ejecutar el schema completo
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas
./setup-rds-database.sh
```

### **Error: "Duplicate entry '1' for key 'PRIMARY'"**

Ya existen datos. Opciones:

#### **Opción A: Eliminar y reinsertar**
```sql
DELETE FROM categories;
DELETE FROM priorities;
DELETE FROM ticket_statuses;
DELETE FROM roles;

-- Luego ejecutar SEED-DATA-AWS.sql
```

#### **Opción B: Ignorar errores de duplicados**
```bash
# Modificar el script para usar INSERT IGNORE
sed 's/INSERT INTO/INSERT IGNORE INTO/g' SEED-DATA-AWS.sql > SEED-DATA-IGNORE.sql
mysql -h xxx < SEED-DATA-IGNORE.sql
```

### **Las categorías no aparecen después de insertar**

```bash
# 1. Verificar que se insertaron
mysql -h xxx -u admin -p macTickets -e "SELECT COUNT(*) FROM categories;"

# 2. Verificar el endpoint
curl http://tu-app.elasticbeanstalk.com/api/catalog/categories \
  -H "Authorization: Bearer $TOKEN"

# 3. Reiniciar Elastic Beanstalk
eb restart

# 4. Limpiar caché del navegador (Ctrl+Shift+R)
```

---

## 🚀 **Siguiente Paso Después de Insertar Datos**

### **1. Probar Login**
```bash
curl -X POST http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'
```

### **2. Probar Crear Ticket**
```bash
curl -X POST http://tu-app.elasticbeanstalk.com/api/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prueba desde AWS",
    "description": "Ticket de prueba",
    "category_id": 1,
    "priority_id": 2,
    "client_company": "MAC",
    "client_contact": "Test"
  }'
```

### **3. Verificar en Frontend**
- Login con admin / Admin123
- Ir a "Crear Ticket"
- Verificar que aparecen categorías
- Crear un ticket de prueba

---

## 📝 **Checklist de Verificación**

Después de insertar los datos:

- [ ] Categorías existen en base de datos (7 categorías)
- [ ] Prioridades existen (4 prioridades)
- [ ] Estados existen (7 estados)
- [ ] Roles existen (3 roles)
- [ ] Usuario admin existe y puede hacer login
- [ ] API endpoint `/api/catalog/categories` devuelve datos
- [ ] Dropdown de categorías en frontend muestra opciones
- [ ] Se puede crear un ticket seleccionando categoría
- [ ] Dropdown de prioridades funciona
- [ ] El ticket se crea exitosamente

---

## 📚 **Archivos Relacionados**

| Archivo | Descripción |
|---------|-------------|
| `SEED-DATA-AWS.sql` | SQL con todos los datos iniciales |
| `insert-seed-data.sh` | Script automatizado para insertar datos |
| `FULL-SCHEMA-AWS.sql` | Schema completo (tablas + datos) |
| `setup-rds-database.sh` | Setup completo (schema + seed data) |

---

## 🎯 **Resumen Rápido**

```bash
# TODO EN UNO:
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas && \
./insert-seed-data.sh && \
cd ../../MAC/mac-tickets-api && \
eb restart && \
echo "✅ Listo! Prueba crear un ticket ahora"
```

---

**¡Listo! Ahora deberías poder crear tickets con categorías en AWS! 🎉**

**Tiempo total:** 5 minutos  
**Archivos modificados:** Base de datos RDS únicamente  
**Requiere restart:** Sí (eb restart)

