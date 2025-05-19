// Forms/SectionDivider.jsx
import React from 'react';

const SectionDivider = ({ title, icon }) => {
  return (
    <div className="flex items-center mt-8 mb-6 pb-3 border-b-2 border-gray-200">
      <div className="mr-3">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>
    </div>
  );
};

export default SectionDivider;