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
  Alert
} from '@mui/material';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiKey, FiUser, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const UserList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data de usuarios
  const mockUsers = [
    {
      id: 1,
      username: 'MAC-001',
      first_name: 'Omar Felipe',
      last_name: 'Andrade',
      email: 'omar.andrade@maccomputadoras.com',
      role_id: 2,
      role: { name: 'Técnico' },
      is_active: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      username: 'MAC-002',
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@maccomputadoras.com',
      role_id: 2,
      role: { name: 'Técnico' },
      is_active: true,
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      id: 3,
      username: 'MAC-003',
      first_name: 'María',
      last_name: 'González',
      email: 'maria.gonzalez@maccomputadoras.com',
      role_id: 2,
      role: { name: 'Técnico' },
      is_active: true,
      created_at: '2024-01-05T10:00:00Z'
    },
    {
      id: 4,
      username: 'MAC-004',
      first_name: 'Lucía',
      last_name: 'Mesa',
      email: 'lucia.mesa@maccomputadoras.com',
      role_id: 3,
      role: { name: 'Mesa de Trabajo' },
      is_active: true,
      created_at: '2024-01-01T10:00:00Z'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleResetPassword = (userToReset) => {
    setSelectedUser(userToReset);
    setOpenResetPassword(true);
  };

  const handleDeleteUser = (userToDelete) => {
    setSelectedUser(userToDelete);
    setOpenDeleteUser(true);
  };

  const confirmResetPassword = () => {
    console.log('Restaurar contraseña para:', selectedUser);
    setOpenResetPassword(false);
    setSelectedUser(null);
    // Aquí iría la lógica real de reset de contraseña
  };

  const confirmDeleteUser = () => {
    console.log('Eliminar usuario:', selectedUser);
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setOpenDeleteUser(false);
    setSelectedUser(null);
    // Aquí iría la lógica real de eliminación
  };

  const filteredUsers = users.filter(u => 
    u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        onClose={() => setOpenResetPassword(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" className="font-bold">
            Restaurar Contraseña
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Alert severity="info" className="mb-4">
              Se enviará un correo a <strong>{selectedUser.email}</strong> con las instrucciones para restaurar la contraseña.
            </Alert>
          )}
          <Typography variant="body1" className="text-gray-700">
            ¿Estás seguro que deseas restaurar la contraseña de{' '}
            <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={() => setOpenResetPassword(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmResetPassword}
            variant="contained"
            sx={{
              backgroundColor: '#E31E24',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#C41A1F'
              }
            }}
          >
            Restaurar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Eliminar Usuario */}
      <Dialog 
        open={openDeleteUser} 
        onClose={() => setOpenDeleteUser(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" className="font-bold text-red-600">
            Eliminar Usuario
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" className="mb-4">
            Esta acción no se puede deshacer
          </Alert>
          <Typography variant="body1" className="text-gray-700">
            ¿Estás seguro que deseas eliminar a{' '}
            <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>?
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-2">
            Se eliminarán todos los datos asociados a este usuario.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={() => setOpenDeleteUser(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteUser}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none'
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;
