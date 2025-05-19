// Statistics/PeriodSelector.jsx
import React from 'react';

const periods = [
  { id: '1d', label: 'Hoy' },
  { id: '7d', label: '7 días' },
  { id: '30d', label: '30 días' },
  { id: '1y', label: 'Este año' }
];

const PeriodSelector = ({ selectedPeriod, onChange }) => {
  return (
    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
      {periods.map(period => (
        <button
          key={period.id}
          onClick={() => onChange(period.id)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${selectedPeriod === period.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;