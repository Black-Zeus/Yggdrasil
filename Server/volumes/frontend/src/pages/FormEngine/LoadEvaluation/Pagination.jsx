import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center p-5 gap-2">
      <button 
        className={`px-3 py-2 text-sm border border-border rounded-md transition-colors
          ${currentPage === 1 
            ? 'opacity-50 cursor-not-allowed bg-secondary-light dark:bg-secondary-dark text-text-muted' 
            : 'bg-background-light dark:bg-background-dark text-text dark:text-text-dark hover:bg-highlight dark:hover:bg-secondary-dark'}`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>
      {pages.map(page => (
        <button 
          key={page}
          className={`px-3 py-2 text-sm border rounded-md transition-colors
            ${currentPage === page 
              ? 'bg-primary text-white border-primary' 
              : 'bg-background-light dark:bg-background-dark border-border text-text dark:text-text-dark hover:bg-highlight dark:hover:bg-secondary-dark'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button 
        className={`px-3 py-2 text-sm border border-border rounded-md transition-colors
          ${currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed bg-secondary-light dark:bg-secondary-dark text-text-muted' 
            : 'bg-background-light dark:bg-background-dark text-text dark:text-text-dark hover:bg-highlight dark:hover:bg-secondary-dark'}`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;