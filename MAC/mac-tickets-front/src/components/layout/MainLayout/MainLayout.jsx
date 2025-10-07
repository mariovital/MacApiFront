// /components/layout/MainLayout/MainLayout.jsx - Layout principal con estética Figma

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import MobileNavigation from '../MobileNavigation/MobileNavigation';

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] dark:bg-gray-900 overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Sidebar Mobile (Drawer) */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slide-in">
            <Sidebar collapsed={false} onToggle={toggleMobileMenu} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col overflow-hidden transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
      `}>
        {/* Header Mobile */}
        <Header onMenuClick={toggleMobileMenu} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation Mobile */}
        <div className="lg:hidden">
          <MobileNavigation />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
