import React, { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MobileNavigation from '../MobileNavigation/MobileNavigation';

const MainLayout = ({ children }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-collapse sidebar en pantallas pequeñas
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Layout */}
      {!isMobile && (
        <>
          {/* Sidebar */}
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={handleSidebarToggle}
          />
          
          {/* Header */}
          <Header sidebarCollapsed={sidebarCollapsed} />
          
          {/* Main Content Area */}
          <main 
            className={`
              transition-all duration-300 pt-16
              ${sidebarCollapsed ? 'ml-16' : 'ml-72'}
            `}
            style={{
              minHeight: 'calc(100vh - 64px)' // 64px es la altura del header
            }}
          >
            <div className="p-6">
              {children}
            </div>
          </main>
        </>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <>
          {/* Mobile Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16">
            <div className="flex items-center justify-between px-4 h-full">
              {/* Logo y toggle menu */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleMobileMenuToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="space-y-1">
                    <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                    <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                    <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                  </div>
                </button>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white text-sm">MAC</span>
                  </div>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    MAC Computadoras
                  </span>
                </div>
              </div>

              {/* Notificaciones */}
              <div className="flex items-center space-x-2">
                {/* TODO: Agregar botón de notificaciones móvil */}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={handleMobileMenuToggle}
              ></div>
              
              {/* Sidebar */}
              <div className="fixed left-0 top-0 h-full w-72 transform transition-transform">
                <Sidebar 
                  collapsed={false}
                  onToggle={handleMobileMenuToggle}
                />
              </div>
            </div>
          )}

          {/* Mobile Content */}
          <main className="pt-16 pb-16">
            <div className="p-4">
              {children}
            </div>
          </main>

          {/* Mobile Navigation */}
          <MobileNavigation />
        </>
      )}
    </div>
  );
};

export default MainLayout;
