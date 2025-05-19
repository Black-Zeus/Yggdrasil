import React from 'react';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * SidebarHeader - Componente para el encabezado del sidebar
 */
const SidebarHeader = () => {
  const { collapsed } = useLayoutStore();
  
  return (
    <div className={`p-6 border-b border-border-sidebar flex items-center gap-4 transition-all duration-300 ${
      collapsed ? 'justify-center p-4' : ''
    }`}>
      <div className="w-10 h-10 bg-white/20 rounded-sidebar-logo flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        A
      </div>
      <div className={`text-lg font-bold text-white whitespace-nowrap transition-opacity duration-300 ${
        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
      }`}>
        Aqumex
      </div>
    </div>
  );
};

export default SidebarHeader;