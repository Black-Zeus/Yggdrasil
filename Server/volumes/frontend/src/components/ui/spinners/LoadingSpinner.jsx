import React from 'react';

/**
 * Componente de spinner para indicar cargas en secciones específicas
 * Versión mejorada compatible con el sistema de gestión de carga
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size='md'] - Tamaño del spinner: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
 * @param {string} [props.message] - Mensaje opcional para mostrar
 * @param {boolean} [props.overlay=false] - Si debe mostrar un overlay
 * @param {string} [props.className] - Clases CSS adicionales
 */
const LoadingSpinner = ({ 
  size = 'md', 
  message, 
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
    '2xl': 'w-20 h-20 border-[6px]'
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-label="Cargando..."
    >
      <div
        className={`${spinnerClass} border-primary/30 dark:border-primary-light/30 border-t-primary dark:border-t-primary-light rounded-full animate-spin`}
      ></div>
      {message && (
        <p className="mt-2 text-text-muted dark:text-text-dark text-sm">{message}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 dark:bg-background-dark/50 backdrop-blur-sm z-10">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Memoizar el componente para evitar re-renders innecesarios
export default React.memo(LoadingSpinner);