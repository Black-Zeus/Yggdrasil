// Support/ContactOptions.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';
import logger from '../../../utils/logger';

const ContactOptions = () => {
  const contactMethods = [
    {
      id: 1,
      icon: 'RiChat1Line',
      title: 'Chat en Vivo',
      info: 'Disponible Lun-Vie, 9:00-18:00',
      action: 'Iniciar Chat',
      type: 'chat'
    },
    {
      id: 2,
      icon: 'RiMailLine',
      title: 'Soporte por Email',
      info: 'Respuesta en menos de 24 horas',
      action: 'Enviar Email',
      type: 'email'
    },
    {
      id: 3,
      icon: 'RiPhoneLine',
      title: 'Soporte Telefónico',
      info: '+1 (800) 123-4567',
      action: 'Llamar Ahora',
      type: 'phone'
    }
  ];

  const handleContact = (type) => {
    switch (type) {
      case 'chat':
        // Implementar apertura de chat
        logger.info('ContactOptions','Opening chat...');
        break;
      case 'email':
        // Abrir cliente de correo
        window.location.href = 'mailto:soporte@tudominio.com';
        break;
      case 'phone':
        // Iniciar llamada
        window.location.href = 'tel:+18001234567';
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {contactMethods.map((method) => (
        <div
          key={method.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm"
        >
          <IconResolve_RI 
            name={method.icon} 
            className="text-5xl text-primary mb-4 mx-auto"
          />
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            {method.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {method.info}
          </p>
          <button
            onClick={() => handleContact(method.type)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            {method.action}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContactOptions;