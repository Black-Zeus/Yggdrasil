import React from 'react';
import { useNavigate } from 'react-router-dom';
import OptionCard from '../components/ui/cards/OptionCard';
import ActivityTable from '../components/ui/tables/ActivityTable';

// Importamos los iconos necesarios
import { IoAddOutline } from "react-icons/io5";
import { BsFileEarmarkBarGraph, BsFileEarmarkCode, BsQuestionCircle } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";

import PageMeta from '../components/atoms/PageMeta';

const Home = () => {
  const navigate = useNavigate();

  // Opciones principales del sistema con React Icons
  const mainOptions = [
    {
      id: 'crear',
      title: 'Crear Evaluación',
      icon: <IoAddOutline size={24} />,
      description: 'Crea una nueva evaluación desde cero utilizando el editor intuitivo.',
      buttonText: 'Comenzar',
      buttonAction: () => navigate('/crear-evaluacion'),
      color: '#1e50a0'
    },
    {
      id: 'cargar',
      title: 'Cargar Evaluación',
      icon: <BsFileEarmarkBarGraph size={22} />,
      description: 'Carga y modifica evaluaciones existentes guardadas en el sistema.',
      buttonText: 'Explorar',
      buttonAction: () => navigate('/cargar-evaluacion'),
      color: '#ff8000'
    },
    {
      id: 'importar',
      title: 'Importar JSON',
      icon: <BsFileEarmarkCode size={22} />,
      description: 'Importa evaluaciones desde archivos JSON que cumplan con el esquema requerido.',
      buttonText: 'Importar',
      buttonAction: () => navigate('/importar-json'),
      color: '#6c757d'
    },
    {
      id: 'reportes',
      title: 'Reportes',
      icon: <HiOutlineDocumentReport size={22} />,
      description: 'Visualiza estadísticas y resultados de las evaluaciones completadas.',
      buttonText: 'Ver reportes',
      buttonAction: () => navigate('/reportes'),
      color: '#20c997'
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      icon: <FiSettings size={22} />,
      description: 'Personaliza las opciones del sistema según tus necesidades específicas.',
      buttonText: 'Configurar',
      buttonAction: () => navigate('/configuracion'),
      color: '#7b2ff7'
    },
    {
      id: 'ayuda',
      title: 'Ayuda',
      icon: <BsQuestionCircle size={22} />,
      description: 'Accede a guías, tutoriales y documentación sobre el uso del sistema.',
      buttonText: 'Ver ayuda',
      buttonAction: () => navigate('/ayuda'),
      color: '#fd7e14'
    }
  ];

  // Datos de actividad reciente
  const recentActivities = [
    {
      id: 1,
      name: 'Evaluación de Jefatura - Área de Sistemas',
      category: 'evaluacion_jefatura',
      modified: 'Hoy, 12:45',
      status: 'Activa'
    },
    {
      id: 2,
      name: 'Evaluación de Clima Laboral',
      category: 'clima_laboral',
      modified: 'Ayer, 10:30',
      status: 'Borrador'
    },
    {
      id: 3,
      name: 'Evaluación de Desempeño Anual',
      category: 'desempeno_anual',
      modified: '10/03/2025',
      status: 'Activa'
    }
  ];

  return (
    <>
      <PageMeta>
        <title>yggdrasil | Sistema de Gestion de Formularios</title>
        <meta name="description" content="Panel principal del sistema de gestión de formularios digitales." />
        <meta name="keywords" content="formularios, dashboard, inicio, sistema digital" />
        <meta name="author" content="Tecnocomp" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </PageMeta>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl text-blue-700 font-semibold mb-2">Bienvenido al Sistema de Evaluaciones</h1>
          <p className="text-gray-600">Selecciona una de las siguientes opciones para comenzar:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {mainOptions.map((option) => (
            <OptionCard
              key={option.id}
              title={option.title}
              icon={option.icon}
              description={option.description}
              buttonText={option.buttonText}
              buttonAction={option.buttonAction}
              color={option.color}
            />
          ))}
        </div>

        <ActivityTable activities={recentActivities} />
      </div></>
  );
};

export default Home;