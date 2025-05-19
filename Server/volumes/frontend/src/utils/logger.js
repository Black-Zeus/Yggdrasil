import toast from 'react-hot-toast';
import ENV from './envConfig';

const IS_DEV = ENV.IS_DEV;

/**
 * Utilidad para logging controlado por entorno
 */
const logger = {
  /**
   * Muestra mensajes informativos en desarrollo
   * @param {string} scope - Ámbito o componente que genera el mensaje
   * @param {string} message - Mensaje a mostrar
   */
  info: (scope, message) => {
    if (IS_DEV) {
      console.info(`[${scope}] ${message}`);
    }
  },
  
  /**
   * Muestra advertencias en desarrollo
   * @param {string} scope - Ámbito o componente que genera la advertencia
   * @param {string} message - Mensaje de advertencia
   */
  warn: (scope, message) => {
    if (IS_DEV) {
      console.warn(`[${scope}] ${message}`);
    }
  },
  
  /**
   * Muestra errores en desarrollo
   * @param {string} scope - Ámbito o componente que genera el error
   * @param {string} message - Mensaje de error
   * @param {Error} [error] - Objeto de error opcional
   */
  error: (scope, message, error) => {
    if (IS_DEV) {
      console.error(`[${scope}] ${message}`, error || '');
    }
  },
  
  /**
   * Muestra notificaciones toast solo en desarrollo
   * @param {string} message - Mensaje a mostrar
   * @param {'success'|'error'|'info'} type - Tipo de notificación
   */
  toast: (message, type = 'info') => {
    if (IS_DEV) {
      switch (type) {
        case 'success':
          toast.success(`[DEV] ${message}`);
          break;
        case 'error':
          toast.error(`[DEV] ${message}`);
          break;
        default:
          toast(`[DEV] ${message}`);
      }
    }
  }
};

export default logger;