// Dashboard/DateSelector.jsx
import React from 'react';

const DateSelector = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { id: '1d', label: 'Hoy' },
    { id: '7d', label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: '1y', label: 'Este año' }
  ];

  return (
    <div className="flex gap-3">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${selectedPeriod === period.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default DateSelector;