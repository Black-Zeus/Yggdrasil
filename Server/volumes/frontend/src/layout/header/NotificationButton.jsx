// src/layout/header/NotificationButton.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useMessageStore, useNotificationStore } from '../../store';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * NotificationButton - Componente para botones de notificación
 * 
 * @param {Object} props
 * @param {string} props.type - Tipo de notificación ('message' o 'notification')
 */
const NotificationButton = ({ type }) => {
  // Usar el store apropiado según el tipo
  const messageStore = useMessageStore();
  const notificationStore = useNotificationStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Determinar qué store y datos usar
  const store = type === 'message' ? messageStore : notificationStore;
  const items = type === 'message' ? 
    messageStore.getSortedMessages() : 
    notificationStore.getSortedNotifications();
  const unreadCount = type === 'message' ? 
    messageStore.getUnreadCount() : 
    notificationStore.getUnreadCount();
  
  // Cargar datos al montar
  useEffect(() => {
    if (type === 'message') {
      messageStore.loadMessages();
    } else {
      notificationStore.loadNotifications();
    }
  }, [type, messageStore, notificationStore]);
  
  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Marcar un item como leído
  const handleItemClick = (id) => {
    store.markAsRead(id);
  };
  
  // Marcar todos como leídos
  const handleMarkAllAsRead = () => {
    store.markAllAsRead();
  };
  
  // Formatear la fecha relativa (ejemplo: "hace 2 horas")
  const formatRelativeTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: es 
    });
  };
  
  // Determinar icono para el botón principal
  const mainIcon = type === 'message' ? 'mail' : 'bell';
  
  // Determinar icono para una notificación basado en su tipo
  const getItemIcon = (item) => {
    if (type === 'notification' && item.icon) {
      return item.icon;
    }
    
    if (type === 'message') {
      return item.type === 'system' ? 'information' : 'chat';
    }
    
    // Iconos por defecto según prioridad
    switch (item.priority) {
      case 'high':
        return 'warning';
      case 'medium':
        return 'bell';
      default:
        return 'information';
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-sidebar-active dark:bg-sidebar-dark-active text-white hover:bg-sidebar dark:hover:bg-sidebar-dark transition-colors duration-300"
        onClick={toggleDropdown}
        aria-label={type === 'message' ? 'Mensajes' : 'Notificaciones'}
      >
        <IconResolve_RI 
          name={mainIcon} 
          size={18} 
        />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-[18px] h-[18px] text-[0.7rem] flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>
      
      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[350px] bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg shadow-dropdown overflow-hidden z-50">
          {/* Encabezado del dropdown */}
          <div className="px-4 py-3 border-b border-border dark:border-border-dark flex justify-between items-center">
            <h3 className="font-semibold">
              {type === 'message' ? 'Mensajes' : 'Notificaciones'}
            </h3>
            {unreadCount > 0 && (
              <button 
                className="text-xs text-sidebar hover:text-sidebar-active dark:text-sidebar-dark dark:hover:text-sidebar-dark-active"
                onClick={handleMarkAllAsRead}
              >
                Marcar todo como leído
              </button>
            )}
          </div>
          
          {/* Lista de elementos */}
          <div className="max-h-[350px] overflow-y-auto">
            {items.length > 0 ? (
              <div>
                {items.map(item => (
                  <div 
                    key={item.id}
                    className={`px-4 py-3 border-b border-border dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 ${
                      !item.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="flex items-start mb-1">
                      {/* Icono */}
                      <div className={`mr-3 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.priority === 'high' 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                          : item.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        <IconResolve_RI 
                          name={getItemIcon(item)} 
                          size={16} 
                        />
                      </div>
                      
                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate">
                            {type === 'message' ? item.sender : item.title}
                          </div>
                          <div className="text-xs text-text-secondary dark:text-text-dark-secondary ml-2 whitespace-nowrap">
                            {formatRelativeTime(item.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1 line-clamp-2">
                          {item.content}
                        </div>
                      </div>
                    </div>
                    
                    {/* Indicador de prioridad para prioridad alta */}
                    {item.priority === 'high' && (
                      <div className="mt-1 inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">
                        Prioritario
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-text-secondary dark:text-text-dark-secondary">
                No hay {type === 'message' ? 'mensajes' : 'notificaciones'} para mostrar.
              </div>
            )}
          </div>
          
          {/* Pie del dropdown */}
          <div className="px-4 py-2 text-center border-t border-border dark:border-border-dark">
            <button className="text-sidebar hover:text-sidebar-active dark:text-sidebar-dark dark:hover:text-sidebar-dark-active text-sm font-medium transition-colors duration-200">
              Ver todos los {type === 'message' ? 'mensajes' : 'notificaciones'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;