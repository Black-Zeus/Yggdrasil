// src/layout/header/HeaderMain.jsx
import React, { useEffect } from 'react';
import SearchBar from './SearchBar';
import NotificationButton from './NotificationButton';
import UserDropdown from './UserDropdown';
import { useMessageStore, useNotificationStore } from '../../store';

/**
 * HeaderMain - Componente para la sección principal del header
 */
const HeaderMain = () => {
  const { loadMessages } = useMessageStore();
  const { loadNotifications } = useNotificationStore();
  
  // Cargar datos al montar el componente
  useEffect(() => {
    loadMessages();
    loadNotifications();
  }, [loadMessages, loadNotifications]);
  
  return (
    <div className="flex items-center justify-between px-8 h-header border-b border-border dark:border-border-dark transition-colors duration-300">
      {/* Título de la página */}
      <h1 className="text-2xl font-bold text-text dark:text-text-dark">Dashboard</h1>
      
      {/* Barra de búsqueda */}
      <SearchBar />
      
      {/* Acciones del header */}
      <div className="flex items-center gap-5">
        {/* Botón de mensajes */}
        <NotificationButton type="message" />
        
        {/* Botón de notificaciones */}
        <NotificationButton type="notification" />
        
        {/* Menú desplegable del usuario */}
        <UserDropdown />
      </div>
    </div>
  );
};

export default HeaderMain;