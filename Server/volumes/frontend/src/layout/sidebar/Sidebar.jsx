import React, { useEffect } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import UserProfile from './UserProfile';
import ThemeToggle from './ThemeToggle';

/**
 * Sidebar - Componente principal de la barra lateral
 */
export const Sidebar = () => {
  const { 
    collapsed, 
    toggleSidebar, 
    darkMode,
    loadCurrentUser 
  } = useLayoutStore();
  
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);
  
  return (
    <div 
      className={`fixed top-0 left-0 h-screen ${
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      } bg-sidebar dark:bg-sidebar-dark shadow-sidebar z-20 flex flex-col text-text-sidebar transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <SidebarHeader />
      
      {/* Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Sidebar Footer */}
      <div className="border-t border-border-sidebar mt-auto">
        {/* User Profile */}
        <UserProfile />
        
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
      
      {/* Collapse Button */}
      <button 
        onClick={toggleSidebar}
        className={`absolute top-1/2 -right-3 w-6 h-10 bg-sidebar dark:bg-sidebar-dark rounded-r flex items-center justify-center cursor-pointer shadow-md z-30 text-text-sidebar text-xs transform -translate-y-1/2 transition-transform duration-300 ${
          collapsed ? 'rotate-180' : ''
        }`}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        &#10094;
      </button>
    </div>
  );
};

export default Sidebar;