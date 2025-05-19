import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ 
  notifications, 
  onNotificationClick, 
  onMarkAsRead, 
  onDeleteNotification 
}) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="flex items-center justify-center w-full max-w-[100px] h-[100px] mb-4">
          <svg 
            className="w-full h-full text-text-muted opacity-50" 
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
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">No hay notificaciones</h3>
        <p className="text-text-muted max-w-md">
          No tienes notificaciones que coincidan con los filtros actuales. 
          Intenta cambiar los filtros o revisa más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[200px]" name="otronamaste">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification.id)}
          onMarkAsRead={() => onMarkAsRead(notification.id)}
          onDelete={() => onDeleteNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationList;