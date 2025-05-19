import React, { useState } from 'react';
import NotificationsSection from './Preferences/NotificationsSection';
import DashboardSection from './Preferences/DashboardSection';
import EvaluationsSection from './Preferences/EvaluationsSection';
import logger from '../../utils/logger';

const Preferences = () => {
  // Estados para las diferentes secciones de preferencias
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newEvaluations: true,
    deadlineReminders: true,
    evaluationComments: true
  });

  const [dashboardPrefs, setDashboardPrefs] = useState({
    widgets: {
      performanceStats: true,
      pendingEvaluations: true,
      recentActivity: false,
      evaluationsCalendar: true,
      periodObjectives: false,
      recentComments: false,
      evaluationsHistory: false,
      competenceProgress: false,
      teamComparison: false
    },
    defaultPeriod: 'quarter',
    dataVisualization: 'charts'
  });

  const [evaluationPrefs, setEvaluationPrefs] = useState({
    automaticReminders: true,
    reminderTime: '3days',
    resultsView: 'detailed',
    exportFormats: {
      pdf: true,
      excel: true,
      csv: false,
      word: false
    }
  });

  // Manejadores de cambios
  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWidgetChange = (widgetId, checked) => {
    setDashboardPrefs(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetId]: checked
      }
    }));
  };

  const handleDashboardChange = (field, value) => {
    setDashboardPrefs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEvaluationChange = (field, value) => {
    setEvaluationPrefs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportFormatChange = (format, checked) => {
    setEvaluationPrefs(prev => ({
      ...prev,
      exportFormats: {
        ...prev.exportFormats,
        [format]: checked
      }
    }));
  };

  // Restablecer valores predeterminados
  const handleResetDefaults = () => {
    setNotifications({
      emailNotifications: true,
      newEvaluations: true,
      deadlineReminders: true,
      evaluationComments: true
    });

    setDashboardPrefs({
      widgets: {
        performanceStats: true,
        pendingEvaluations: true,
        recentActivity: false,
        evaluationsCalendar: true,
        periodObjectives: false,
        recentComments: false,
        evaluationsHistory: false,
        competenceProgress: false,
        teamComparison: false
      },
      defaultPeriod: 'quarter',
      dataVisualization: 'charts'
    });

    setEvaluationPrefs({
      automaticReminders: true,
      reminderTime: '3days',
      resultsView: 'detailed',
      exportFormats: {
        pdf: true,
        excel: true,
        csv: false,
        word: false
      }
    });
  };

  // Guardar cambios
  const handleSaveChanges = (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica para guardar en el backend
    logger.info('Preferences.jsx','Guardando preferencias:', {
      notifications,
      dashboardPrefs,
      evaluationPrefs
    });
    
    // Mostrar alguna notificación de éxito
    alert('Preferencias guardadas correctamente');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <form onSubmit={handleSaveChanges}>
        <div className="bg-white rounded-lg shadow-subtle overflow-hidden mb-6">
          {/* Sección de Notificaciones */}
          <NotificationsSection 
            notifications={notifications} 
            onChange={handleNotificationChange} 
          />
          
          {/* Sección de Dashboard */}
          <DashboardSection 
            preferences={dashboardPrefs}
            onWidgetChange={handleWidgetChange}
            onChange={handleDashboardChange}
          />
          
          {/* Sección de Evaluaciones */}
          <EvaluationsSection 
            preferences={evaluationPrefs}
            onChange={handleEvaluationChange}
            onExportFormatChange={handleExportFormatChange}
          />
          
          {/* Botones de acción */}
          <div className="flex justify-end p-6 bg-highlight border-t border-border-light">
            <button
              type="button"
              className="px-4 py-2 border border-border text-text-muted rounded-md hover:bg-border-light transition-colors mr-3"
              onClick={handleResetDefaults}
            >
              Restablecer valores predeterminados
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Preferences;