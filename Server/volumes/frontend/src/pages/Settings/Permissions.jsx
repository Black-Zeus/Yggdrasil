// Permissions.jsx
import React, { useState, useEffect } from 'react';
import UserList from './Permissions/UserList';
import RoleSelector from './Permissions/RoleSelector';
import PermissionTree from './Permissions/PermissionTree';
import logger from '../../utils/logger';

const initialUsers = [
  { id: 1, name: 'Juan Pérez', role: 'Editor', avatar: null },
  { id: 2, name: 'María García', role: 'Administrador', avatar: null },
  { id: 3, name: 'Carlos López', role: 'Usuario', avatar: null },
];

const initialPermissions = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    enabled: true,
    children: [
      { id: 'dashboard.view', name: 'Ver dashboard', enabled: true },
      { id: 'dashboard.edit', name: 'Editar widgets', enabled: true },
    ]
  },
  {
    id: 'users',
    name: 'Usuarios',
    enabled: false,
    children: [
      { id: 'users.view', name: 'Ver usuarios', enabled: false },
      { id: 'users.create', name: 'Crear usuarios', enabled: false },
      { id: 'users.edit', name: 'Editar usuarios', enabled: false },
      { id: 'users.delete', name: 'Eliminar usuarios', enabled: false },
    ]
  },
  {
    id: 'settings',
    name: 'Configuración',
    enabled: false,
    children: [
      { id: 'settings.view', name: 'Ver configuración', enabled: false },
      { id: 'settings.edit', name: 'Editar configuración', enabled: false },
      { id: 'settings.roles', name: 'Gestionar roles', enabled: false },
    ]
  }
];

const Permissions = () => {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('editor');
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser.id);
    }
  }, [selectedUser]);

  const loadUserPermissions = async (userId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPermissions(initialPermissions);
    } catch (error) {
      logger.error('EvaluationCreate','Error al cargar permisos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    loadRolePermissions(role);
  };

  const loadRolePermissions = async (role) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPermissions(initialPermissions);
    } catch (error) {
      logger.error('EvaluationCreate','Error al cargar permisos del rol:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setPermissions(prevPermissions => {
      const updatePermissions = (items) => {
        return items.map(item => {
          if (item.id === permissionId) {
            return { ...item, enabled: !item.enabled };
          }
          if (item.children) {
            return {
              ...item,
              children: updatePermissions(item.children)
            };
          }
          return item;
        });
      };
      return updatePermissions(prevPermissions);
    });
  };

  const handleToggleAll = (checked) => {
    setPermissions(prevPermissions => {
      const updateAllPermissions = (items) => {
        return items.map(item => ({
          ...item,
          enabled: checked,
          children: item.children ? updateAllPermissions(item.children) : undefined
        }));
      };
      return updateAllPermissions(prevPermissions);
    });
  };

  const handleSaveTemplate = async () => {
    try {
      logger.info('Permissions','Template guardado:', {
        role: selectedRole,
        permissions: permissions
      });
    } catch (error) {
      logger.error('EvaluationCreate','Error al guardar template:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    try {
      logger.info('Permissions','Permisos actualizados:', {
        userId: selectedUser.id,
        permissions: permissions
      });
    } catch (error) {
      logger.error('EvaluationCreate','Error al guardar permisos:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-4 gap-6 bg-white rounded-lg shadow-sm">
        <div className="col-span-1 border-r border-gray-200">
          <RoleSelector
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            onSaveTemplate={handleSaveTemplate}
          />
          <UserList
            users={users}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
          />
        </div>
        
        <div className="col-span-3">
          <PermissionTree
            permissions={permissions}
            onToggle={handlePermissionToggle}
            onToggleAll={handleToggleAll}
            isLoading={isLoading}
          />
        </div>
      </div>

      {selectedUser && (
        <div className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleSaveChanges}
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default Permissions;