import React  from 'react';

// Componente para preguntas de tipo hora
const TimeQuestion = ({ id, prompt, required, value, onChange }) => {
    return (
      <div>
        <input
          type="time"
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
  
  export default TimeQuestion;