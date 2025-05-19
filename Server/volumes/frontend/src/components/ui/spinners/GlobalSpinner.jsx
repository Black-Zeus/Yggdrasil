import React from 'react';
import useLoadingStore from '../../../store/loadingStore';

/**
 * Componente de spinner global con estilo modal
 * Optimizado para utilizar el loadingStore
 */
const GlobalSpinner = ({ customMessage = null }) => {
  // Usar selectores específicos para minimizar re-renders
  const isLoading = useLoadingStore(state => state.isGlobalLoading);
  const storeMessage = useLoadingStore(state => state.globalLoadingMessage);
  
  // Usar mensaje personalizado, mensaje del store, o predeterminado
  const displayMessage = customMessage || storeMessage || 'Cargando';
  
  // No renderizar nada si no está cargando
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm">
      {/* Marco contenedor del spinner */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-96 flex flex-col items-center justify-center">
        <div className="w-20 h-20 relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Círculo exterior - base */}
            <circle
              className="text-primary-light/30 dark:text-primary/30"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              stroke="currentColor"
            />
            
            {/* Arco animado */}
            <circle
              className="text-primary dark:text-primary-light"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeDasharray="180 180"
              strokeDashoffset="75"
              transform="rotate(-90 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
        <p className="mt-6 text-text dark:text-text-dark font-semibold text-lg text-center">
          {displayMessage}
        </p>
        
        {/* 5 puntos con animación de rebote */}
        <div className="flex mt-4">
          <span className="w-1.5 h-1.5 bg-primary dark:bg-primary-light rounded-full mx-0.5 animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-1.5 h-1.5 bg-primary dark:bg-primary-light rounded-full mx-0.5 animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-1.5 h-1.5 bg-primary dark:bg-primary-light rounded-full mx-0.5 animate-bounce" style={{ animationDelay: "300ms" }}></span>
          <span className="w-1.5 h-1.5 bg-primary dark:bg-primary-light rounded-full mx-0.5 animate-bounce" style={{ animationDelay: "450ms" }}></span>
          <span className="w-1.5 h-1.5 bg-primary dark:bg-primary-light rounded-full mx-0.5 animate-bounce" style={{ animationDelay: "600ms" }}></span>
        </div>
      </div>
    </div>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export default React.memo(GlobalSpinner);