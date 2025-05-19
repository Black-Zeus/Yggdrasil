// src/layout/sidebar/SubmenuItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

/**
 * SubmenuItem - Componente para un elemento del submenú
 * 
 * @param {Object} props
 * @param {Object} props.item - Datos del elemento de submenú
 */
const SubmenuItem = ({ item }) => {
  return (
    <li className="mb-1">
      <Link 
        to={item.path || '#'}
        className={`flex items-center px-3 py-2 rounded-menu-item cursor-pointer relative transition-colors duration-300 text-white/85 text-[0.9rem] whitespace-nowrap ${
          item.active ? 'bg-sidebar-active dark:bg-sidebar-dark-active' : 'hover:bg-hover-sidebar'
        }`}
      >
        {item.icon && (
          <div className="mr-2 flex items-center justify-center">
            <IconResolve_RI
              name={item.icon} 
              size={16} 
              className="text-white/80"
            />
          </div>
        )}
        {item.text}
      </Link>
    </li>
  );
};

export default SubmenuItem;