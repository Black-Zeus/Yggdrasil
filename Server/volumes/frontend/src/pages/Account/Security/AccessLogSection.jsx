import React from 'react';

const AccessLogSection = ({ logs = [] }) => {
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
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Registro de Acceso</h2>
      </div>
      
      <p className="text-sm mb-4">
        Revisa los accesos recientes a tu cuenta. Si detectas alguna actividad sospechosa, 
        cambia tu contraseña inmediatamente.
      </p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-highlight">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                Dirección IP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                Dispositivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-highlight">
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    {log.date}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    {log.ip}
                  </td>
                  <td className="px-6 py-3 whitespace, -nowrap text-sm text-gray-700">
                    {log.location}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    {log.device}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status === 'Exitoso'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay registros de acceso disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {logs.length > 4 && (
        <div className="mt-4 flex justify-center">
          <button className="text-primary hover:text-primary-light text-sm">
            Ver historial completo
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessLogSection;