import { jwtDecode } from 'jwt-decode';
import logger from '../utils/logger';
import { AUTH_ENDPOINTS } from './endpoints';
import api from './http';
import toastNotification from './toastNotification';

/**
 * Servicio centralizado para operaciones de autenticación
 */
const authService = {
  /**
   * Inicia sesión de usuario
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  login: async (email, password) => {
    try {
      if (!email || !password) {
        return {
          error: true,
          message: 'El correo y la contraseña son obligatorios'
        };
      }
      
      logger.info('AuthService', `Intentando iniciar sesión: ${email}`);
      
      // Usar api.auth para evitar interceptores de token en login
      const response = await api.auth.post(AUTH_ENDPOINTS.LOGIN, { email, password });
      
      // Extraer datos considerando la estructura correcta del backend
      // La respuesta viene anidada en response.response.data
      const data = response?.response?.data;
      
      if (!data || !data.access_token) {
        // Intentar buscar en una estructura alternativa
        const altData = response?.data?.response?.data;
        
        if (altData && altData.access_token) {
          logger.info('AuthService', 'Datos extraídos de estructura alternativa');
          return {
            success: true,
            data: altData
          };
        }
        
        throw new Error('Formato de respuesta inválido');
      }
      
      logger.info('AuthService', 'Inicio de sesión exitoso');
      
      return {
        success: true,
        data
      };
    } catch (err) {
      logger.error('AuthService', `Error en login: ${email}`, err);
      
      // Manejar respuesta de error
      const errorMessage = err.response?.data?.message || 'Error en la autenticación';
      
      return {
        error: true,
        status: err.response?.status,
        message: errorMessage,
        details: err.message
      };
    }
  },
  
  /**
   * Cierra la sesión en el servidor
   * @param {string} token - Token de acceso actual
   * @returns {Promise<Object>} Resultado de la operación
   */
  logout: async (token) => {
    try {
      if (token) {
        logger.info('AuthService', 'Cerrando sesión en el servidor');
        
        // Usar cliente de auth con token explícito para logout
        await api.auth.post(AUTH_ENDPOINTS.LOGOUT, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      return { success: true };
    } catch (err) {
      logger.error('AuthService', 'Error al cerrar sesión en el servidor', err);
      
      // Consideramos éxito incluso si hay error en la API
      return { 
        success: true,
        warning: 'La sesión se cerró localmente, pero hubo un error en el servidor'
      };
    }
  },
  
  /**
   * Refresca el token de acceso usando el token de refresco
   * @param {string} refreshToken - Token de refresco
   * @returns {Promise<Object>} Resultado con el nuevo token de acceso
   */
  refreshToken: async (refreshToken) => {
    try {
      if (!refreshToken) {
        throw new Error('No hay token de refresco disponible');
      }
      
      logger.info('AuthService', 'Intentando refrescar token');
      
      // Usar cliente de auth sin interceptores para evitar ciclos
      const response = await api.auth.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { 
        refresh_token: refreshToken 
      });
      
      // Extraer el nuevo token de la respuesta
      const data = response?.response?.data;
      const newToken = data?.access_token;
      
      if (!newToken) {
        throw new Error('Formato de respuesta de refresco inválido');
      }
      
      logger.info('AuthService', 'Token refrescado correctamente');
      
      return {
        success: true,
        accessToken: newToken
      };
    } catch (err) {
      logger.error('AuthService', 'Error al refrescar token', err);
      
      return {
        error: true,
        status: err.response?.status,
        message: err.response?.data?.message || 'Error al refrescar la sesión',
        details: err.message
      };
    }
  },
  
  /**
   * Solicita restablecimiento de contraseña
   * @param {string} email - Correo electrónico del usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  requestPasswordReset: async (email) => {
    try {
      if (!email) {
        return {
          error: true,
          message: 'El correo electrónico es obligatorio'
        };
      }
      
      logger.info('AuthService', `Solicitando reset de contraseña: ${email}`);
      
      // Usar cliente sin interceptores para operaciones de auth
      const response = await api.auth.post(AUTH_ENDPOINTS.RECOVER_PASSWORD, { email });
      
      return {
        success: true,
        data: response?.response?.data
      };
    } catch (err) {
      logger.error('AuthService', `Error en solicitud de reset: ${email}`, err);
      
      return {
        error: true,
        status: err.response?.status,
        message: err.response?.data?.message || 'Error al solicitar restablecimiento de contraseña',
        details: err.message
      };
    }
  },
  
  /**
   * Restablece la contraseña usando un token de recuperación
   * @param {Object} data - Datos para restablecer la contraseña
   * @param {string} data.email - Email del usuario
   * @param {string} data.reset_token - Token de recuperación
   * @param {string} data.new_password - Nueva contraseña
   * @returns {Promise<Object>} Resultado de la operación
   */
  resetPassword: async (data) => {
    try {
      if (!data.email || !data.reset_token || !data.new_password) {
        return {
          error: true,
          message: 'Faltan datos requeridos para restablecer la contraseña'
        };
      }
      
      logger.info('AuthService', `Restableciendo contraseña para: ${data.email}`);
      
      // Usar cliente sin interceptores para operaciones de auth
      const response = await api.auth.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
      
      return {
        success: true,
        data: response?.response?.data
      };
    } catch (err) {
      logger.error('AuthService', `Error al restablecer contraseña: ${data.email}`, err);
      
      return {
        error: true,
        status: err.response?.status,
        message: err.response?.data?.message || 'Error al restablecer la contraseña',
        details: err.message
      };
    }
  },
  
  /**
   * Decodifica un token JWT para extraer su información
   * @param {string} token - Token JWT a decodificar
   * @returns {Object|null} Información decodificada o null si es inválido
   */
  decodeToken: (token) => {
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (e) {
      logger.error('AuthService', 'Error al decodificar token', e);
      return null;
    }
  },
  
  /**
   * Verifica si un token JWT ha expirado
   * @param {string} token - Token JWT a verificar
   * @param {number} marginSeconds - Margen en segundos antes de considerar expirado
   * @returns {boolean} true si el token es válido, false si expiró
   */
  isTokenValid: (token, marginSeconds = 30) => {
    if (!token) return false;
    
    try {
      const decoded = authService.decodeToken(token);
      if (!decoded || !decoded.exp) return false;
      
      // Verificar expiración con margen de seguridad
      return Date.now() < ((decoded.exp - marginSeconds) * 1000);
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Calcula tiempo restante en segundos hasta la expiración del token
   * @param {string} token - Token JWT a verificar
   * @returns {number} Segundos hasta expiración, 0 si expirado o inválido
   */
  getTokenRemainingTime: (token) => {
    if (!token) return 0;
    
    try {
      const decoded = authService.decodeToken(token);
      if (!decoded || !decoded.exp) return 0;
      
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      
      return Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
    } catch (e) {
      return 0;
    }
  },
  
  /**
   * Maneja errores comunes de autenticación y muestra notificaciones apropiadas
   * @param {Object} error - Objeto de error de axios
   */
  handleAuthError: (error) => {
    if (!error.response) {
      toastNotification.auth.connectionError();
    } else if (error.response.status === 401) {
      toastNotification.auth.invalidCredentials();
    } else if (error.response.status >= 500) {
      toastNotification.auth.serverError();
    } else {
      const message = error.response?.data?.message || 'Ha ocurrido un error.';
      toastNotification.error(message);
    }
  }
};

export default authService;