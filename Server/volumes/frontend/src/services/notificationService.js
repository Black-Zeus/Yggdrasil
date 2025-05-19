import logger from '../utils/logger';
import { NOTIFICATION_ENDPOINTS } from './endpoints';
import api from './http';

/**
 * Servicio centralizado para manejo de notificaciones de usuario
 */
const notificationService = {
  /**
   * Obtiene todas las notificaciones del usuario actual
   * @param {Object} filters - Filtros para notificaciones (leído, tipo, etc.)
   * @param {number} page - Número de página 
   * @param {number} limit - Límite de resultados por página
   * @returns {Promise<Object>} Resultado de la operación
   */
  getNotifications: async (filters = {}, page = 1, limit = 10) => {
    try {
      logger.info('NotificationService', 'Obteniendo notificaciones');
      const params = { ...filters, page, limit };
      
      // Usar cliente HTTP centralizado con spinner local
      const response = await api.withLocalSpinner('notifications').get(
        NOTIFICATION_ENDPOINTS.LIST, 
        { params }
      );
      
      return {
        success: true,
        data: response
      };
    } catch (err) {
      logger.error('NotificationService', 'Error al obtener notificaciones', err);
      
      return {
        error: true,
        message: err.response?.data?.message || 'Error al cargar las notificaciones',
        details: err.message
      };
    }
  },
  
  /**
   * Obtiene detalles de una notificación específica
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise<Object>} Resultado de la operación
   */
  getNotificationDetails: async (notificationId) => {
    try {
      logger.info('NotificationService', `Obteniendo detalles de notificación: ${notificationId}`);
      
      // Usar cliente HTTP centralizado con spinner local
      const response = await api.withLocalSpinner('notification-details').get(
        NOTIFICATION_ENDPOINTS.DETAIL(notificationId)
      );
      
      return {
        success: true,
        data: response
      };
    } catch (err) {
      logger.error('NotificationService', `Error al obtener detalles de notificación ${notificationId}`, err);
      
      return {
        error: true,
        message: err.response?.data?.message || 'Error al cargar los detalles de la notificación',
        details: err.message
      };
    }
  },
  
  /**
   * Marca una notificación como leída
   * @param {string} notificationId - ID de la notificación a marcar
   * @returns {Promise<Object>} Resultado de la operación
   */
  markAsRead: async (notificationId) => {
    try {
      logger.info('NotificationService', `Marcando notificación como leída: ${notificationId}`);
      
      // Operación de actualización simple
      const response = await api.patch(NOTIFICATION_ENDPOINTS.MARK_READ(notificationId));
      
      return {
        success: true,
        data: response
      };
    } catch (err) {
      logger.error('NotificationService', `Error al marcar notificación ${notificationId} como leída`, err);
      
      return {
        error: true,
        message: err.response?.data?.message || 'Error al marcar la notificación como leída',
        details: err.message
      };
    }
  },
  
  /**
   * Marca todas las notificaciones del usuario como leídas
   * @returns {Promise<Object>} Resultado de la operación
   */
  markAllAsRead: async () => {
    try {
      logger.info('NotificationService', 'Marcando todas las notificaciones como leídas');
      
      // Operación de actualización masiva
      const response = await api.withGlobalSpinner('Marcando todas las notificaciones...').patch(
        NOTIFICATION_ENDPOINTS.MARK_ALL_READ
      );
      
      return {
        success: true,
        data: response
      };
    } catch (err) {
      logger.error('NotificationService', 'Error al marcar todas las notificaciones como leídas', err);
      
      return {
        error: true,
        message: err.response?.data?.message || 'Error al marcar todas las notificaciones como leídas',
        details: err.message
      };
    }
  },
  
  /**
   * Elimina una notificación específica
   * @param {string} notificationId - ID de la notificación a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   */
  deleteNotification: async (notificationId) => {
    try {
      logger.info('NotificationService', `Eliminando notificación: ${notificationId}`);
      
      // Operación de eliminación
      const response = await api.delete(NOTIFICATION_ENDPOINTS.DELETE(notificationId));
      
      return {
        success: true,
        data: response
      };
    } catch (err) {
      logger.error('NotificationService', `Error al eliminar notificación ${notificationId}`, err);
      
      return {
        error: true,
        message: err.response?.data?.message || 'Error al eliminar la notificación',
        details: err.message
      };
    }
  }
};

export default notificationService;