import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import messages from '../../dummyData/messages.json';

/**
 * Store para gestionar los mensajes con persistencia
 */
export const useMessageStore = create(
  persist(
    (set, get) => ({
      // Estado
      messages: [],
      isLoading: false,
      isLoaded: false,
      error: null,
      
      // Acciones
      loadMessages: async () => {
        // Si ya tenemos datos cargados, no volvemos a cargar
        if (get().isLoaded) return get().messages;
        
        set({ isLoading: true, error: null });
        
        try {
          // En un entorno real, esto sería una llamada a API
          set({ 
            messages,
            isLoading: false,
            isLoaded: true
          });
          
          return messages;
        } catch (error) {
          console.error('Error loading messages:', error);
          set({ 
            error: 'Error al cargar mensajes',
            isLoading: false
          });
          return [];
        }
      },
      
      markAsRead: (messageId) => {
        set(state => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        }));
      },
      
      markAllAsRead: () => {
        set(state => ({
          messages: state.messages.map(msg => ({ ...msg, read: true }))
        }));
      },
      
      deleteMessage: (messageId) => {
        set(state => ({
          messages: state.messages.filter(msg => msg.id !== messageId)
        }));
      },
      
      // Getters
      getUnreadCount: () => {
        return get().messages.filter(msg => !msg.read).length;
      },
      
      getMessagesByType: (type) => {
        return get().messages.filter(msg => msg.type === type);
      },
      
      // Cosas más importantes primero
      getSortedMessages: () => {
        return [...get().messages].sort((a, b) => {
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
      name: 'messages-storage', // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
      // Opcional: limitar qué se persiste para evitar guardar demasiados datos
      partialize: (state) => ({
        messages: state.messages,
        isLoaded: state.isLoaded
      }),
    }
  )
);