import React from 'react';

const NotificationDetail = ({ notification, onBack }) => {
  if (!notification) {
    return null;
  }

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

  // Formatear el texto completo con saltos de línea
  const formatFullText = () => {
    if (!notification.details || !notification.details.fullText) {
      return notification.description;
    }
    
    return notification.details.fullText.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="p-6 border-b border-border-light">
      <button 
        onClick={onBack}
        className="flex items-center text-primary hover:text-primary-light mb-4"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="mr-2"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver a la lista
      </button>
      
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getIconClass()}`}>
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold text-primary">{notification.title}</h3>
      </div>
      
      <div className="flex items-center mb-6 text-sm text-text-muted">
        <div className="mr-4">Recibido: {notification.date}, {notification.time.replace('Hace ', '')}</div>
        <div className={`px-2 py-0.5 text-xs rounded-full ${getBadgeClass()}`}>
          {notification.badge}
        </div>
      </div>
      
      <div className="text-sm text-primary leading-relaxed mb-6 whitespace-pre-line">
        {formatFullText()}
      </div>
      
      {notification.type === 'evaluation' && (
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors">
            Ver evaluación
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDetail;