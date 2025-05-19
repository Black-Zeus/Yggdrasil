import React from 'react';

/**
 * SubmenuItem - Componente para un elemento del submenú
 * 
 * @param {Object} props
 * @param {Object} props.item - Datos del elemento de submenú
 */
const SubmenuItem = ({ item }) => {
  return (
    <li 
      className={`flex items-center px-3 py-2 rounded-menu-item cursor-pointer mb-1 relative transition-colors duration-300 text-white/85 text-[0.9rem] whitespace-nowrap ${
        item.active ? 'bg-sidebar-active dark:bg-sidebar-dark-active' : 'hover:bg-hover-sidebar'
      }`}
    >
      {item.text}
    </li>
  );
};

export default SubmenuItem;