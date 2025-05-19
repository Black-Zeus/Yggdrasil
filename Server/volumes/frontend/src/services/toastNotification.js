import toast from 'react-hot-toast';
import logger from '../utils/logger';

/**
 * Servicio para mostrar notificaciones toast al usuario
 * Encapsula la lógica de presentación de alertas y mensajes
 */
const toastNotification = {
  /**
   * Muestra una notificación de éxito
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales para la notificación
   */
  success: (message, options = {}) => {
    logger.info('Toast', message);
    toast.success(message, options);
  },

  /**
   * Muestra una notificación de error
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales para la notificación
   */
  error: (message, options = {}) => {
    logger.error('Toast', message);
    toast.error(message, options);
  },

  /**
   * Muestra una notificación informativa
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales para la notificación
   */
  info: (message, options = {}) => {
    logger.info('Toast', message);
    toast(message, options);
  },

  /**
   * Muestra una notificación de advertencia
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones adicionales para la notificación
   */
  warning: (message, options = {}) => {
    logger.warn('Toast', message);
    toast(message, {
      icon: '⚠️',
      ...options
    });
  },

  /**
   * Muestra una notificación personalizada
   * @param {string} message - Mensaje a mostrar
   * @param {Object} options - Opciones completas para la notificación
   */
  custom: (message, options = {}) => {
    logger.info('Toast', `Custom: ${message}`);
    toast(message, options);
  },

  /**
   * Mensajes predefinidos para errores comunes de autenticación
   */
  auth: {
    /**
     * Notifica que la sesión ha expirado
     */
    sessionExpired: () => 
      toastNotification.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'),
    
    /**
     * Notifica credenciales inválidas
     */
    invalidCredentials: () => 
      toastNotification.error('Credenciales inválidas. Verifica tu correo y contraseña.'),
    
    /**
     * Notifica error de conexión
     */
    connectionError: () => 
      toastNotification.error('Error de conexión. Verifica tu internet.'),
    
    /**
     * Notifica error del servidor
     */
    serverError: () => 
      toastNotification.error('Error del servidor. Intenta más tarde.')
  },

  /**
   * Mensajes predefinidos para errores comunes de API
   */
  api: {
    /**
     * Notifica error de conexión
     */
    connectionError: () => 
      toastNotification.error('No se pudo conectar con el servidor. Verifica tu conexión.'),
    
    /**
     * Notifica error del servidor
     * @param {number} status - Código de estado HTTP 
     */
    serverError: (status) => 
      toastNotification.error(`Error del servidor (${status}). Por favor, intenta más tarde.`),
    
    /**
     * Notifica error de timeout
     */
    timeoutError: () => 
      toastNotification.error('La solicitud ha tardado demasiado. Verifica tu conexión.'),
    
    /**
     * Notifica error general con mensaje personalizado
     * @param {string} message - Mensaje de error 
     */
    generalError: (message) => 
      toastNotification.error(message || 'Ha ocurrido un error inesperado.')
  }
};

export default toastNotification;