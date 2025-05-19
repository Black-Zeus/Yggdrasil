// src/store/layoutStore.js
import { create } from 'zustand';

export const useLayoutStore = create((set, get) => ({
  // Estado inicial
  collapsed: false,
  darkMode: false,
  currentUser: null,
  notifications: [],

  // Acciones para el sidebar
  toggleSidebar: () => set(state => ({ collapsed: !state.collapsed })),

  // Acciones para el tema
  toggleTheme: () => {
    set(state => {
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', newDarkMode.toString());
      return { darkMode: newDarkMode };
    });
  },

  // Inicializar el tema desde localStorage
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      set({ darkMode: savedTheme === 'true' });
    }
  },

  // Cargar datos del usuario
  loadCurrentUser: async () => {
    try {
      // En un entorno real, esto sería una llamada a API
      // Simulamos la carga desde dummyData
      const userResponse = await import('../../dummyData/currentUser.json');
      set({ currentUser: userResponse.default });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },

  // Cargar notificaciones
  loadNotifications: async () => {
    try {
      // Simulamos la carga desde dummyData
      const notificationsResponse = await import('../../dummyData/notifications.json');
      set({ notifications: notificationsResponse.default });
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }
}));