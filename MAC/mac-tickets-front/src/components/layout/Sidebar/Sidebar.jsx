// /components/layout/Sidebar/Sidebar.jsx - Sidebar con estética Figma

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  FiHome, 
  FiTag, 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiClock,
  FiLogOut,
  FiSun, 
  FiMoon
} from 'react-icons/fi';
import { Avatar, Tooltip, IconButton, Divider } from '@mui/material';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Elementos de navegación según Figma
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
      roles: ['admin', 'tecnico', 'mesa_trabajo']
    },
    {
      label: 'Tickets Pasados',
      icon: FiClock,
      path: '/tickets/history',
      roles: ['admin', 'tecnico', 'mesa_trabajo']
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
    // Para la ruta /tickets, solo activar si es exactamente /tickets o /tickets/create o /tickets/:id
    // pero NO para /tickets/history
    if (path === '/tickets') {
      return location.pathname === '/tickets' || 
             (location.pathname.startsWith('/tickets/') && !location.pathname.startsWith('/tickets/history'));
    }
    // Para otras rutas, usar la lógica normal
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
      fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
      shadow-lg transition-all duration-300 z-30
      ${collapsed ? 'w-20' : 'w-72'}
    `}>
      
      {/* Logo y nombre - Clickeable para ir al home */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700 w-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      >
        {!collapsed ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 p-2 shadow-md transition-transform hover:scale-105">
              <img 
                src="/maccomputadoras_logo.png" 
                alt="MAC Computadoras" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              MAC Computadoras
            </span>
          </div>
        ) : (
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md transition-transform hover:scale-105">
            <img 
              src="/maccomputadoras_logo.png" 
              alt="MAC" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </button>

      {/* Navegación */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Tooltip title={collapsed ? item.label : ''} placement="right">
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      w-full flex items-center px-4 py-3 rounded-xl transition-all
                      ${active 
                        ? 'bg-[#E31E24] text-white shadow-lg' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${collapsed ? 'justify-center' : 'justify-start'}
                    `}
                  >
                    <Icon size={20} className={collapsed ? '' : 'mr-3'} />
                    {!collapsed && (
                      <span className="font-medium text-sm">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span className={`
                        ml-auto bg-red-500 text-white text-xs font-bold 
                        px-2 py-1 rounded-full
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Usuario y configuraciones */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {/* Toggle tema */}
        <div className="mb-3">
          <Tooltip title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
            <IconButton 
              onClick={toggleTheme}
              className={`
                w-full ${collapsed ? 'justify-center' : 'justify-start'} 
                hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl
              `}
              sx={{ 
                color: '#6B7280',
                padding: collapsed ? '12px' : '12px 16px'
              }}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              {!collapsed && (
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </span>
              )}
            </IconButton>
          </Tooltip>
        </div>

        {/* Cerrar sesión */}
        <Tooltip title="Cerrar sesión" placement="right">
          <button
            onClick={logout}
            className={`
              w-full flex items-center px-4 py-3 rounded-xl transition-all
              text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
              ${collapsed ? 'justify-center' : 'justify-start'}
            `}
          >
            <FiLogOut size={20} />
            {!collapsed && (
              <span className="ml-3 font-medium text-sm">
                Cerrar Sesión
              </span>
            )}
          </button>
        </Tooltip>

        {!collapsed && (
          <>
            <Divider className="my-3" />
            
            {/* Info de usuario */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
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
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
