import React, { useState } from 'react';

// Componente para preguntas de tipo texto
const TextQuestion = ({ id, prompt, required, validation, value, onChange }) => {
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      const newValue = e.target.value;
      onChange(newValue);
      
      // Validar si hay reglas de validación
      if (validation && validation.regex === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newValue)) {
          setError(validation.errorMessage || 'Correo inválido');
        } else {
          setError('');
        }
      }
    };
  
    return (
      <div>
        <input
          type="text"
          id={id}
          className={`mt-1 p-2 w-full border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
          placeholder={prompt}
          required={required}
          value={value}
          onChange={handleChange}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  };
  
  export default TextQuestion;