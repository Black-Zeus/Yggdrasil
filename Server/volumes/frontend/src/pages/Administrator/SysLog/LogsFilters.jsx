// SysLog/LogsFilters.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const QuickFilter = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 rounded-full text-sm ${
      active 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const LogsFilters = ({ filters, onSearch, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <IconResolve_RI name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Período */}
          <div className="relative">
            <IconResolve_RI name="RiCalendarLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => onFilterChange('period', e.target.value)}
            >
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Última semana</option>
              <option value="30d">Último mes</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Severidad */}
          <div className="relative">
            <IconResolve_RI name="RiErrorWarningLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.severity}
              onChange={(e) => onFilterChange('severity', e.target.value)}
            >
              <option value="all">Todas las severidades</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Módulo */}
          <div className="relative">
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.module}
              onChange={(e) => onFilterChange('module', e.target.value)}
            >
              <option value="all">Todos los módulos</option>
              <option value="forms">Formularios</option>
              <option value="users">Usuarios</option>
              <option value="system">Sistema</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 flex gap-2 overflow-x-auto">
        <QuickFilter label="Todos" active={true} />
        <QuickFilter label="Errores" />
        <QuickFilter label="Formularios" />
        <QuickFilter label="Usuarios" />
        <QuickFilter label="Seguridad" />
        <QuickFilter label="Sistema" />
      </div>
    </div>
  );
};

export default LogsFilters;