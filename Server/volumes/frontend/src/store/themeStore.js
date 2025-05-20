import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store para gestionar el tema (claro/oscuro) con persistencia
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Estado
      darkMode: false,
      
      // Acciones
      toggleTheme: () => {
        set(state => {
          const newDarkMode = !state.darkMode;
          // Aplicar al DOM cuando cambia el tema
          document.documentElement.classList.toggle('dark', newDarkMode);
          return { darkMode: newDarkMode };
        });
      },
      
      setDarkMode: (isDark) => {
        set({ darkMode: isDark });
        // Aplicar al DOM cuando se establece el tema
        document.documentElement.classList.toggle('dark', isDark);
      },
      
      // Inicialización de tema del sistema (solo se llama al inicio)
      initializeTheme: () => {
        try {
          // Verificar preferencia del sistema solo si no hay tema guardado
          const prefersDark = window.matchMedia && 
                           window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          // Si no hay tema persistido, usar preferencia del sistema
          if (get().darkMode === undefined) {
            set({ darkMode: prefersDark });
          }
          
          // Aplicar al DOM
          document.documentElement.classList.toggle('dark', get().darkMode);
        } catch (error) {
          console.error('Error initializing theme preference:', error);
        }
      },
    }),
    {
      name: 'theme-storage', // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);