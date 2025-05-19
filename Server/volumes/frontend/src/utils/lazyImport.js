import { lazy } from 'react';
import logger from './logger';

/**
 * Lazy import mejorado con soporte para preload, manejo de errores y seguimiento de estado.
 * 
 * @param {Function} factory - Función que retorna un dynamic import.
 * @param {string} name - Nombre del export (default por defecto).
 * @param {Object} options - Opciones adicionales
 * @param {Function} options.onError - Manejador de errores personalizado
 * @param {string} options.componentName - Nombre identificativo del componente para logging
 * @returns {Object} Componente lazy con métodos extendidos
 */
export const lazyImport = (factory, name = 'default', options = {}) => {
  // Valores por defecto para options
  const { 
    onError, 
    componentName = 'AnonymousComponent' 
  } = options;
  
  // Estado de carga compartido entre instancias
  let loadPromise = null;
  let loadStatus = 'idle'; // 'idle' | 'loading' | 'loaded' | 'error'
  
  /**
   * Carga el módulo y gestiona el estado
   * @returns {Promise} Promesa del módulo
   */
  const load = () => {
    // Reutilizar promesa existente si ya se está cargando o ya está cargado
    if (loadPromise) return loadPromise;
    
    loadStatus = 'loading';
    logger.info('LazyLoad', `Cargando componente: ${componentName}`);
    
    loadPromise = factory()
      .then(mod => {
        loadStatus = 'loaded';
        logger.info('LazyLoad', `Componente cargado con éxito: ${componentName}`);
        return mod;
      })
      .catch(error => {
        loadStatus = 'error';
        logger.error('LazyLoad', `Error al cargar componente ${componentName}:`, error);
        
        if (onError) {
          onError(error, componentName);
        }
        
        // Limpiar la promesa para permitir reintentos
        loadPromise = null;
        
        // Re-throw para que React pueda manejarlo
        throw error;
      });
    
    return loadPromise;
  };

  // Componente lazy con extracción inteligente del export
  const Component = lazy(() => 
    load().then(mod => {
      // Compatibilidad con diferentes formatos de módulo
      const exportedComponent = name === 'default' 
        ? (mod.default || mod) // Maneja tanto export default como module.exports
        : mod[name];          // Maneja export nombrado
        
      if (!exportedComponent) {
        throw new Error(`Export '${name}' no encontrado en el módulo ${componentName}`);
      }
      
      return { default: exportedComponent };
    })
  );
  
  // Añadir métodos y propiedades útiles al componente
  Component.preload = load;
  Component.getLoadStatus = () => loadStatus;
  Component.displayName = componentName;
  
  // Método para cancelar/descartar la carga (útil en ciertos escenarios)
  Component.cancelLoad = () => {
    if (loadStatus === 'loading') {
      logger.info('LazyLoad', `Cancelando carga pendiente: ${componentName}`);
      loadPromise = null;
      loadStatus = 'idle';
    }
  };
  
  return Component;
};

/**
 * Versión simplificada que detecta automáticamente el nombre del componente
 * a partir de la función factory
 * 
 * @param {Function} factory - Función que retorna un dynamic import
 * @returns {Object} Componente lazy
 */
export const lazy$ = (factory) => {
  // Extraer el nombre del componente de la string de la función
  const factoryStr = factory.toString();
  const match = factoryStr.match(/import\(['"](.+)['"]\)/);
  const path = match ? match[1] : '';
  const componentName = path.split('/').pop()?.split('.')[0] || 'Component';
  
  return lazyImport(factory, 'default', { componentName });
};

export default lazyImport;