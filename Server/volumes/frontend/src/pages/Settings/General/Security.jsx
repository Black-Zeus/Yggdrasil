import React from 'react';
import logger from '../../../utils/logger';

const Security = () => {
  const handleCloseAllSessions = () => {
    // Lógica para cerrar todas las sesiones
    logger.info('Security','Cerrar todas las sesiones');
  };

  return (
    <div className="p-6 border-b border-border-light">
      <div className="flex items-center mb-5">
        <svg className="w-6 h-6 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <h2 className="text-lg font-semibold text-primary m-0">Seguridad</h2>
      </div>

      <div className="bg-danger-light/20 rounded-md p-4">
        <div className="text-base font-semibold text-danger mb-2">Zona de peligro</div>
        <div className="text-sm text-text-muted mb-4">
          Esta acción cerrará la sesión de todos los usuarios actualmente conectados al sistema. Todos
          deberán iniciar sesión nuevamente.
        </div>

        <button 
          className="py-2.5 px-4 rounded-md text-sm font-medium bg-danger text-white hover:bg-danger-dark transition-all flex items-center"
          onClick={handleCloseAllSessions}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="mr-2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <line x1="12" y1="15" x2="12" y2="19"></line>
          </svg>
          Cerrar todas las sesiones
        </button>
      </div>
    </div>
  );
};

export default Security;
