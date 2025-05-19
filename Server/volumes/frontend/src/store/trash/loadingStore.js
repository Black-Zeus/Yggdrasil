import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import logger from '../../utils/logger';

/**
 * Store especializado exclusivamente para gestionar estados de carga en la aplicación
 * Implementa un sistema completo para:
 * - Estados de carga global
 * - Estados de carga por módulo/componente
 * - Seguimiento de múltiples fuentes de carga
 */
const useLoadingStore = create(
  subscribeWithSelector((set, get) => ({
    // Estado de carga global
    isGlobalLoading: false,
    globalLoadingMessage: 'Cargando...',
    globalLoadingCount: 0,
    globalLoadingSources: {}, // Registro de fuentes de carga global

    // Registro de cargas por componente/módulo
    moduleLoadingStates: {},
    
    /**
     * Muestra el spinner global
     * @param {string} message - Mensaje a mostrar
     * @param {string} source - Identificador de la fuente de carga
     */
    showGlobalLoading: (message = 'Cargando...', source = 'global') => {
      const currentCount = get().globalLoadingCount;
      const newCount = currentCount + 1;
      
      // Registrar la fuente de la carga
      const updatedSources = {
        ...get().globalLoadingSources,
        [source]: {
          message,
          timestamp: new Date().toISOString()
        }
      };
      
      logger.info('Loading', `Global loading started (${source}): ${message}`);
      
      set({
        isGlobalLoading: true,
        globalLoadingMessage: message,
        globalLoadingCount: newCount,
        globalLoadingSources: updatedSources
      });
    },
    
    /**
     * Oculta el spinner global para una fuente específica
     * @param {string} source - Identificador de la fuente de carga
     */
    hideGlobalLoading: (source = 'global') => {
      const currentCount = get().globalLoadingCount;
      const currentSources = get().globalLoadingSources;
      
      // Si no hay cargas o la fuente no existe, salir
      if (currentCount <= 0 || !currentSources[source]) {
        logger.warn('Loading', `Attempt to hide global loader when none active for source: ${source}`);
        return;
      }
      
      const newCount = currentCount - 1;
      
      // Eliminar la fuente del registro
      const { [source]: removedSource, ...updatedSources } = currentSources;
      
      logger.info('Loading', `Global loading ended (${source}), ${newCount} remaining`);
      
      set({
        globalLoadingCount: newCount,
        isGlobalLoading: newCount > 0,
        globalLoadingSources: updatedSources,
        // Actualizar mensaje si quedan cargas activas
        globalLoadingMessage: newCount > 0 
          ? Object.values(updatedSources)[0]?.message || 'Cargando...'
          : 'Cargando...'
      });
    },
    
    /**
     * Fuerza reinicio del estado de carga global
     */
    resetGlobalLoading: () => {
      logger.info('Loading', 'Global loading state reset');
      
      set({
        isGlobalLoading: false,
        globalLoadingMessage: 'Cargando...',
        globalLoadingCount: 0,
        globalLoadingSources: {}
      });
    },
    
    /**
     * Establece el estado de carga para un módulo específico
     * @param {string} moduleId - Identificador único del módulo
     * @param {boolean} isLoading - Estado de carga
     * @param {string} message - Mensaje de carga opcional
     */
    setModuleLoading: (moduleId, isLoading, message = '') => {
      if (!moduleId) {
        logger.warn('Loading', 'Attempted to set module loading without moduleId');
        return;
      }
      
      logger.info('Loading', `Module ${moduleId} loading: ${isLoading}`);
      
      set(state => ({
        moduleLoadingStates: {
          ...state.moduleLoadingStates,
          [moduleId]: {
            isLoading,
            message: message || (isLoading ? 'Cargando...' : ''),
            timestamp: new Date().toISOString()
          }
        }
      }));
    },
    
    /**
     * Obtiene el estado de carga para un módulo específico
     * @param {string} moduleId - Identificador único del módulo
     * @returns {Object} Estado de carga del módulo
     */
    getModuleLoadingState: (moduleId) => {
      if (!moduleId) return { isLoading: false, message: '' };
      
      const state = get().moduleLoadingStates[moduleId];
      return state || { isLoading: false, message: '' };
    },
    
    /**
     * Verifica si algún módulo está cargando
     * @returns {boolean} True si hay al menos un módulo cargando
     */
    isAnyModuleLoading: () => {
      return Object.values(get().moduleLoadingStates).some(state => state.isLoading);
    },
    
    /**
     * Verifica si un módulo específico está cargando
     * @param {string} moduleId - Identificador único del módulo
     * @returns {boolean} True si el módulo está cargando
     */
    isModuleLoading: (moduleId) => {
      if (!moduleId) return false;
      const state = get().moduleLoadingStates[moduleId];
      return state ? state.isLoading : false;
    },
    
    /**
     * Ejecuta una función asíncrona con manejo automático de carga
     * @param {string} moduleId - Identificador del módulo
     * @param {Function} asyncFn - Función asíncrona a ejecutar
     * @param {string} message - Mensaje de carga
     * @param {boolean} useGlobal - Si debe usar loading global en vez de modular
     * @returns {Promise} Resultado de la función
     */
    withLoading: async (moduleId, asyncFn, message = 'Cargando...', useGlobal = false) => {
      if (!moduleId || typeof asyncFn !== 'function') {
        throw new Error('LoadingStore: withLoading requiere moduleId y función válida');
      }
      
      try {
        // Iniciar carga
        if (useGlobal) {
          get().showGlobalLoading(message, moduleId);
        } else {
          get().setModuleLoading(moduleId, true, message);
        }
        
        // Ejecutar función
        return await asyncFn();
      } finally {
        // Finalizar carga
        if (useGlobal) {
          get().hideGlobalLoading(moduleId);
        } else {
          get().setModuleLoading(moduleId, false);
        }
      }
    },
    
    /**
     * Limpia todos los estados de carga
     */
    resetAllLoadingStates: () => {
      logger.info('Loading', 'All loading states reset');
      
      set({
        isGlobalLoading: false,
        globalLoadingMessage: 'Cargando...',
        globalLoadingCount: 0,
        globalLoadingSources: {},
        moduleLoadingStates: {}
      });
    }
  }))
);

export default useLoadingStore;