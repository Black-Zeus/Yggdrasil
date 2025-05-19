import React from 'react';

const DashboardSection = ({ preferences, onWidgetChange, onChange }) => {
  const { widgets, defaultPeriod, dataVisualization } = preferences;
  
  // Mapeo de widgets para la interfaz de usuario
  const widgetOptions = [
    { id: 'performanceStats', label: 'Estadísticas de rendimiento' },
    { id: 'pendingEvaluations', label: 'Evaluaciones pendientes' },
    { id: 'recentActivity', label: 'Actividad reciente' },
    { id: 'evaluationsCalendar', label: 'Calendario de evaluaciones' },
    { id: 'periodObjectives', label: 'Objetivos del período' },
    { id: 'recentComments', label: 'Comentarios recientes' },
    { id: 'evaluationsHistory', label: 'Historial de evaluaciones' },
    { id: 'competenceProgress', label: 'Progreso de competencias' },
    { id: 'teamComparison', label: 'Comparativa con equipo' }
  ];

  const handleWidgetToggle = (widgetId) => {
    onWidgetChange(widgetId, !widgets[widgetId]);
  };

  const handlePeriodChange = (e) => {
    onChange('defaultPeriod', e.target.value);
  };

  const handleVisualizationChange = (visualization) => {
    onChange('dataVisualization', visualization);
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
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Visualización del Dashboard</h2>
      </div>
      
      <div className="mb-6">
        <label className="block font-medium text-primary mb-2">Widgets prioritarios</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {widgetOptions.map((widget) => (
            <div key={widget.id} className="flex items-start">
              <input
                type="checkbox"
                id={`widget-${widget.id}`}
                checked={widgets[widget.id]}
                onChange={() => handleWidgetToggle(widget.id)}
                className="mt-1 mr-2"
              />
              <label htmlFor={`widget-${widget.id}`} className="text-sm">
                {widget.label}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-2">Selecciona los widgets que deseas mostrar en tu dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-primary mb-2">
            Período predeterminado para informes
          </label>
          <select
            value={defaultPeriod}
            onChange={handlePeriodChange}
            className="w-full p-2 border border-border rounded-md"
          >
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
            <option value="all">Todo el historial</option>
          </select>
        </div>
        
        <div>
          <label className="block font-medium text-primary mb-2">
            Visualización de datos preferida
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="dataVisualization"
                checked={dataVisualization === 'charts'}
                onChange={() => handleVisualizationChange('charts')}
                className="mr-2"
              />
              <span className="text-sm">Gráficos</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="dataVisualization"
                checked={dataVisualization === 'tables'}
                onChange={() => handleVisualizationChange('tables')}
                className="mr-2"
              />
              <span className="text-sm">Tablas</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="dataVisualization"
                checked={dataVisualization === 'cards'}
                onChange={() => handleVisualizationChange('cards')}
                className="mr-2"
              />
              <span className="text-sm">Tarjetas</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;