import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit,
  FiTrash2,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield
} from 'react-icons/fi';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para usuarios
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@tuempresa.com',
      first_name: 'Super',
      last_name: 'Admin',
      role: 'Administrador',
      is_active: true,
      created_at: '2024-12-01T10:00:00Z',
      last_login: '2025-01-15T09:30:00Z'
    },
    {
      id: 2,
      username: 'juan.perez',
      email: 'juan.perez@tuempresa.com',
      first_name: 'Juan',
      last_name: 'Pérez',
      role: 'Técnico',
      is_active: true,
      created_at: '2024-12-05T14:20:00Z',
      last_login: '2025-01-15T08:15:00Z'
    },
    {
      id: 3,
      username: 'maria.gonzalez',
      email: 'maria.gonzalez@tuempresa.com',
      first_name: 'María',
      last_name: 'González',
      role: 'Técnico',
      is_active: true,
      created_at: '2024-12-10T11:45:00Z',
      last_login: '2025-01-14T16:45:00Z'
    },
    {
      id: 4,
      username: 'carlos.mesa',
      email: 'carlos.mesa@tuempresa.com',
      first_name: 'Carlos',
      last_name: 'Mesa',
      role: 'Mesa de Trabajo',
      is_active: true,
      created_at: '2024-12-15T09:30:00Z',
      last_login: '2025-01-15T07:20:00Z'
    },
    {
      id: 5,
      username: 'ana.inactive',
      email: 'ana.torres@tuempresa.com',
      first_name: 'Ana',
      last_name: 'Torres',
      role: 'Mesa de Trabajo',
      is_active: false,
      created_at: '2024-11-20T13:15:00Z',
      last_login: '2024-12-20T10:30:00Z'
    }
  ];

  const getRoleColor = (role) => {
    const colors = {
      'Administrador': 'bg-red-100 text-red-800',
      'Técnico': 'bg-blue-100 text-blue-800',
      'Mesa de Trabajo': 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role) => {
    const icons = {
      'Administrador': <FiShield className="text-red-600" />,
      'Técnico': <FiUserCheck className="text-blue-600" />,
      'Mesa de Trabajo': <FiUsers className="text-green-600" />
    };
    return icons[role] || <FiUsers className="text-gray-600" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatLastLogin = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays - 1} días`;
    return formatDate(dateString);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const activeUsers = mockUsers.filter(u => u.is_active).length;
  const adminUsers = mockUsers.filter(u => u.role === 'Administrador').length;
  const techUsers = mockUsers.filter(u => u.role === 'Técnico').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
            Administra usuarios, roles y permisos del sistema
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <CardContent className="flex items-center p-4">
            <FiUsers className="text-blue-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-blue-700">
                {mockUsers.length}
              </Typography>
              <Typography variant="body2" className="text-blue-600">
                Total Usuarios
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <CardContent className="flex items-center p-4">
            <FiUserCheck className="text-green-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-green-700">
                {activeUsers}
              </Typography>
              <Typography variant="body2" className="text-green-600">
                Usuarios Activos
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-l-4 border-red-500">
          <CardContent className="flex items-center p-4">
            <FiShield className="text-red-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-red-700">
                {adminUsers}
              </Typography>
              <Typography variant="body2" className="text-red-600">
                Administradores
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <CardContent className="flex items-center p-4">
            <FiUserCheck className="text-purple-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-purple-700">
                {techUsers}
              </Typography>
              <Typography variant="body2" className="text-purple-600">
                Técnicos
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-sm">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              placeholder="Buscar usuarios por nombre, email o username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="flex-1"
            />
            <Button
              variant="outlined"
              startIcon={<FiFilter />}
              className="border-gray-300"
            >
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <TableContainer component={Paper} className="shadow-none">
            <Table>
              <TableHead className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableCell className="font-semibold">Usuario</TableCell>
                  <TableCell className="font-semibold">Rol</TableCell>
                  <TableCell className="font-semibold">Estado</TableCell>
                  <TableCell className="font-semibold">Último Acceso</TableCell>
                  <TableCell className="font-semibold">Creado</TableCell>
                  <TableCell className="font-semibold">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar
                          className="w-10 h-10 bg-blue-500 text-white"
                        >
                          {getInitials(user.first_name, user.last_name)}
                        </Avatar>
                        <div>
                          <Typography variant="body2" className="font-medium text-gray-900 dark:text-white">
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                            @{user.username}
                          </Typography>
                          <Typography variant="caption" className="text-gray-400">
                            {user.email}
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <Chip
                          label={user.role}
                          size="small"
                          className={getRoleColor(user.role)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Chip
                          label="Activo"
                          size="small"
                          className="bg-green-100 text-green-800"
                          icon={<FiUserCheck />}
                        />
                      ) : (
                        <Chip
                          label="Inactivo"
                          size="small"
                          className="bg-red-100 text-red-800"
                          icon={<FiUserX />}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        {formatLastLogin(user.last_login)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        {formatDate(user.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Tooltip title="Editar usuario">
                          <IconButton size="small" className="text-blue-600 hover:bg-blue-50">
                            <FiEdit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                          <IconButton 
                            size="small" 
                            className="text-red-600 hover:bg-red-50"
                            disabled={user.role === 'Administrador'}
                          >
                            <FiTrash2 />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserList;
