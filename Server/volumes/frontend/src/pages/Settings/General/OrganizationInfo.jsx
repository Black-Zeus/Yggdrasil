import React from 'react';

const OrganizationInfo = () => {
  return (
    <div className="p-6 border-b border-border-light">
      <div className="flex items-center mb-5">
        <svg className="w-6 h-6 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <h2 className="text-lg font-semibold text-primary m-0">Información de la Organización</h2>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="org-name">Nombre de la organización</label>
            <input 
              type="text" 
              id="org-name" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="Mi Empresa S.A." 
            />
            <p className="text-xs text-text-muted mt-1">Este nombre aparecerá en informes y comunicaciones oficiales.</p>
          </div>
        </div>

        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="org-email">Correo electrónico principal</label>
            <input 
              type="email" 
              id="org-email" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="contacto@miempresa.com" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="org-phone">Teléfono</label>
            <input 
              type="tel" 
              id="org-phone" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="+52 55 1234 5678" 
            />
          </div>
        </div>

        <div className="flex-1 px-2 min-w-[200px]">
          <div className="mb-5">
            <label className="block font-medium mb-2 text-text" htmlFor="org-website">Sitio web</label>
            <input 
              type="url" 
              id="org-website" 
              className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20" 
              defaultValue="https://www.miempresa.com" 
            />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className="block font-medium mb-2 text-text" htmlFor="org-address">Dirección</label>
        <input 
          type="text" 
          id="org-address" 
          className="w-full p-2.5 border border-border rounded-md text-sm transition-colors focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
          defaultValue="Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México, CP 03100" 
        />
      </div>
    </div>
  );
};

export default OrganizationInfo;