// Guides/GuideCard.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const GuideCard = ({ title, description, readTime, level, icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 transition-all hover:border-blue-500 hover:shadow-md cursor-pointer">
      <img 
        src={icon} 
        alt={title} 
        className="w-10 h-10 mb-4 p-2 bg-blue-50 rounded-lg"
      />
      
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
        {description}
      </p>
      
      <div className="flex items-center pt-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center mr-4">
          <IconResolve_RI name="RiTimeLine" className="w-4 h-4 mr-1" />
          <span>{readTime} min lectura</span>
        </div>
        <div className="flex items-center">
          <IconResolve_RI name="RiBookOpenLine" className="w-4 h-4 mr-1" />
          <span>{level}</span>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;