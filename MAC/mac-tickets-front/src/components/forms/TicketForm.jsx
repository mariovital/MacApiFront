// /components/forms/TicketForm.jsx - Formulario para crear/editar tickets

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Divider,
  FormHelperText
} from '@mui/material';
import { FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import catalogService from '../../services/catalogService';

const TicketForm = ({ onSubmit, onCancel, initialData = null, isLoading = false }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    priority_id: '',
    client_company: '',
    client_contact: '',
    client_email: '',
    client_phone: '',
    location: ''
  });

  // Catálogos
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  
  // Validación y errores
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  // Cargar catálogos al montar el componente
  useEffect(() => {
    loadCatalogs();
  }, []);

  // Cargar datos iniciales si existen (modo edición)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        priority_id: initialData.priority_id || '',
        client_company: initialData.client_company || '',
        client_contact: initialData.client_contact || '',
        client_email: initialData.client_email || '',
        client_phone: initialData.client_phone || '',
        location: initialData.location || ''
      });
    }
  }, [initialData]);

  const loadCatalogs = async () => {
    try {
      setLoadingCatalogs(true);
      const [categoriesRes, prioritiesRes] = await Promise.all([
        catalogService.getCategories(),
        catalogService.getPriorities()
      ]);
      
      setCategories(categoriesRes.data || []);
      setPriorities(prioritiesRes.data || []);
    } catch (error) {
      console.error('Error cargando catálogos:', error);
      setFormError('Error al cargar los datos del formulario. Intenta de nuevo.');
    } finally {
      setLoadingCatalogs(false);
    }
  };

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
    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Selecciona una categoría';
    }

    if (!formData.priority_id) {
      newErrors.priority_id = 'Selecciona una prioridad';
    }

    if (!formData.client_company || formData.client_company.trim().length < 3) {
      newErrors.client_company = 'Ingresa el nombre de la empresa';
    }

    if (!formData.client_contact || formData.client_contact.trim().length < 3) {
      newErrors.client_contact = 'Ingresa el nombre del contacto';
    }

    // Validación de email (opcional, pero si se ingresa debe ser válido)
    if (formData.client_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.client_email)) {
        newErrors.client_email = 'Ingresa un email válido';
      }
    }

    // Validación de teléfono (opcional, pero si se ingresa debe ser válido)
    if (formData.client_phone) {
      const phoneRegex = /^\d{8,}$/; // Al menos 8 dígitos
      if (!phoneRegex.test(formData.client_phone.replace(/[\s-]/g, ''))) {
        newErrors.client_phone = 'Ingresa un teléfono válido (mínimo 8 dígitos)';
      }
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
      await onSubmit(formData);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Error al guardar el ticket');
    }
  };

  if (loadingCatalogs) {
    return (
      <div className="flex items-center justify-center py-12">
        <CircularProgress sx={{ color: '#E31E24' }} />
        <Typography className="ml-4 text-gray-600 dark:text-gray-400">Cargando formulario...</Typography>
      </div>
    );
  }

  return (
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

      {/* Información del Ticket */}
      <div>
        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
          Información del Ticket
        </Typography>
        
        <div className="space-y-4">
          {/* Título */}
          <TextField
            fullWidth
            label="Título del ticket"
            value={formData.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            required
            placeholder="Ej: Problema con impresora HP LaserJet"
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

          {/* Descripción */}
          <TextField
            fullWidth
            label="Descripción detallada"
            value={formData.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            required
            multiline
            rows={4}
            placeholder="Describe el problema con el mayor detalle posible..."
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

          {/* Categoría y Prioridad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl 
              fullWidth 
              error={!!errors.category_id}
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
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.category_id}
                onChange={handleChange('category_id')}
                label="Categoría"
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
                  <em>Selecciona una categoría</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && (
                <FormHelperText>{errors.category_id}</FormHelperText>
              )}
            </FormControl>

            <FormControl 
              fullWidth 
              error={!!errors.priority_id}
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
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={formData.priority_id}
                onChange={handleChange('priority_id')}
                label="Prioridad"
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
                  <em>Selecciona una prioridad</em>
                </MenuItem>
                {priorities.map((priority) => (
                  <MenuItem key={priority.id} value={priority.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: priority.color }}
                      />
                      <span>{priority.name}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
              {errors.priority_id && (
                <FormHelperText>{errors.priority_id}</FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
      </div>

      <Divider className="dark:border-gray-700" />

      {/* Información del Cliente */}
      <div>
        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
          Información del Cliente
        </Typography>
        
        <div className="space-y-4">
          {/* Empresa y Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Empresa"
              value={formData.client_company}
              onChange={handleChange('client_company')}
              error={!!errors.client_company}
              helperText={errors.client_company}
              required
              placeholder="Nombre de la empresa"
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
              label="Nombre del contacto"
              value={formData.client_contact}
              onChange={handleChange('client_contact')}
              error={!!errors.client_contact}
              helperText={errors.client_contact}
              required
              placeholder="Juan Pérez"
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

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.client_email}
              onChange={handleChange('client_email')}
              error={!!errors.client_email}
              helperText={errors.client_email || 'Opcional'}
              placeholder="correo@empresa.com"
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
              label="Teléfono"
              type="tel"
              value={formData.client_phone}
              onChange={handleChange('client_phone')}
              error={!!errors.client_phone}
              helperText={errors.client_phone || 'Opcional'}
              placeholder="8888-8888"
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

          {/* Ubicación */}
          <TextField
            fullWidth
            label="Ubicación / Dirección"
            value={formData.location}
            onChange={handleChange('location')}
            placeholder="Ej: San José, Zapote, 200m norte de la Shell"
            multiline
            rows={2}
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

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outlined"
          onClick={onCancel}
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
          {isLoading ? 'Guardando...' : (initialData ? 'Actualizar Ticket' : 'Crear Ticket')}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;

