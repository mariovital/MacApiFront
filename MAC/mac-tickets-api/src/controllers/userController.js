// /controllers/userController.js - Controlador de Usuarios

// Datos mock para desarrollo (reemplazar con base de datos real)
const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@tuempresa.com",
    first_name: "Super",
    last_name: "Admin",
    role_id: 1,
    role: "admin",
    is_active: true,
    created_at: "2024-01-01T08:00:00.000Z",
    updated_at: "2024-01-01T08:00:00.000Z",
    last_login: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    username: "jtecnico",
    email: "juan.tecnico@tuempresa.com",
    first_name: "Juan",
    last_name: "Técnico",
    role_id: 2,
    role: "tecnico",
    is_active: true,
    created_at: "2024-01-01T09:00:00.000Z",
    updated_at: "2024-01-01T09:00:00.000Z",
    last_login: "2024-01-15T09:15:00.000Z"
  },
  {
    id: 3,
    username: "mmesa",
    email: "maria.mesa@tuempresa.com",
    first_name: "María",
    last_name: "Mesa",
    role_id: 3,
    role: "mesa_trabajo",
    is_active: true,
    created_at: "2024-01-01T09:30:00.000Z",
    updated_at: "2024-01-01T09:30:00.000Z",
    last_login: "2024-01-15T08:45:00.000Z"
  }
];

// GET /users - Obtener lista de usuarios
export const getUsers = async (req, res) => {
  try {
    console.log('🔍 GET /users - Usuario solicitante:', req.user);

    // Verificar que el usuario es admin (más adelante implementaremos el middleware)
    // if (req.user && req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Permisos insuficientes',
    //     code: 'INSUFFICIENT_PERMISSIONS'
    //   });
    // }

    // Obtener parámetros de query
    const {
      page = 1,
      limit = 20,
      role,
      search,
      is_active
    } = req.query;

    let filteredUsers = [...mockUsers];

    // Aplicar filtros
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    }

    if (is_active !== undefined) {
      const isActiveBoolean = is_active === 'true';
      filteredUsers = filteredUsers.filter(user => user.is_active === isActiveBoolean);
    }

    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const paginatedUsers = filteredUsers.slice(offset, offset + limitNum);

    // Remover información sensible
    const safeUsers = paginatedUsers.map(user => {
      const { password_hash, password_reset_token, ...safeUser } = user;
      return safeUser;
    });

    // Respuesta con paginación
    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: {
        items: safeUsers,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredUsers.length,
          pages: Math.ceil(filteredUsers.length / limitNum)
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

// GET /users/:id - Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Buscar usuario
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Remover información sensible
    const { password_hash, password_reset_token, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: safeUser
    });

  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /users - Crear nuevo usuario
export const createUser = async (req, res) => {
  try {
    console.log('🆕 POST /users - Creando usuario:', req.body);

    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role_id
    } = req.body;

    // Validaciones básicas
    if (!username || !email || !password || !first_name || !last_name || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
        errors: [
          { field: 'username', message: 'Username es requerido' },
          { field: 'email', message: 'Email es requerido' },
          { field: 'password', message: 'Password es requerido' },
          { field: 'first_name', message: 'Nombre es requerido' },
          { field: 'last_name', message: 'Apellido es requerido' },
          { field: 'role_id', message: 'Rol es requerido' }
        ].filter(error => !req.body[error.field.replace('_', '')] && !req.body[error.field])
      });
    }

    // Verificar que no exista usuario con el mismo email/username
    const existingUser = mockUsers.find(u => 
      u.email === email || u.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Usuario ya existe',
        code: 'USER_ALREADY_EXISTS'
      });
    }

    // Mapear role_id a role name
    const roleMap = { 1: 'admin', 2: 'tecnico', 3: 'mesa_trabajo' };
    const role = roleMap[role_id];

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido',
        code: 'INVALID_ROLE'
      });
    }

    // Crear nuevo usuario
    const newUser = {
      id: mockUsers.length + 1,
      username,
      email,
      first_name,
      last_name,
      role_id,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null
    };

    // Agregar a la lista mock
    mockUsers.push(newUser);

    console.log('✅ Usuario creado exitosamente:', newUser.id);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /users/:id - Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    console.log('📝 PUT /users/:id - Actualizando usuario:', userId, req.body);

    // Buscar usuario
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Campos permitidos para actualizar
    const allowedFields = ['first_name', 'last_name', 'email', 'is_active', 'role_id'];
    const updates = {};

    // Filtrar solo campos permitidos
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Si se actualiza role_id, actualizar también role
    if (updates.role_id) {
      const roleMap = { 1: 'admin', 2: 'tecnico', 3: 'mesa_trabajo' };
      updates.role = roleMap[updates.role_id];
    }

    // Actualizar usuario
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    console.log('✅ Usuario actualizado exitosamente:', userId);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: mockUsers[userIndex]
    });

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE /users/:id - Eliminar usuario (soft delete)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    console.log('🗑️ DELETE /users/:id - Eliminando usuario:', userId);

    // No permitir eliminar admin principal
    if (userId === 1) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el usuario administrador principal',
        code: 'CANNOT_DELETE_MAIN_ADMIN'
      });
    }

    // Buscar usuario
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Soft delete - marcar como inactivo
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      is_active: false,
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('✅ Usuario eliminado exitosamente:', userId);

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

// POST /users/:id/reset-password - Resetear contraseña
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const userId = parseInt(id);

    console.log('🔑 POST /users/:id/reset-password - Reseteando contraseña:', userId);

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Nueva contraseña es requerida',
        errors: [{ field: 'newPassword', message: 'Nueva contraseña es requerida' }]
      });
    }

    // Buscar usuario
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // En un entorno real, aquí se hashearia la contraseña
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      password_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('✅ Contraseña reseteada exitosamente para usuario:', userId);

    res.json({
      success: true,
      message: 'Contraseña reseteada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error reseteando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
