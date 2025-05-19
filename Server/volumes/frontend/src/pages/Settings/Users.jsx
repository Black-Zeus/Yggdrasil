import React, { useState } from 'react';
import UserTable from './users/UserTable';
import UserFilters from './users/UserFilters';
import AddUserModal from './users/AddUserModal';
import UserDetailsModal from './users/UserDetailsModal';
import ConfirmationModal from './users/ConfirmationModal';
import logger from '../../utils/logger';

const Users = () => {
  // Estados para gestionar los modales
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock de datos de usuarios para esta demostración
  const [users] = useState([
    {
      id: 1,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Administrador',
      department: 'Recursos Humanos',
      status: 'active',
      lastLogin: 'Hoy, 10:23 AM'
    },
    {
      id: 2,
      name: 'Carlos Gómez',
      email: 'carlos.gomez@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Editor',
      department: 'Marketing',
      status: 'active',
      lastLogin: 'Ayer, 15:45 PM'
    },
    {
      id: 3,
      name: 'María López',
      email: 'maria.lopez@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      role: 'Visualizador',
      department: 'Finanzas',
      status: 'pending',
      lastLogin: 'Nunca'
    },
    {
      id: 4,
      name: 'Javier Martínez',
      email: 'javier.martinez@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      role: 'Editor',
      department: 'IT',
      status: 'inactive',
      lastLogin: 'Hace 3 meses'
    },
    {
      id: 5,
      name: 'Laura Sánchez',
      email: 'laura.sanchez@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      role: 'Administrador',
      department: 'Dirección',
      status: 'active',
      lastLogin: 'Hoy, 09:15 AM'
    }
  ]);

  // Abrir modal para añadir usuario
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddUserModalOpen(true);
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddUserModalOpen(true);
  };

  // Abrir modal para ver detalles de usuario
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  // Abrir modal de confirmación para desactivar usuario
  const handleToggleUserStatus = (user) => {
    setSelectedUser(user);
    setIsConfirmationModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Configuración de Usuarios</h1>
        <button 
          className="py-2.5 px-4 bg-primary rounded-md text-white font-medium flex items-center gap-2 hover:bg-primary-light transition-colors"
          onClick={handleAddUser}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Añadir Usuario
        </button>
      </div>
      
      <div className="bg-background-light rounded-lg shadow-subtle overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border-light">
          <button 
            className={`py-3 px-5 font-medium transition-colors ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'hover:bg-highlight'}`}
            onClick={() => setActiveTab('all')}
          >
            Todos los usuarios
          </button>
          <button 
            className={`py-3 px-5 font-medium transition-colors ${activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'hover:bg-highlight'}`}
            onClick={() => setActiveTab('active')}
          >
            Activos
          </button>
          <button 
            className={`py-3 px-5 font-medium transition-colors ${activeTab === 'inactive' ? 'text-primary border-b-2 border-primary' : 'hover:bg-highlight'}`}
            onClick={() => setActiveTab('inactive')}
          >
            Inactivos
          </button>
          <button 
            className={`py-3 px-5 font-medium transition-colors ${activeTab === 'admin' ? 'text-primary border-b-2 border-primary' : 'hover:bg-highlight'}`}
            onClick={() => setActiveTab('admin')}
          >
            Administradores
          </button>
        </div>
        
        <div className="p-6">
          <UserFilters />
          
          <UserTable 
            users={users} 
            onEdit={handleEditUser}
            onViewDetails={handleViewUserDetails}
            onToggleStatus={handleToggleUserStatus}
          />
        </div>
      </div>
      
      {/* Modales */}
      {isAddUserModalOpen && (
        <AddUserModal 
          user={selectedUser} 
          isOpen={isAddUserModalOpen} 
          onClose={() => setIsAddUserModalOpen(false)} 
        />
      )}
      
      {isUserDetailsModalOpen && (
        <UserDetailsModal 
          user={selectedUser} 
          isOpen={isUserDetailsModalOpen} 
          onClose={() => setIsUserDetailsModalOpen(false)}
          onEdit={() => {
            setIsUserDetailsModalOpen(false);
            setIsAddUserModalOpen(true);
          }}
        />
      )}
      
      {isConfirmationModalOpen && (
        <ConfirmationModal 
          user={selectedUser} 
          isOpen={isConfirmationModalOpen} 
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => {
            // Aquí iría la lógica para desactivar/activar el usuario
            logger.info('Users',`Cambiar estado de usuario ${selectedUser.name}`);
            setIsConfirmationModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Users;