import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import notifications from '../../dummyData/notifications.json';

/**
 * Store para gestionar las notificaciones con persistencia
 */
export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // Estado
      notifications: [],
      isLoading: false,
      isLoaded: false,
      error: null,
      
      // Acciones
      loadNotifications: async () => {
        // Si ya tenemos datos cargados, no volvemos a cargar
        if (get().isLoaded) return get().notifications;
        
        set({ isLoading: true, error: null });
        
        try {
          // En un entorno real, esto sería una llamada a API
          set({ 
            notifications,
            isLoading: false,
            isLoaded: true
          });
          
          return notifications;
        } catch (error) {
          console.error('Error loading notifications:', error);
          set({ 
            error: 'Error al cargar notificaciones',
            isLoading: false
          });
          return [];
        }
      },
      
      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        }));
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true }))
        }));
      },
      
      dismissNotification: (notificationId) => {
        set(state => ({
          notifications: state.notifications.filter(notif => notif.id !== notificationId)
        }));
      },
      
      // Getters
      getUnreadCount: () => {
        return get().notifications.filter(notif => !notif.read).length;
      },
      
      getNotificationsByType: (type) => {
        return get().notifications.filter(notif => notif.type === type);
      },
      
      getNotificationsByPriority: (priority) => {
        return get().notifications.filter(notif => notif.priority === priority);
      },
      
      // Cosas más importantes primero
      getSortedNotifications: () => {
        return [...get().notifications].sort((a, b) => {
          // Primero los no leídos
          if (a.read !== b.read) return a.read ? 1 : -1;
          
          // Luego por prioridad
          if (a.priority !== b.priority) {
            const priorityOrder = { high: 0, medium: 1, normal: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          
          // Finalmente por fecha, más recientes primero
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
      }
    }),
    {
      name: 'notifications-storage', // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
      // Opcional: limitar qué se persiste
      partialize: (state) => ({
        notifications: state.notifications,
        isLoaded: state.isLoaded
      }),
    }
  )
);