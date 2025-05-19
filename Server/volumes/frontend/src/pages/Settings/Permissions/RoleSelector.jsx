// Permissions/RoleSelector.jsx
import React from 'react';

const RoleSelector = ({ selectedRole, onRoleChange, onSaveTemplate }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Rol asignado</h2>
      
      <select 
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="admin">Administrador</option>
        <option value="editor">Editor</option>
        <option value="viewer">Visualizador</option>
        <option value="custom">Personalizado</option>
      </select>

      <div className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-800 text-xs font-medium rounded-md mb-4">
        4 modificaciones del rol base
      </div>

      <button
        onClick={onSaveTemplate}
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        Guardar como plantilla
      </button>
    </div>
  );
};

export default RoleSelector;