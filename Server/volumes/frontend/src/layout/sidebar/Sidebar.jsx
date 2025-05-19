// src/layout/sidebar/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { useSidebarStore, useThemeStore, useUserStore } from '../../store';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import UserProfile from './UserProfile';
import ThemeToggle from './ThemeToggle';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

/**
 * Sidebar - Componente principal de la barra lateral
 */
export const Sidebar = () => {
  const { collapsed, toggleSidebar, saveSidebarState } = useSidebarStore();
  const { darkMode } = useThemeStore();
  const { loadCurrentUser } = useUserStore();
  
  // Estado local para manejar la animación secuencial
  const [textVisible, setTextVisible] = useState(!collapsed);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Cargar datos del usuario solo una vez al montar el componente
  useEffect(() => {
    loadCurrentUser();
  }, []); // Sin dependencias para evitar recarga
  
  // Efecto para manejar el cambio de visibilidad del texto
  useEffect(() => {
    if (collapsed && textVisible) {
      setTextVisible(false);
    } else if (!collapsed && !textVisible) {
      const timer = setTimeout(() => {
        setTextVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [collapsed, textVisible]);
  
  // Efecto para manejar el estado de transición
  useEffect(() => {
    if (collapsed !== undefined) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [collapsed]);
  
  // Función para alternar el sidebar
  const handleToggleSidebar = () => {
    if (isTransitioning) return; // Prevenir cambios durante la transición
    toggleSidebar();
    saveSidebarState();
  };
  
  // Ancho fijo para expanded y collapsed
  const expandedWidth = 250;
  const collapsedWidth = 70;
  
  return (
    <>
      {/* Sidebar contenedor principal */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-sidebar dark:bg-sidebar-dark shadow-sidebar z-20 flex flex-col text-text-sidebar overflow-hidden transition-all duration-300 ease-in-out`}
        style={{ 
          width: collapsed ? `${collapsedWidth}px` : `${expandedWidth}px` 
        }}
      >
        <SidebarHeader textVisible={textVisible} />
        <SidebarNavigation textVisible={textVisible} />
        
        <div className="border-t border-border-sidebar mt-auto">
          <UserProfile textVisible={textVisible} />
          <ThemeToggle textVisible={textVisible} />
        </div>
      </div>
      
      {/* Botón de colapso como solapa */}
      <button 
        onClick={handleToggleSidebar}
        className="fixed top-[15px] z-30 w-8 h-[40px] text-white rounded-r-md shadow-md flex items-center justify-center cursor-pointer bg-red-500 dark:bg-sidebar-dark transition-all duration-300 ease-in-out select-none"
        style={{ 
          left: collapsed ? `${collapsedWidth}px` : `${expandedWidth}px` 
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        disabled={isTransitioning}
      >
        <IconResolve_RI 
          name={collapsed ? "arrow-right" : "arrow-left"} 
          size={16} 
          className="text-white"
        />
      </button>
    </>
  );
};

export default Sidebar;