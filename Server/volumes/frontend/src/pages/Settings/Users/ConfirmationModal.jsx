import React from 'react';

const ConfirmationModal = ({ user, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !user) return null;

  // Determinar el mensaje según el estado del usuario
  const getActionMessages = () => {
    if (user.status === 'active') {
      return {
        title: '¿Desactivar usuario?',
        description: `Está a punto de desactivar al usuario ${user.name}. El usuario no podrá acceder al sistema, pero sus datos se mantendrán.`,
        buttonText: 'Desactivar',
        buttonColor: 'bg-warning hover:bg-warning-dark'
      };
    } else if (user.status === 'inactive') {
      return {
        title: '¿Activar usuario?',
        description: `Está a punto de activar al usuario ${user.name}. El usuario podrá acceder al sistema nuevamente.`,
        buttonText: 'Activar',
        buttonColor: 'bg-success hover:bg-success-dark'
      };
    } else if (user.status === 'pending') {
      return {
        title: '¿Reenviar invitación?',
        description: `Está a punto de reenviar la invitación a ${user.name}. Se enviará un nuevo correo electrónico de invitación.`,
        buttonText: 'Reenviar invitación',
        buttonColor: 'bg-info hover:bg-info-dark'
      };
    }
  };

  const actionMsg = getActionMessages();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-light rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text">
            Confirmar acción
          </h3>
          <button 
            className="text-2xl text-text-muted hover:text-text"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="p-6 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-12 h-12 mx-auto mb-4 text-warning" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          
          <h4 className="text-lg font-semibold mb-2">{actionMsg.title}</h4>
          <p className="text-text-muted mb-0">{actionMsg.description}</p>
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t border-border-light bg-highlight">
          <button 
            className="px-4 py-2 border border-border rounded-md text-sm text-text-muted hover:bg-border-light transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className={`px-4 py-2 text-white rounded-md text-sm transition-colors ${actionMsg.buttonColor}`}
            onClick={onConfirm}
          >
            {actionMsg.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;