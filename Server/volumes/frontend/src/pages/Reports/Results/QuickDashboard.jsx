// Results/QuickDashboard.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const StatCard = ({ iconName, title, value, trend }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-start">
      <div className="p-2 bg-blue-50 rounded-lg">
        <IconResolve_RI name={iconName} className="w-5 h-5 text-blue-600" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        {trend && (
          <p className="text-sm text-green-600">
            {trend}
          </p>
        )}
      </div>
    </div>
  </div>
);

const QuickDashboard = ({ formId }) => {
  // Mock data - Esto vendría de una API
  const stats = {
    totalResponses: 45,
    completionRate: '94%',
    avgTime: '8.5 min',
    lastResponse: '2h atrás'
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Resumen Rápido
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          iconName="RiUserLine"
          title="Total Respuestas"
          value={stats.totalResponses}
          trend="↑ 12 esta semana"
        />
        
        <StatCard
          iconName="RiCheckboxCircleLine"
          title="Tasa de Completitud"
          value={stats.completionRate}
          trend="↑ 2% vs promedio"
        />
        
        <StatCard
          iconName="RiTimeLine"
          title="Tiempo Promedio"
          value={stats.avgTime}
          trend="↓ 1.2m mejora"
        />
        
        <StatCard
          iconName="RiCalendarLine"
          title="Última Respuesta"
          value={stats.lastResponse}
        />
      </div>
    </div>
  );
};

export default QuickDashboard;