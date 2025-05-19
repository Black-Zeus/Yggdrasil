import React, { useState } from 'react';

// Componente para preguntas de tipo rango
const RangeQuestion = ({ id, prompt, required, value, onChange }) => {
    const [displayValue, setDisplayValue] = useState(value || 5);
  
    const handleChange = (e) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);
      onChange(newValue);
    };
  
    return (
      <div>
        <div className="flex items-center">
          <input
            type="range"
            id={id}
            min="1"
            max="10"
            step="1"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            required={required}
            value={displayValue}
            onChange={handleChange}
          />
          <span className="ml-3 text-lg font-medium">{displayValue}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    );
  };
  
  export default RangeQuestion;