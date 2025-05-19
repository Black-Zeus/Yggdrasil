import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * SidebarNavigation - Componente para la navegación del sidebar
 */
const SidebarNavigation = () => {
  const { collapsed } = useLayoutStore();
  const [menuItems, setMenuItems] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  
  // Cargar datos de menú desde los archivos JSON
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const menuResponse = await import('../../../dummyData/menuItems.json');
        const shortcutsResponse = await import('../../../dummyData/shortcuts.json');
        
        setMenuItems(menuResponse.default);
        setShortcuts(shortcutsResponse.default);
      } catch (error) {
        console.error('Error loading menu data:', error);
      }
    };
    
    loadMenuData();
  }, []);
  
  return (
    <div className="flex-1 py-4 overflow-y-auto">
      {/* Main Menu Section */}
      <div className="mb-4 px-4">
        <ul className="menu">
          {menuItems.map(item => (
            <MenuItem 
              key={item.id}
              item={item}
            />
          ))}
        </ul>
      </div>
      
      {/* Shortcuts Section */}
      <div className="px-4">
        <div className={`uppercase text-xs font-bold text-white/60 mb-2 px-3 whitespace-nowrap transition-all duration-300 ${
          collapsed ? 'opacity-0 h-0 m-0 p-0 overflow-hidden' : 'opacity-100'
        }`}>
          Shortcuts
        </div>
        <ul className="menu">
          {shortcuts.map(item => (
            <MenuItem 
              key={item.id}
              item={item}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarNavigation;