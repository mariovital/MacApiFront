// /pages/auth/Login.jsx - Página de Login

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton 
} from '@mui/material';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. HOOKS - Siempre en este orden
  const { login, loading, error, isAuthenticated, setError } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // 2. FUNCIONES DE EVENTO
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (error) setError(null);
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!credentials.email || !credentials.password) {
      setLocalError('Por favor complete todos los campos');
      return;
    }

    if (credentials.email.length < 3) {
      setLocalError('El email debe tener al menos 3 caracteres');
      return;
    }

    try {
      await login(credentials);
      // Si el login es exitoso, se redirigirá automáticamente
    } catch (loginError) {
      // El error ya se maneja en el AuthContext
      console.error('Error en login:', loginError);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // 3. EFFECTS - Siempre al final de hooks
  useEffect(() => {
    // Redirigir si ya está autenticado
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // 4. EARLY RETURNS - Validaciones y loading states
  if (isAuthenticated) {
    return <div className="p-4">Redirigiendo...</div>;
  }

  // 5. RENDER LOGIC - Variables para el render
  const currentError = error || localError;

  // 6. JSX RETURN
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <FiUser className="text-2xl text-white" />
          </div>
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white mb-2">
            MAC Computadoras
          </Typography>
          <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
            Sistema de Gestión de Tickets
          </Typography>
        </div>

        {/* Formulario de Login */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <Typography variant="h5" className="font-semibold text-center mb-6 dark:text-white">
              Iniciar Sesión
            </Typography>

            {/* Error Alert */}
            {currentError && (
              <Alert severity="error" className="mb-6">
                {currentError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Usuario o Email"
                value={credentials.email}
                onChange={handleInputChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiUser className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className="bg-white dark:bg-gray-800"
              />

              {/* Campo Password */}
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                value={credentials.password}
                onChange={handleInputChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiLock className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="bg-white dark:bg-gray-800"
              />

              {/* Botón de Login */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 py-3 text-lg font-medium"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Credenciales de Demo */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Typography variant="body2" className="text-gray-600 dark:text-gray-300 text-center mb-2">
                <strong>Credenciales de Demo:</strong>
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-300 text-center">
                Email: admin@tuempresa.com<br />
                Contraseña: admin123
              </Typography>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography variant="body2" className="text-center text-gray-500 mt-6">
          © 2024 MAC Computadoras. Todos los derechos reservados.
        </Typography>
      </div>
    </div>
  );
};

export default Login;
