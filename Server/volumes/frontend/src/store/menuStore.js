import { create } from 'zustand';
import menuData from '../../dummyData/menuItems.json';

// Menú no necesita persistencia ya que se genera dinámicamente según la ruta
export const useMenuStore = create((set) => ({
  mainMenu: [],
  shortcuts: [],

  loadMenu: (pathname) => {
    const markActive = (items) =>
      items.map(item => {
        const hasSubmenu = Array.isArray(item.submenu);
        const isActive = item.path === pathname;
        const submenuActive = hasSubmenu && item.submenu.some(sub => sub.path === pathname);
        return {
          ...item,
          active: isActive || submenuActive,
          open: submenuActive,
          submenu: hasSubmenu
            ? item.submenu.map(sub => ({
                ...sub,
                active: sub.path === pathname
              }))
            : undefined
        };
      });

    set({
      mainMenu: markActive(menuData),
      shortcuts: [
        {
          id: 'help',
          text: 'Help Center',
          icon: 'question',
          path: '/help',
          active: pathname === '/help'
        },
        {
          id: 'support',
          text: 'Support',
          icon: 'customer-service',
          path: '/support',
          active: pathname === '/support'
        }
      ]
    });
  }
}));