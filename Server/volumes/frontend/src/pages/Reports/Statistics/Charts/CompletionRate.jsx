// Statistics/Charts/CompletionRate.jsx
import React from 'react';

const CompletionRate = ({ period }) => {
  const rate = 94;
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <svg className="w-32 h-32">
          <circle
            className="text-gray-200"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="64"
            cy="64"
          />
          <circle
            className="text-blue-600"
            strokeWidth="12"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="64"
            cy="64"
            style={{
              strokeDasharray: `${2 * Math.PI * 56}`,
              strokeDashoffset: `${2 * Math.PI * 56 * (1 - rate / 100)}`,
              transform: 'rotate(-90deg)',
              transformOrigin: 'center'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{rate}%</span>
        </div>
      </div>
    </div>
  );
};

export default CompletionRate;