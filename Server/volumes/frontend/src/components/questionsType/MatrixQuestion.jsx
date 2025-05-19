import React from 'react';

// Componente para preguntas de tipo matriz
const MatrixQuestion = ({ id, prompt, required, items, options, value, onChange }) => {
    const handleOptionChange = (itemId, optionValue) => {
      onChange({
        ...value,
        [itemId]: optionValue
      });
    };
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 text-left"></th>
              {options.map((option) => (
                <th key={option.value} className="py-2 px-4 border-b-2 text-center">
                  {option.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b font-medium">{item.label}</td>
                {options.map((option) => (
                  <td key={option.value} className="py-2 px-4 border-b text-center">
                    <input
                      type="radio"
                      id={`${id}-${item.id}-${option.value}`}
                      name={`${id}-${item.id}`}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                      value={option.value}
                      checked={value[item.id] === option.value}
                      onChange={() => handleOptionChange(item.id, option.value)}
                      required={required && !value[item.id]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default MatrixQuestion;