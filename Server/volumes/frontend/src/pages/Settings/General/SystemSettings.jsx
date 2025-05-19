import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const SystemSettings = () => {
  return (
    <div className="p-6 border-b border-border-light">
      <div className="flex items-center mb-5">
        <svg className="w-6 h-6 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
          </path>
        </svg>
        <h2 className="text-lg font-semibold text-primary m-0">Configuración del Sistema</h2>
      </div>

      <div className="mb-5">
        <ToggleSwitch 
          label="Activar notificaciones por correo electrónico" 
          defaultChecked={true} 
        />
        <p className="text-xs text-text-muted mt-1">Enviar correos electrónicos para notificaciones importantes del sistema.</p>
      </div>

      <div className="mb-5">
        <ToggleSwitch 
          label="Mostrar estadísticas en el dashboard" 
          defaultChecked={true} 
        />
        <p className="text-xs text-text-muted mt-1">
          Muestra gráficos y estadísticas en la página principal para todos los usuarios.
        </p>
      </div>

      <div className="mb-5">
        <ToggleSwitch 
          label="Modo de mantenimiento" 
          defaultChecked={false} 
        />
        <p className="text-xs text-text-muted mt-1">
          Activa el modo de mantenimiento para realizar actualizaciones. Solo administradores podrán acceder.
        </p>
      </div>

      <div className="mb-5">
        <label className="block font-medium mb-2 text-text" htmlFor="session-timeout">Tiempo de expiración de sesión</label>
        <select 
          id="session-timeout" 
          className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
          defaultValue="30"
        >
          <option value="15">15 minutos</option>
          <option value="30">30 minutos</option>
          <option value="60">1 hora</option>
          <option value="120">2 horas</option>
          <option value="240">4 horas</option>
          <option value="480">8 horas</option>
        </select>
        <p className="text-xs text-text-muted mt-1">Tiempo después del cual se cerrará la sesión por inactividad.</p>
      </div>
    </div>
  );
};

export default SystemSettings;
