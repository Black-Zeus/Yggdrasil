import React from 'react';

// Componente para preguntas de tipo selección múltiple
const MultipleChoiceQuestion = ({ id, prompt, required, options, value, onChange }) => {
    const handleChange = (optionValue) => {
      const newValue = [...value];
      const index = newValue.indexOf(optionValue);
      
      if (index === -1) {
        newValue.push(optionValue);
      } else {
        newValue.splice(index, 1);
      }
      
      onChange(newValue);
    };
  
    return (
      <div>
        <fieldset>
          <legend className="sr-only">{prompt}</legend>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${id}-${option.value}`}
                  name={`${id}-${option.value}`}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  value={option.value}
                  checked={value.includes(option.value)}
                  onChange={() => handleChange(option.value)}
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
  
  export default MultipleChoiceQuestion;