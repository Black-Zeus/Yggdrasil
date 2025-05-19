import React, { useState, useEffect } from 'react';
import logger from '../../../utils/logger';

const AddUserModal = ({ user, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    permissions: {
      export: false,
      approve: false,
      dashboard: false
    },
    notifications: {
      email: true,
      system: true
    },
    notes: ''
  });

  // Rellenar el formulario si estamos editando un usuario existente
  useEffect(() => {
    if (user) {
      // En un caso real, aquí descompondríamos el nombre completo en nombre y apellidos
      // y extraeríamos el resto de información del usuario
      const nameParts = user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: '',  // Supongamos que no tenemos este dato en la vista de tabla
        department: user.department || '',
        role: user.role || '',
        permissions: {
          export: false,
          approve: false,
          dashboard: false
        },
        notifications: {
          email: true,
          system: true
        },
        notes: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    if (name.startsWith('permission_')) {
      const permission = name.replace('permission_', '');
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [permission]: checked
        }
      });
    } else if (name.startsWith('notif_')) {
      const notification = name.replace('notif_', '');
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [notification]: checked
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logger.error('EvaluationCreate','Form data:', formData);
    // Aquí iría la lógica para guardar el usuario
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-light rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text">
            {user ? 'Editar usuario' : 'Añadir nuevo usuario'}
          </h3>
          <button 
            className="text-2xl text-text-muted hover:text-text"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block font-medium mb-2" htmlFor="firstName">Nombre</label>
                <input 
                  type="text" 
                  id="firstName"
                  name="firstName"
                  className="w-full p-2.5 border border-border rounded-md text-sm"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block font-medium mb-2" htmlFor="lastName">Apellidos</label>
                <input 
                  type="text" 
                  id="lastName"
                  name="lastName"
                  className="w-full p-2.5 border border-border rounded-md text-sm"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="email">Correo electrónico</label>
              <input 
                type="email" 
                id="email"
                name="email"
                className="w-full p-2.5 border border-border rounded-md text-sm"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-text-muted mt-1">
                Se enviará un correo de invitación a esta dirección
              </p>
            </div>
            
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block font-medium mb-2" htmlFor="phone">Teléfono</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  className="w-full p-2.5 border border-border rounded-md text-sm"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block font-medium mb-2" htmlFor="department">Departamento</label>
                <select 
                  id="department"
                  name="department"
                  className="w-full p-2.5 border border-border rounded-md text-sm bg-white"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  <option value="Dirección">Dirección</option>
                  <option value="IT">IT</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventas">Ventas</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="role">Rol</label>
              <select 
                id="role"
                name="role"
                className="w-full p-2.5 border border-border rounded-md text-sm bg-white"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Editor">Editor</option>
                <option value="Visualizador">Visualizador</option>
              </select>
              <p className="text-xs text-text-muted mt-1">
                El rol determina qué permisos tendrá el usuario en el sistema
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-2">Permisos adicionales</label>
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="permission_export"
                  name="permission_export"
                  className="mr-2"
                  checked={formData.permissions.export}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="permission_export">Exportar datos</label>
              </div>
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="permission_approve"
                  name="permission_approve"
                  className="mr-2"
                  checked={formData.permissions.approve}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="permission_approve">Aprobar cambios</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="permission_dashboard"
                  name="permission_dashboard"
                  className="mr-2"
                  checked={formData.permissions.dashboard}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="permission_dashboard">Acceso al dashboard</label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-2">Notificaciones</label>
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="notif_email"
                  name="notif_email"
                  className="mr-2"
                  checked={formData.notifications.email}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="notif_email">Correo electrónico</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="notif_system"
                  name="notif_system"
                  className="mr-2"
                  checked={formData.notifications.system}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="notif_system">Notificaciones del sistema</label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="notes">Notas</label>
              <textarea 
                id="notes"
                name="notes"
                className="w-full p-2.5 border border-border rounded-md text-sm"
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
              <p className="text-xs text-text-muted mt-1">
                Información adicional sobre el usuario (solo visible para administradores)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-4 border-t border-border-light bg-highlight">
            <button 
              type="button"
              className="px-4 py-2 border border-border rounded-md text-sm text-text-muted hover:bg-border-light transition-colors"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-light transition-colors"
            >
              {user ? 'Guardar cambios' : 'Guardar usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;