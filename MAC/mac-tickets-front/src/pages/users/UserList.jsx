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

        {/* Grid de usuarios - Estilo moderno similar al Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((userItem) => (
            <Card
              key={userItem.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
              sx={{ borderRadius: '16px' }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Avatar con icono */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-bold text-lg">
                        {userItem.first_name[0]}{userItem.last_name[0]}
                      </span>
                    </div>

                    {/* Información principal */}
                    <div className="flex-1 min-w-0">
                      <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                        {userItem.first_name} {userItem.last_name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium truncate mb-2">
                        @{userItem.username}
                      </Typography>
                      
                      {/* Chip de rol */}
                      <Chip 
                        label={userItem.role.name}
                        size="small"
                        sx={{
                          backgroundColor: userItem.role.name === 'Administrador' ? '#EEF2FF' : 
                                         userItem.role.name === 'Técnico' ? '#FEF3C7' : '#DBEAFE',
                          color: userItem.role.name === 'Administrador' ? '#4F46E5' : 
                                userItem.role.name === 'Técnico' ? '#F59E0B' : '#3B82F6',
                          fontWeight: '700',
                          fontSize: '0.7rem',
                          height: '24px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <FiMail className="text-gray-600 dark:text-gray-400" size={16} />
                  </div>
                  <Typography variant="body2" className="text-gray-700 dark:text-gray-300 truncate">
                    {userItem.email}
                  </Typography>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    startIcon={<FiKey />}
                    onClick={() => handleResetPassword(userItem)}
                    fullWidth
                    sx={{
                      borderColor: '#E5E7EB',
                      color: '#6B7280',
                      borderRadius: '10px',
                      textTransform: 'none',
                      padding: '10px 16px',
                      fontWeight: '600',
                      '&:hover': {
                        borderColor: '#E31E24',
                        backgroundColor: '#FEE2E2',
                        color: '#E31E24'
                      }
                    }}
                  >
                    Restaurar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FiTrash2 />}
                    onClick={() => handleDeleteUser(userItem)}
                    fullWidth
                    sx={{
                      borderColor: '#E5E7EB',
                      color: '#DC2626',
                      borderRadius: '10px',
                      textTransform: 'none',
                      padding: '10px 16px',
                      fontWeight: '600',
                      '&:hover': {
                        borderColor: '#DC2626',
                        backgroundColor: '#FEE2E2'
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sin resultados */}
        {filteredUsers.length === 0 && !loading && (
          <Card 
            className="shadow-lg"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <FiUser className="text-gray-400 dark:text-gray-500" size={48} />
                </div>
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                  No se encontraron usuarios
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 max-w-md">
                  {searchTerm 
                    ? `No hay usuarios que coincidan con "${searchTerm}"`
                    : 'No hay usuarios registrados en el sistema'}
                </Typography>
                {!searchTerm && (
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
                      marginTop: 2,
                      '&:hover': {
                        backgroundColor: '#C41A1F'
                      }
                    }}
                  >
                    Crear Primer Usuario
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog: Restaurar Contraseña */}
      <Dialog 
        open={openResetPassword} 
        onClose={() => !submitting && setOpenResetPassword(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '20px',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle className="dark:bg-gray-800 pb-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FiKey className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                Restaurar Contraseña
              </Typography>
              <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                Configurar nueva contraseña de acceso
              </Typography>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="mt-2 dark:bg-gray-800">
          {selectedUser && (
            <>
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <Typography variant="body2" className="text-blue-900 dark:text-blue-200">
                  Usuario: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong>
                </Typography>
                <Typography variant="caption" className="text-blue-700 dark:text-blue-300">
                  @{selectedUser.username}
                </Typography>
              </div>
              
              {passwordError && (
                <Alert 
                  severity="error" 
                  className="mb-4"
                  sx={{ borderRadius: '12px' }}
                  icon={<FiAlertCircle />}
                >
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
                placeholder="Mínimo 6 caracteres"
                sx={{
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    backgroundColor: 'background.paper'
                  }
                }}
                InputProps={{ className: 'dark:text-white' }}
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
                placeholder="Repetir contraseña"
                sx={{
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    backgroundColor: 'background.paper'
                  }
                }}
                InputProps={{ className: 'dark:text-white' }}
                InputLabelProps={{ className: 'dark:text-gray-300' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions className="px-6 pb-6 pt-4 dark:bg-gray-800 gap-2">
          <Button 
            onClick={() => setOpenResetPassword(false)}
            disabled={submitting}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              borderColor: '#E5E7EB',
              color: '#6B7280',
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB'
              }
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
              boxShadow: '0 4px 12px rgba(227, 30, 36, 0.3)',
              '&:hover': {
                backgroundColor: '#C41A1F',
                boxShadow: '0 6px 16px rgba(227, 30, 36, 0.4)'
              },
              '&:disabled': {
                backgroundColor: '#FCA5A5',
                color: 'white',
                boxShadow: 'none'
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
          sx: { 
            borderRadius: '20px',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle className="dark:bg-gray-800 pb-2">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <FiAlertCircle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                Eliminar Usuario
              </Typography>
              <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                Esta acción no se puede deshacer
              </Typography>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="mt-2 dark:bg-gray-800">
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <Typography variant="body2" className="text-red-900 dark:text-red-200 mb-2">
              <strong>Usuario a eliminar:</strong>
            </Typography>
            <Typography variant="body1" className="text-red-900 dark:text-red-100 font-bold">
              {selectedUser?.first_name} {selectedUser?.last_name}
            </Typography>
            <Typography variant="caption" className="text-red-700 dark:text-red-300">
              @{selectedUser?.username} • {selectedUser?.email}
            </Typography>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-2">
              <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <Typography variant="body2" className="text-yellow-900 dark:text-yellow-200 font-semibold mb-1">
                  Advertencia importante
                </Typography>
                <Typography variant="body2" className="text-yellow-800 dark:text-yellow-300">
                  Se eliminarán todos los datos asociados a este usuario, incluyendo tickets creados y comentarios.
                </Typography>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="px-6 pb-6 pt-4 dark:bg-gray-800 gap-2">
          <Button 
            onClick={() => setOpenDeleteUser(false)}
            disabled={submitting}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              borderColor: '#E5E7EB',
              color: '#6B7280',
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB'
              }
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
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              '&:hover': {
                backgroundColor: '#B91C1C',
                boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)'
              },
              '&:disabled': {
                backgroundColor: '#FCA5A5',
                color: 'white',
                boxShadow: 'none'
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
