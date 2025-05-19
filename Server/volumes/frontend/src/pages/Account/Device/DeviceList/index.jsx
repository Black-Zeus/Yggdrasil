// Device/DeviceList/index.jsx
import React from 'react';
import DeviceFilters from './DeviceFilters';
import DeviceCard from './DeviceCard';

const DeviceList = ({ devices, filters, onFilterChange, onDeviceAction }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Dispositivos Registrados
        </h2>
        <DeviceFilters 
          filters={filters}
          onChange={onFilterChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onAction={onDeviceAction}
          />
        ))}
        {devices.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron dispositivos con los filtros seleccionados
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceList;