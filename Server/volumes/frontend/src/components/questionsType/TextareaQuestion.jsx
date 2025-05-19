import React from 'react';

// Componente para preguntas de tipo área de texto
const TextareaQuestion = ({ id, prompt, required, value, onChange }) => {
    return (
      <div>
        <textarea
          id={id}
          rows="4"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder={prompt}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
      </div>
    );
  };
  
  export default TextareaQuestion;