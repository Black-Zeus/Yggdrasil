import logger from '../../utils/logger';
import useLoadingStore from '../../store/trash/loadingStore';
import requestTracking from './requestTracking';
import errorHandlers from './errorHandlers';

/**
 * Interceptores organizados por funcionalidad
 */
const interceptors = {
  /**
   * Interceptores de carga (spinners y estados de carga)
   */
  loading: {
    /**
     * Interceptor de solicitud para manejo de estados de carga
     */
    request: (config) => {
      // Determinar tipo de spinner a mostrar
      const showGlobalSpinner = config.showGlobalSpinner === true;
      const showLocalSpinner = config.showLocalSpinner === true;
      const moduleId = config.moduleId || config._requestId;
      const loadingMessage = config.loadingMessage || 'Cargando...';
      
      // Mostrar indicador de carga basado en configuración
      if (showGlobalSpinner) {
        // Usar spinner global para peticiones críticas
        useLoadingStore.getState().showGlobalLoading(loadingMessage, moduleId);
      } else if (showLocalSpinner && moduleId) {
        // Usar spinner local para peticiones no críticas
        useLoadingStore.getState().setModuleLoading(moduleId, true, loadingMessage);
      }
      
      return config;
    },
    
    /**
     * Interceptor de respuesta para finalizar estados de carga
     */
    response: (response) => {
      // Determinar tipo de spinner a ocultar
      const config = response.config;
      const showGlobalSpinner = config.showGlobalSpinner === true;
      const showLocalSpinner = config.showLocalSpinner === true;
      const moduleId = config.moduleId || config._requestId;
      
      // Ocultar indicador de carga
      if (showGlobalSpinner) {
        useLoadingStore.getState().hideGlobalLoading(moduleId);
      } else if (showLocalSpinner && moduleId) {
        useLoadingStore.getState().setModuleLoading(moduleId, false);
      }
      
      return response;
    },
    
    /**
     * Interceptor de error para finalizar estados de carga
     */
    error: (error) => {
      // Determinar tipo de spinner a ocultar
      const config = error.config || {};
      const showGlobalSpinner = config.showGlobalSpinner === true;
      const showLocalSpinner = config.showLocalSpinner === true;
      const moduleId = config.moduleId || config._requestId;
      
      // Ocultar indicador de carga
      if (showGlobalSpinner) {
        useLoadingStore.getState().hideGlobalLoading(moduleId);
      } else if (showLocalSpinner && moduleId) {
        useLoadingStore.getState().setModuleLoading(moduleId, false);
      }
      
      return Promise.reject(error);
    }
  },
  
  /**
   * Interceptores de autenticación (token)
   */
  auth: {
    /**
     * Interceptor de solicitud para añadir token de autenticación
     * @param {Function} getAccessToken - Función para obtener el token actual
     */
    request: (config, getAccessToken) => {
      // Si la función de token no existe, continuar sin modificar
      if (typeof getAccessToken !== 'function') {
        return config;
      }
      
      // Obtener token actual
      const token = getAccessToken();
      
      // Añadir token a las cabeceras si existe y no es una petición de autenticación
      if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/refresh')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    }
  },
  
  /**
   * Interceptores de seguimiento (trazado de peticiones)
   */
  tracking: {
    /**
     * Interceptor de solicitud para registrar peticiones
     */
    request: (config) => {
      // Generar y asignar ID único para la petición
      const requestId = requestTracking.generateRequestId();
      config._requestId = requestId;
      config._retryCount = config._retryCount || 0;
      
      // Registrar petición
      requestTracking.logRequest(config);
      
      return config;
    },
    
    /**
     * Interceptor de respuesta para registrar respuestas exitosas
     */
    response: (response) => {
      // Procesar y registrar respuesta
      return requestTracking.logResponse(response);
    }
  },
  
  /**
   * Interceptores de reintento
   */
  retry: {
    /**
     * Interceptor de error para reintentar peticiones fallidas
     * @param {Object} options - Opciones de reintento
     * @param {number} options.maxRetries - Número máximo de reintentos
     * @param {Function} options.shouldRetry - Función para determinar si debe reintentar
     * @param {Function} options.retryDelay - Función para calcular retardo entre reintentos
     * @param {Function} options.onRetry - Callback a ejecutar antes de reintentar
     */
    error: async (error, options = {}, axiosInstance) => {
      const { 
        maxRetries = 2, 
        shouldRetry = null,
        retryDelay = (retryCount) => 1000 * Math.pow(2, retryCount - 1),
        onRetry = null
      } = options;
      
      const config = error.config || {};
      
      // Verificar si debe reintentar
      const canRetry = typeof shouldRetry === 'function'
        ? shouldRetry(error)
        : (!error.response || error.response.status >= 500);
      
      // Si puede reintentar y no ha excedido el máximo
      if (canRetry && config._retryCount < maxRetries) {
        config._retryCount = (config._retryCount || 0) + 1;
        
        logger.info('API', `Reintentando petición (${config._retryCount}/${maxRetries}): ${config.method} ${config.url}`);
        
        // Ejecutar callback antes de reintentar
        if (typeof onRetry === 'function') {
          await onRetry(error, config);
        }
        
        // Esperar antes de reintentar
        const delayMs = typeof retryDelay === 'function'
          ? retryDelay(config._retryCount)
          : 1000;
          
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        // Reintentar la petición
        return axiosInstance(config);
      }
      
      // Si no puede reintentar, continuar con el error
      return Promise.reject(error);
    }
  },
  
  /**
   * Interceptores de transformación de datos
   */
  transform: {
    /**
     * Interceptor de respuesta para transformar datos
     * @param {Function} transformFn - Función de transformación personalizada
     */
    response: (response, transformFn = null) => {
      // Si hay una función de transformación personalizada, usarla
      if (typeof transformFn === 'function') {
        return transformFn(response);
      }
      
      // Transformación predeterminada: extraer datos de la estructura estandarizada
      const data = response.data;
      
      // Si la respuesta tiene estructura específica, extraerla
      if (data && data.response && data.response.data !== undefined) {
        return data.response.data;
      }
      
      // Si no, devolver los datos completos
      return data;
    }
  }
};

export default interceptors;