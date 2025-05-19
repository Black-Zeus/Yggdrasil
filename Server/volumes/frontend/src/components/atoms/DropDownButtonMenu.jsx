import React, { useState, useRef, useEffect } from 'react';
import IconResolve_RI from './IconResolve_RI';

/**
 * Componente DropdownMenu que muestra un menú desplegable al hacer clic en un botón
 * @param {ReactNode} children - Contenido del botón
 * @param {string} buttonClassName - Clases CSS adicionales para personalizar el botón
 * @param {string} listClassName - Clases CSS para personalizar la lista desplegable
 * @param {Array} menuItems - Array de objetos con las opciones del menú
 *                 Cada objeto debe tener: {icon: ReactNode, text: string, onClick: function}
 * @returns {JSX.Element}
 */
const DropDownButtonMenu = ({ 
  children,
  buttonClassName = "",
  listClassName = "",
  menuItems = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultListClasses = "absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none";
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className={`inline-flex justify-center items-center gap-x-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${buttonClassName}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {children}
        <IconResolve_RI name="RiArrowDownSLine"
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          className={listClassName || defaultListClasses}
          style={{ position: 'absolute', zIndex: 50 }}
        >
          <div className="py-1">
            {menuItems.length > 0 ? (
              menuItems.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                    setIsOpen(false);
                  }}
                >
                  {item.icon && <span className="mr-2 text-gray-500">{item.icon}</span>}
                  {item.text}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No hay opciones disponibles</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownButtonMenu;