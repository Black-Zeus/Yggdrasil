import React from 'react';

const NotificationHeader = ({ onMarkAllAsRead }) => {
  return (
    <div className="flex justify-between items-center p-6 border-b border-border-light">
      <div className="flex items-center">
        <svg 
          className="w-6 h-6 mr-3 text-primary" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Notificaciones</h2>
      </div>
      
      <button 
        className="flex items-center px-4 py-2 border border-border rounded-md hover:bg-highlight transition-colors"
        onClick={onMarkAllAsRead}
      >
        <svg 
          className="w-4 h-4 mr-2" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
        Marcar todas como leídas
      </button>
    </div>
  );
};

export default NotificationHeader;