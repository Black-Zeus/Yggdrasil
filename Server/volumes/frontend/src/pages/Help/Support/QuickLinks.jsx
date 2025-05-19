// Support/QuickLinks.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';
import logger from '../../../utils/logger';

const QuickLinks = () => {
  const links = [
    {
      id: 1,
      icon: 'RiBookOpenLine',
      title: 'Guías de Usuario',
      description: 'Documentación completa y tutoriales paso a paso',
      link: '/guides'
    },
    {
      id: 2,
      icon: 'RiToolsLine',
      title: 'Solución de Problemas',
      description: 'Encuentra soluciones a problemas comunes',
      link: '/troubleshooting'
    },
    {
      id: 3,
      icon: 'RiQuestionLine',
      title: 'Preguntas Frecuentes',
      description: 'Respuestas a las consultas más comunes',
      link: '/faq'
    },
    {
      id: 4,
      icon: 'RiRocketLine',
      title: 'Comenzar',
      description: 'Guía rápida para nuevos usuarios',
      link: '/getting-started'
    }
  ];

  const handleClick = (link) => {
    // Implementar navegación aquí
    logger.info('QuickLinks','Navigating to:', link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {links.map((link) => (
        <div
          key={link.id}
          onClick={() => handleClick(link.link)}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
        >
          <IconResolve_RI 
            name={link.icon} 
            className="text-4xl text-primary mb-4"
          />
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            {link.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {link.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuickLinks;