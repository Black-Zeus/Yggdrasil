import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store para gestionar la información del usuario con persistencia
 */
export const useUserStore = create(
  persist(
    (set, get) => ({
      // Estado
      currentUser: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      
      // Acciones
      loadCurrentUser: async () => {
        // Si ya tenemos datos del usuario, no volvemos a cargar
        if (get().currentUser) return get().currentUser;
        
        set({ isLoading: true, error: null });
        
        try {
          // En un entorno real, esto sería una llamada a API
          const userResponse = {
            id: 'user-001',
            name: 'Juan Pérez',
            email: 'juan.perez@aqumex.com',
            role: 'Administrador',
            avatar: '/api/placeholder/36/36',
            lastLogin: '2025-05-17T08:30:00.000Z',
            permissions: ['admin', 'read', 'write']
          };
          
          set({ 
            currentUser: userResponse,
            isLoading: false,
            isAuthenticated: true
          });
          
          return userResponse;
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ 
            error: 'Error al cargar datos del usuario',
            isLoading: false
          });
          return null;
        }
      },
      
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false
        });
      },
      
      // Getters
      getUserRole: () => {
        const { currentUser } = get();
        return currentUser?.role || null;
      },
      
      hasPermission: (permission) => {
        const { currentUser } = get();
        return currentUser?.permissions?.includes(permission) || false;
      }
    }),
    {
      name: 'user-storage', // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir estos campos (opcional)
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);