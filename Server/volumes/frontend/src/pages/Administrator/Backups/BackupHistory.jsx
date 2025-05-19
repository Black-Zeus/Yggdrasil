// Backups/BackupHistory.jsx
import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const BackupHistory = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    period: '7d'
  });

  // Mock data para ejemplo
  const backups = [
    {
      id: 1,
      date: '2025-04-20 00:00',
      type: 'database',
      source: 'Automático',
      size: '256 MB',
      status: 'success',
      duration: '2m 15s'
    },
    {
      id: 2,
      date: '2025-04-19 15:30',
      type: 'minio',
      source: 'Manual',
      size: '1.2 GB',
      status: 'error',
      duration: '5m 45s'
    },
    {
      id: 3,
      date: '2025-04-19 00:00',
      type: 'full',
      source: 'Automático',
      size: '1.5 GB',
      status: 'success',
      duration: '8m 30s'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Historial de Backups</h2>
      </div>

      <div className="p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">Todos los tipos</option>
            <option value="database">Base de datos</option>
            <option value="minio">Minio</option>
            <option value="full">Completo</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Todos los estados</option>
            <option value="success">Exitoso</option>
            <option value="error">Error</option>
            <option value="running">En progreso</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.period}
            onChange={(e) => setFilters({ ...filters, period: e.target.value })}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Último mes</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backup.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backup.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={backup.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {backup.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BackupHistory;