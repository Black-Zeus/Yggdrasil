// Statistics/Header.jsx
import React from 'react';
import PeriodSelector from './PeriodSelector';

const Header = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Estadísticas
      </h1>
      <PeriodSelector 
        selectedPeriod={selectedPeriod}
        onChange={onPeriodChange}
      />
    </div>
  );
};

export default Header;