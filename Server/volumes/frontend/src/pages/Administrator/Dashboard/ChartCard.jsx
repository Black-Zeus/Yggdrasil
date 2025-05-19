// Dashboard/ChartCard.jsx
import React, { useState } from 'react';

const ChartCard = ({ title, type, options }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
        {/* Aquí iría el componente de gráfico real */}
        <p className="text-gray-500">
          [{type === 'bar' ? 'Gráfico de Barras' : 'Gráfico de Línea'} - {title}]
        </p>
      </div>
    </div>
  );
};

export default ChartCard;