import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import logger from '../../utils/logger';

/**
 * Store para gestionar exclusivamente estados UI generales 
 * (tema, sidebar, notificaciones)
 */
const useUIStore = create(
  // Usar subscribeWithSelector para permitir suscripciones más granulares
  subscribeWithSelector((set, get) => ({
    // ---------- Configuración de tema ----------
    theme: 'light', // 'light' | 'dark' | 'system'
    systemPrefersDark: false,
    themeInitialized: false, // Bandera para evitar inicializaciones múltiples
    
    // ---------- Estado del Sidebar ----------
    isSidebarOpen: true,
    isSidebarCollapsible: true, // Si el sidebar puede colapsarse
    
    // ---------- Estado de notificaciones de la UI ----------
    uiNotifications: [],
    lastNotificationId: 0,
    
    // -----------------------------------------
    // Acciones de tema
    // -----------------------------------------
    
    /**
     * Sincroniza el estado del tema sin inicializarlo (no manipula el DOM)
     * @param {string} theme - Tema a sincronizar ('light', 'dark', 'system')
     */
    syncThemeState: (theme) => {
      // No manipula el DOM, solo actualiza el estado interno
      set({ 
        theme: theme || 'light',
        themeInitialized: true
      });
      
      logger.info('UIStore', `Estado del tema sincronizado: ${theme}`);
    },
    
    /**
     * Cambia el tema de la aplicación
     * @param {string} newTheme - 'light' | 'dark' | 'system'
     */
    setTheme: (newTheme) => {
      if (!['light', 'dark', 'system'].includes(newTheme)) {
        logger.warn('UIStore', `Tema no válido: ${newTheme}`);
        return;
      }
      
      try {
        // Guardar preferencia
        localStorage.setItem('theme', newTheme);
        
        // Determinar si aplicar dark mode
        let applyDark = newTheme === 'dark';
        if (newTheme === 'system') {
          applyDark = get().systemPrefersDark;
        }
        
        // Aplicar al DOM
        if (typeof document !== 'undefined' && document.documentElement) {
          document.documentElement.classList.toggle('dark', applyDark);
        }
        
        // Actualizar estado
        set({ 
          theme: newTheme,
          themeInitialized: true
        });
        
        logger.info('UIStore', `Tema cambiado a: ${newTheme}`);
      } catch (error) {
        logger.error('UIStore', 'Error al cambiar tema:', error);
      }
    },
    
    /**
     * Obtiene la configuración actual del tema
     * @returns {Object} Configuración del tema
     */
    getThemeConfig: () => {
      const { theme, systemPrefersDark } = get();
      // Calcular si el tema actual es oscuro
      const isDarkMode = theme === 'dark' || (theme === 'system' && systemPrefersDark);
      
      return {
        theme,
        systemPrefersDark,
        isDarkMode
      };
    },
    
    // -----------------------------------------
    // Acciones de Sidebar
    // -----------------------------------------
    
    /**
     * Alterna el estado del sidebar
     */
    toggleSidebar: () => {
      // Solo permitir alternar si es colapsible
      if (!get().isSidebarCollapsible) return;
      
      const newState = !get().isSidebarOpen;
      set({ isSidebarOpen: newState });
      
      try {
        // Guardar preferencia
        localStorage.setItem('sidebarOpen', String(newState));
      } catch (error) {
        logger.error('UIStore', 'Error al guardar estado de sidebar:', error);
      }
    },
    
    /**
     * Establece si el sidebar puede colapsarse
     * @param {boolean} collapsible - Si el sidebar puede colapsarse
     */
    setSidebarCollapsible: (collapsible) => {
      set({ 
        isSidebarCollapsible: collapsible,
        // Si se desactiva colapsible, asegurarse que esté abierto
        isSidebarOpen: collapsible ? get().isSidebarOpen : true
      });
    },
    
    /**
     * Establece directamente el estado del sidebar
     * @param {boolean} isOpen - Si el sidebar está abierto o cerrado
     */
    setSidebarOpen: (isOpen) => {
      if (!get().isSidebarCollapsible && !isOpen) {
        // No permitir cerrar si no es colapsible
        return;
      }
      
      set({ isSidebarOpen: isOpen });
      
      try {
        localStorage.setItem('sidebarOpen', String(isOpen));
      } catch (error) {
        logger.error('UIStore', 'Error al guardar estado de sidebar:', error);
      }
    },
    
    /**
     * Inicializa el estado del sidebar desde localStorage
     */
    initializeSidebar: () => {
      try {
        // Intentar leer la preferencia guardada
        const savedState = localStorage.getItem('sidebarOpen');
        
        // Si existe una preferencia, aplicarla
        if (savedState !== null) {
          const isOpen = savedState === 'true';
          set({ isSidebarOpen: isOpen });
        }
        
        logger.info('UIStore', 'Sidebar inicializado');
      } catch (error) {
        logger.error('UIStore', 'Error al inicializar sidebar:', error);
      }
    },
    
    // -----------------------------------------
    // Acciones de notificaciones UI
    // -----------------------------------------
    
    /**
     * Muestra una notificación UI (no confundir con toasts)
     * @param {Object} notification - Datos de la notificación
     * @param {string} notification.message - Mensaje a mostrar
     * @param {string} notification.type - Tipo: 'info' | 'success' | 'warning' | 'error'
     * @param {number} notification.duration - Duración en ms (0 para indefinido)
     * @param {string} notification.title - Título opcional de la notificación
     * @param {Function} notification.onClick - Función a ejecutar al hacer clic
     * @returns {number} ID de la notificación
     */
    showNotification: (notification) => {
      const id = get().lastNotificationId + 1;
      const newNotification = {
        id,
        message: notification.message || 'Nueva notificación',
        type: notification.type || 'info',
        duration: notification.duration || 5000,
        timestamp: new Date().toISOString(),
        title: notification.title || '',
        onClick: notification.onClick || null
      };
      
      // Añadir a la lista
      set(state => ({
        uiNotifications: [...state.uiNotifications, newNotification],
        lastNotificationId: id
      }));
      
      // Si tiene duración, programar eliminación
      if (newNotification.duration > 0) {
        setTimeout(() => {
          get().dismissNotification(id);
        }, newNotification.duration);
      }
      
      return id;
    },
    
    /**
     * Elimina una notificación por su ID
     * @param {number} id - ID de la notificación a eliminar
     */
    dismissNotification: (id) => {
      set(state => ({
        uiNotifications: state.uiNotifications.filter(n => n.id !== id)
      }));
    },
    
    /**
     * Elimina todas las notificaciones
     */
    clearAllNotifications: () => {
      set({ uiNotifications: [] });
    },
    
    /**
     * Métodos de ayuda para tipos específicos de notificaciones
     */
    notifications: {
      /**
       * Muestra una notificación de tipo info
       * @param {string} message - Mensaje a mostrar
       * @param {Object} options - Opciones adicionales
       * @returns {number} ID de la notificación
       */
      info: (message, options = {}) => {
        return get().showNotification({
          message,
          type: 'info',
          ...options
        });
      },
      
      /**
       * Muestra una notificación de tipo success
       * @param {string} message - Mensaje a mostrar
       * @param {Object} options - Opciones adicionales
       * @returns {number} ID de la notificación
       */
      success: (message, options = {}) => {
        return get().showNotification({
          message,
          type: 'success',
          ...options
        });
      },
      
      /**
       * Muestra una notificación de tipo warning
       * @param {string} message - Mensaje a mostrar
       * @param {Object} options - Opciones adicionales
       * @returns {number} ID de la notificación
       */
      warning: (message, options = {}) => {
        return get().showNotification({
          message,
          type: 'warning',
          ...options
        });
      },
      
      /**
       * Muestra una notificación de tipo error
       * @param {string} message - Mensaje a mostrar
       * @param {Object} options - Opciones adicionales
       * @returns {number} ID de la notificación
       */
      error: (message, options = {}) => {
        return get().showNotification({
          message,
          type: 'error',
          duration: 10000, // Los errores se muestran más tiempo por defecto
          ...options
        });
      }
    }
  }))
);

export default useUIStore;