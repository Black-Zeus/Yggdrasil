import React from 'react';

// Componente para preguntas de tipo sí/no
const YesNoQuestion = ({ id, prompt, required, value, onChange }) => {
    return (
      <div>
        <fieldset>
          <legend className="sr-only">{prompt}</legend>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                id={`${id}-yes`}
                name={id}
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300"
                value="yes"
                checked={value === "yes"}
                onChange={() => onChange("yes")}
                required={required}
              />
              <label htmlFor={`${id}-yes`} className="ml-3 block text-gray-700">
                Sí
              </label>
            </div>
            <div className="flex items-center">
              <input
                id={`${id}-no`}
                name={id}
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300"
                value="no"
                checked={value === "no"}
                onChange={() => onChange("no")}
                required={required}
              />
              <label htmlFor={`${id}-no`} className="ml-3 block text-gray-700">
                No
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    );
  };

  export default YesNoQuestion;