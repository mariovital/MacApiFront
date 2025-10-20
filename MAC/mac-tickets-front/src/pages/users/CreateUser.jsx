// /pages/users/CreateUser.jsx - Página para crear nuevo usuario

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { FiCheckCircle, FiArrowLeft, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const CreateUser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role_id: ''
  });

  const [errors, setErrors] = useState({});

  // Roles disponibles
  const roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Técnico' },
    { id: 3, name: 'Mesa de Trabajo' }
  ];

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Ingresa un email válido';
      }
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.first_name || formData.first_name.trim().length < 2) {
      newErrors.first_name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.last_name || formData.last_name.trim().length < 2) {
      newErrors.last_name = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Selecciona un rol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      setFormError('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setIsLoading(true);
      
      // Preparar datos para enviar (sin confirmPassword)
      const { confirmPassword, ...userData } = formData;
      
      // Llamar al servicio para crear usuario
      const response = await userService.createUser(userData);
      
      if (response.success) {
        // Mostrar mensaje de éxito
        setShowSuccess(true);
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          navigate('/users');
        }, 1500);
      } else {
        setFormError(response.message || 'Error al crear el usuario');
      }
      
    } catch (error) {
      console.error('Error creando usuario:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el usuario';
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Header estilo Figma */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              Nuevo Usuario<span className="text-[#E31E24]">.</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Completa el formulario para crear un nuevo usuario
            </Typography>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6 max-w-4xl mx-auto">
        <Card 
          className="shadow-lg dark:bg-gray-800"
          sx={{ borderRadius: '16px' }}
        >
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error general */}
              {formError && (
                <Alert 
                  severity="error" 
                  icon={<FiAlertCircle />}
                  onClose={() => setFormError('')}
                  sx={{ 
                    borderRadius: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444'
                  }}
                >
                  {formError}
                </Alert>
              )}

              {/* Información básica */}
              <div>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Información Básica
                </Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.first_name}
                    onChange={handleChange('first_name')}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    required
                    placeholder="Juan"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        '& fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.3)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E31E24'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(156, 163, 175, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#E31E24'
                      },
                      '& .MuiInputBase-input': {
                        color: 'inherit'
                      }
                    }}
                  />

                  {/* Apellido */}
                  <TextField
                    fullWidth
                    label="Apellido"
                    value={formData.last_name}
                    onChange={handleChange('last_name')}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    required
                    placeholder="Pérez"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        '& fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.3)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E31E24'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(156, 163, 175, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#E31E24'
                      },
                      '& .MuiInputBase-input': {
                        color: 'inherit'
                      }
                    }}
                  />
                </div>
              </div>

              {/* Credenciales */}
              <div>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Credenciales de Acceso
                </Typography>
                
                <div className="space-y-4">
                  {/* Username */}
                  <TextField
                    fullWidth
                    label="Nombre de usuario"
                    value={formData.username}
                    onChange={handleChange('username')}
                    error={!!errors.username}
                    helperText={errors.username || 'Ejemplo: MAC-005'}
                    required
                    placeholder="MAC-005"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        '& fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.3)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E31E24'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(156, 163, 175, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#E31E24'
                      },
                      '& .MuiInputBase-input': {
                        color: 'inherit'
                      }
                    }}
                  />

                  {/* Email */}
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    placeholder="usuario@maccomputadoras.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        '& fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.3)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(156, 163, 175, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E31E24'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(156, 163, 175, 0.7)'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#E31E24'
                      },
                      '& .MuiInputBase-input': {
                        color: 'inherit'
                      }
                    }}
                  />

                  {/* Contraseñas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      fullWidth
                      label="Contraseña"
                      type="password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      error={!!errors.password}
                      helperText={errors.password || 'Mínimo 6 caracteres'}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: 'rgba(156, 163, 175, 0.3)'
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(156, 163, 175, 0.5)'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#E31E24'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(156, 163, 175, 0.7)'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#E31E24'
                        },
                        '& .MuiInputBase-input': {
                          color: 'inherit'
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Confirmar contraseña"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: 'rgba(156, 163, 175, 0.3)'
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(156, 163, 175, 0.5)'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#E31E24'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(156, 163, 175, 0.7)'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#E31E24'
                        },
                        '& .MuiInputBase-input': {
                          color: 'inherit'
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Rol */}
              <div>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Rol y Permisos
                </Typography>
                
                <FormControl 
                  fullWidth 
                  error={!!errors.role_id}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'transparent',
                      '& fieldset': {
                        borderColor: 'rgba(156, 163, 175, 0.3)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(156, 163, 175, 0.5)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#E31E24'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(156, 163, 175, 0.7)'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#E31E24'
                    },
                    '& .MuiSelect-select': {
                      color: 'inherit'
                    }
                  }}
                >
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={formData.role_id}
                    onChange={handleChange('role_id')}
                    label="Rol"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'background.paper',
                          '& .MuiMenuItem-root': {
                            color: 'text.primary'
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Selecciona un rol</em>
                    </MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role_id && (
                    <FormHelperText>{errors.role_id}</FormHelperText>
                  )}
                </FormControl>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isLoading}
                  startIcon={<FiX />}
                  sx={{
                    borderColor: 'rgba(156, 163, 175, 0.3)',
                    color: 'inherit',
                    borderRadius: '12px',
                    textTransform: 'none',
                    padding: '10px 24px',
                    fontWeight: '600',
                    '&:hover': {
                      borderColor: 'rgba(156, 163, 175, 0.5)',
                      backgroundColor: 'rgba(156, 163, 175, 0.1)'
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <FiSave />}
                  sx={{
                    backgroundColor: '#E31E24',
                    color: 'white',
                    borderRadius: '12px',
                    textTransform: 'none',
                    padding: '10px 24px',
                    fontWeight: '600',
                    '&:hover': {
                      backgroundColor: '#C41A1F'
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(227, 30, 36, 0.5)',
                      color: 'white'
                    }
                  }}
                >
                  {isLoading ? 'Creando...' : 'Crear Usuario'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Snackbar de éxito */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          icon={<FiCheckCircle />}
          onClose={() => setShowSuccess(false)}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              color: '#10B981'
            }
          }}
        >
          ¡Usuario creado exitosamente! Redirigiendo...
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateUser;

