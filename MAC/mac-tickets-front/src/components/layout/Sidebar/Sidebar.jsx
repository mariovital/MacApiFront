import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FiHome, 
  FiTag, 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiBell, 
  FiSun, 
  FiMoon,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { Avatar, Badge, Tooltip, IconButton } from '@mui/material';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Elementos de navegación
  const navigationItems = [
    {
      label: 'Dashboard',
      icon: FiHome,
      path: '/dashboard',
      roles: ['admin', 'tecnico', 'mesa_trabajo']
    },
    {
      label: 'Tickets',
      icon: FiTag,
      path: '/tickets',
      roles: ['admin', 'tecnico', 'mesa_trabajo'],
      badge: 5 // TODO: obtener de API
    },
    {
      label: 'Usuarios',
      icon: FiUsers,
      path: '/users',
      roles: ['admin']
    },
    {
      label: 'Reportes',
      icon: FiBarChart2,
      path: '/reports',
      roles: ['admin']
    },
    {
      label: 'Configuración',
      icon: FiSettings,
      path: '/settings',
      roles: ['admin', 'tecnico', 'mesa_trabajo']
    }
  ];

  // Filtrar navegación por rol
  const visibleItems = navigationItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'admin': 'Administrador',
      'tecnico': 'Técnico',
      'mesa_trabajo': 'Mesa de Trabajo'
    };
    return roleLabels[role] || role;
  };

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 
      text-white shadow-xl transition-all duration-300 z-30
      ${collapsed ? 'w-16' : 'w-72'}
    `}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-white rounded-full p-1 text-blue-900 shadow-lg hover:shadow-xl transition-shadow"
      >
        {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>

      {/* Logo */}
      <div className="flex items-center p-6 border-b border-blue-700/50">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
          <span className="font-bold text-blue-900 text-lg">
            {collapsed ? 'M' : 'MAC'}
          </span>
        </div>
        {!collapsed && (
          <div className="ml-3">
            <h1 className="font-bold text-lg">MAC Computadoras</h1>
            <p className="text-blue-200 text-sm">Sistema de Tickets</p>
          </div>
        )}
      </div>

      {/* Perfil de Usuario */}
      <div className="p-4 border-b border-blue-700/50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <Avatar
            src={user?.avatar}
            alt={user?.first_name}
            className="w-10 h-10"
            sx={{ bgcolor: 'white', color: '#1E40AF' }}
          >
            {user?.first_name?.[0]?.toUpperCase()}
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-blue-200 text-sm truncate">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-4 py-6">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Tooltip 
              key={item.path} 
              title={collapsed ? item.label : ''} 
              placement="right"
            >
              <button
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center px-3 py-3 rounded-lg mb-2 transition-all duration-200
                  ${active 
                    ? 'bg-white/10 text-white border-r-2 border-white' 
                    : 'text-blue-100 hover:bg-white/5 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : 'justify-start'}
                `}
              >
                <div className="relative">
                  <Icon size={20} />
                  {item.badge && (
                    <Badge
                      badgeContent={item.badge}
                      color="error"
                      className="absolute -top-2 -right-2"
                      sx={{ 
                        '& .MuiBadge-badge': { 
                          fontSize: '10px', 
                          height: '16px', 
                          minWidth: '16px' 
                        } 
                      }}
                    />
                  )}
                </div>
                {!collapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </button>
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer con controles */}
      <div className="p-4 border-t border-blue-700/50">
        <div className={`flex items-center ${collapsed ? 'flex-col space-y-3' : 'justify-between'}`}>
          {/* Notificaciones */}
          <Tooltip title="Notificaciones" placement="right">
            <IconButton 
              className="text-blue-100 hover:text-white hover:bg-white/10"
              size="small"
            >
              <Badge badgeContent={3} color="error">
                <FiBell size={18} />
              </Badge>
            </IconButton>
          </Tooltip>

          {!collapsed && (
            <div className="flex space-x-2">
              {/* Toggle Tema */}
              <Tooltip title={darkMode ? "Tema Claro" : "Tema Oscuro"}>
                <IconButton 
                  onClick={toggleTheme}
                  className="text-blue-100 hover:text-white hover:bg-white/10"
                  size="small"
                >
                  {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </IconButton>
              </Tooltip>
            </div>
          )}

          {/* Toggle tema en modo collapsed */}
          {collapsed && (
            <Tooltip title={darkMode ? "Tema Claro" : "Tema Oscuro"} placement="right">
              <IconButton 
                onClick={toggleTheme}
                className="text-blue-100 hover:text-white hover:bg-white/10"
                size="small"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
