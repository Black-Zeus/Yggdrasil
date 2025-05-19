import React from 'react';

const NotificationItem = ({ notification, onClick, onMarkAsRead, onDelete }) => {
  // Función para obtener el icono según el tipo
  const getIcon = () => {
    switch (notification.icon) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'clock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        );
      case 'check':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  // Función para obtener la clase de color según el tipo de badge
  const getBadgeClass = () => {
    switch (notification.badgeType) {
      case 'success':
        return 'bg-success-light text-success-dark';
      case 'warning':
        return 'bg-warning-light text-warning-dark';
      case 'danger':
        return 'bg-danger-light text-danger-dark';
      case 'info':
      default:
        return 'bg-info-light text-info-dark';
    }
  };

  // Función para obtener la clase de color del icono
  const getIconClass = () => {
    switch (notification.badgeType) {
      case 'success':
        return 'bg-success-light text-success-dark';
      case 'warning':
        return 'bg-warning-light text-warning-dark';
      case 'danger':
        return 'bg-danger-light text-danger-dark';
      case 'info':
      default:
        return 'bg-info-light text-info-dark';
    }
  };

  return (
    <div 
      className={`w-full flex p-4 border-b border-border-light hover:bg-highlight cursor-pointer ${
        !notification.read ? 'bg-unread' : ''
      }`}
      name="masnamaste"
    >
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${getIconClass()}`}
      >
        {getIcon()}
      </div>
      
      <div className="flex-1"  onClick={onClick}>
        <div className="font-medium text-primary">{notification.title}</div>
        <div className="text-sm text-text-muted mt-1">{notification.description}</div>
        <div className="flex items-center mt-2">
          <div className="text-xs text-text-muted">{notification.time}</div>
          <div className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getBadgeClass()}`}>
            {notification.badge}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col ml-2">
        {!notification.read && (
          <button 
            onClick={(e) => { e.stopPropagation(); onMarkAsRead(); }}
            className="p-1 mb-2 text-text-muted hover:text-primary hover:bg-highlight rounded-full"
            title="Marcar como leída"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-text-muted hover:text-danger hover:bg-highlight rounded-full"
          title="Eliminar"
        >          
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;