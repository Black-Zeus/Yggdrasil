import React from 'react';
import OrganizationInfo from './General/OrganizationInfo';
import BrandAndLogo from './General/BrandAndLogo';
import RegionalSettings from './General/RegionalSettings';
import SystemSettings from './General/SystemSettings';
import Security from './General/Security';

const General = () => {
  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="bg-background-light rounded-lg shadow-subtle mb-6 overflow-hidden">
        <OrganizationInfo />
        <BrandAndLogo />
        <RegionalSettings />
        <SystemSettings />
        <Security />
        
        {/* Botones de acción */}
        <div className="flex justify-end p-4 bg-highlight border-t border-border-light">
          <button className="py-2.5 px-4 rounded-md text-sm font-medium border border-border text-text-muted mr-3 hover:bg-border-light transition-all">
            Cancelar
          </button>
          <button className="py-2.5 px-4 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-light transition-all">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default General;