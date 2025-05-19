// src/layout/header/UserDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

/**
 * UserDropdown - Componente para el menú desplegable del usuario
 */
const UserDropdown = () => {
  const { currentUser, logout } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    logout();
    // Aquí podrías también redirigir al usuario a la página de login
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="relative" ref={dropdownRef} id="user-dropdown">
      <button 
        className="flex items-center bg-transparent border-none cursor-pointer py-2 px-2 rounded-[30px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
        onClick={toggleDropdown}
      >
        <div className="w-9 h-9 rounded-full mr-3 overflow-hidden">
          <img 
            src={currentUser.avatar || "/api/placeholder/36/36"}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col text-left mr-2">
          <div className="font-semibold text-[0.9rem] text-text dark:text-text-dark">
            {currentUser.name}
          </div>
          <div className="text-[0.75rem] text-text-secondary dark:text-text-dark-secondary">
            {currentUser.role}
          </div>
        </div>
        
        <div className="text-text-secondary dark:text-text-dark-secondary ml-1">
          <IconResolve_RI 
            name="arrow-down" 
            size={16} 
            className="opacity-70"
          />
        </div>
      </button>
      
      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute top-full right-0 w-[200px] bg-background dark:bg-background-dark rounded-lg shadow-dropdown p-2 mt-2 z-100 origin-top-right transform scale-100 opacity-100 visible transition-all duration-200">
          <a href="#/profile" className="flex items-center px-4 py-3 text-text dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5 rounded text-[0.9rem] no-underline transition-colors duration-200">
            <div className="mr-3 w-4 h-4 flex items-center justify-center">
              <IconResolve_RI name="user" size={16} />
            </div>
            <div>Mi Perfil</div>
          </a>
          
          <a href="#/settings" className="flex items-center px-4 py-3 text-text dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5 rounded text-[0.9rem] no-underline transition-colors duration-200">
            <div className="mr-3 w-4 h-4 flex items-center justify-center">
              <IconResolve_RI name="settings" size={16} />
            </div>
            <div>Configuración</div>
          </a>
          
          <a href="#/activity" className="flex items-center px-4 py-3 text-text dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5 rounded text-[0.9rem] no-underline transition-colors duration-200">
            <div className="mr-3 w-4 h-4 flex items-center justify-center">
              <IconResolve_RI name="history" size={16} />
            </div>
            <div>Registro de Actividad</div>
          </a>
          
          <div className="h-px bg-border dark:bg-border-dark my-2"></div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-[0.9rem] transition-colors duration-200"
          >
            <div className="mr-3 w-4 h-4 flex items-center justify-center">
              <IconResolve_RI name="logout" size={16} className="text-red-600" />
            </div>
            <div>Cerrar Sesión</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;