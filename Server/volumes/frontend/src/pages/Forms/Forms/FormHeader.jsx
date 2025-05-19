// Forms/FormHeader.jsx
import React from 'react';

const FormHeader = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        {title}
      </h1>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default FormHeader;