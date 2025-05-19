import React, { useState } from 'react';

const UserFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="mb-4">
      {/* Barra de búsqueda */}
      <div className="flex bg-background border border-border rounded-md p-2 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-text-muted mr-2" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          placeholder="Buscar usuarios por nombre, email o departamento..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select className="min-w-[150px] p-2 border border-border rounded-md text-sm bg-background-light">
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="editor">Editor</option>
          <option value="viewer">Visualizador</option>
        </select>
        
        <select className="min-w-[150px] p-2 border border-border rounded-md text-sm bg-background-light">
          <option value="">Todos los departamentos</option>
          <option value="it">IT</option>
          <option value="hr">Recursos Humanos</option>
          <option value="finance">Finanzas</option>
          <option value="marketing">Marketing</option>
          <option value="direccion">Dirección</option>
        </select>
        
        <select className="min-w-[150px] p-2 border border-border rounded-md text-sm bg-background-light">
          <option value="">Estado</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="pending">Pendiente</option>
        </select>
        
        <button className="p-2 border border-border rounded-md text-sm bg-background-light text-text-muted flex items-center gap-2 hover:bg-highlight transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="21" y1="4" x2="14" y2="4"></line>
            <line x1="10" y1="4" x2="3" y2="4"></line>
            <line x1="21" y1="12" x2="12" y2="12"></line>
            <line x1="8" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="20" x2="16" y2="20"></line>
            <line x1="12" y1="20" x2="3" y2="20"></line>
            <line x1="14" y1="2" x2="14" y2="6"></line>
            <line x1="8" y1="10" x2="8" y2="14"></line>
            <line x1="16" y1="18" x2="16" y2="22"></line>
          </svg>
          Filtros
        </button>
      </div>
    </div>
  );
};

export default UserFilters;