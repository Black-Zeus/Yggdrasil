// src/store/index.js
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

/**
 * Función de utilidad para inicializar todos los stores
 */
export const initializeAllStores = () => {
  const { initializeSidebar } = useSidebarStore.getState();
  const { initializeTheme } = useThemeStore.getState();
  const { loadCurrentUser } = useUserStore.getState();
  const { loadMessages } = useMessageStore.getState();
  const { loadNotifications } = useNotificationStore.getState();
  
  // Inicializar UI primero (tema y sidebar)
  initializeTheme();
  initializeSidebar();
  
  // Cargar datos de usuario y contenido
  loadCurrentUser();
  loadMessages();
  loadNotifications();
};