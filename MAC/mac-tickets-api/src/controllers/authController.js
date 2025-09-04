// /controllers/authController.js - Controlador de Autenticación

// Función temporal de login hasta que implementemos los modelos
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Credenciales de demo (temporal)
    if (email === 'admin@tuempresa.com' && password === 'admin123') {
      // Usuario demo
      const user = {
        id: 1,
        username: 'admin',
        email: 'admin@tuempresa.com',
        first_name: 'Super',
        last_name: 'Admin',
        role_id: 1,
        role: 'admin'
      };

      // Token temporal generado dinámicamente
      const token = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          user,
          token,
          refresh_token: refreshToken
        }
      });
    }

    // Credenciales inválidas
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función temporal para obtener perfil
const getProfile = async (req, res) => {
  try {
    // Usuario demo temporal
    const user = {
      id: 1,
      username: 'admin',
      email: 'admin@tuempresa.com',
      first_name: 'Super',
      last_name: 'Admin',
      role_id: 1,
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: user
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función temporal de logout
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export {
  login,
  getProfile,
  logout
};
