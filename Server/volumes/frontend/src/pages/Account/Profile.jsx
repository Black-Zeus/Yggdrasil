import React from 'react';
import ProfileInfo from './Profile/ProfileInfo';
import EvaluationsAsEvaluator from './Profile/EvaluationsAsEvaluator';
import EvaluationsAsEvaluated from './Profile/EvaluationsAsEvaluated';
import QuickAccess from './Profile/QuickAccess';
import logger from '../../utils/logger';

const Profile = () => {
  // Datos de ejemplo del usuario - en una aplicación real, estos datos vendrían de una API o contexto
  const userData = {
    id: 1,
    name: 'Administrador del Sistema',
    role: 'Invitado',
    email: 'administrador@sistema.com',
    department: 'Tecnología',
    position: 'Administrador de Sistemas',
    joinDate: '12/03/2023',
    lastActivity: 'Hoy, 10:35 AM',
    status: 'Activo',
    initials: 'AD'
  };

  // Datos de ejemplo para evaluaciones como evaluador
  const evaluatorEvaluations = [
    {
      id: 1,
      title: 'Evaluación de Desempeño Q1',
      evaluatedPerson: 'Juan Pérez',
      date: '18/04/2025',
      status: 'Pendiente',
      action: 'Completar'
    },
    {
      id: 2,
      title: 'Evaluación de Objetivos Anuales',
      evaluatedPerson: 'María García',
      date: '05/03/2025',
      status: 'Completada',
      action: 'Ver'
    },
    {
      id: 3,
      title: 'Evaluación de Competencias',
      evaluatedPerson: 'Carlos Rodríguez',
      date: '22/02/2025',
      status: 'Completada',
      action: 'Ver'
    }
  ];

  // Datos de ejemplo para evaluaciones como evaluado
  const evaluatedEvaluations = [
    {
      id: 1,
      title: 'Evaluación de Desempeño Anual',
      evaluator: 'Laura Martínez',
      date: '15/03/2025',
      status: 'Completada',
      action: 'Ver'
    },
    {
      id: 2,
      title: 'Evaluación de Objetivos Q1',
      evaluator: 'Laura Martínez',
      date: '20/01/2025',
      status: 'Completada',
      action: 'Ver'
    },
    {
      id: 3,
      title: 'Evaluación de Competencias',
      evaluator: 'Laura Martínez',
      date: '05/12/2024',
      status: 'Completada',
      action: 'Ver'
    }
  ];

  // Datos para los accesos rápidos
  const quickAccessItems = [
    {
      id: 1,
      title: 'Crear Evaluación',
      icon: 'document',
      link: '/evaluations/create'
    },
    {
      id: 2,
      title: 'Ver Reportes',
      icon: 'chart',
      link: '/reports'
    },
    {
      id: 3,
      title: 'Importar Datos',
      icon: 'import',
      link: '/import'
    },
    {
      id: 4,
      title: 'Configuración',
      icon: 'settings',
      link: '/settings'
    }
  ];

  // Manejo de eventos
  const handleEditProfile = () => {
    logger.info('Profile','Editar perfil');
    // Aquí iría la lógica para editar el perfil
  };

  const handleResetPassword = () => {
    logger.info('Profile','Restablecer contraseña');
    // Aquí iría la lógica para restablecer la contraseña
  };

  const handleEvaluationAction = (id, action) => {
    logger.info('Profile',`Acción ${action} en evaluación ${id}`);
    // Aquí iría la lógica para manejar las acciones de evaluación
  };

  return (
    <div className="container mx-auto px-4 py-6">
      
      {/* Información del perfil */}
      <ProfileInfo 
        userData={userData} 
        onEditProfile={handleEditProfile}
        onResetPassword={handleResetPassword}
      />
      
      {/* Evaluaciones como evaluador */}
      <EvaluationsAsEvaluator 
        evaluations={evaluatorEvaluations} 
        onAction={handleEvaluationAction} 
      />
      
      {/* Evaluaciones como evaluado */}
      <EvaluationsAsEvaluated 
        evaluations={evaluatedEvaluations} 
        onAction={handleEvaluationAction} 
      />
      
      {/* Accesos rápidos */}
      <QuickAccess items={quickAccessItems} />
    </div>
  );
};

export default Profile;