// Permissions/PermissionTree.jsx
import React from 'react';
import PermissionItem from './PermissionItem';

const PermissionTree = ({ permissions, onToggle, onToggleAll, isLoading }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Permisos del rol
        </h2>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Seleccionar todo</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={(e) => onToggleAll(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {permissions.map(permission => (
            <PermissionItem
              key={permission.id}
              permission={permission}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionTree;