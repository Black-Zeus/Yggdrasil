// Permissions/PermissionItem.jsx
import React, { useState } from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const PermissionItem = ({ permission, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = permission.children && permission.children.length > 0;

  return (
    <div className="mb-3">
      <div 
        className="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <IconResolve_RI name="RiArrowRightSLine" 
            className={`w-5 h-5 mr-2 text-gray-500 transition-transform ${
              isExpanded ? 'transform rotate-90' : ''
            }`}
          />
        )}
        
        <span className="flex-1 text-sm font-medium text-gray-700">
          {permission.name}
        </span>

        <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            className="sr-only peer"
            checked={permission.enabled}
            onChange={() => onToggle(permission.id)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-6 pl-4 border-l border-gray-200 mt-2">
          {permission.children.map(child => (
            <PermissionItem
              key={child.id}
              permission={child}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionItem;