// /pages/users/UserList.jsx - Vista de Usuarios según Figma

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiKey, FiUser, FiMail, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const UserList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Cargar usuarios desde la API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers({
        limit: 100,
        page: 1
      });

      if (response.success) {
        setUsers(response.data.items || []);
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar los usuarios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (userToReset) => {
    setSelectedUser(userToReset);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setOpenResetPassword(true);
  };

  const handleDeleteUser = (userToDelete) => {
    setSelectedUser(userToDelete);
    setOpenDeleteUser(true);
  };

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
      const response = await userService.resetPassword(selectedUser.id, newPassword);
      
      if (response.success) {
        setSuccessMessage(`Contraseña de ${selectedUser.first_name} ${selectedUser.last_name} actualizada exitosamente`);
        setShowSnackbar(true);
        setOpenResetPassword(false);
        setSelectedUser(null);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      }
    } catch (err) {
      console.error('Error reseteando contraseña:', err);
      setPasswordError(err.response?.data?.message || 'Error al resetear contraseña');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteUser = async () => {
    try {
      setSubmitting(true);
      const response = await userService.deleteUser(selectedUser.id);
      
      if (response.success) {
        // Actualizar la lista local
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setSuccessMessage(`Usuario ${selectedUser.first_name} ${selectedUser.last_name} eliminado exitosamente`);
        setShowSnackbar(true);
        setOpenDeleteUser(false);
        setSelectedUser(null);
        
        // Recargar lista para asegurar sincronización
        await loadUsers();
      }
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar usuario';
      setError(errorMessage);
      setShowSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Header estilo Figma */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              Usuarios<span className="text-[#E31E24]">.</span>
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => navigate('/users/create')}
            sx={{
              backgroundColor: '#E31E24',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              '&:hover': {
                backgroundColor: '#C41A1F'
              }
            }}
          >
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <TextField
            fullWidth
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch className="text-gray-400 dark:text-gray-500" />
                </InputAdornment>
              ),
              className: "dark:bg-gray-800 dark:text-white",
              sx: {
                backgroundColor: 'white',
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #E5E7EB'
                }
              }
            }}
          />
        </div>

        {/* Grid de usuarios - Estilo Figma */}
        <div className="space-y-4">
          {filteredUsers.map((userItem) => (
            <div 
              key={userItem.id}
              className="bg-[#E31E24] rounded-[40px] p-2 shadow-lg"
            >
              {/* Card blanca interior */}
              <div className="bg-white dark:bg-gray-800 rounded-[36px] p-4 md:p-6">
                {/* Layout responsive: columna en móvil, fila en desktop */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Información del usuario */}
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                    {/* Avatar circular */}
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-base md:text-lg">
                        {userItem.first_name[0]}{userItem.last_name[0]}
                      </span>
                    </div>

                    {/* Datos */}
                    <div className="flex-1 min-w-0">
                      {/* Username y Nombre - Stack en móvil, inline en desktop */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-1">
                        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white text-base md:text-lg truncate">
                          {userItem.username}
                        </Typography>
                        <Typography variant="h6" className="font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base truncate">
                          {userItem.first_name} {userItem.last_name}
                        </Typography>
                      </div>
                      {/* Email y Rol - Stack en móvil */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center truncate">
                          <FiMail className="mr-1 flex-shrink-0" size={14} />
                          <span className="truncate">{userItem.email}</span>
                        </div>
                        <Chip 
                          label={userItem.role.name} 
                          size="small"
                          sx={{
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                            fontWeight: '600',
                            fontSize: '0.75rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción - Stack en móvil, inline en desktop */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:flex-shrink-0">
                    <Button
                      variant="contained"
                      startIcon={<FiKey className="hidden sm:inline" />}
                      onClick={() => handleResetPassword(userItem)}
                      fullWidth
                      sx={{
                        backgroundColor: '#E31E24',
                        color: 'white',
                        borderRadius: '12px',
                        textTransform: 'none',
                        padding: '10px 16px',
                        fontWeight: '600',
                        fontSize: { xs: '0.875rem', sm: '0.875rem' },
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          backgroundColor: '#C41A1F'
                        },
                        '@media (min-width: 640px)': {
                          width: 'auto'
                        }
                      }}
                    >
                      <span className="sm:hidden">🔑 Restaurar contraseña</span>
                      <span className="hidden sm:inline">Restaurar contraseña</span>
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<FiTrash2 className="hidden sm:inline" />}
                      onClick={() => handleDeleteUser(userItem)}
                      fullWidth
                      sx={{
                        backgroundColor: '#E31E24',
                        color: 'white',
                        borderRadius: '12px',
                        textTransform: 'none',
                        padding: '10px 16px',
                        fontWeight: '600',
                        fontSize: { xs: '0.875rem', sm: '0.875rem' },
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          backgroundColor: '#C41A1F'
                        },
                        '@media (min-width: 640px)': {
                          width: 'auto'
                        }
                      }}
                    >
                      <span className="sm:hidden">🗑️ Eliminar</span>
                      <span className="hidden sm:inline">Eliminar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sin resultados */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="mx-auto text-gray-400 mb-4" size={48} />
            <Typography variant="h6" className="text-gray-600">
              No se encontraron usuarios
            </Typography>
          </div>
        )}
      </div>

      {/* Dialog: Restaurar Contraseña */}
      <Dialog 
        open={openResetPassword} 
        onClose={() => !submitting && setOpenResetPassword(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-[#E31E24] to-[#C41A1F] text-white">
          <div className="flex items-center space-x-2">
            <FiKey size={24} />
            <Typography variant="h6" className="font-bold">
              Restaurar Contraseña
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent className="mt-4 dark:bg-gray-800">
          {selectedUser && (
            <>
              <Alert severity="info" className="mb-4">
                Configurar nueva contraseña para <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>
              </Alert>
              
              {passwordError && (
                <Alert severity="error" className="mb-4">
                  {passwordError}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                margin="normal"
                disabled={submitting}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' }
                }}
                InputProps={{ className: 'dark:text-white dark:bg-gray-700' }}
                InputLabelProps={{ className: 'dark:text-gray-300' }}
              />

              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                margin="normal"
                disabled={submitting}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                  '& .MuiInputLabel-root': { color: 'text.secondary' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' }
                }}
                InputProps={{ className: 'dark:text-white dark:bg-gray-700' }}
                InputLabelProps={{ className: 'dark:text-gray-300' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions className="px-6 pb-4 dark:bg-gray-800">
          <Button 
            onClick={() => setOpenResetPassword(false)}
            disabled={submitting}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              color: 'text.primary'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmResetPassword}
            disabled={submitting || !newPassword || !confirmPassword}
            variant="contained"
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <FiCheckCircle />}
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
                backgroundColor: '#FCA5A5',
                color: 'white'
              }
            }}
          >
            {submitting ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Eliminar Usuario */}
      <Dialog 
        open={openDeleteUser} 
        onClose={() => !submitting && setOpenDeleteUser(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center space-x-2">
            <FiAlertCircle size={24} />
            <Typography variant="h6" className="font-bold">
              Eliminar Usuario
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent className="mt-4 dark:bg-gray-800">
          <Alert severity="warning" className="mb-4">
            Esta acción no se puede deshacer
          </Alert>
          <Typography variant="body1" className="text-gray-700 dark:text-gray-300">
            ¿Estás seguro que deseas eliminar a{' '}
            <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>?
          </Typography>
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400 mt-2">
            Se eliminarán todos los datos asociados a este usuario.
          </Typography>
        </DialogContent>
        <DialogActions className="px-6 pb-4 dark:bg-gray-800">
          <Button 
            onClick={() => setOpenDeleteUser(false)}
            disabled={submitting}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              color: 'text.primary'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteUser}
            disabled={submitting}
            variant="contained"
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <FiTrash2 />}
            sx={{
              backgroundColor: '#DC2626',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              '&:hover': {
                backgroundColor: '#B91C1C'
              },
              '&:disabled': {
                backgroundColor: '#FCA5A5',
                color: 'white'
              }
            }}
          >
            {submitting ? 'Eliminando...' : 'Eliminar Usuario'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de éxito/error */}
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
          sx={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              color: error ? '#EF4444' : '#10B981'
            }
          }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center space-y-4">
            <CircularProgress sx={{ color: '#E31E24' }} size={48} />
            <Typography className="text-gray-600 dark:text-gray-400">
              Cargando usuarios...
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
