// sidebarStore.js - Store unificado para sidebar y tema

import { create } from "zustand";
import { persist } from "zustand/middleware";
import logger from '../../utils/logger';
import useUIStore from "./uiStore"; // Importamos uiStore para acceder a las funciones de tema

const useSidebarStore = create(
  persist(
    (set, get) => ({
      isOpen: false, // Estado para móviles
      isCollapsed: false, // Estado para pantallas grandes
      expandedMenu: null, // Submenús expandidos
      menuItems: [], // Almacén de menús dinámicos
  
      // Acciones
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      toggleSubMenu: (menu) =>
        set((state) => ({
          expandedMenu: state.expandedMenu === menu ? null : menu,
        })),
      setMenuItems: (menuItems) => set({ menuItems }), // Setter para menús dinámicos
      
      // Método para inicializar estado del sidebar
      initializeSidebar: () => {
        try {
          const storedState = localStorage.getItem('sidebar-collapsed');
          if (storedState !== null) {
            const isCollapsed = storedState === 'true';
            set({ isCollapsed });
            logger.info('SidebarStore', `Sidebar inicializado: ${isCollapsed ? 'colapsado' : 'expandido'}`);
          }
          
          // Inicializar también el tema usando uiStore
          // Esta es la línea que causa problemas, ya que intenta acceder a initializeTheme
          // del uiStore, pero lo hace incorrectamente
          const { initializeTheme } = useUIStore.getState();
          if (typeof initializeTheme === 'function') {
            initializeTheme();
          } else {
            logger.warn('SidebarStore', 'No se pudo inicializar el tema: función no disponible');
          }
        } catch (error) {
          logger.error('SidebarStore', 'Error al inicializar estado del sidebar', error);
        }
      }
    }),
    {
      name: "sidebar-store", // Nombre en LocalStorage
      getStorage: () => localStorage, // Usar localStorage
    }
  )
);
  
export default useSidebarStore;