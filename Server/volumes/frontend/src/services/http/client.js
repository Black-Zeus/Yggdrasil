import axios from 'axios';
import ENV from '../../utils/envConfig';

/**
 * Configuración base para clientes Axios
 */
const BASE_CONFIG = {
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * Crea un cliente Axios con la configuración base
 * @param {Object} config - Configuración adicional a aplicar
 * @returns {AxiosInstance} - Instancia configurada de Axios
 */
export const createClient = (config = {}) => {
  return axios.create({
    ...BASE_CONFIG,
    ...config
  });
};

/**
 * Cliente base Axios - Para uso interno del módulo
 * Usar el cliente exportado desde index.js para aplicaciones
 */
export const baseClient = createClient();

/**
 * Cliente Axios para autenticación - Sin interceptores de token
 * Útil para operaciones de login/registro/recuperación
 */
export const authClient = createClient();

export default {
  createClient,
  baseClient,
  authClient
};