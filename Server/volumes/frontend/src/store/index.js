import { useSidebarStore } from './sidebarStore';
import { useThemeStore } from './themeStore';
import { useUserStore } from './userStore';
import { useMessageStore } from './messageStore';
import { useNotificationStore } from './notificationStore';

// Exportamos los stores para que puedan ser importados por los componentes
export { useSidebarStore } from './sidebarStore';
export { useThemeStore } from './themeStore';
export { useUserStore } from './userStore';
export { useMessageStore } from './messageStore';
export { useNotificationStore } from './notificationStore';
export { useMenuStore } from './menuStore';

/**
 * Función de utilidad para inicializar todos los stores
 * Ahora solo necesitamos ejecutar las inicializaciones específicas
 */
export const initializeAllStores = () => {
  // Sólo llamar carga inicial de datos
  const { loadCurrentUser } = useUserStore.getState();
  const { loadMessages } = useMessageStore.getState();
  const { loadNotifications } = useNotificationStore.getState();
  const { initializeTheme } = useThemeStore.getState();
  
  // Para temas que necesitan inicialización DOM
  initializeTheme();
  
  // Cargar datos de usuario y contenido
  loadCurrentUser();
  loadMessages();
  loadNotifications();
};