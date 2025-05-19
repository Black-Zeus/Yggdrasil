import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import DefaultContent from './layout/DefaultContent';
import { initializeAllStores } from './store';

/**
 * App - Componente principal de la aplicación con React Router
 */
function App() {
  // Inicializar todos los stores al montar la aplicación
  useEffect(() => {
    initializeAllStores();
  }, []);

  return (
    <Routes>
      {/* Ruta principal con MainLayout */}
      <Route path="/" element={
        <MainLayout>
          <DefaultContent />
        </MainLayout>
      } />

      {/* Ejemplo de otra ruta con contenido diferente */}
      <Route path="/dashboard" element={
        <MainLayout>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-sidebar dark:text-sidebar-dark">Dashboard</h2>
            <p className="text-text dark:text-text-dark">
              This is the dashboard page using React Router.
            </p>
          </div>
        </MainLayout>
      } />

      {/* Ejemplo de ruta con parámetros */}
      <Route path="/profile/:userId" element={
        <MainLayout>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-sidebar dark:text-sidebar-dark">User Profile</h2>
            <p className="text-text dark:text-text-dark">
              This page would show details for a specific user ID from the URL.
            </p>
          </div>
        </MainLayout>
      } />

      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;