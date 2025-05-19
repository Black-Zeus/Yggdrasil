import React, { useEffect } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { useLayoutStore } from '../store/layoutStore';

/**
 * MainLayout - Componente principal para la estructura de la aplicación
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar en el área principal
 */
const MainLayout = ({ children }) => {
  // Utilizamos el store de Zustand para gestionar el estado del layout
  const { 
    collapsed, 
    darkMode, 
    initializeTheme
  } = useLayoutStore();

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
    <div className="flex min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed 
            ? 'ml-sidebar-collapsed w-[calc(100%-70px)]' 
            : 'ml-sidebar w-[calc(100%-250px)]'
        }`}
      >
        {/* Header Component */}
        <Header />
        
        {/* Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;