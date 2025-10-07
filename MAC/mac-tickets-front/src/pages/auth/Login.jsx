// /pages/auth/Login.jsx - Página de Login (Diseño Figma)

import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. HOOKS
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
    
    if (error) setError(null);
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    } catch (loginError) {
      console.error('Error en login:', loginError);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // 3. EFFECTS
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // 4. EARLY RETURNS
  if (isAuthenticated) {
    return <div className="p-4">Redirigiendo...</div>;
  }

  // 5. RENDER LOGIC
  const currentError = error || localError;

  // 6. JSX RETURN - DISEÑO FIGMA
  return (
    <div className="min-h-screen bg-[#E31E24] flex items-center justify-center p-4 md:p-8">
      {/* Contenedor principal con fondo blanco en los bordes */}
      <div className="w-full max-w-[500px] bg-white rounded-[40px] p-8 md:p-12 shadow-2xl">
        
        {/* Contenedor interior con fondo rojo */}
        <div className="bg-[#E31E24] rounded-[32px] px-6 py-10 md:px-10 md:py-12">
          
          {/* Logo MAC Computadoras */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="text-white">
                <svg 
                  width="200" 
                  height="80" 
                  viewBox="0 0 200 80" 
                  className="mx-auto"
                >
                  {/* Logo simplificado MAC */}
                  <text 
                    x="100" 
                    y="40" 
                    fontSize="48" 
                    fontWeight="bold" 
                    fill="white" 
                    textAnchor="middle" 
                    fontFamily="Arial, sans-serif"
                    letterSpacing="4"
                  >
                    MAC
                  </text>
                  <text 
                    x="100" 
                    y="65" 
                    fontSize="14" 
                    fill="white" 
                    textAnchor="middle" 
                    fontFamily="Arial, sans-serif"
                    letterSpacing="2"
                  >
                    COMPUTADORAS
                  </text>
                  {/* Líneas decorativas */}
                  <line x1="20" y1="45" x2="50" y2="45" stroke="white" strokeWidth="2"/>
                  <line x1="150" y1="45" x2="180" y2="45" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {currentError && (
            <Alert 
              severity="error" 
              className="mb-6 bg-white/90 backdrop-blur-sm"
              sx={{
                borderRadius: '12px',
                '& .MuiAlert-message': {
                  color: '#E31E24'
                }
              }}
            >
              {currentError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Correo */}
            <div>
              <Typography 
                variant="body2" 
                className="text-white font-medium mb-2 text-sm"
              >
                Correo
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="tucorreo@correo.com"
                value={credentials.email}
                onChange={handleInputChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiMail className="text-gray-500" />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                    fontSize: '14px',
                    height: '50px'
                  }
                }}
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <Typography 
                variant="body2" 
                className="text-white font-medium mb-2 text-sm"
              >
                Contraseña
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleInputChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiLock className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                        sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                    fontSize: '14px',
                    height: '50px'
                  }
                }}
              />
            </div>

            {/* Link Olvidaste Contraseña */}
            <div className="text-center">
              <Link
                href="#"
                underline="always"
                className="text-white text-sm font-medium hover:opacity-80 transition-opacity"
                sx={{
                  color: 'white',
                  textDecorationColor: 'white'
                }}
              >
                ¿Olvidaste tu Contraseña?
              </Link>
            </div>

            {/* Botón Iniciar Sesión */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                backgroundColor: '#4A5568',
                color: 'white',
                borderRadius: '12px',
                height: '52px',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  backgroundColor: '#2D3748',
                },
                '&:disabled': {
                  backgroundColor: '#718096',
                  color: 'white'
                }
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;