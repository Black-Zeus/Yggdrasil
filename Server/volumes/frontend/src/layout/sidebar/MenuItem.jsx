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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  
  // Efecto para manejar el estado del submenú cuando el sidebar cambia
  useEffect(() => {
    // Cuando comienza a colapsarse, marcamos que está en transición
    if (collapsed) {
      setIsTransitioning(true);
      setIsOpen(false);
      
      // Después de la transición, restauramos el estado
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Debe coincidir con la duración de la transición del sidebar
      
      return () => clearTimeout(timer);
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
        className={`group flex items-center px-3 py-3 rounded-menu-item cursor-pointer mb-1 relative transition-colors duration-300 ${
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
        
        {/* Tooltip para modo colapsado - visible solo en hover */}
        {collapsed && (
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-800 text-white py-2 px-3 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none ml-2.5 z-40">
            {item.text}
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-solid border-transparent border-r-gray-800 border-[5px]"></div>
          </div>
        )}
      </li>
      
      {/* Submenu - Oculto inmediatamente durante la transición */}
      {hasSubmenu && (
        <ul className={`transition-all duration-300 overflow-hidden ${
          isTransitioning 
            ? 'invisible opacity-0 absolute' // Oculto inmediatamente durante la transición
            : collapsed 
              ? 'absolute left-full top-0 ml-0 bg-sidebar dark:bg-sidebar-dark rounded-r-lg shadow-md p-2 w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible' 
              : 'ml-10 max-h-0'
          } ${
            isOpen && !collapsed ? 'max-h-[500px]' : ''
          }`}
        >
          {item.submenu.map(subItem => (
            <SubmenuItem 
              key={subItem.id} 
              item={subItem} 
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default MenuItem;