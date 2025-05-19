// Support/StatusSection.jsx
import React from 'react';

const StatusSection = () => {
  const services = [
    {
      id: 1,
      name: 'Aplicación Web',
      status: 'operational',
      description: 'Operativo'
    },
    {
      id: 2,
      name: 'API',
      status: 'operational',
      description: 'Operativo'
    },
    {
      id: 3,
      name: 'Base de Datos',
      status: 'degraded',
      description: 'Rendimiento Degradado'
    },
    {
      id: 4,
      name: 'Servicio de Archivos',
      status: 'operational',
      description: 'Operativo'
    },
    {
      id: 5,
      name: 'Autenticación',
      status: 'operational',
      description: 'Operativo'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-success';
      case 'degraded':
        return 'bg-warning';
      case 'outage':
        return 'bg-danger';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'degraded':
        return 'text-warning';
      case 'outage':
        return 'text-danger';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-12 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Estado del Sistema
      </h2>
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} mr-4`}
            />
            <div className="flex-1 font-medium text-gray-800 dark:text-white">
              {service.name}
            </div>
            <div className={`${getStatusText(service.status)}`}>
              {service.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusSection;