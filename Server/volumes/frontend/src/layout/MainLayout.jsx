// src/layout/MainLayout.jsx
import React, { useEffect } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { useSidebarStore, useThemeStore } from '../store';

/**
 * MainLayout - Componente principal para la estructura de la aplicación
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar en el área principal
 */
const MainLayout = ({ children }) => {
  // Utilizamos los stores específicos
  const { collapsed } = useSidebarStore();
  const { darkMode, initializeTheme } = useThemeStore();

  // Valores fijos para los anchos del sidebar
  const expandedWidth = 250;
  const collapsedWidth = 70;

  // Inicializar el tema desde localStorage al montar el componente
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Aplicar la clase dark al html cuando cambia el modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-background dark:bg-background-dark text-text dark:text-text-dark transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area - Con espacio reservado para el sidebar */}
      <div 
        className="flex flex-col flex-1 min-h-screen overflow-x-hidden transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: collapsed ? `${collapsedWidth}px` : `${expandedWidth}px`,
          width: `calc(100% - ${collapsed ? collapsedWidth : expandedWidth}px)` 
        }}
      >
        {/* Header Component */}
        <Header />
        
        {/* Content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;