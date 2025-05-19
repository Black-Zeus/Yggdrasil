// Device/DeviceList/DeviceCard.jsx
import React from 'react';
import IconResolve_RI from '../../../../components/atoms/IconResolve_RI';

const DeviceCard = ({ device, onAction }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{device.name}</h3>
          <span className="text-sm text-gray-500">
            {device.type} {device.version} • v{device.appVersion}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          device.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {device.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {device.offlineForms}
          </div>
          <div className="text-xs text-gray-500">Forms Offline</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {device.lastSync}
          </div>
          <div className="text-xs text-gray-500">Último Sync</div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onAction(device.id, 'reset')}
          className="flex items-center justify-center flex-1 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
        >
          <IconResolve_RI name="RiRefreshLine" className="w-4 h-4 mr-2" />
          Resetear
        </button>
        <button
          onClick={() => onAction(device.id, 'details')}
          className="flex items-center justify-center flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <IconResolve_RI name="RiExternalLinkLine" className="w-4 h-4 mr-2" />
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;