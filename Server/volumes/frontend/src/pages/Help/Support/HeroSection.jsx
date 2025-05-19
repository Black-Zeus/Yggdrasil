// Support/HeroSection.jsx
import React, { useState } from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';
import logger from '../../../utils/logger';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    logger.info('HeroSections','Searching for:', searchTerm);
    // Implementar lógica de búsqueda aquí
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-12 rounded-xl mb-8 text-center">
      <h1 className="text-4xl font-bold mb-4">¿Cómo podemos ayudarte?</h1>
      <p className="text-xl mb-8">Encuentra respuestas, recursos y soporte técnico para tus necesidades</p>
      
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
        <div className="relative">
          <IconResolve_RI 
            name="RiSearchLine" 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en la base de conocimientos..."
            className="w-full p-4 pl-12 text-lg rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>
      </form>
    </div>
  );
};

export default HeroSection;