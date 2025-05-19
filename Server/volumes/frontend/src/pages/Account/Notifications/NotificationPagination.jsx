import React from 'react';

const NotificationPagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  // Si no hay elementos o solo hay una página, no mostrar la paginación
  if (totalItems <= itemsPerPage) {
    return null;
  }

  // Calcular el rango de elementos que se están mostrando
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generar los números de página
  const getPageNumbers = () => {
    const pages = [];
    
    // Siempre incluir la primera página, la última, la actual y una página antes y después de la actual
    const pageSet = new Set([
      1, 
      totalPages, 
      currentPage, 
      Math.max(1, currentPage - 1), 
      Math.min(totalPages, currentPage + 1)
    ]);
    
    // Convertir el Set a array y ordenar
    const pageArray = [...pageSet].sort((a, b) => a - b);
    
    // Agregar los números de página o separadores
    for (let i = 0; i < pageArray.length; i++) {
      pages.push(pageArray[i]);
      
      // Agregar separador si hay saltos
      if (i < pageArray.length - 1 && pageArray[i + 1] - pageArray[i] > 1) {
        pages.push('...');
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-between items-center p-4 border-t border-border-light">
      <div className="text-sm text-text-muted">
        Mostrando {startItem}-{endItem} de {totalItems} notificaciones
      </div>
      
      <div className="flex">
        {/* Botón Anterior */}
        <button 
          className={`border border-border px-3 py-1 rounded-l-md ${
            currentPage === 1 
              ? 'bg-gray-100 text-text-muted cursor-not-allowed' 
              : 'hover:bg-highlight'
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {/* Números de página */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className="border-t border-b border-border px-3 py-1 text-text-muted"
            >
              {page}
            </span>
          ) : (
            <button 
              key={`page-${page}`}
              className={`border-t border-b border-r border-border px-3 py-1 ${
                currentPage === page 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-highlight'
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
        
        {/* Botón Siguiente */}
        <button 
          className={`border border-l-0 border-border px-3 py-1 rounded-r-md ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-text-muted cursor-not-allowed' 
              : 'hover:bg-highlight'
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationPagination;