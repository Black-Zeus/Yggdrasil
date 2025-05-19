// src/store/layoutStore.js
import { create } from 'zustand';

export const useLayoutStore = create((set, get) => ({
  // Estado de UI
  collapsed: false,
  darkMode: false,
  
  // Estado de datos
  currentUser: null,
  notifications: [],
  isDataLoaded: {
    user: false,
    notifications: false,
  },
  
  // Acciones para el sidebar
  toggleSidebar: () => set(state => ({ collapsed: !state.collapsed })),
  setSidebarState: (collapsed) => set({ collapsed }),
  
  // Acciones para el tema
  toggleTheme: () => {
    set(state => {
      const newDarkMode = !state.darkMode;
      try {
        localStorage.setItem('darkMode', newDarkMode.toString());
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
      return { darkMode: newDarkMode };
    });
  },
  
  setDarkMode: (isDark) => {
    set({ darkMode: isDark });
    try {
      localStorage.setItem('darkMode', isDark.toString());
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  },
  
  // Inicializar el tema desde localStorage
  initializeTheme: () => {
    try {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        set({ darkMode: savedTheme === 'true' });
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  },
  
  // Cargar datos del usuario - optimizado para prevenir re-renders
  loadCurrentUser: async () => {
    // Verificar si los datos ya están cargados
    if (get().isDataLoaded.user) return;
    
    try {
      // En un entorno real, esto sería una llamada a API
      const userResponse = await import('../../dummyData/currentUser.json');
      
      // Actualizar estado en una sola operación para minimizar renders
      set(state => ({
        currentUser: userResponse.default,
        isDataLoaded: {
          ...state.isDataLoaded,
          user: true
        }
      }));
      
      return userResponse.default;
    } catch (error) {
      console.error('Error loading user data:', error);
      // No actualizar el estado en caso de error para evitar renders
      return null;
    }
  },
  
  // Recargar datos del usuario (forzar recarga)
  reloadUserData: async () => {
    try {
      const userResponse = await import('../../dummyData/currentUser.json?t=' + Date.now());
      
      set({
        currentUser: userResponse.default,
        isDataLoaded: {
          ...get().isDataLoaded,
          user: true
        }
      });
      
      return userResponse.default;
    } catch (error) {
      console.error('Error reloading user data:', error);
      return null;
    }
  },
  
  // Cargar notificaciones - optimizado para prevenir re-renders
  loadNotifications: async () => {
    // Verificar si los datos ya están cargados
    if (get().isDataLoaded.notifications) return;
    
    try {
      // Simulamos la carga desde dummyData
      const notificationsResponse = await import('../../dummyData/notifications.json');
      
      // Actualizar estado en una sola operación
      set(state => ({
        notifications: notificationsResponse.default,
        isDataLoaded: {
          ...state.isDataLoaded,
          notifications: true
        }
      }));
      
      return notificationsResponse.default;
    } catch (error) {
      console.error('Error loading notifications:', error);
      // No actualizar el estado en caso de error para evitar renders
      return [];
    }
  },
  
  // Recargar notificaciones (forzar recarga)
  reloadNotifications: async () => {
    try {
      const notificationsResponse = await import('../../dummyData/notifications.json?t=' + Date.now());
      
      set({
        notifications: notificationsResponse.default,
        isDataLoaded: {
          ...get().isDataLoaded,
          notifications: true
        }
      });
      
      return notificationsResponse.default;
    } catch (error) {
      console.error('Error reloading notifications:', error);
      return [];
    }
  },
  
  // Marcar notificación como leída
  markNotificationAsRead: (notificationId) => {
    set(state => ({
      notifications: state.notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true } 
          : notif
      )
    }));
  },
  
  // Marcar todas las notificaciones como leídas
  markAllNotificationsAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(notif => ({ 
        ...notif, 
        read: true 
      }))
    }));
  },
  
  // Obtener contador de notificaciones no leídas
  getUnreadCount: (type = null) => {
    const { notifications } = get();
    
    if (!notifications || notifications.length === 0) {
      return 0;
    }
    
    // Si se especifica un tipo, filtrar por ese tipo
    if (type) {
      return notifications.filter(notif => !notif.read && notif.type === type).length;
    }
    
    // De lo contrario, contar todas las no leídas
    return notifications.filter(notif => !notif.read).length;
  },
  
  // Obtener notificaciones filtradas por tipo
  getNotificationsByType: (type) => {
    const { notifications } = get();
    
    if (!notifications || notifications.length === 0) {
      return [];
    }
    
    return notifications.filter(notif => notif.type === type);
  },
  
  // Gestión del perfil de usuario
  getUserProfile: () => {
    const { currentUser } = get();
    
    if (!currentUser) {
      return null;
    }
    
    return {
      name: currentUser.name || 'Usuario',
      avatar: currentUser.avatar || null,
      role: currentUser.role || 'Usuario',
      email: currentUser.email || '',
    };
  },
  
  // Verificar si ambos datos están cargados
  isAllDataLoaded: () => {
    const { isDataLoaded } = get();
    return isDataLoaded.user && isDataLoaded.notifications;
  },
  
  // Resetear estado (útil para logout)
  resetState: () => {
    set({
      currentUser: null,
      notifications: [],
      isDataLoaded: {
        user: false,
        notifications: false,
      }
    });
  }
}));