import React from 'react';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * ThemeToggle - Componente para alternar entre tema claro y oscuro
 */
const ThemeToggle = () => {
  const { collapsed, darkMode, toggleTheme } = useLayoutStore();
  
  return (
    <div className={`p-4 flex items-center justify-between transition-all duration-300 ${
      collapsed ? 'justify-center p-4' : ''
    }`}>
      <div className={`text-[0.9rem] text-white transition-opacity duration-300 ${
        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
      }`}>
        Dark mode
      </div>
      
      <label className="relative inline-block w-[50px] h-[26px] cursor-pointer">
        <input 
          type="checkbox" 
          className="opacity-0 w-0 h-0" 
          checked={darkMode}
          onChange={toggleTheme}
        />
        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-white/20 rounded-full flex items-center justify-between px-[5px] before:absolute before:content-[''] before:h-[18px] before:w-[18px] before:left-[4px] before:bottom-[4px] before:bg-white before:rounded-full before:transition-all before:duration-300 before:z-[2] before:transform-gpu before:transform before:translate-x-0 dark:before:translate-x-[24px]">
          <span className="flex items-center justify-center z-[1] h-[18px] w-[18px] text-[0.8rem] text-yellow-400">
            ☀
          </span>
          <span className="flex items-center justify-center z-[1] h-[18px] w-[18px] text-[0.8rem] text-purple-400">
            ☾
          </span>
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;