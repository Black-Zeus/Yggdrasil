// Dashboard/KPICard.jsx
import React from 'react';

const KPICard = ({ title, value, trend, trendText, icon }) => {
  const isTrendPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <img src={icon} alt={title} className="w-6 h-6" />
      </div>
      
      <div className="text-2xl font-bold text-gray-800 mb-2">
        {value}
      </div>
      
      <div className={`flex items-center text-sm ${
        isTrendPositive ? 'text-green-500' : 'text-red-500'
      }`}>
        <span>{trend}</span>
        <span className="ml-1 text-gray-500">{trendText}</span>
      </div>
    </div>
  );
};

export default KPICard;