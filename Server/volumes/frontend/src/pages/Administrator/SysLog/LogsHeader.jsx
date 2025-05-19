// SysLog/LogsHeader.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const LogsHeader = ({ onExport }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Logs del Sistema</h1>
      <button
        onClick={onExport}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <IconResolve_RI name="RiDownloadLine" className="w-5 h-5 mr-2" />
        Exportar Logs
      </button>
    </div>
  );
};

export default LogsHeader;