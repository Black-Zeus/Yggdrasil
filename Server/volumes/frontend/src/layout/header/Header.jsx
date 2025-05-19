import React, { useEffect } from 'react';
import HeaderMain from './HeaderMain';
import Breadcrumbs from './Breadcrumbs';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * Header - Componente principal del encabezado
 */
export const Header = () => {
  const { loadNotifications } = useLayoutStore();
  
  // Cargar notificaciones al montar el componente
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);
  
  return (
    <header className="sticky top-0 z-15 flex flex-col w-full bg-background dark:bg-background-dark text-text dark:text-text-dark shadow-header border-b border-border dark:border-border-dark transition-colors duration-300">
      {/* Sección principal del header */}
      <HeaderMain />
      
      {/* Navegación breadcrumbs */}
      <Breadcrumbs />
    </header>
  );
};

export default Header;