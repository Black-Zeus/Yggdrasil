// src/layout/sidebar/MenuItem.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SubmenuItem from './SubmenuItem';
import { useLayoutStore } from '../../store/layoutStore';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

/**
 * MenuItem - Componente para un elemento del menú con iconos
 * 
 * @param {Object} props
 * @param {Object} props.item - Datos del elemento de menú
 * @param {boolean} props.textVisible - Si el texto debe estar visible
 */
const MenuItem = ({ item, textVisible = true }) => {
  const { collapsed } = useLayoutStore();
  const [isOpen, setIsOpen] = useState(item.open || false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const location = useLocation();
  
  // Si el elemento o sus subelementos están activos, marcarlo como abierto
  useEffect(() => {
    if (hasSubmenu && !collapsed) {
      const isActive = item.submenu.some(subItem => subItem.active);
      if (isActive && !isOpen) {
        setIsOpen(true);
      }
    }
  }, [location.pathname, hasSubmenu, item.submenu, collapsed, isOpen]);
  
  // Cerrar submenús cuando el sidebar está colapsado
  useEffect(() => {
    if (collapsed) {
      setIsTransitioning(true);
      setIsOpen(false);
      
      // Después de la transición, restauramos el estado
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [collapsed]);
  
  const toggleSubmenu = (e) => {
    if (!collapsed && hasSubmenu) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    }
  };
  
  // Renderizar el contenido del elemento de menú con iconos
  const renderMenuItemContent = () => (
    <>
      <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${
        collapsed ? 'mr-0' : 'mr-3'
      }`}>
        <IconResolve_RI
          name={item.icon || 'warning'} 
          size={collapsed ? 22 : 18} 
          className="text-white"
        />
      </div>
      
      <div className={`text-[0.95rem] whitespace-nowrap transition-all duration-300 ${
        !textVisible ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 flex-1'
      }`}>
        {item.text}
      </div>
      
      {hasSubmenu && !collapsed && textVisible && (
        <div className={`ml-2 text-xs opacity-70 transition-transform duration-300 ${
          isOpen ? 'transform rotate-90' : ''
        }`}>
          <IconResolve_RI 
            name="arrow-right" 
            size={16} 
            className="text-white/70"
          />
        </div>
      )}
    </>
  );
  
  return (
    <>
      {/* Elemento de menú - Como Link o botón dependiendo de si tiene submenú */}
      {hasSubmenu ? (
        <li 
          className={`group flex items-center px-3 py-3 rounded-menu-item cursor-pointer mb-1 relative transition-colors duration-300 ${
            item.active ? 'bg-sidebar-active dark:bg-sidebar-dark-active' : 'hover:bg-hover-sidebar'
          } ${
            collapsed ? 'justify-center' : ''
          }`}
          onClick={toggleSubmenu}
        >
          {renderMenuItemContent()}
          
          {/* Tooltip para modo colapsado */}
          {collapsed && (
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-800 text-white py-2 px-3 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none ml-2.5 z-40">
              {item.text}
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-solid border-transparent border-r-gray-800 border-[5px]"></div>
            </div>
          )}
        </li>
      ) : (
        <li className="mb-1">
          <Link
            to={item.path || '#'}
            className={`group flex items-center px-3 py-3 rounded-menu-item cursor-pointer relative transition-colors duration-300 ${
              item.active ? 'bg-sidebar-active dark:bg-sidebar-dark-active' : 'hover:bg-hover-sidebar'
            } ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {renderMenuItemContent()}
            
            {/* Tooltip para modo colapsado */}
            {collapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 bg-gray-800 text-white py-2 px-3 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none ml-2.5 z-40">
                {item.text}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-solid border-transparent border-r-gray-800 border-[5px]"></div>
              </div>
            )}
          </Link>
        </li>
      )}
      
      {/* Submenu con mejor manejo de transición */}
      {hasSubmenu && (
        <ul className={`transition-all duration-300 overflow-hidden ${
          isTransitioning || !textVisible
            ? 'opacity-0 absolute invisible pointer-events-none' // Oculto durante transiciones
            : collapsed 
              ? 'absolute left-full top-0 ml-0 bg-sidebar dark:bg-sidebar-dark rounded-r-lg shadow-md p-2 w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50' 
              : 'ml-10 max-h-0'
          } ${
            isOpen && !collapsed && textVisible ? 'max-h-[500px]' : ''
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