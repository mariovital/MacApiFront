import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Badge } from '@mui/material';
import { 
  FiHome, 
  FiTag, 
  FiUsers, 
  FiBarChart2, 
  FiSettings 
} from 'react-icons/fi';

const MobileNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Elementos de navegación móvil
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
      label: 'Config',
      icon: FiSettings,
      path: '/settings',
      roles: ['admin', 'tecnico', 'mesa_trabajo']
    }
  ];

  // Filtrar navegación por rol
  const visibleItems = navigationItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-1 z-40 lg:hidden">
      <div className="flex justify-around items-center">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`
                flex flex-col items-center px-3 py-2 rounded-lg min-w-0 flex-1 max-w-20
                transition-colors duration-200
                ${active 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              <div className="relative mb-1">
                <Icon size={20} />
                {item.badge && (
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    className="absolute -top-2 -right-2"
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        fontSize: '9px', 
                        height: '14px', 
                        minWidth: '14px',
                        padding: '0 4px'
                      } 
                    }}
                  />
                )}
              </div>
              <span className="text-xs font-medium leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
