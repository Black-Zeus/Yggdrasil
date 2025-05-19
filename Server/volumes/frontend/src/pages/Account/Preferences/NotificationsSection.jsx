import React from 'react';

const NotificationsSection = ({ notifications, onChange }) => {
  const handleToggle = (field) => {
    onChange(field, !notifications[field]);
  };

  return (
    <div className="p-6 border-b border-border-light">
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
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Notificaciones y Comunicaciones</h2>
      </div>
      
      <div className="mb-4">
        <label className="block font-medium text-primary mb-2">Configuración de notificaciones</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="relative inline-block w-12 h-6 mr-3">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={notifications.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                id="toggle-email-notifications"
              />
              <label 
                htmlFor="toggle-email-notifications"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-300 ${
                  notifications.emailNotifications ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    notifications.emailNotifications ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
            <span className="text-sm">Recibir notificaciones por email</span>
          </div>
          
          <div className="flex items-center">
            <div className="relative inline-block w-12 h-6 mr-3">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={notifications.newEvaluations}
                onChange={() => handleToggle('newEvaluations')}
                id="toggle-new-evaluations"
              />
              <label 
                htmlFor="toggle-new-evaluations"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-300 ${
                  notifications.newEvaluations ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    notifications.newEvaluations ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
            <span className="text-sm">Nuevas evaluaciones asignadas</span>
          </div>
          
          <div className="flex items-center">
            <div className="relative inline-block w-12 h-6 mr-3">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={notifications.deadlineReminders}
                onChange={() => handleToggle('deadlineReminders')}
                id="toggle-deadline-reminders"
              />
              <label 
                htmlFor="toggle-deadline-reminders"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-300 ${
                  notifications.deadlineReminders ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    notifications.deadlineReminders ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
            <span className="text-sm">Recordatorios de vencimiento</span>
          </div>
          
          <div className="flex items-center">
            <div className="relative inline-block w-12 h-6 mr-3">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={notifications.evaluationComments}
                onChange={() => handleToggle('evaluationComments')}
                id="toggle-evaluation-comments"
              />
              <label 
                htmlFor="toggle-evaluation-comments"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-300 ${
                  notifications.evaluationComments ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    notifications.evaluationComments ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
            <span className="text-sm">Comentarios en evaluaciones</span>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-2">Gestiona los tipos de notificaciones que deseas recibir</p>
      </div>
    </div>
  );
};

export default NotificationsSection;