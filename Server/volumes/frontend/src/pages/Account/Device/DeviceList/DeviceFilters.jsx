// Device/DeviceList/DeviceFilters.jsx
import React from 'react';
import IconResolve_RI from '../../../../components/atoms/IconResolve_RI';


const DeviceFilters = ({ filters, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center text-sm text-gray-500">
        <IconResolve_RI name="RiFilterLine" className="w-4 h-4 mr-2" />
        Filtrar por:
      </div>
      
      <select
        className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm text-gray-700"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
      >
        <option value="all">Todos los tipos</option>
        <option value="IOS">iOS</option>
        <option value="ANDROID">Android</option>
      </select>
      
      <select
        className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm text-gray-700"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="all">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
    </div>
  );
};

export default DeviceFilters;