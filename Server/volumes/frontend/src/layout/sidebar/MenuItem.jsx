import React, { useState, useEffect } from 'react';
import SubmenuItem from './SubmenuItem';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * MenuItem - Componente para un elemento del menú
 * 
 * @param {Object} props
 * @param {Object} props.item - Datos del elemento de menú
 */
const MenuItem = ({ item }) => {
  const { collapsed } = useLayoutStore();
  const [isOpen, setIsOpen] = useState(item.open || false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  
  // Cerrar submenús cuando el sidebar está colapsado
  useEffect(() => {
    if (collapsed) {
      setIsOpen(false);
    } else if (item.open) {
      setIsOpen(true);
    }
  }, [collapsed, item.open]);
  
  const toggleSubmenu = (e) => {
    if (!collapsed && hasSubmenu) {
      e.stopPropagation();
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <>
      <li 
        className={`flex items-center px-3 py-3 rounded-menu-item cursor-pointer mb-1 relative transition-colors duration-300 ${
          item.active ? 'bg-sidebar-active dark:bg-sidebar-dark-active' : 'hover:bg-hover-sidebar'
        } ${
          collapsed ? 'justify-center' : ''
        }`}
        onClick={toggleSubmenu}
      >
        <div className={`w-5 h-5 flex items-center justify-center text-lg flex-shrink-0 ${
          collapsed ? 'mr-0' : 'mr-3'
        }`}>
          {item.icon}
        </div>
        
        <div className={`text-[0.95rem] whitespace-nowrap transition-opacity duration-300 ${
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 flex-1'
        }`}>
          {item.text}
        </div>
        
        {hasSubmenu && !collapsed && (
          <div className={`ml-2 text-xs opacity-70 transition-transform duration-300 ${
            isOpen ? 'transform rotate-90' : ''
          }`}>
            &#8250;
          </div>
        )}
        
        {/* Tooltip for collapsed mode */}
        {collapsed && (
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-800 text-white py-2 px-3 rounded text-sm opacity-0 invisible transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none ml-2.5 z-40 tooltip-sidebar">
            {item.text}
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-solid border-transparent border-r-gray-800 border-[5px]"></div>
          </div>
        )}
      </li>
      
      {/* Submenu */}
      {hasSubmenu && (
        <ul className={`transition-all duration-300 overflow-hidden ${
          collapsed 
            ? 'absolute left-full top-0 ml-0 bg-sidebar dark:bg-sidebar-dark rounded-r-lg shadow-md p-2 w-[180px] opacity-0 invisible hover:opacity-100 hover:visible submenu-hover' 
            : 'ml-10 max-h-0'
        } ${
          isOpen && !collapsed ? 'max-h-[500px]' : ''
        }`}>
          {item.submenu.map(subItem => (
            <SubmenuItem 
              key={subItem.id} 
              item={subItem} 
            />
          ))}
        </ul>
      )}
      
      {/* CSS para mostrar submenú en hover cuando está colapsado */}
      <style jsx>{`
        .tooltip-sidebar {
          position: absolute;
          z-index: 40;
        }
        
        li:hover .tooltip-sidebar {
          opacity: 1;
          visibility: visible;
        }
        
        li:hover + .submenu-hover,
        .submenu-hover:hover {
          max-height: 500px;
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </>
  );
};

export default MenuItem;