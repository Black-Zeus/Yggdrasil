import { jwtDecode } from 'jwt-decode';
import logger from './logger';

/**
 * Utilidades para trabajar con tokens JWT
 */
const jwtUtils = {
  /**
   * Verifica si un token JWT está expirado
   * @param {string} token - Token JWT a verificar
   * @param {number} [gracePeriodSeconds=0] - Período de gracia en segundos
   * @returns {boolean} True si el token está expirado
   */
  isTokenExpired: (token, gracePeriodSeconds = 0) => {
    if (!token) {
      logger.warn('JWT', 'Intento de verificar un token nulo o vacío');
      return true;
    }
    
    try {
      const { exp } = jwtDecode(token);
      if (!exp) {
        logger.warn('JWT', 'Token no contiene fecha de expiración');
        return true;
      }
      
      // Añadir periodo de gracia (útil para renovaciones proactivas)
      const graceTime = gracePeriodSeconds * 1000;
      return Date.now() >= (exp * 1000) - graceTime;
    } catch (e) {
      logger.error('JWT', 'Error al decodificar token', e);
      return true;
    }
  },
  
  /**
   * Tiempo restante en segundos antes de que expire el token
   * @param {string} token - Token JWT a verificar
   * @returns {number} Segundos restantes (0 si ya expiró o hay un error)
   */
  getTokenRemainingTime: (token) => {
    if (!token) return 0;
    
    try {
      const { exp } = jwtDecode(token);
      if (!exp) return 0;
      
      const remaining = (exp * 1000) - Date.now();
      return Math.max(0, Math.floor(remaining / 1000));
    } catch (e) {
      logger.error('JWT', 'Error al obtener tiempo restante del token', e);
      return 0;
    }
  },
  
  /**
   * Extrae el payload de un token JWT
   * @param {string} token - Token JWT a decodificar
   * @returns {Object|null} Payload del token o null si hay error
   */
  getTokenPayload: (token) => {
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (e) {
      logger.error('JWT', 'Error al decodificar payload del token', e);
      return null;
    }
  },
  
  /**
   * Verifica si un token tiene un rol específico
   * @param {string} token - Token JWT a verificar
   * @param {string|Array<string>} roles - Rol o roles a verificar
   * @returns {boolean} True si el token contiene el rol
   */
  hasRole: (token, roles) => {
    if (!token) return false;
    
    try {
      const payload = jwtDecode(token);
      const userRoles = payload.roles || [];
      
      if (Array.isArray(roles)) {
        return roles.some(role => userRoles.includes(role));
      }
      
      return userRoles.includes(roles);
    } catch (e) {
      logger.error('JWT', 'Error al verificar roles en token', e);
      return false;
    }
  },
  
  /**
   * Extrae el identificador del usuario desde el token
   * @param {string} token - Token JWT a verificar
   * @returns {string|null} ID del usuario o null si hay error
   */
  getUserId: (token) => {
    if (!token) return null;
    
    try {
      const payload = jwtDecode(token);
      return payload.sub || payload.userId || null;
    } catch (e) {
      logger.error('JWT', 'Error al extraer ID de usuario del token', e);
      return null;
    }
  }
};

export const { 
  isTokenExpired, 
  getTokenRemainingTime, 
  getTokenPayload, 
  hasRole,
  getUserId 
} = jwtUtils;

export default jwtUtils;