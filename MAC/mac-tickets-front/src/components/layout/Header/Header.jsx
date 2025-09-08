import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Avatar, 
  Breadcrumbs,
  Link,
  Typography,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  FiSearch,
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
  FiTag,
  FiUsers,
  FiBarChart2
} from 'react-icons/fi';

const Header = ({ sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  // Breadcrumbs dinámicos basados en la ruta actual
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbMap = {
      'dashboard': { label: 'Dashboard', icon: FiHome },
      'tickets': { label: 'Tickets', icon: FiTag },
      'users': { label: 'Usuarios', icon: FiUsers },
      'reports': { label: 'Reportes', icon: FiBarChart2 },
      'settings': { label: 'Configuración', icon: FiSettings }
    };

    return pathSegments.map((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const breadcrumb = breadcrumbMap[segment] || { label: segment };
      
      return {
        label: breadcrumb.label,
        path: isLast ? null : path,
        isLast
      };
    });
  };

  // Notificaciones mock (TODO: obtener de API)
  const notifications = [
    {
      id: 1,
      title: 'Nuevo ticket asignado',
      message: 'Ticket #ID-001: Problema con impresora',
      time: '5 min',
      unread: true
    },
    {
      id: 2,
      title: 'Ticket actualizado',
      message: 'Estado cambiado a "En Proceso"',
      time: '15 min',
      unread: true
    },
    {
      id: 3,
      title: 'SLA próximo a vencer',
      message: 'Ticket #ID-045 vence en 2 horas',
      time: '1 hora',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implementar búsqueda global
      console.log('Buscando:', searchQuery);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleNavigateToProfile = () => {
    handleProfileMenuClose();
    navigate('/settings/profile');
  };

  const handleNavigateToSettings = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <AppBar 
      position="fixed" 
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      elevation={0}
      sx={{ 
        left: sidebarCollapsed ? 64 : 288,
        width: `calc(100% - ${sidebarCollapsed ? 64 : 288}px)`,
        transition: 'all 0.3s ease'
      }}
    >
      <Toolbar className="h-16 px-6">
        {/* Breadcrumbs */}
        <div className="flex-1 min-w-0">
          <Breadcrumbs 
            separator="/" 
            className="text-gray-600 dark:text-gray-300 mb-1"
            maxItems={3}
          >
            {breadcrumbs.map((crumb, index) => (
              crumb.isLast ? (
                <Typography 
                  key={index}
                  className="text-gray-900 dark:text-white font-medium"
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={index}
                  onClick={() => navigate(crumb.path)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  underline="hover"
                >
                  {crumb.label}
                </Link>
              )
            ))}
          </Breadcrumbs>
          
          {/* Búsqueda Global */}
          <form onSubmit={handleSearch} className="max-w-md">
            <TextField
              size="small"
              placeholder="Buscar tickets, usuarios, empresas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch className="text-gray-400" />
                  </InputAdornment>
                ),
                className: "bg-gray-50 dark:bg-gray-700 rounded-lg"
              }}
              className="w-full"
              variant="outlined"
            />
          </form>
        </div>

        {/* Controles del Header */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Notificaciones */}
          <IconButton
            onClick={handleNotificationsOpen}
            className="text-gray-600 dark:text-gray-300"
          >
            <Badge badgeContent={unreadCount} color="error">
              <FiBell size={20} />
            </Badge>
          </IconButton>

          {/* Perfil de Usuario */}
          <div className="flex items-center">
            <IconButton
              onClick={handleProfileMenuOpen}
              className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Avatar
                src={user?.avatar}
                alt={user?.first_name}
                className="w-8 h-8"
                sx={{ bgcolor: '#3B82F6', fontSize: '14px' }}
              >
                {user?.first_name?.[0]?.toUpperCase()}
              </Avatar>
              <div className="hidden md:block text-left">
                <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                  {user?.first_name} {user?.last_name}
                </Typography>
              </div>
              <FiChevronDown className="text-gray-400" size={16} />
            </IconButton>
          </div>
        </div>

        {/* Menu de Notificaciones */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          className="mt-2"
          PaperProps={{
            className: "w-80 max-h-96"
          }}
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <Typography variant="subtitle1" className="font-semibold">
              Notificaciones
            </Typography>
            {unreadCount > 0 && (
              <Typography variant="caption" className="text-blue-600">
                {unreadCount} sin leer
              </Typography>
            )}
          </div>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              className={`px-4 py-3 ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <div className="flex-1">
                <Typography variant="body2" className="font-medium">
                  {notification.title}
                </Typography>
                <Typography variant="caption" className="text-gray-600 dark:text-gray-400 block">
                  {notification.message}
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  {notification.time}
                </Typography>
              </div>
              {notification.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
              )}
            </MenuItem>
          ))}
        </Menu>

        {/* Menu de Perfil */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          className="mt-2"
          PaperProps={{
            className: "w-56"
          }}
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <Typography variant="body2" className="font-semibold">
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {user?.email}
            </Typography>
          </div>
          
          <MenuItem onClick={handleNavigateToProfile}>
            <ListItemIcon>
              <FiUser size={16} />
            </ListItemIcon>
            <ListItemText primary="Mi Perfil" />
          </MenuItem>
          
          <MenuItem onClick={handleNavigateToSettings}>
            <ListItemIcon>
              <FiSettings size={16} />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <FiLogOut size={16} className="text-red-500" />
            </ListItemIcon>
            <ListItemText 
              primary="Cerrar Sesión" 
              className="text-red-500"
            />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
