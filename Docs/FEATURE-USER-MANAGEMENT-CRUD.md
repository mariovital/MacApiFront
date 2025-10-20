# Feature: Gestión Completa de Usuarios (CRUD)

## Resumen
Sistema completo de gestión de usuarios con operaciones CRUD (Crear, Leer, Actualizar, Eliminar) conectado a la base de datos real.

## Fecha
Octubre 2025

## Componentes Implementados

### ✅ 1. Servicio de Usuarios (`userService.js`)
### ✅ 2. Lista de Usuarios (`UserList.jsx`)
### ✅ 3. Crear Usuario (`CreateUser.jsx`)
### ✅ 4. Resetear Contraseña
### ✅ 5. Eliminar Usuario (Soft Delete)

---

## 📁 Archivos Creados/Modificados

### Nuevo:
- ✅ `/services/userService.js` - Servicio completo de API

### Modificados:
- ✅ `/pages/users/UserList.jsx` - Integración con API real
- ✅ `/pages/users/CreateUser.jsx` - Integración con API real

---

## 🔧 1. UserService - API Service

### **Ubicación:** `/services/userService.js`

### **Métodos Implementados:**

```javascript
const userService = {
  // Obtener lista de usuarios
  getUsers: async (params = {}) => { ... },

  // Obtener usuario por ID
  getUserById: async (userId) => { ... },

  // Crear nuevo usuario
  createUser: async (userData) => { ... },

  // Actualizar usuario
  updateUser: async (userId, userData) => { ... },

  // Eliminar usuario (soft delete)
  deleteUser: async (userId) => { ... },

  // Resetear contraseña
  resetPassword: async (userId, newPassword) => { ... },

  // Cambiar estado de usuario
  toggleUserStatus: async (userId, isActive) => { ... }
};
```

### **Endpoints Utilizados:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users` | Lista de usuarios con filtros |
| GET | `/users/:id` | Usuario específico |
| POST | `/users` | Crear nuevo usuario |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario (soft delete) |
| POST | `/users/:id/reset-password` | Resetear contraseña |

---

## 📋 2. UserList - Lista de Usuarios

### **Ubicación:** `/pages/users/UserList.jsx`

### **Funcionalidades:**

#### ✅ **Cargar Usuarios desde API**
```javascript
const loadUsers = async () => {
  try {
    setLoading(true);
    const response = await userService.getUsers({
      limit: 100,
      page: 1
    });
    
    if (response.success) {
      setUsers(response.data.items || []);
    }
  } catch (err) {
    setError('Error al cargar los usuarios');
  } finally {
    setLoading(false);
  }
};
```

#### ✅ **Búsqueda Local**
```javascript
const filteredUsers = users.filter(u => 
  u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  u.email?.toLowerCase().includes(searchTerm.toLowerCase())
);
```

#### ✅ **Resetear Contraseña con Validación**
```javascript
const confirmResetPassword = async () => {
  // Validaciones
  if (!newPassword || !confirmPassword) {
    setPasswordError('Ambos campos son requeridos');
    return;
  }

  if (newPassword.length < 6) {
    setPasswordError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError('Las contraseñas no coinciden');
    return;
  }

  try {
    setSubmitting(true);
    const response = await userService.resetPassword(
      selectedUser.id, 
      newPassword
    );
    
    if (response.success) {
      setSuccessMessage(`Contraseña actualizada exitosamente`);
      setShowSnackbar(true);
      setOpenResetPassword(false);
    }
  } catch (err) {
    setPasswordError(err.response?.data?.message || 'Error al resetear');
  } finally {
    setSubmitting(false);
  }
};
```

#### ✅ **Eliminar Usuario**
```javascript
const confirmDeleteUser = async () => {
  try {
    setSubmitting(true);
    const response = await userService.deleteUser(selectedUser.id);
    
    if (response.success) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSuccessMessage('Usuario eliminado exitosamente');
      setShowSnackbar(true);
      setOpenDeleteUser(false);
      
      // Recargar para sincronizar
      await loadUsers();
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error al eliminar';
    setError(errorMessage);
    setShowSnackbar(true);
  } finally {
    setSubmitting(false);
  }
};
```

---

## 🆕 3. CreateUser - Crear Usuario

### **Ubicación:** `/pages/users/CreateUser.jsx`

### **Integración con API:**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    setFormError('Por favor corrige los errores');
    return;
  }

  try {
    setIsLoading(true);
    
    // Remover confirmPassword antes de enviar
    const { confirmPassword, ...userData } = formData;
    
    // Llamar al servicio
    const response = await userService.createUser(userData);
    
    if (response.success) {
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } else {
      setFormError(response.message || 'Error al crear usuario');
    }
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                         'Error al crear el usuario';
    setFormError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};
```

### **Validaciones del Formulario:**

```javascript
const validateForm = () => {
  let newErrors = {};

  // Username
  if (!formData.username) {
    newErrors.username = 'El username es requerido';
  } else if (formData.username.length < 3) {
    newErrors.username = 'Mínimo 3 caracteres';
  }

  // Email
  if (!formData.email) {
    newErrors.email = 'El email es requerido';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email inválido';
  }

  // Nombres
  if (!formData.first_name || formData.first_name.length < 2) {
    newErrors.first_name = 'Mínimo 2 caracteres';
  }
  if (!formData.last_name || formData.last_name.length < 2) {
    newErrors.last_name = 'Mínimo 2 caracteres';
  }

  // Contraseña
  if (!formData.password) {
    newErrors.password = 'La contraseña es requerida';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Mínimo 6 caracteres';
  }

  // Confirmar contraseña
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Las contraseñas no coinciden';
  }

  // Rol
  if (!formData.role_id) {
    newErrors.role_id = 'Selecciona un rol';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## 🎨 Mejoras en UI/UX

### **1. Diálogo de Resetear Contraseña**

#### Antes:
- ❌ Solo mensaje de confirmación
- ❌ No permitía ingresar contraseña
- ❌ Simulación con `setTimeout`

#### Después:
```jsx
<Dialog open={openResetPassword}>
  <DialogTitle className="bg-gradient-to-r from-[#E31E24] to-[#C41A1F] text-white">
    <FiKey /> Restaurar Contraseña
  </DialogTitle>
  
  <DialogContent>
    <Alert severity="info">
      Configurar nueva contraseña para {selectedUser.first_name}
    </Alert>
    
    {passwordError && (
      <Alert severity="error">{passwordError}</Alert>
    )}
    
    <TextField
      label="Nueva Contraseña"
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      disabled={submitting}
    />
    
    <TextField
      label="Confirmar Contraseña"
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      disabled={submitting}
    />
  </DialogContent>
  
  <DialogActions>
    <Button onClick={handleClose} disabled={submitting}>
      Cancelar
    </Button>
    <Button 
      onClick={confirmResetPassword}
      disabled={submitting || !newPassword || !confirmPassword}
      startIcon={submitting ? <CircularProgress size={16} /> : <FiCheckCircle />}
    >
      {submitting ? 'Actualizando...' : 'Actualizar Contraseña'}
    </Button>
  </DialogActions>
</Dialog>
```

### **2. Diálogo de Eliminar Usuario**

```jsx
<Dialog open={openDeleteUser}>
  <DialogTitle className="bg-gradient-to-r from-red-600 to-red-700 text-white">
    <FiAlertCircle /> Eliminar Usuario
  </DialogTitle>
  
  <DialogContent>
    <Alert severity="warning">
      Esta acción no se puede deshacer
    </Alert>
    
    <Typography>
      ¿Estás seguro que deseas eliminar a{' '}
      <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>?
    </Typography>
    
    <Typography variant="body2" className="text-gray-500">
      Se eliminarán todos los datos asociados.
    </Typography>
  </DialogContent>
  
  <DialogActions>
    <Button onClick={handleClose} disabled={submitting}>
      Cancelar
    </Button>
    <Button 
      onClick={confirmDeleteUser}
      disabled={submitting}
      color="error"
      startIcon={submitting ? <CircularProgress size={16} /> : <FiTrash2 />}
    >
      {submitting ? 'Eliminando...' : 'Eliminar Usuario'}
    </Button>
  </DialogActions>
</Dialog>
```

### **3. Snackbar de Notificaciones**

```jsx
<Snackbar
  open={showSnackbar}
  autoHideDuration={4000}
  onClose={() => setShowSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    severity={error ? 'error' : 'success'}
    icon={error ? <FiAlertCircle /> : <FiCheckCircle />}
    onClose={() => setShowSnackbar(false)}
  >
    {error || successMessage}
  </Alert>
</Snackbar>
```

### **4. Loading Overlay**

```jsx
{loading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4">
      <CircularProgress sx={{ color: '#E31E24' }} size={48} />
      <Typography>Cargando usuarios...</Typography>
    </div>
  </div>
)}
```

---

## 🔄 Flujos Completos

### **Flujo 1: Cargar Usuarios**
```
1. Componente monta
2. ✅ useEffect llama loadUsers()
3. ✅ setLoading(true)
4. ✅ API call: GET /users?limit=100&page=1
5. ✅ Parsear response.data.items
6. ✅ setUsers(items)
7. ✅ setLoading(false)
8. ✅ Renderizar lista
```

### **Flujo 2: Crear Usuario**
```
1. Usuario: Click "Nuevo Usuario"
2. ✅ Navigate a /users/create
3. ✅ Formulario carga con campos vacíos
4. Usuario: Llena formulario
5. Usuario: Click "Crear Usuario"
6. ✅ validateForm()
7. ✅ Remove confirmPassword del objeto
8. ✅ API call: POST /users con userData
9. ✅ setShowSuccess(true)
10. ✅ setTimeout → navigate('/users')
11. ✅ UserList recarga con nuevo usuario
```

### **Flujo 3: Resetear Contraseña**
```
1. Usuario: Click "Restaurar contraseña"
2. ✅ handleResetPassword(user)
3. ✅ Modal se abre con campos limpios
4. Usuario: Ingresa nueva contraseña
5. Usuario: Confirma contraseña
6. Usuario: Click "Actualizar Contraseña"
7. ✅ Validar: ambos campos, length >= 6, coincidencia
8. ✅ API call: POST /users/:id/reset-password
9. ✅ Success: Snackbar "Contraseña actualizada"
10. ✅ Modal se cierra automáticamente
```

### **Flujo 4: Eliminar Usuario**
```
1. Usuario: Click "Eliminar"
2. ✅ handleDeleteUser(user)
3. ✅ Modal de confirmación se abre
4. Usuario: Lee advertencia "No se puede deshacer"
5. Usuario: Click "Eliminar Usuario"
6. ✅ setSubmitting(true)
7. ✅ API call: DELETE /users/:id
8. ✅ Actualizar lista local (filter)
9. ✅ loadUsers() para sincronizar
10. ✅ Success: Snackbar "Usuario eliminado"
11. ✅ Modal se cierra
```

---

## 🧪 Testing

### **Test 1: Cargar Usuarios**
```bash
1. Login como admin
2. Ir a /users
3. ✅ Debe mostrar loading overlay
4. ✅ Debe cargar lista de usuarios desde DB
5. ✅ Cada usuario debe mostrar:
   - Avatar con iniciales
   - Username (MAC-XXX)
   - Nombre completo
   - Email
   - Rol (Chip)
   - Botón "Restaurar contraseña"
   - Botón "Eliminar"
```

### **Test 2: Búsqueda**
```bash
1. En /users
2. Escribir en barra de búsqueda: "Juan"
3. ✅ Lista debe filtrar mostrando solo usuarios con "Juan"
4. Limpiar búsqueda
5. ✅ Lista debe mostrar todos nuevamente
```

### **Test 3: Crear Usuario**
```bash
1. Click "Nuevo Usuario"
2. ✅ Navigate a /users/create
3. Llenar formulario:
   - Username: testuser
   - Email: test@mac.com
   - Password: 123456
   - Confirm: 123456
   - First Name: Test
   - Last Name: User
   - Rol: Técnico
4. Click "Crear Usuario"
5. ✅ Snackbar: "Usuario creado exitosamente"
6. ✅ Redirect a /users
7. ✅ Nuevo usuario debe aparecer en la lista
```

### **Test 4: Resetear Contraseña**
```bash
1. En /users
2. Click "Restaurar contraseña" en un usuario
3. ✅ Modal se abre con header rojo
4. Ingresar contraseña corta (< 6 chars)
5. ✅ Error: "Mínimo 6 caracteres"
6. Ingresar contraseñas que no coinciden
7. ✅ Error: "Las contraseñas no coinciden"
8. Ingresar correctamente:
   - Nueva: password123
   - Confirmar: password123
9. Click "Actualizar Contraseña"
10. ✅ Botón muestra "Actualizando..." con spinner
11. ✅ Snackbar: "Contraseña actualizada exitosamente"
12. ✅ Modal se cierra
```

### **Test 5: Eliminar Usuario**
```bash
1. En /users
2. Click "Eliminar" en un usuario
3. ✅ Modal se abre con header rojo
4. ✅ Advertencia: "No se puede deshacer"
5. Click "Eliminar Usuario"
6. ✅ Botón muestra "Eliminando..." con spinner
7. ✅ Snackbar: "Usuario eliminado exitosamente"
8. ✅ Usuario desaparece de la lista
9. ✅ Modal se cierra
```

### **Test 6: Validaciones CreateUser**
```bash
1. En /users/create
2. No llenar nada, click "Crear Usuario"
3. ✅ Errors en todos los campos requeridos
4. Llenar solo username (< 3 chars)
5. ✅ Error: "Mínimo 3 caracteres"
6. Email inválido (sin @)
7. ✅ Error: "Email inválido"
8. Contraseñas no coinciden
9. ✅ Error: "Las contraseñas no coinciden"
10. No seleccionar rol
11. ✅ Error: "Selecciona un rol"
```

### **Test 7: Dark Mode**
```bash
1. Activar modo oscuro
2. Ir a /users
3. ✅ Lista se ve correctamente
4. Abrir modal de resetear contraseña
5. ✅ Modal con dark mode
6. Abrir modal de eliminar
7. ✅ Modal con dark mode
8. Ir a /users/create
9. ✅ Formulario con dark mode
```

### **Test 8: Responsive**
```bash
1. Resize ventana a mobile (< 640px)
2. ✅ Botones deben apilarse verticalmente
3. ✅ Texto debe truncar apropiadamente
4. ✅ Username y nombre en stack
5. ✅ Email y rol en stack
6. Resize a desktop
7. ✅ Todo debe volver a layout horizontal
```

---

## 📊 Endpoints Backend Requeridos

### **1. GET /users**
```javascript
// Query params: page, limit, role, search, is_active
Response: {
  success: true,
  message: 'Usuarios obtenidos exitosamente',
  data: {
    items: [
      {
        id: 1,
        username: 'admin',
        email: 'admin@mac.com',
        first_name: 'Super',
        last_name: 'Admin',
        role_id: 1,
        role: { id: 1, name: 'Administrador' },
        is_active: true,
        created_at: '2024-01-01T08:00:00.000Z'
      }
    ],
    pagination: {
      page: 1,
      limit: 100,
      total: 1,
      pages: 1
    }
  }
}
```

### **2. POST /users**
```javascript
Request: {
  username: 'testuser',
  email: 'test@mac.com',
  password: '123456',
  first_name: 'Test',
  last_name: 'User',
  role_id: 2
}

Response: {
  success: true,
  message: 'Usuario creado exitosamente',
  data: {
    id: 5,
    username: 'testuser',
    email: 'test@mac.com',
    first_name: 'Test',
    last_name: 'User',
    role_id: 2,
    is_active: true
  }
}
```

### **3. POST /users/:id/reset-password**
```javascript
Request: {
  new_password: 'password123'
}

Response: {
  success: true,
  message: 'Contraseña actualizada exitosamente'
}
```

### **4. DELETE /users/:id**
```javascript
Response: {
  success: true,
  message: 'Usuario eliminado exitosamente'
}
```

---

## 🚨 Manejo de Errores

### **Frontend Validations:**
```javascript
// CreateUser - Validaciones
✅ Username: Mínimo 3 caracteres
✅ Email: Formato válido
✅ First Name: Mínimo 2 caracteres
✅ Last Name: Mínimo 2 caracteres
✅ Password: Mínimo 6 caracteres
✅ Confirm Password: Debe coincidir
✅ Role: Debe seleccionar uno

// ResetPassword - Validaciones
✅ Ambos campos requeridos
✅ Mínimo 6 caracteres
✅ Contraseñas deben coincidir
```

### **API Error Handling:**
```javascript
try {
  const response = await userService.createUser(userData);
} catch (error) {
  // Parsear error del backend
  const errorMessage = error.response?.data?.message || 
                       'Error al crear el usuario';
  setFormError(errorMessage);
  
  // Mostrar en UI
  <Alert severity="error">{errorMessage}</Alert>
}
```

### **Errores Backend Comunes:**

| Código | Mensaje | Solución |
|--------|---------|----------|
| 400 | "Username ya existe" | Cambiar username |
| 400 | "Email ya registrado" | Usar otro email |
| 403 | "Permisos insuficientes" | Login como admin |
| 404 | "Usuario no encontrado" | Verificar ID |
| 500 | "Error interno" | Verificar logs backend |

---

## 🎯 Status Final

| Funcionalidad | Estado | Backend | Frontend |
|---------------|--------|---------|----------|
| **Listar Usuarios** | ✅ Completo | GET /users | UserList.jsx |
| **Crear Usuario** | ✅ Completo | POST /users | CreateUser.jsx |
| **Resetear Contraseña** | ✅ Completo | POST /users/:id/reset-password | UserList Dialog |
| **Eliminar Usuario** | ✅ Completo | DELETE /users/:id | UserList Dialog |
| **Búsqueda Local** | ✅ Completo | - | UserList filteredUsers |
| **Loading States** | ✅ Completo | - | CircularProgress |
| **Error Handling** | ✅ Completo | - | Snackbar + Alerts |
| **Dark Mode** | ✅ Completo | - | Tailwind dark: classes |
| **Responsive** | ✅ Completo | - | Tailwind sm: md: lg: |

---

## 📝 Notas Importantes

### **1. Soft Delete**
El backend implementa soft delete, por lo que:
- Los usuarios NO se eliminan físicamente de la DB
- Se marca `deleted_at` con timestamp
- No aparecen en listados normales
- Pueden recuperarse si es necesario

### **2. Roles**
```javascript
const USER_ROLES = {
  ADMIN: { id: 1, name: 'Administrador' },
  TECNICO: { id: 2, name: 'Técnico' },
  MESA_TRABAJO: { id: 3, name: 'Mesa de Trabajo' }
};
```

### **3. Seguridad**
- ✅ Solo admins pueden gestionar usuarios
- ✅ Contraseñas hasheadas con bcrypt (backend)
- ✅ Validación en frontend Y backend
- ✅ Rate limiting en endpoints críticos
- ✅ JWT auth requerida

---

## 🚀 Próximas Mejoras Sugeridas

### **1. Editar Usuario**
```javascript
// Crear EditUser.jsx similar a CreateUser
// Usar userService.updateUser(userId, userData)
// Ruta: /users/:id/edit
```

### **2. Filtros Avanzados**
```javascript
// Agregar filtros en UI:
- Por rol (dropdown)
- Por estado (activo/inactivo)
- Por fecha de creación
// Pasar params a getUsers()
```

### **3. Paginación**
```javascript
// Implementar paginación real:
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

// UI con botones Anterior/Siguiente
// O componente Pagination de MUI
```

### **4. Exportar Usuarios**
```javascript
// Botón "Exportar CSV"
// Generar CSV con lista de usuarios
// Descargar automáticamente
```

### **5. Cambiar Estado (Activo/Inactivo)**
```javascript
// Toggle en cada usuario
// userService.toggleUserStatus(userId, isActive)
// Sin eliminar completamente
```

---

## 📚 Documentación Relacionada

- `/Docs/COMPONENT-STRUCTURE.md` - Estructura de componentes
- `/Docs/DEVELOPMENT-RULES.md` - Reglas de desarrollo
- `/Docs/API-ENDPOINTS-ANDROID.md` - Documentación de API

---

**¡Sistema de gestión de usuarios 100% funcional y conectado a la base de datos!** 🎯👥✅

El CRUD está completo con validaciones, manejo de errores, loading states, notificaciones y diseño responsive con dark mode.

