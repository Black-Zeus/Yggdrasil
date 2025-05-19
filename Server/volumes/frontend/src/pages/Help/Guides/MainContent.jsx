// Guides/MainContent.jsx
import React from 'react';
import SearchBar from './SearchBar';
import GuideCard from './GuideCard';

const MainContent = ({ searchQuery, onSearch }) => {
  // Mock data - esto debería venir de una API o props
  const guides = [
    {
      id: 1,
      title: 'Configuración Inicial',
      description: 'Aprende a configurar el sistema por primera vez y establece los parámetros básicos.',
      readTime: 10,
      level: 'Básico',
      icon: 'https://placehold.co/150x150/png'
    },
    {
      id: 2,
      title: 'Gestión de Usuarios',
      description: 'Guía completa sobre la creación y administración de usuarios en el sistema.',
      readTime: 15,
      level: 'Intermedio',
      icon: 'https://placehold.co/150x150/png'
    },
    {
      id: 3,
      title: 'Trabajo Offline',
      description: 'Aprende a utilizar el sistema sin conexión y sincronizar datos posteriormente.',
      readTime: 8,
      level: 'Avanzado',
      icon: 'https://placehold.co/150x150/png'
    }
  ];

  // Filtrar guías basado en la búsqueda
  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <SearchBar 
        value={searchQuery}
        onChange={onSearch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuides.map(guide => (
          <GuideCard
            key={guide.id}
            {...guide}
          />
        ))}
      </div>
      
      {filteredGuides.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron guías que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
};

export default MainContent;