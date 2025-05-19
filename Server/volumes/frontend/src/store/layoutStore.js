// src/store/layoutStore.js - Actualizado para manejar mensajes y notificaciones
import { create } from 'zustand';
import messages from '../../dummyData/messages.json'
import notifications from '../../dummyData/notifications.json';

export const useLayoutStore = create((set, get) => ({
  // Estado de UI
  collapsed: false,
  darkMode: false,
  
  // Estado de datos
  currentUser: null,
  messages: [],
  notifications: [],
  isDataLoaded: {
    user: false,
    messages: false,
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
  
  // Cargar datos del usuario
  loadCurrentUser: async () => {
    // Verificar si los datos ya están cargados
    if (get().isDataLoaded.user) return;
    
    try {
      // En un entorno real, esto sería una llamada a API
      const userResponse = {
        id: 'user-001',
        name: 'Juan Pérez',
        email: 'juan.perez@aqumex.com',
        role: 'Administrador',
        avatar: '/api/placeholder/36/36',
        lastLogin: '2025-05-17T08:30:00.000Z'
      };
      
      // Actualizar estado en una sola operación para minimizar renders
      set(state => ({
        currentUser: userResponse,
        isDataLoaded: {
          ...state.isDataLoaded,
          user: true
        }
      }));
      
      return userResponse;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  },
  
  // Cargar mensajes
  loadMessages: async () => {
    // Verificar si los datos ya están cargados
    if (get().isDataLoaded.messages) return get().messages;
    
    try {
      // Simulamos la carga desde nuestro JSON local
      set(state => ({
        messages: messages,
        isDataLoaded: {
          ...state.isDataLoaded,
          messages: true
        }
      }));
      
      return messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  },
  
  // Cargar notificaciones
  loadNotifications: async () => {
    // Verificar si los datos ya están cargados
    if (get().isDataLoaded.notifications) return get().notifications;
    
    try {
      // Simulamos la carga desde nuestro JSON local
      set(state => ({
        notifications: notifications,
        isDataLoaded: {
          ...state.isDataLoaded,
          notifications: true
        }
      }));
      
      return notifications;
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  },
  
  // Marcar mensaje como leído
  markMessageAsRead: (messageId) => {
    set(state => ({
      messages: state.messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, read: true } 
          : msg
      )
    }));
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
  
  // Marcar todos los mensajes como leídos
  markAllMessagesAsRead: () => {
    set(state => ({
      messages: state.messages.map(msg => ({ 
        ...msg, 
        read: true 
      }))
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
  
  // Obtener contador de mensajes no leídos
  getUnreadMessagesCount: () => {
    const { messages } = get();
    return messages.filter(msg => !msg.read).length;
  },
  
  // Obtener contador de notificaciones no leídas
  getUnreadNotificationsCount: () => {
    const { notifications } = get();
    return notifications.filter(notif => !notif.read).length;
  },
  
  // Verificar si todos los datos están cargados
  isAllDataLoaded: () => {
    const { isDataLoaded } = get();
    return isDataLoaded.user && isDataLoaded.messages && isDataLoaded.notifications;
  }
}));