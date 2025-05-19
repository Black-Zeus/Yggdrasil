import React from 'react';

const RegionalSettings = () => {
  return (
    <div className="p-6 border-b border-border-light">
      <div className="flex items-center mb-5">
        <svg className="w-6 h-6 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path
            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
          </path>
        </svg>
        <h2 className="text-lg font-semibold text-primary m-0">Configuración Regional</h2>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="timezone">Zona horaria</label>
            <select 
              id="timezone" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="America/Mexico_City"
            >
              <option value="America/Mexico_City">América/Ciudad de México (UTC-6)</option>
              <option value="America/Tijuana">América/Tijuana (UTC-8)</option>
              <option value="America/Cancun">América/Cancún (UTC-5)</option>
              <option value="America/New_York">América/Nueva York (UTC-5)</option>
              <option value="Europe/Madrid">Europa/Madrid (UTC+1)</option>
            </select>
            <p className="text-xs text-text-muted mt-1">La zona horaria se utilizará para mostrar fechas y programar eventos.</p>
          </div>
        </div>

        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="language">Idioma predeterminado</label>
            <select 
              id="language" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="es"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
              <option value="pt">Portugués</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="date-format">Formato de fecha</label>
            <select 
              id="date-format" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="DD/MM/YYYY"
            >
              <option value="DD/MM/YYYY">DD/MM/AAAA (31/12/2025)</option>
              <option value="MM/DD/YYYY">MM/DD/AAAA (12/31/2025)</option>
              <option value="YYYY-MM-DD">AAAA-MM-DD (2025-12-31)</option>
            </select>
          </div>
        </div>

        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="time-format">Formato de hora</label>
            <select 
              id="time-format" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="24h"
            >
              <option value="24h">24 horas (14:30)</option>
              <option value="12h">12 horas (2:30 PM)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className="block font-medium mb-2 text-text" htmlFor="first-day">Primer día de la semana</label>
        <select 
          id="first-day" 
          className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
          defaultValue="1"
        >
          <option value="1">Lunes</option>
          <option value="0">Domingo</option>
        </select>
        <p className="text-xs text-text-muted mt-1">Se utilizará para calendarios y vistas semanales.</p>
      </div>
    </div>
  );
};

export default RegionalSettings;