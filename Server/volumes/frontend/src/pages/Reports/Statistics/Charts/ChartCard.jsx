// Statistics/Charts/ChartCard.jsx
import React, { useState } from 'react';
import IconResolve_RI from '../../../../components/atoms/IconResolve_RI';
import logger from '../../../../utils/logger';

const ChartCard = ({ title, children, fullWidth = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleExport = () => {
    logger.info('ChartCard','Exportando gráfico:', title);
    // Implementar lógica de exportación
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
          >
            <IconResolve_RI name="RiDownload2Line" className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
          >
            <IconResolve_RI name="RiExpandDiagonalLine" className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className={`p-4 ${isFullscreen ? 'h-[calc(100%-4rem)]' : 'h-[300px]'}`}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;