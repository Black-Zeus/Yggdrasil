// Dashboard/CategoryMetrics.jsx
import React from 'react';

const CategoryMetrics = ({ title, metrics }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <ul className="space-y-4">
        {metrics.map((metric, index) => (
          <li 
            key={index}
            className={`flex justify-between items-center py-2 ${
              index !== metrics.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <span className="text-gray-500 text-sm">{metric.name}</span>
            <span className="font-medium text-gray-800">{metric.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMetrics;