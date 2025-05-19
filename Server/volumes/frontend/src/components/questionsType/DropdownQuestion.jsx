import React from 'react';

// Componente para preguntas de tipo dropdown
const DropdownQuestion = ({ id, prompt, required, options, value, onChange }) => {
    return (
      <div>
        <select
          id={id}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{prompt}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default DropdownQuestion;