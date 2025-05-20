import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store para gestionar el estado del sidebar con persistencia
 */
export const useSidebarStore = create(
  persist(
    (set) => ({
      // Estado
      collapsed: false,
      
      // Acciones
      toggleSidebar: () => set(state => ({ collapsed: !state.collapsed })),
      setSidebarState: (collapsed) => set({ collapsed }),
    }),
    {
      name: 'sidebar-storage', // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);