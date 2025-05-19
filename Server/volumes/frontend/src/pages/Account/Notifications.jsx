import React, { useState } from 'react';
import NotificationHeader from './notifications/NotificationHeader';
import NotificationTabs from './notifications/NotificationTabs';
import NotificationFilters from './notifications/NotificationFilters';
import NotificationList from './notifications/NotificationList';
import NotificationDetail from './notifications/NotificationDetail';
import NotificationPagination from './notifications/NotificationPagination';

const Notifications = () => {
  // Estados
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  // Datos de notificaciones (simulados)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nueva evaluación asignada',
      description: 'Se te ha asignado la evaluación "Desempeño Anual 2025" para completar.',
      time: 'Hace 2 horas',
      date: '20/04/2025',
      type: 'evaluation',
      badge: 'Evaluación',
      badgeType: 'info',
      icon: 'document',
      read: false,
      details: {
        fullText: `Estimado/a usuario/a,
        
Se te ha asignado una nueva evaluación para completar. A continuación, encontrarás los detalles:

• Título: Evaluación de Desempeño Anual 2025
• Persona a evaluar: Juan Pérez
• Departamento: Tecnología
• Fecha límite: 05/05/2025

Para completar esta evaluación, por favor dirígete a la sección "Evaluaciones pendientes" en tu panel principal.`
      }
    },
    {
      id: 2,
      title: 'Recordatorio de evaluación pendiente',
      description: 'Tienes 3 días restantes para completar la evaluación "Objetivos Q1" de Juan Pérez.',
      time: 'Ayer, 15:30',
      date: '19/04/2025',
      type: 'reminder',
      badge: 'Recordatorio',
      badgeType: 'warning',
      icon: 'clock',
      read: false,
      details: null
    },
    {
      id: 3,
      title: 'Evaluación completada',
      description: 'Laura Martínez ha completado tu evaluación "Competencias Técnicas 2025".',
      time: '18/04/2025',
      date: '18/04/2025',
      type: 'evaluation',
      badge: 'Completada',
      badgeType: 'success',
      icon: 'check',
      read: true,
      details: null
    },
    {
      id: 4,
      title: 'Nuevo comentario en evaluación',
      description: 'Carlos Rodríguez ha añadido un comentario a la evaluación "Objetivos Q1".',
      time: '15/04/2025',
      date: '15/04/2025',
      type: 'comment',
      badge: 'Comentario',
      badgeType: 'info',
      icon: 'message',
      read: true,
      details: null
    },
    {
      id: 5,
      title: 'Actualización del sistema',
      description: 'Hemos lanzado nuevas funcionalidades en el módulo de reportes.',
      time: '10/04/2025',
      date: '10/04/2025',
      type: 'system',
      badge: 'Sistema',
      badgeType: 'info',
      icon: 'info',
      read: true,
      details: null
    }
  ]);
  
  // Cálculos
  const totalItems = notifications.length;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Filtrar notificaciones según la pestaña y el filtro activo
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Filtro por tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(notif => !notif.read);
    } else if (activeTab === 'evaluations') {
      filtered = filtered.filter(notif => notif.type === 'evaluation');
    } else if (activeTab === 'system') {
      filtered = filtered.filter(notif => notif.type === 'system');
    }
    
    // Filtro por fecha
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    if (activeFilter === 'today') {
      filtered = filtered.filter(notif => {
        const date = new Date(notif.date.split('/').reverse().join('-'));
        return date.toDateString() === today.toDateString();
      });
    } else if (activeFilter === 'week') {
      filtered = filtered.filter(notif => {
        const date = new Date(notif.date.split('/').reverse().join('-'));
        return date >= weekStart && date <= today;
      });
    } else if (activeFilter === 'month') {
      filtered = filtered.filter(notif => {
        const date = new Date(notif.date.split('/').reverse().join('-'));
        return date >= monthStart && date <= today;
      });
    }
    
    return filtered;
  };

  // Obtener notificaciones para la página actual
  const getPaginatedNotifications = () => {
    const filtered = getFilteredNotifications();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedNotification(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setSelectedNotification(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedNotification(null);
  };

  const handleNotificationClick = (id) => {
    setSelectedNotification(id);
    
    // Marcar como leída
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notif => notif.id !== id)
    );
    
    if (selectedNotification === id) {
      setSelectedNotification(null);
    }
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[700px]">
      <div className="bg-white rounded-lg shadow-subtle overflow-hidden h-[700px] flex flex-col">
        {/* Cabecera con título y acciones */}
        <NotificationHeader 
          onMarkAllAsRead={handleMarkAllAsRead} 
        />
        
        {/* Pestañas */}
        <NotificationTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        
        {/* Filtros */}
        <NotificationFilters 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
        
        {/* Contenedor flexible para el contenido principal */}
        <div className="flex-1 overflow-hidden h-[650px]">
          {/* Si hay una notificación seleccionada, mostrar su detalle */}
          {selectedNotification ? (
            <NotificationDetail 
              notification={notifications.find(n => n.id === selectedNotification)} 
              onBack={handleBackToList} 
            />
          ) : (
            <div className=" h-[650px] flex flex-col">
              {/* Lista de notificaciones */}
              <div className="flex-1 h-[500px]" name="namaste">
                <NotificationList 
                  notifications={getPaginatedNotifications()} 
                  onNotificationClick={handleNotificationClick}
                  onMarkAsRead={handleMarkAsRead}
                  onDeleteNotification={handleDeleteNotification}
                />
              </div>
              
              {/* Paginación */}
              <NotificationPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={getFilteredNotifications().length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;