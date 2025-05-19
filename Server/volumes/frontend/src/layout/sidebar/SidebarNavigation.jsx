// src/layout/sidebar/SidebarNavigation.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';
import { useLayoutStore } from '../../store/layoutStore';
import { useMenuStore } from '../../store/menuStore'; // ✅ importar el store

/**
 * SidebarNavigation - Componente para la navegación del sidebar
 * @param {Object} props
 * @param {boolean} props.textVisible - Si el texto debe estar visible
 */
const SidebarNavigation = ({ textVisible = true }) => {
  const { collapsed } = useLayoutStore();
  const location = useLocation();
  const { mainMenu, shortcuts, loadMenu } = useMenuStore(); // ✅ consumir el store

  useEffect(() => {
    loadMenu(location.pathname); // ✅ actualizar menús según la ruta
  }, [location.pathname]);

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      {/* Main Menu Section */}
      <div className="mb-4 px-4">
        <ul className="menu">
          {mainMenu.map(item => (
            <MenuItem 
              key={item.id}
              item={item}
              textVisible={textVisible}
            />
          ))}
        </ul>
      </div>
      
      {/* Shortcuts Section */}
      <div className="px-4">
        <div className={`uppercase text-xs font-bold text-white/60 mb-2 px-3 whitespace-nowrap transition-all duration-300 ${
          !textVisible ? 'opacity-0 h-0 m-0 p-0 overflow-hidden' : 'opacity-100'
        }`}>
          Shortcuts
        </div>
        <ul className="menu">
          {shortcuts.map(item => (
            <MenuItem 
              key={item.id}
              item={item}
              textVisible={textVisible}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarNavigation;
