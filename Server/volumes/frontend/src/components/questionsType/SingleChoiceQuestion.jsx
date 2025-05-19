import React from 'react';

// Componente para preguntas de tipo opción única
const SingleChoiceQuestion = ({ id, prompt, required, options, value, onChange }) => {
    return (
      <div>
        <fieldset>
          <legend className="sr-only">{prompt}</legend>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${id}-${option.value}`}
                  name={id}
                  type="radio"
                  className="h-4 w-4 text-blue-600 border-gray-300"
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  required={required}
                />
                <label htmlFor={`${id}-${option.value}`} className="ml-3 block text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    );
  };
  
  export default SingleChoiceQuestion;