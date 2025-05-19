import React from 'react';

const FiltersSection = ({ filters, onFilterChange, onSearch }) => {
  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'Evaluaciones', label: 'Evaluaciones' },
    { value: 'Servicios en terreno', label: 'Servicios en terreno' },
    { value: 'Soporte', label: 'Soporte' },
    { value: 'Safety', label: 'Safety' },
    { value: 'Custom', label: 'Custom' }
  ];

  const subcategories = [
    { value: '', label: 'Todas las subcategorías' },
    { value: 'Desempeño', label: 'Desempeño' },
    { value: 'Satisfacción', label: 'Satisfacción' },
    { value: 'Competencias', label: 'Competencias' },
    { value: 'Otros', label: 'Otros' }
  ];

  // Manejar la tecla Enter en el campo de búsqueda
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevenir comportamiento por defecto
      onSearch();
    }
  };

  // Manejar el submit del formulario para prevenir recargas de página
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    onSearch();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-background-light dark:bg-background-dark rounded-lg p-5 mb-6 shadow-subtle"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm text-text-muted dark:text-text-dark mb-1.5">
            Categoría
          </label>
          <select 
            className="w-full p-2.5 border border-border rounded-md bg-background-light dark:bg-background-dark text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-text-muted dark:text-text-dark mb-1.5">
            Subcategoría
          </label>
          <select 
            className="w-full p-2.5 border border-border rounded-md bg-background-light dark:bg-background-dark text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
            value={filters.subcategory}
            onChange={(e) => onFilterChange('subcategory', e.target.value)}
          >
            {subcategories.map(sub => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            className="w-full p-2.5 pr-10 border border-border rounded-md bg-background-light dark:bg-background-dark text-text dark:text-text-dark placeholder-text-muted dark:placeholder-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
            placeholder="Buscar por nombre, ID o descripción..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-text-dark" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        
        {/* Botón de búsqueda modificado para funcionar como submit del formulario */}
        <button 
          type="submit"
          className="px-4 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default FiltersSection;