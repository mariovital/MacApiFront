// /components/layout/Header/Header.jsx - Header minimalista estilo Figma

import React, { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Badge, 
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  FiMenu, 
  FiBell, 
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate('/settings');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        {/* Menu icon para mobile */}
        <IconButton
          onClick={onMenuClick}
          sx={{ 
            color: '#6B7280',
            '&:hover': {
              backgroundColor: '#F3F4F6'
            }
          }}
        >
          <FiMenu size={24} />
        </IconButton>

        {/* Logo mobile */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#E31E24] rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-sm">M</span>
          </div>
          <span className="ml-2 font-bold text-gray-900 dark:text-white text-sm">
            MAC
          </span>
        </div>

        {/* Acciones rápidas */}
        <div className="flex items-center space-x-2">
          {/* Notificaciones */}
          <Tooltip title="Notificaciones">
            <IconButton
              onClick={handleOpenNotifications}
              sx={{ 
                color: '#6B7280',
                '&:hover': {
                  backgroundColor: '#F3F4F6'
                }
              }}
            >
              <Badge badgeContent={4} color="error">
                <FiBell size={20} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Usuario */}
          <Tooltip title="Perfil">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ padding: 0 }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: '#E31E24',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </Avatar>
            </IconButton>
          </Tooltip>
        </div>

        {/* Menu de Notificaciones */}
        <Menu
          anchorEl={anchorElNotifications}
          open={Boolean(anchorElNotifications)}
          onClose={handleCloseNotifications}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: '12px',
              minWidth: '300px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
          }}
        >
          <div className="p-4">
            <p className="font-bold text-gray-900 mb-2">Notificaciones</p>
            <Divider className="mb-2" />
            <MenuItem className="text-sm text-gray-600 rounded-lg">
              Nuevo ticket asignado
            </MenuItem>
            <MenuItem className="text-sm text-gray-600 rounded-lg">
              Ticket #001 actualizado
            </MenuItem>
            <MenuItem className="text-sm text-gray-600 rounded-lg">
              Comentario en ticket #002
            </MenuItem>
          </div>
        </Menu>

        {/* Menu de Usuario */}
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: '12px',
              minWidth: '220px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
          }}
        >
          <div className="p-4">
            <p className="font-bold text-gray-900">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Divider />
          <MenuItem 
            onClick={handleProfile}
            className="rounded-lg mx-2 my-1"
          >
            <FiUser className="mr-3" size={18} />
            <span className="text-sm">Mi Perfil</span>
          </MenuItem>
          <MenuItem 
            onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}
            className="rounded-lg mx-2 my-1"
          >
            <FiSettings className="mr-3" size={18} />
            <span className="text-sm">Configuración</span>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleLogout}
            className="rounded-lg mx-2 my-1 text-red-600"
          >
            <FiLogOut className="mr-3" size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
