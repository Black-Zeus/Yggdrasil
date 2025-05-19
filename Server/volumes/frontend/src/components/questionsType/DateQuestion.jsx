import React from 'react';

// Componente para preguntas de tipo fecha
const DateQuestion = ({ id, prompt, required, value, onChange }) => {
    return (
      <div>
        <input
          type="date"
          id={id}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder={prompt}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };
  
  export default DateQuestion;