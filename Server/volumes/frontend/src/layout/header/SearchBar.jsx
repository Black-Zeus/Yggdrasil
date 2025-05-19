import React, { useState } from 'react';

/**
 * SearchBar - Componente para la barra de búsqueda
 */
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Aquí se implementaría la lógica de búsqueda real
  };
  
  return (
    <div className="flex items-center bg-sidebar-active dark:bg-sidebar-dark-active rounded-full px-4 py-2 w-[300px] text-white transition-colors duration-300">
      <span className="mr-2">🔍</span>
      <input 
        type="text" 
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search anything..." 
        className="bg-transparent border-none text-white w-full text-sm placeholder:text-white/70 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;