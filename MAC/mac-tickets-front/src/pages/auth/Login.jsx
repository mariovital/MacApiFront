// /pages/auth/Login.jsx - Login Moderno y Profesional

import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Fade,
  Slide
} from '@mui/material';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight,
  FiShield,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';
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
  const [showContent, setShowContent] = useState(false);

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
    setShowContent(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // 4. EARLY RETURNS
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E31E24] to-[#C41A1F] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  // 5. RENDER LOGIC
  const currentError = error || localError;

  // 6. JSX RETURN - DISEÑO MODERNO
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E31E24] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#E31E24] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenedor principal */}
      <Fade in={showContent} timeout={800}>
        <div className="w-full max-w-6xl relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Lado izquierdo - Branding */}
              <Slide direction="right" in={showContent} timeout={1000}>
                <div className="relative bg-gradient-to-br from-[#E31E24] to-[#C41A1F] p-12 lg:p-16 flex flex-col justify-between min-h-[600px] overflow-hidden">
                  
                  {/* Patrón de fondo */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10">
                    {/* Logo */}
                    <div className="mb-12">
                      <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl transform hover:scale-105 transition-transform p-4">
                        <img 
                          src="/maccomputadoras_logo.png" 
                          alt="MAC Computadoras" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Typography variant="h3" className="text-white font-black mb-2">
                        MAC Computadoras
                      </Typography>
                      <Typography variant="h6" className="text-white/90 font-light">
                        Sistema de Gestión de Tickets
                      </Typography>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <FiShield className="text-white" size={24} />
                        </div>
                        <div>
                          <Typography className="text-white font-semibold text-lg mb-1">
                            Seguro y Confiable
                          </Typography>
                          <Typography className="text-white/80 text-sm">
                            Tus datos protegidos con encriptación de nivel empresarial
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <FiZap className="text-white" size={24} />
                        </div>
                        <div>
                          <Typography className="text-white font-semibold text-lg mb-1">
                            Rápido y Eficiente
                          </Typography>
                          <Typography className="text-white/80 text-sm">
                            Gestiona tickets en tiempo real desde cualquier lugar
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <FiCheckCircle className="text-white" size={24} />
                        </div>
                        <div>
                          <Typography className="text-white font-semibold text-lg mb-1">
                            Fácil de Usar
                          </Typography>
                          <Typography className="text-white/80 text-sm">
                            Interfaz intuitiva diseñada para tu equipo de soporte
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 mt-12">
                    <Typography className="text-white/60 text-sm">
                      © 2025 MAC Computadoras. Todos los derechos reservados.
                    </Typography>
                  </div>

                  {/* Elementos decorativos */}
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>
              </Slide>

              {/* Lado derecho - Formulario */}
              <Slide direction="left" in={showContent} timeout={1000}>
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                  
                  {/* Header del formulario */}
                  <div className="mb-10">
                    <Typography variant="h4" className="font-bold text-gray-900 dark:text-white mb-2">
                      Bienvenido de vuelta
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
                      Ingresa tus credenciales para acceder al sistema
                    </Typography>
                  </div>

                  {/* Error Alert */}
                  {currentError && (
                    <Fade in={true}>
                      <Alert 
                        severity="error" 
                        onClose={() => {
                          setError(null);
                          setLocalError('');
                        }}
                        sx={{ 
                          mb: 3,
                          borderRadius: '12px',
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          '& .MuiAlert-icon': {
                            color: '#DC2626'
                          }
                        }}
                      >
                        {currentError}
                      </Alert>
                    </Fade>
                  )}

                  {/* Formulario */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email */}
                    <div>
                      <Typography variant="body2" className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Correo Electrónico
                      </Typography>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        value={credentials.email}
                        onChange={handleInputChange}
                        placeholder="correo@empresa.com"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FiMail className="text-gray-400" />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(243, 244, 246, 0.5)',
                            '&:hover': {
                              backgroundColor: 'rgba(243, 244, 246, 0.8)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(229, 231, 235, 0.8)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#E31E24',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#E31E24',
                              borderWidth: '2px'
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <Typography variant="body2" className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Contraseña
                      </Typography>
                      <TextField
                        fullWidth
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        required
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
                                sx={{ 
                                  color: '#6B7280',
                                  '&:hover': {
                                    backgroundColor: 'rgba(227, 30, 36, 0.1)',
                                    color: '#E31E24'
                                  }
                                }}
                              >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(243, 244, 246, 0.5)',
                            '&:hover': {
                              backgroundColor: 'rgba(243, 244, 246, 0.8)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(229, 231, 235, 0.8)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#E31E24',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#E31E24',
                              borderWidth: '2px'
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                      <Link 
                        href="#" 
                        underline="hover"
                        sx={{
                          color: '#E31E24',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          '&:hover': {
                            color: '#C41A1F'
                          }
                        }}
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      endIcon={loading ? null : <FiArrowRight />}
                      sx={{
                        backgroundColor: '#E31E24',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '14px 24px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        textTransform: 'none',
                        boxShadow: '0 10px 25px -5px rgba(227, 30, 36, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#C41A1F',
                          boxShadow: '0 15px 35px -5px rgba(227, 30, 36, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        },
                        '&:disabled': {
                          backgroundColor: '#FCA5A5',
                          color: 'white',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Iniciando sesión...</span>
                        </div>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </Button>

                    {/* Demo Credentials Info */}
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <Typography variant="caption" className="text-blue-800 dark:text-blue-300 font-semibold block mb-2">
                        🔑 Credenciales de prueba:
                      </Typography>
                      <div className="space-y-1">
                        <Typography variant="caption" className="text-blue-700 dark:text-blue-400 block font-mono">
                          Email: admin@maccomputadoras.com
                        </Typography>
                        <Typography variant="caption" className="text-blue-700 dark:text-blue-400 block font-mono">
                          Password: demo123
                        </Typography>
                      </div>
                    </div>
                  </form>

                  {/* Footer del formulario */}
                  <div className="mt-8 text-center">
                    <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                      ¿Necesitas ayuda? {' '}
                      <Link 
                        href="#" 
                        underline="hover"
                        sx={{
                          color: '#E31E24',
                          fontWeight: '600',
                          '&:hover': {
                            color: '#C41A1F'
                          }
                        }}
                      >
                        Contacta a soporte
                      </Link>
                    </Typography>
                  </div>
                </div>
              </Slide>
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default Login;