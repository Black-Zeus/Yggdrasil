// Device/Header.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const Header = ({ onEnroll }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Device Manager
      </h1>
      <button
        onClick={onEnroll}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <IconResolve_RI name="RiQrCodeLine" className="w-5 h-5" />
        Enrolar Nuevo Dispositivo
      </button>
    </div>
  );
};

export default Header;