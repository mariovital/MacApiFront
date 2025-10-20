// /components/layout/MobileNavigation/MobileNavigation.jsx - Navegación móvil estilo Figma

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FiHome, 
  FiTag, 
  FiClock,
  FiUsers, 
  FiBarChart2
} from 'react-icons/fi';
import { Badge } from '@mui/material';

const MobileNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Elementos de navegación para mobile
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
      badge: 5
    },
    {
      label: 'Historial',
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

  return (
    <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`
                flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all
                min-w-[60px]
                ${active 
                  ? 'text-[#E31E24]' 
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}
            >
              <div className="relative">
                {item.badge ? (
                  <Badge 
                    badgeContent={item.badge} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.65rem',
                        height: '16px',
                        minWidth: '16px'
                      }
                    }}
                  >
                    <Icon size={22} />
                  </Badge>
                ) : (
                  <Icon size={22} />
                )}
              </div>
              <span className={`
                text-[10px] font-medium mt-1
                ${active ? 'font-bold' : ''}
              `}>
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 bg-[#E31E24] rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
