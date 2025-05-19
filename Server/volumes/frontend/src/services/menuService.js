import logger from '../utils/logger';
import { MENU_ENDPOINTS } from './endpoints';
import api from './http';

// Cache local simple para menús
let cachedMenu = null;
let lastFetchTime = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Servicio centralizado para obtener los menús del sistema
 */
const menuService = {
  /**
   * Obtiene el menú de navegación desde el backend, con cache local simple.
   * @returns {Promise<Array>} Arreglo de ítems de menú activos.
   */
  getMenuItems: async () => {
    const now = Date.now();
    if (cachedMenu && lastFetchTime && now - lastFetchTime < CACHE_TTL_MS) {
      logger.info('MenuService', 'Menú desde caché local');
      return cachedMenu;
    }

    try {
      logger.info('MenuService', 'Solicitando menú desde API');
      
      // Usar cliente HTTP centralizado con spinner local
      const response = await api.withLocalSpinner('menu-service').get(MENU_ENDPOINTS.LIST);
      
      // Extraer datos de la estructura de respuesta
      const data = response?.response?.data?.items || [];

      // Filtrar solo ítems activos
      cachedMenu = data.filter(item => item.is_active);
      lastFetchTime = now;

      return cachedMenu;
    } catch (error) {
      logger.error('MenuService', 'Error al obtener menú', error);
      return [];
    }
  },

  /**
   * Limpia la caché del menú para forzar una recarga desde backend
   */
  clearCache: () => {
    cachedMenu = null;
    lastFetchTime = null;
    logger.info('MenuService', 'Caché de menú limpiada');
  }
};

export default menuService;