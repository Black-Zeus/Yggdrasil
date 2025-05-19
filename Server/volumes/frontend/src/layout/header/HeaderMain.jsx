import React from 'react';
import SearchBar from './SearchBar';
import NotificationButton from './NotificationButton';
import UserDropdown from './UserDropdown';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * HeaderMain - Componente para la sección principal del header
 */
const HeaderMain = () => {
  const { collapsed } = useLayoutStore();
  
  return (
    <div className="flex items-center justify-between px-8 h-header border-b border-border dark:border-border-dark transition-colors duration-300">
      {/* Título de la página */}
      <h1 className="text-2xl font-bold text-text dark:text-text-dark">Dashboard</h1>
      
      {/* Barra de búsqueda */}
      <SearchBar />
      
      {/* Acciones del header */}
      <div className="flex items-center gap-5">
        {/* Notificaciones de mensajes */}
        <NotificationButton 
          type="message" 
          icon="📩" 
        />
        
        {/* Notificaciones de alertas */}
        <NotificationButton 
          type="alert" 
          icon="🔔" 
        />
        
        {/* Menú desplegable del usuario */}
        <UserDropdown />
      </div>
    </div>
  );
};

export default HeaderMain;