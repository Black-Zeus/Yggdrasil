// src/store/sidebarStore.js
import { create } from 'zustand';

/**
 * Store para gestionar el estado del sidebar
 */
export const useSidebarStore = create((set, get) => ({
  // Estado
  collapsed: false,
  
  // Acciones
  toggleSidebar: () => set(state => ({ collapsed: !state.collapsed })),
  setSidebarState: (collapsed) => set({ collapsed }),
  
  // Inicialización
  initializeSidebar: () => {
    try {
      const savedState = localStorage.getItem('sidebar-collapsed');
      if (savedState !== null) {
        set({ collapsed: savedState === 'true' });
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    }
  },
  
  // Persistencia
  saveSidebarState: () => {
    try {
      localStorage.setItem('sidebar-collapsed', get().collapsed.toString());
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  }
}));