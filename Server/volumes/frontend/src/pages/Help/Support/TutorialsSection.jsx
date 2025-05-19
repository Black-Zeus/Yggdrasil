// Support/TutorialsSection.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';
import logger from '../../../utils/logger';

const TutorialsSection = () => {
  const tutorials = [
    {
      id: 1,
      title: 'Introducción a la Plataforma',
      duration: '5 min',
      thumbnail: '/thumbnails/intro.jpg',
      videoUrl: '/tutorials/intro',
      category: 'Básico'
    },
    {
      id: 2,
      title: 'Creación de Formularios',
      duration: '8 min',
      thumbnail: '/thumbnails/forms.jpg',
      videoUrl: '/tutorials/forms',
      category: 'Intermedio'
    },
    {
      id: 3,
      title: 'Importación y Exportación',
      duration: '6 min',
      thumbnail: '/thumbnails/import-export.jpg',
      videoUrl: '/tutorials/import-export',
      category: 'Intermedio'
    },
    {
      id: 4,
      title: 'Gestión de Usuarios',
      duration: '10 min',
      thumbnail: '/thumbnails/users.jpg',
      videoUrl: '/tutorials/users',
      category: 'Avanzado'
    },
    {
      id: 5,
      title: 'Configuración de Permisos',
      duration: '7 min',
      thumbnail: '/thumbnails/permissions.jpg',
      videoUrl: '/tutorials/permissions',
      category: 'Avanzado'
    },
    {
      id: 6,
      title: 'Análisis y Reportes',
      duration: '12 min',
      thumbnail: '/thumbnails/analytics.jpg',
      videoUrl: '/tutorials/analytics',
      category: 'Avanzado'
    }
  ];

  const handleWatchTutorial = (videoUrl) => {
    // Implementar navegación o modal de video
    logger.info('TutorialsSection','Opening tutorial:', videoUrl);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Video Tutoriales
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div 
              className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative cursor-pointer group"
              onClick={() => handleWatchTutorial(tutorial.videoUrl)}
            >
              {/* Placeholder para la miniatura del video */}
              <IconResolve_RI 
                name="RiPlayCircleLine" 
                className="text-5xl text-primary group-hover:scale-110 transition-transform duration-200"
              />
              {/* Badge de categoría */}
              <span className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {tutorial.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                {tutorial.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <IconResolve_RI name="RiTimeLine" className="mr-1" />
                {tutorial.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorialsSection;