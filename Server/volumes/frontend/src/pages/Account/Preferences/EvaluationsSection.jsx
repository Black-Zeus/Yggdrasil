import React from 'react';

const EvaluationsSection = ({ preferences, onChange, onExportFormatChange }) => {
  const { automaticReminders, reminderTime, resultsView, exportFormats } = preferences;
  
  const handleToggle = () => {
    onChange('automaticReminders', !automaticReminders);
  };
  
  const handleReminderTimeChange = (e) => {
    onChange('reminderTime', e.target.value);
  };
  
  const handleResultsViewChange = (view) => {
    onChange('resultsView', view);
  };
  
  const handleFormatToggle = (format) => {
    onExportFormatChange(format, !exportFormats[format]);
  };
  
  // Opciones de formatos de exportación
  const exportOptions = [
    { id: 'pdf', label: 'PDF' },
    { id: 'excel', label: 'Excel' },
    { id: 'csv', label: 'CSV' },
    { id: 'word', label: 'Word' }
  ];

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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Preferencias de Evaluaciones</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-2">
            <div className="relative inline-block w-12 h-6 mr-3">
              <input 
                type="checkbox" 
                className="opacity-0 w-0 h-0"
                checked={automaticReminders}
                onChange={handleToggle}
                id="toggle-automatic-reminders"
              />
              <label 
                htmlFor="toggle-automatic-reminders"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-300 ${
                  automaticReminders ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                    automaticReminders ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
            <span className="text-sm font-medium">Recordatorios automáticos</span>
          </div>
          <p className="text-xs text-text-muted ml-15 mb-4">
            Recibe recordatorios antes del vencimiento de evaluaciones
          </p>
        </div>
        
        <div>
          <label className="block font-medium text-primary mb-2">
            Antelación de recordatorios
          </label>
          <select
            value={reminderTime}
            onChange={handleReminderTimeChange}
            className="w-full p-2 border border-border rounded-md"
            disabled={!automaticReminders}
          >
            <option value="1day">1 día antes</option>
            <option value="3days">3 días antes</option>
            <option value="1week">1 semana antes</option>
            <option value="2weeks">2 semanas antes</option>
          </select>
        </div>
        
        <div>
          <label className="block font-medium text-primary mb-2">
            Vista predeterminada de resultados
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="resultsView"
                checked={resultsView === 'detailed'}
                onChange={() => handleResultsViewChange('detailed')}
                className="mr-2"
              />
              <span className="text-sm">Detallada</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="resultsView"
                checked={resultsView === 'summary'}
                onChange={() => handleResultsViewChange('summary')}
                className="mr-2"
              />
              <span className="text-sm">Resumida</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block font-medium text-primary mb-2">
            Formatos de exportación disponibles
          </label>
          <p className="text-xs text-text-muted mb-2">
            Selecciona los formatos que deseas tener disponibles al exportar evaluaciones
          </p>
          <div className="grid grid-cols-2 gap-3">
            {exportOptions.map((format) => (
              <div key={format.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`format-${format.id}`}
                  checked={exportFormats[format.id]}
                  onChange={() => handleFormatToggle(format.id)}
                  className="mr-2"
                />
                <label htmlFor={`format-${format.id}`} className="text-sm">
                  {format.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsSection;