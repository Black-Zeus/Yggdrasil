import logger from '../../utils/logger';
import toastNotification from '../../services/toastNotification';
import requestTracking from './requestTracking';

/**
 * Manejadores centralizados de errores HTTP
 */
const errorHandlers = {
  /**
   * Maneja errores generales de red y comunicación
   * @param {Object} error - Error de Axios
   * @returns {Object} Error procesado
   */
  handleNetworkError: (error) => {
    // Registrar error
    requestTracking.logError(error);
    
    // Extraer mensaje relevante
    const message = error.message || 'Error de conexión';
    
    // Mostrar notificación al usuario
    toastNotification.api.connectionError();
    
    // Devolver error procesado
    return {
      error: true,
      type: 'network',
      message,
      original: error
    };
  },
  
  /**
   * Maneja errores del servidor (5xx)
   * @param {Object} error - Error de Axios
   * @returns {Object} Error procesado
   */
  handleServerError: (error) => {
    // Registrar error
    requestTracking.logError(error);
    
    // Extraer información
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    
    // Mostrar notificación al usuario
    toastNotification.api.serverError(status);
    
    // Devolver error procesado
    return {
      error: true,
      type: 'server',
      status,
      message: serverMessage || `Error del servidor (${status})`,
      original: error
    };
  },
  
  /**
   * Maneja errores de autenticación (401)
   * @param {Object} error - Error de Axios
   * @param {Function} refreshCallback - Función para refrescar token
   * @param {Function} logoutCallback - Función para cerrar sesión
   * @returns {Promise} Promesa con resultado del refresco o error
   */
  handleAuthError: async (error, refreshCallback, logoutCallback) => {
    // Registrar error
    requestTracking.logError(error);
    
    // Si hay callback de refresco, intentar refresco de token
    if (typeof refreshCallback === 'function') {
      try {
        logger.info('Auth', 'Intentando refrescar token');
        const result = await refreshCallback();
        
        // Si el refresco es exitoso, devolver resultado
        if (result && !result.error) {
          return result;
        }
      } catch (refreshError) {
        logger.error('Auth', 'Error en refresco de token', refreshError);
      }
    }
    
    // Si el refresco falla o no hay callback, notificar al usuario
    toastNotification.auth.sessionExpired();
    
    // Si hay callback de logout, cerrar sesión
    if (typeof logoutCallback === 'function') {
      try {
        await logoutCallback();
      } catch (logoutError) {
        logger.error('Auth', 'Error al cerrar sesión', logoutError);
      }
    }
    
    // Devolver error procesado
    return {
      error: true,
      type: 'auth',
      status: 401,
      message: 'Sesión expirada',
      original: error
    };
  },
  
  /**
   * Maneja errores de solicitud (4xx, excepto 401)
   * @param {Object} error - Error de Axios
   * @returns {Object} Error procesado
   */
  handleRequestError: (error) => {
    // Registrar error
    requestTracking.logError(error);
    
    // Extraer información
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message || 'Error en la solicitud';
    
    // Mostrar notificación con el mensaje específico
    toastNotification.api.generalError(message);
    
    // Devolver error procesado
    return {
      error: true,
      type: 'request',
      status,
      message,
      data,
      original: error
    };
  },
  
  /**
   * Analiza el error y lo dirige al manejador apropiado
   * @param {Object} error - Error de Axios
   * @param {Object} options - Opciones adicionales
   * @returns {Object|Promise} Error procesado o promesa con resultado
   */
  processError: async (error, options = {}) => {
    const { refreshCallback, logoutCallback } = options;
    
    // Si no hay respuesta, es un error de red
    if (!error.response) {
      return errorHandlers.handleNetworkError(error);
    }
    
    // Dirigir según código de estado
    const status = error.response.status;
    
    if (status === 401) {
      return errorHandlers.handleAuthError(error, refreshCallback, logoutCallback);
    } else if (status >= 500) {
      return errorHandlers.handleServerError(error);
    } else {
      return errorHandlers.handleRequestError(error);
    }
  }
};

export default errorHandlers;