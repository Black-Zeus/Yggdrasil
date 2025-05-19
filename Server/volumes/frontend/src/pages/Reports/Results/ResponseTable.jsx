// Results/ResponseTable.jsx
import React, { useState } from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';
import logger from '../../../utils/logger';

const ResponseTable = ({ formId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - Esto vendría de una API
  const responses = [
    {
      id: 1,
      respondent: 'Juan Pérez',
      date: '2025-04-20 15:30',
      status: 'completed',
      duration: '7m 30s',
      score: '85%'
    },
    {
      id: 2,
      respondent: 'María García',
      date: '2025-04-20 14:15',
      status: 'completed',
      duration: '8m 45s',
      score: '92%'
    },
    {
      id: 3,
      respondent: 'Carlos López',
      date: '2025-04-20 13:00',
      status: 'incomplete',
      duration: '5m 20s',
      score: '-'
    }
  ];

  const handleExport = () => {
    logger.info('ResponseTable','Exportando respuestas...');
    // Implementar lógica de exportación
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = response.respondent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || response.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Respuestas</h2>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <IconResolve_RI name="RiDownloadLine" className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>

        <div className="flex gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <IconResolve_RI name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Filtro */}
          <div className="relative">
            <IconResolve_RI name="RiFilterLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completados</option>
              <option value="incomplete">Incompletos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Respondente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntuación
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResponses.map(response => (
              <tr key={response.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {response.respondent}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(response.date).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    response.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {response.status === 'completed' ? 'Completado' : 'Incompleto'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {response.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {response.score}
                </td>
              </tr>
            ))}

            {filteredResponses.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No se encontraron respuestas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseTable;