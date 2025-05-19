// Backups/BackupTypeCard.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const BackupTypeCard = ({ type, title, description, iconName, isSelected, onClick }) => (
  <div
    onClick={() => onClick(type)}
    className={`p-4 border rounded-lg cursor-pointer transition-all ${
      isSelected 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <IconResolve_RI name={iconName} className={`w-6 h-6 ${isSelected ? 'text-blue-500' : 'text-gray-500'}`} />
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

export default BackupTypeCard;