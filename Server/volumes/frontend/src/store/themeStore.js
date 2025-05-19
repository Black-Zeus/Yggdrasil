// src/store/themeStore.js
import { create } from 'zustand';

/**
 * Store para gestionar el tema (claro/oscuro)
 */
export const useThemeStore = create((set, get) => ({
  // Estado
  darkMode: false,
  
  // Acciones
  toggleTheme: () => {
    set(state => {
      const newDarkMode = !state.darkMode;
      get().saveThemePreference(newDarkMode);
      return { darkMode: newDarkMode };
    });
  },
  
  setDarkMode: (isDark) => {
    set({ darkMode: isDark });
    get().saveThemePreference(isDark);
  },
  
  // Inicialización
  initializeTheme: () => {
    try {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        set({ darkMode: savedTheme === 'true' });
      } else {
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia && 
                           window.matchMedia('(prefers-color-scheme: dark)').matches;
        set({ darkMode: prefersDark });
      }
      
      // Aplicar al DOM
      document.documentElement.classList.toggle('dark', get().darkMode);
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  },
  
  // Persistencia
  saveThemePreference: (isDark) => {
    try {
      localStorage.setItem('darkMode', isDark.toString());
      document.documentElement.classList.toggle('dark', isDark);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }
}));