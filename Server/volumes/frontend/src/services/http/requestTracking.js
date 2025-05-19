import logger from '../../utils/logger';
import ENV from '../../utils/envConfig';

/**
 * Servicio para trazar peticiones HTTP y capturar información relevante
 */
const requestTracking = {
  /**
   * Determina si el trazado está habilitado
   * @type {boolean}
   */
  enabled: ENV.IS_DEV || ENV.ENABLE_API_TRACING,

  /**
   * Nivel de detalle para el trazado
   * - 0: Deshabilitado
   * - 1: Solo errores
   * - 2: Errores y respuestas
   * - 3: Errores, respuestas y peticiones completas
   * @type {number}
   */
  traceLevel: ENV.API_TRACE_LEVEL || 2,

  /**
   * Genera un ID único para una petición
   * @returns {string} ID único
   */
  generateRequestId: () => {
    return `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  },

  /**
   * Registra una petición HTTP
   * @param {Object} config - Configuración de la petición
   * @returns {string} ID de la petición
   */
  logRequest: (config) => {
    // Generar ID único para la petición
    const requestId = config._requestId || requestTracking.generateRequestId();
    
    // Si el trazado está deshabilitado, solo devolver el ID
    if (!requestTracking.enabled || requestTracking.traceLevel < 3) {
      return requestId;
    }
    
    // Extraer información relevante
    const { method, url, baseURL, headers, params } = config;
    
    // Identificar endpoints sensibles para no loguear datos
    const isSensitiveEndpoint = url?.includes('login') || 
                                url?.includes('password') || 
                                url?.includes('auth');
    
    // Redactar datos sensibles
    const body = isSensitiveEndpoint ? '[REDACTED]' : config.data;
    
    // Registrar información de la petición
    logger.info('API Request', `${method?.toUpperCase() || 'UNKNOWN'} ${baseURL || ''}${url}`);
    logger.info('API Request', `RequestId: ${requestId}`);
    
    // Registrar detalles completos en nivel máximo
    if (requestTracking.traceLevel > 2) {
      logger.info('API Request Details', {
        requestId,
        method,
        url: `${baseURL || ''}${url}`,
        // Filtrar headers sensibles
        headers: headers ? {
          'Content-Type': headers['Content-Type'],
          'Accept': headers['Accept']
        } : {},
        params,
        body
      });
    }
    
    return requestId;
  },

  /**
   * Registra una respuesta HTTP
   * @param {Object} response - Respuesta de la petición
   * @returns {Object} Datos procesados de la respuesta
   */
  logResponse: (response) => {
    // Obtener ID de la petición
    const requestId = response.config?._requestId;
    
    // Si el trazado está deshabilitado, devolver los datos sin procesar
    if (!requestTracking.enabled || requestTracking.traceLevel < 2) {
      return response.data;
    }
    
    // Extraer información relevante
    const { status, config } = response;
    const method = config?.method?.toUpperCase() || 'UNKNOWN';
    const url = config?.url;
    
    // Registrar información de la respuesta
    logger.info('API Response', `${method} ${url} - Status: ${status}`);
    if (requestId) {
      logger.info('API Response', `RequestId: ${requestId}`);
    }
    
    // Extraer datos según la estructura de respuesta
    const responseData = response.data?.response?.data !== undefined 
      ? response.data.response.data 
      : response.data;
    
    return responseData;
  },

  /**
   * Registra un error HTTP
   * @param {Object} error - Error de la petición
   * @returns {Object} Detalles del error
   */
  logError: (error) => {
    // Obtener ID de la petición
    const requestId = error.config?._requestId;
    
    // Si el trazado está deshabilitado, devolver el error sin procesar
    if (!requestTracking.enabled || requestTracking.traceLevel < 1) {
      return error;
    }
    
    // Extraer información relevante
    const { response, request, config, message } = error;
    const method = config?.method?.toUpperCase() || 'UNKNOWN';
    const url = config?.url || 'Unknown URL';
    
    // Determinar tipo de error
    let errorType = 'Unknown Error';
    let status = null;
    let errorData = null;
    
    if (response) {
      // Error con respuesta del servidor
      errorType = 'Response Error';
      status = response.status;
      errorData = response.data;
      
      logger.error('API Error', `${method} ${url} - Status: ${status} - ${message}`);
    } else if (request) {
      // Error sin respuesta del servidor (problema de red)
      errorType = 'Network Error';
      logger.error('API Error', `${method} ${url} - Network Error: ${message}`);
    } else {
      // Error en la configuración o antes de enviar la petición
      errorType = 'Request Config Error';
      logger.error('API Error', `${method} ${url} - Request Error: ${message}`);
    }
    
    if (requestId) {
      logger.error('API Error', `RequestId: ${requestId}`);
    }
    
    // Registrar detalles adicionales para depuración
    if (requestTracking.traceLevel > 1) {
      const errorDetails = {
        type: errorType,
        url,
        method,
        requestId,
        message,
        status,
        data: errorData
      };
      
      logger.error('API Error Details', errorDetails);
    }
    
    return {
      requestId,
      type: errorType,
      message,
      status
    };
  }
};

export default requestTracking;