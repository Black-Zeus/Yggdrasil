import { baseClient, authClient, createClient } from './client';
import interceptors from './interceptors';
import errorHandlers from './errorHandlers';
import requestTracking from './requestTracking';
import authStore from '../../store/trash/authStore';
import logger from '../../utils/logger';

/**
 * Controlador para refresco de token centralizado
 */
const tokenController = (() => {
  let isRefreshing = false;
  let refreshPromise = null;
  let pendingRequests = [];

  const executeRefresh = async () => {
    try {
      isRefreshing = true;
      const newToken = await authStore.getState().refreshAccessToken();
      
      // Resolver todas las peticiones pendientes
      pendingRequests.forEach(resolve => resolve(newToken));
      return newToken;
    } catch (error) {
      // Rechazar todas las peticiones pendientes
      pendingRequests.forEach(resolve => resolve(Promise.reject(error)));
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
      pendingRequests = [];
    }
  };

  return {
    refreshToken: async () => {
      // Si ya hay un refresco en curso, esperar
      if (isRefreshing) {
        return new Promise(resolve => {
          pendingRequests.push(resolve);
        });
      }
      
      // Iniciar nuevo refresco
      if (!refreshPromise) {
        refreshPromise = executeRefresh();
      }
      
      return refreshPromise;
    },
    isRefreshing: () => isRefreshing
  };
})();

// Configuración de opciones de reintento
const retryOptions = {
  maxRetries: 2,
  shouldRetry: (error) => {
    return !error.response || error.response.status >= 500;
  },
  retryDelay: (retryCount) => 1000 * Math.pow(2, retryCount - 1),
  onRetry: (error, config) => {
    logger.info('API', `Preparando reintento ${config._retryCount}`);
  }
};

/**
 * Cliente HTTP principal configurado con todos los interceptores
 */
const configureClient = () => {
  // Interceptor de petición para seguimiento
  baseClient.interceptors.request.use(
    interceptors.tracking.request,
    error => Promise.reject(error)
  );
  
  // Interceptor de petición para carga
  baseClient.interceptors.request.use(
    interceptors.loading.request,
    error => {
      interceptors.loading.error(error);
      return Promise.reject(error);
    }
  );
  
  // Interceptor de petición para autenticación
  baseClient.interceptors.request.use(
    config => interceptors.auth.request(config, () => authStore.getState().accessToken),
    error => Promise.reject(error)
  );
  
  // Interceptor de respuesta para seguimiento y transformación
  baseClient.interceptors.response.use(
    response => {
      // Registrar respuesta
      interceptors.tracking.response(response);
      
      // Finalizar estado de carga
      interceptors.loading.response(response);
      
      // Transformar respuesta
      return interceptors.transform.response(response);
    },
    async error => {
      // Manejar error de autenticación (401)
      if (error.response?.status === 401 && !error.config?.url.includes('/auth/login')) {
        try {
          // Intentar refrescar token
          const newToken = await tokenController.refreshToken();
          
          // Configurar nueva petición con token actualizado
          error.config.headers.Authorization = `Bearer ${newToken}`;
          
          // Reintentar con nuevo token
          return baseClient(error.config);
        } catch (refreshError) {
          // Manejar error de refresco
          return errorHandlers.processError(error, {
            logoutCallback: () => authStore.getState().logoutUser()
          });
        }
      }
      
      // Intentar reintento para otros errores
      try {
        return await interceptors.retry.error(error, retryOptions, baseClient);
      } catch (retryError) {
        // Si el reintento falla, procesar error
        return errorHandlers.processError(retryError);
      }
    }
  );
  
  return baseClient;
};

// Configurar cliente principal
const httpClient = configureClient();

/**
 * Crear cliente con spinner global
 * @param {string} message - Mensaje para el spinner
 * @returns {Object} Cliente configurado
 */
const withGlobalSpinner = (message = 'Cargando...') => {
  return {
    get: (url, config = {}) => httpClient.get(url, { 
      ...config, 
      showGlobalSpinner: true,
      loadingMessage: message
    }),
    post: (url, data, config = {}) => httpClient.post(url, data, { 
      ...config, 
      showGlobalSpinner: true,
      loadingMessage: message
    }),
    put: (url, data, config = {}) => httpClient.put(url, data, { 
      ...config, 
      showGlobalSpinner: true,
      loadingMessage: message
    }),
    delete: (url, config = {}) => httpClient.delete(url, { 
      ...config, 
      showGlobalSpinner: true,
      loadingMessage: message
    }),
    patch: (url, data, config = {}) => httpClient.patch(url, data, { 
      ...config, 
      showGlobalSpinner: true,
      loadingMessage: message
    })
  };
};

/**
 * Crear cliente con spinner local
 * @param {string} moduleId - ID del módulo
 * @param {string} message - Mensaje para el spinner
 * @returns {Object} Cliente configurado
 */
const withLocalSpinner = (moduleId, message = 'Cargando...') => {
  if (!moduleId) {
    throw new Error('Se requiere moduleId para spinner local');
  }
  
  return {
    get: (url, config = {}) => httpClient.get(url, { 
      ...config, 
      showLocalSpinner: true,
      moduleId,
      loadingMessage: message
    }),
    post: (url, data, config = {}) => httpClient.post(url, data, { 
      ...config, 
      showLocalSpinner: true,
      moduleId,
      loadingMessage: message
    }),
    put: (url, data, config = {}) => httpClient.put(url, data, { 
      ...config, 
      showLocalSpinner: true,
      moduleId,
      loadingMessage: message
    }),
    delete: (url, config = {}) => httpClient.delete(url, { 
      ...config, 
      showLocalSpinner: true,
      moduleId,
      loadingMessage: message
    }),
    patch: (url, data, config = {}) => httpClient.patch(url, data, { 
      ...config, 
      showLocalSpinner: true,
      moduleId,
      loadingMessage: message
    })
  };
};

/**
 * Cliente HTTP API
 */
const api = {
  // Cliente base
  ...httpClient,
  
  // Cliente de autenticación sin interceptores
  auth: authClient,
  
  // Funciones auxiliares
  withGlobalSpinner,
  withLocalSpinner,
  
  // Funciones para crear clientes personalizados
  create: createClient,
  
  // Acceso a utilidades de seguimiento
  tracking: requestTracking,
  
  // Acceso a manejadores de errores
  errorHandlers
};

export default api;