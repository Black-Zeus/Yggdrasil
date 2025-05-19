import React from 'react';

const SessionsSection = ({ sessions = [], onLogoutSession, onLogoutAllSessions }) => {
  // Función para determinar el icono según el tipo de dispositivo
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        );
      case 'tablet':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        );
      case 'desktop':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-5">
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
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Sesiones Activas</h2>
      </div>
      
      <p className="text-sm mb-4">
        Dispositivos en los que actualmente tienes una sesión abierta. Puedes cerrar sesión 
        en dispositivos individuales o en todos a la vez.
      </p>
      
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className="flex items-center justify-between p-4 border border-border-light rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-highlight rounded-full mr-4">
                  {getDeviceIcon(session.deviceType)}
                </div>
                <div>
                  <div className="font-medium text-primary">
                    {session.device}
                    {session.isCurrent && (
                      <span className="ml-2 text-xs px-2 py-1 bg-highlight text-primary rounded-full">
                        Actual
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted">
                    Última actividad: {session.lastActive} · {session.location}
                  </div>
                </div>
              </div>
              
              {!session.isCurrent && (
                <button
                  onClick={() => onLogoutSession(session.id)}
                  className="px-3 py-1 bg-danger text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          ))}
          
          <div className="mt-6 pt-6 border-t border-border-light">
            <button
              onClick={onLogoutAllSessions}
              className="px-4 py-2 bg-danger text-white rounded hover:bg-red-600 transition-colors"
            >
              Cerrar sesión en todos los dispositivos
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-text-muted">
          No hay sesiones activas además de la actual.
        </div>
      )}
    </div>
  );
};

export default SessionsSection;