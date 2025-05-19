// src/layout/DefaultContent.jsx
import React from 'react';

/**
 * DefaultContent - Componente de contenido predeterminado para la página principal
 */
const DefaultContent = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sidebar dark:text-sidebar-dark">
        Welcome to Aqumex
      </h2>
      
      <p className="text-text dark:text-text-dark">
        This is a responsive sidebar navigation with a modern header.
      </p>
      
      <p className="text-text dark:text-text-dark">Key features include:</p>
      
      <ul className="list-disc pl-5 space-y-2 text-text dark:text-text-dark">
        <li>Expandable/collapsible sidebar with smooth transitions</li>
        <li>Animated tooltips that appear when the sidebar is collapsed</li>
        <li>Comprehensive header with search, notifications, and user dropdown</li>
        <li>Breadcrumb navigation path for easy site orientation</li>
        <li>Dark mode toggle with sun/moon icons</li>
        <li>Mobile-friendly design that adapts to different screen sizes</li>
        <li>User profile section with avatar and role information</li>
        <li>React Router integration for seamless page navigation</li>
      </ul>
      
      <p className="text-text dark:text-text-dark">
        The design uses Tailwind CSS for styling and Zustand for state management.
      </p>
    </div>
  );
};

export default DefaultContent;