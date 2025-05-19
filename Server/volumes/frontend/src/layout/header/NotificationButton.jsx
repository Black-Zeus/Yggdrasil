import React, { useState, useRef, useEffect } from 'react';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * NotificationButton - Componente para botones de notificación
 * 
 * @param {Object} props
 * @param {string} props.type - Tipo de notificación ('message' o 'alert')
 * @param {string} props.icon - Icono a mostrar
 */
const NotificationButton = ({ type, icon }) => {
  const { notifications } = useLayoutStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Filtrar notificaciones por tipo y no leídas
  const filteredNotifications = notifications.filter(
    notif => notif.type === type && !notif.read
  );
  
  const count = filteredNotifications.length;
  
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
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-sidebar-active dark:bg-sidebar-dark-active text-white hover:bg-sidebar dark:hover:bg-sidebar-dark transition-colors duration-300"
        onClick={toggleDropdown}
        aria-label={`${type} notifications`}
      >
        <div>{icon}</div>
        {count > 0 && (
          <div className="absolute -top-1 -right-1 bg-notification-badge text-white rounded-full w-[18px] h-[18px] text-[0.7rem] flex items-center justify-center">
            {count}
          </div>
        )}
      </button>
      
      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg shadow-dropdown overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border dark:border-border-dark font-semibold">
            {type === 'message' ? 'Messages' : 'Notifications'}
          </div>
          
          <div className="max-h-[350px] overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notif => (
                <div 
                  key={notif.id}
                  className="px-4 py-3 border-b border-border dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">
                      {type === 'message' ? notif.sender : notif.title}
                    </div>
                    <div className="text-xs text-text-secondary dark:text-text-dark-secondary">
                      {formatTimestamp(notif.timestamp)}
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
                    {notif.content}
                  </div>
                  {type === 'alert' && notif.priority && (
                    <div className={`mt-2 inline-block px-2 py-1 text-xs rounded ${
                      notif.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : notif.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {notif.priority.charAt(0).toUpperCase() + notif.priority.slice(1)} Priority
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-text-secondary dark:text-text-dark-secondary">
                No unread {type === 'message' ? 'messages' : 'notifications'}
              </div>
            )}
          </div>
          
          <div className="px-4 py-2 text-center border-t border-border dark:border-border-dark">
            <button className="text-sidebar hover:text-sidebar-active dark:text-sidebar-dark dark:hover:text-sidebar-dark-active text-sm font-medium transition-colors duration-200">
              See all {type === 'message' ? 'messages' : 'notifications'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;