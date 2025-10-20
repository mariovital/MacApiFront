# Bug Fix: Usuarios Eliminados Siguen Apareciendo en Frontend

## 🐛 Problema Reportado
**Fecha:** Octubre 2025  
**Descripción:** Un usuario eliminado de la base de datos seguía apareciendo en el frontend cuando se listaban los usuarios.

```
❌ Usuario eliminado en DB
✅ Aparece en DELETE exitoso
❌ Sigue apareciendo al recargar lista
```

---

## 🔍 Análisis del Problema

### **Causa Raíz**
El backend estaba usando **mockUsers** (datos en memoria) en lugar de consultar la base de datos real con Sequelize.

### **Código Problemático:**

```javascript
// ❌ ANTES - userController.js
const mockUsers = [
  { id: 1, username: "admin", ... },
  { id: 2, username: "jtecnico", ... },
  { id: 3, username: "mmesa", ... }
];

export const getUsers = async (req, res) => {
  let filteredUsers = [...mockUsers]; // ❌ Usando datos mock
  // ...
  res.json({ data: { items: safeUsers } });
};

export const deleteUser = async (req, res) => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    deleted_at: new Date() // ❌ Solo actualizando array en memoria
  };
};
```

### **Por qué Fallaba:**

1. **`getUsers()`**: Siempre retornaba los mismos usuarios mock
2. **`deleteUser()`**: Modificaba el array en memoria, pero no la DB
3. **Reinicio del servidor**: El array mock se reiniciaba con los valores originales
4. **Frontend**: Recibía datos desactualizados constantemente

---

## ✅ Solución Implementada

### **1. Importar Modelos de Sequelize**

```javascript
// ✅ DESPUÉS - userController.js
import { User, Role } from '../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

// ❌ Removido: const mockUsers = [...]
```

### **2. Actualizar getUsers() - Consulta Real a DB**

```javascript
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      is_active
    } = req.query;

    // ✅ Construir condiciones WHERE
    const whereConditions = {
      deleted_at: null // 🔥 CRÍTICO: Solo usuarios NO eliminados
    };

    // Filtros opcionales
    if (role) whereConditions.role_id = role;
    if (is_active !== undefined) whereConditions.is_active = is_active === 'true';
    
    if (search) {
      whereConditions[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } }
      ];
    }

    // ✅ Consultar base de datos con Sequelize
    const { count, rows } = await User.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ],
      attributes: {
        exclude: ['password_hash', 'password_reset_token', 'password_reset_expires']
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['created_at', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: {
        items: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### **3. Actualizar getUserById() - Consulta Real**

```javascript
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Buscar usuario en la base de datos
    const user = await User.findOne({
      where: {
        id,
        deleted_at: null // Solo usuarios NO eliminados
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ],
      attributes: {
        exclude: ['password_hash', 'password_reset_token', 'password_reset_expires']
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: user
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### **4. Actualizar createUser() - Inserción Real**

```javascript
export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role_id
    } = req.body;

    // Validaciones...

    // ✅ Verificar usuario existente en DB
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
        deleted_at: null
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        message: `El ${field} ya está registrado`,
        code: 'USER_ALREADY_EXISTS'
      });
    }

    // ✅ Validar rol en DB
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido',
        code: 'INVALID_ROLE'
      });
    }

    // ✅ Hashear contraseña
    const password_hash = await bcrypt.hash(password, 12);

    // ✅ Crear nuevo usuario en la base de datos
    const newUser = await User.create({
      username,
      email,
      password_hash,
      first_name,
      last_name,
      role_id,
      is_active: true
    });

    // ✅ Obtener usuario completo con rol
    const userWithRole = await User.findOne({
      where: { id: newUser.id },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ],
      attributes: {
        exclude: ['password_hash', 'password_reset_token', 'password_reset_expires']
      }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: userWithRole
    });
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### **5. Actualizar updateUser() - Actualización Real**

```javascript
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Buscar usuario en DB
    const user = await User.findOne({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Campos permitidos para actualizar
    const allowedFields = ['first_name', 'last_name', 'email', 'username', 'is_active', 'role_id'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    // ✅ Si se actualiza email o username, verificar duplicados
    if (updates.email || updates.username) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            updates.email ? { email: updates.email } : null,
            updates.username ? { username: updates.username } : null
          ].filter(Boolean),
          id: { [Op.ne]: id },
          deleted_at: null
        }
      });

      if (existingUser) {
        const field = existingUser.email === updates.email ? 'email' : 'username';
        return res.status(400).json({
          success: false,
          message: `El ${field} ya está en uso`,
          code: 'DUPLICATE_FIELD'
        });
      }
    }

    // ✅ Actualizar usuario en DB
    await user.update(updates);

    // ✅ Obtener usuario actualizado con rol
    const updatedUser = await User.findOne({
      where: { id },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ],
      attributes: {
        exclude: ['password_hash', 'password_reset_token', 'password_reset_expires']
      }
    });

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### **6. Actualizar deleteUser() - Soft Delete Real** 🔥

```javascript
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Buscar usuario en DB
    const user = await User.findOne({
      where: {
        id,
        deleted_at: null // Solo usuarios NO eliminados
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // No permitir eliminar admin principal
    if (user.role_id === 1 && user.id === 1) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el usuario administrador principal',
        code: 'CANNOT_DELETE_MAIN_ADMIN'
      });
    }

    // ✅ SOFT DELETE - Marcar deleted_at con timestamp en DB
    await user.update({
      deleted_at: new Date(),
      is_active: false
    });

    console.log('✅ Usuario eliminado exitosamente (soft delete):', id);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### **7. Actualizar resetPassword() - Actualización Real**

```javascript
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password, newPassword } = req.body;
    const password = new_password || newPassword; // Soportar ambos formatos

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Nueva contraseña es requerida',
        errors: [{ field: 'new_password', message: 'Nueva contraseña es requerida' }]
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
        errors: [{ field: 'new_password', message: 'Mínimo 6 caracteres' }]
      });
    }

    // ✅ Buscar usuario en DB
    const user = await User.findOne({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // ✅ Hashear nueva contraseña
    const password_hash = await bcrypt.hash(password, 12);

    // ✅ Actualizar contraseña en DB
    await user.update({
      password_hash,
      password_changed_at: new Date()
    });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error reseteando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

---

## 📊 Comparación Antes vs Después

| Función | ❌ Antes (Mock) | ✅ Después (DB Real) |
|---------|----------------|---------------------|
| **getUsers()** | `[...mockUsers]` | `User.findAndCountAll({ where: { deleted_at: null } })` |
| **getUserById()** | `mockUsers.find()` | `User.findOne({ where: { id, deleted_at: null } })` |
| **createUser()** | `mockUsers.push()` | `User.create()` + `bcrypt.hash()` |
| **updateUser()** | `mockUsers[index] = {...}` | `user.update(updates)` |
| **deleteUser()** | `mockUsers[index].deleted_at = ...` | `user.update({ deleted_at: new Date() })` |
| **resetPassword()** | `mockUsers[index].password = ...` | `user.update({ password_hash: bcrypt.hash() })` |

---

## 🎯 Características Clave del Fix

### **1. Soft Delete Correcto**
```javascript
// ✅ Marcar como eliminado sin borrar físicamente
await user.update({
  deleted_at: new Date(),
  is_active: false
});
```

### **2. Filtro Consistente en Todas las Consultas**
```javascript
// ✅ SIEMPRE filtrar usuarios eliminados
where: {
  id,
  deleted_at: null // 🔥 Crucial
}
```

### **3. Relaciones con Sequelize**
```javascript
// ✅ Incluir información del rol
include: [
  {
    model: Role,
    as: 'role',
    attributes: ['id', 'name']
  }
]
```

### **4. Excluir Campos Sensibles**
```javascript
// ✅ No exponer contraseñas o tokens
attributes: {
  exclude: ['password_hash', 'password_reset_token', 'password_reset_expires']
}
```

### **5. Seguridad con Bcrypt**
```javascript
// ✅ Hashear contraseñas con 12 rounds
const password_hash = await bcrypt.hash(password, 12);
```

---

## 🧪 Pruebas de Verificación

### **Test 1: Listar Usuarios**
```bash
1. GET /users
2. ✅ Debe retornar solo usuarios con deleted_at = null
3. ✅ NO debe aparecer usuario eliminado previamente
```

### **Test 2: Eliminar Usuario**
```bash
1. DELETE /users/4
2. ✅ Respuesta 200 con success: true
3. ✅ Usuario marcado con deleted_at en DB
4. ✅ is_active cambiado a false
5. GET /users
6. ✅ Usuario NO aparece en la lista
```

### **Test 3: Crear Usuario**
```bash
1. POST /users con datos válidos
2. ✅ Usuario insertado en DB con password hasheado
3. GET /users
4. ✅ Nuevo usuario aparece en la lista
```

### **Test 4: Resetear Contraseña**
```bash
1. POST /users/2/reset-password con { new_password: "newpass123" }
2. ✅ password_hash actualizado en DB con bcrypt
3. ✅ password_changed_at actualizado
```

### **Test 5: Reinicio del Servidor**
```bash
1. Eliminar usuario
2. Reiniciar backend
3. GET /users
4. ✅ Usuario eliminado NO reaparece (datos persistidos en DB)
```

---

## 📁 Archivos Modificados

- ✅ `/MAC/mac-tickets-api/src/controllers/userController.js` (434 líneas)
  - Agregado: Imports de User, Role, Op, bcrypt
  - Removido: mockUsers array
  - Actualizado: getUsers, getUserById, createUser, updateUser, deleteUser, resetPassword

---

## 🚀 Impacto del Fix

### **Antes:**
- ❌ Datos en memoria (mockUsers)
- ❌ Se pierden al reiniciar servidor
- ❌ Usuarios eliminados reaparecen
- ❌ No persistencia real
- ❌ Sin validaciones de duplicados

### **Después:**
- ✅ Consultas reales a MySQL via Sequelize
- ✅ Persistencia permanente
- ✅ Soft delete correcto con `deleted_at`
- ✅ Validaciones contra DB (duplicados)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Relaciones User-Role cargadas correctamente

---

## 🎓 Lecciones Aprendidas

### **1. Mock Data vs Real DB**
- **Mock data es solo para desarrollo inicial**
- **Siempre migrar a DB real antes de testing funcional**
- **Los datos en memoria no persisten entre reinicios**

### **2. Soft Delete Pattern**
```javascript
// ✅ Correcto: Filtrar deleted_at en TODAS las consultas
where: { deleted_at: null }

// ❌ Incorrecto: Olvidar el filtro en alguna consulta
where: { id } // ⚠️ Puede retornar usuarios eliminados
```

### **3. Sequelize Best Practices**
- **Usar `include` para relaciones**
- **Usar `attributes.exclude` para datos sensibles**
- **Usar `Op.or`, `Op.like` para búsquedas complejas**
- **Usar transacciones para operaciones críticas**

---

## 📝 Conclusión

El bug fue causado por usar datos mock en lugar de consultar la base de datos real. El fix consistió en:

1. ✅ Remover `mockUsers` array
2. ✅ Importar modelos de Sequelize (User, Role)
3. ✅ Actualizar todas las funciones para usar queries de Sequelize
4. ✅ Implementar filtro `deleted_at: null` en todas las consultas
5. ✅ Agregar validaciones contra DB (duplicados, roles válidos)
6. ✅ Implementar soft delete correcto con `user.update()`

**Resultado:** Sistema de gestión de usuarios 100% funcional con persistencia real en la base de datos. Los usuarios eliminados ya no reaparecen.

---

**Status:** ✅ **RESUELTO** - Backend ahora usa base de datos real para todas las operaciones CRUD.

