# 🔐 Crear Usuario Administrador en RDS

## ⚡ Opción 1: Script Automático (RECOMENDADO)

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas
./create-admin-user.sh
```

El script te pedirá:
1. Contraseña de RDS
2. Ejecutará el SQL automáticamente
3. Verificará que se creó correctamente

**Credenciales creadas:**
- 📧 Email: `admin@maccomputadoras.com`
- 🔑 Password: `demo123`

---

## ⚡ Opción 2: Ejecutar SQL Directamente

```bash
# 1. Edita el script SQL con tu información (opcional)
nano /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas/INSERT-ADMIN-USER.sql

# 2. Ejecuta el SQL
mysql -h tu-rds-endpoint.rds.amazonaws.com -u admin -p macTickets < /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas/INSERT-ADMIN-USER.sql
```

---

## ⚡ Opción 3: Una Línea (Copy-Paste)

```bash
mysql -h tu-rds-endpoint.rds.amazonaws.com -u admin -p macTickets -e "INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, is_active, created_at, updated_at) VALUES ('admin', 'admin@maccomputadoras.com', '\$2b\$12\$v/dFbmP.9LnnruzCpYDWlON0hbwne8ENYFO.VOp6vAm/imElihtte', 'Admin', 'Sistema', 1, 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), is_active = 1, updated_at = NOW();"
```

**Nota:** Reemplaza `tu-rds-endpoint.rds.amazonaws.com` con tu endpoint real de RDS.

---

## ⚡ Opción 4: Desde AWS Console (MySQL Workbench)

1. Conecta a RDS usando MySQL Workbench
2. Selecciona la base de datos `macTickets`
3. Ejecuta este SQL:

```sql
INSERT INTO users (
  username,
  email,
  password_hash,
  first_name,
  last_name,
  role_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  'admin',
  'admin@maccomputadoras.com',
  '$2b$12$v/dFbmP.9LnnruzCpYDWlON0hbwne8ENYFO.VOp6vAm/imElihtte',
  'Admin',
  'Sistema',
  1,
  1,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  is_active = 1,
  updated_at = NOW();
```

---

## ✅ Verificar que Funcionó

### 1. Verificar en Base de Datos

```bash
mysql -h tu-rds-endpoint.rds.amazonaws.com -u admin -p macTickets -e "SELECT id, username, email, first_name, last_name, role_id, is_active FROM users WHERE email='admin@maccomputadoras.com';"
```

**Resultado esperado:**
```
+----+----------+------------------------------+------------+-----------+---------+-----------+
| id | username | email                        | first_name | last_name | role_id | is_active |
+----+----------+------------------------------+------------+-----------+---------+-----------+
|  1 | admin    | admin@maccomputadoras.com    | Admin      | Sistema   |       1 |         1 |
+----+----------+------------------------------+------------+-----------+---------+-----------+
```

### 2. Probar Login en la API

```bash
curl -X POST http://tu-app.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@maccomputadoras.com",
    "password": "demo123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": 1,
      "email": "admin@maccomputadoras.com",
      "first_name": "Admin",
      "last_name": "Sistema",
      "role": {
        "id": 1,
        "name": "admin"
      }
    }
  }
}
```

---

## 🔑 Información de las Credenciales

| Campo | Valor |
|-------|-------|
| **Username** | admin |
| **Email** | admin@maccomputadoras.com |
| **Password** | demo123 |
| **First Name** | Admin |
| **Last Name** | Sistema |
| **Role ID** | 1 (Administrador) |
| **Is Active** | 1 (Activo) |
| **Password Hash** | $2b$12$v/dFbmP.9LnnruzCpYDWlON0hbwne8ENYFO.VOp6vAm/imElihtte |

---

## 🛠️ Crear Usuarios Adicionales

### Generar Nuevo Hash de Contraseña

```bash
cd /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/MAC/mac-tickets-api

# Genera el hash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tu_password', 12, (err, hash) => { console.log(hash); });"
```

### Insertar Otro Usuario

```sql
INSERT INTO users (
  username,
  email,
  password_hash,
  first_name,
  last_name,
  role_id,
  is_active,
  created_at,
  updated_at
) VALUES (
  'juan.tecnico',
  'juan.tecnico@maccomputadoras.com',
  '$2b$12$[TU_HASH_AQUI]',
  'Juan',
  'Técnico',
  2,  -- role_id: 2 = técnico
  1,
  NOW(),
  NOW()
);
```

### Roles Disponibles

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | admin | Administrador (acceso total) |
| 2 | tecnico | Técnico (resolver tickets) |
| 3 | mesa_trabajo | Mesa de Trabajo (crear tickets) |

---

## 🚨 Troubleshooting

### Error: "Access denied for user"
```bash
# Verifica las credenciales de RDS
eb printenv | grep DB_

# O en AWS Console:
# RDS → Databases → tu-instancia → Configuration
```

### Error: "Can't connect to MySQL server"
```bash
# Verifica Security Group
# AWS Console → RDS → tu-instancia → Connectivity & security
# Security Group debe permitir puerto 3306
```

### Error: "Table 'users' doesn't exist"
```bash
# Primero ejecuta el schema completo
mysql -h tu-rds-endpoint -u admin -p macTickets < /Users/vital/Documents/iCloudDocuments/tec/MacApiFront/Docs/Schemas/FULL-SCHEMA-AWS.sql
```

### Error: "Duplicate entry for key 'email'"
```bash
# El usuario ya existe, resetea la contraseña:
mysql -h tu-rds-endpoint -u admin -p macTickets -e "UPDATE users SET password_hash = '\$2b\$12\$v/dFbmP.9LnnruzCpYDWlON0hbwne8ENYFO.VOp6vAm/imElihtte', is_active = 1, login_attempts = 0, locked_until = NULL WHERE email = 'admin@maccomputadoras.com';"
```

---

## 📋 Checklist

Antes de probar el login, verifica:

- [ ] Base de datos `macTickets` existe
- [ ] Tabla `users` existe
- [ ] Usuario insertado correctamente
- [ ] `is_active = 1` (activo)
- [ ] `role_id = 1` (admin)
- [ ] Elastic Beanstalk tiene variables DB configuradas
- [ ] La app puede conectarse a RDS (Security Groups)

---

## 🎯 Siguiente Paso

Una vez creado el usuario:

1. ✅ Prueba login en Insomnia/Postman
2. ✅ Copia el token
3. ✅ Úsalo en el header `Authorization: Bearer [token]`
4. ✅ Prueba endpoints protegidos

**Ejemplo en Insomnia:**

```
# Request 1: Login
POST http://tu-app.elasticbeanstalk.com/api/auth/login
Body: {
  "email": "admin@maccomputadoras.com",
  "password": "demo123"
}

# Request 2: Get Tickets (con token)
GET http://tu-app.elasticbeanstalk.com/api/tickets
Header: Authorization: Bearer [token_del_login]
```

---

## 📞 Soporte

Si necesitas ayuda:
- Revisa logs de Elastic Beanstalk: `eb logs`
- Verifica conexión a RDS: `mysql -h [endpoint] -u admin -p`
- Consulta [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

---

**Última actualización:** 2025-01-21  
**Archivos relacionados:**
- `Docs/Schemas/INSERT-ADMIN-USER.sql`
- `Docs/Schemas/create-admin-user.sh`
- `Docs/DEMO-CREDENTIALS.md`

