import React from 'react';

const UserDetailsModal = ({ user, isOpen, onClose, onEdit }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-light rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text">
            Detalles del usuario
          </h3>
          <button 
            className="text-2xl text-text-muted hover:text-text"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="p-6">
          {/* Encabezado con avatar y nombre */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-light flex items-center justify-center text-white font-semibold mr-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold m-0">{user.name}</h3>
              <p className="text-text-muted mt-1">{user.email}</p>
            </div>
          </div>
          
          {/* Información principal en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm text-text-muted mb-2">Información personal</h4>
              <p className="mb-2"><strong>Teléfono:</strong> +34 612 345 678</p>
              <p className="mb-2"><strong>Departamento:</strong> {user.department}</p>
              <p className="mb-2"><strong>Cargo:</strong> {user.role === 'Administrador' ? 'Director/a de ' + user.department : user.role + ' de ' + user.department}</p>
            </div>
            <div>
              <h4 className="text-sm text-text-muted mb-2">Información de la cuenta</h4>
              <p className="mb-2">
                <strong>Estado:</strong> {' '}
                {user.status === 'active' && <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Activo</span>}
                {user.status === 'inactive' && <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-danger/10 text-danger">Inactivo</span>}
                {user.status === 'pending' && <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning">Pendiente</span>}
              </p>
              <p className="mb-2"><strong>Rol:</strong> {user.role}</p>
              <p className="mb-2"><strong>Creado:</strong> 15/03/2023</p>
              <p className="mb-2"><strong>Último acceso:</strong> {user.lastLogin}</p>
            </div>
          </div>
          
          {/* Permisos */}
          <div className="mb-6">
            <h4 className="text-sm text-text-muted mb-2">Permisos</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-highlight text-text px-2 py-1 rounded text-xs">Gestión de usuarios</span>
              <span className="bg-highlight text-text px-2 py-1 rounded text-xs">Administración del sistema</span>
              <span className="bg-highlight text-text px-2 py-1 rounded text-xs">Exportar datos</span>
              <span className="bg-highlight text-text px-2 py-1 rounded text-xs">Aprobar cambios</span>
              <span className="bg-highlight text-text px-2 py-1 rounded text-xs">Acceso al dashboard</span>
            </div>
          </div>
          
          {/* Actividad reciente */}
          <div>
            <h4 className="text-sm text-text-muted mb-2">Actividad reciente</h4>
            <div className="border-l-2 border-border-light pl-4">
              <div className="mb-4">
                <p className="text-sm m-0">Inició sesión</p>
                <p className="text-xs text-text-muted mt-1">{user.lastLogin}</p>
              </div>
              {user.role === 'Administrador' && (
                <>
                  <div className="mb-4">
                    <p className="text-sm m-0">Creó un nuevo usuario: Carlos Gómez</p>
                    <p className="text-xs text-text-muted mt-1">Ayer, 16:45 PM</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm m-0">Modificó la configuración del sistema</p>
                    <p className="text-xs text-text-muted mt-1">22/04/2025, 09:30 AM</p>
                  </div>
                </>
              )}
              {user.role === 'Editor' && (
                <>
                  <div className="mb-4">
                    <p className="text-sm m-0">Editó un documento: "Reporte Trimestral"</p>
                    <p className="text-xs text-text-muted mt-1">Ayer, 14:22 PM</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm m-0">Subió un archivo nuevo</p>
                    <p className="text-xs text-text-muted mt-1">19/04/2025, 11:15 AM</p>
                  </div>
                </>
              )}
              {user.role === 'Visualizador' && (
                <>
                  <div className="mb-4">
                    <p className="text-sm m-0">Descargó el reporte mensual</p>
                    <p className="text-xs text-text-muted mt-1">20/04/2025, 15:30 PM</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t border-border-light bg-highlight">
          <button 
            className="px-4 py-2 border border-border rounded-md text-sm text-text-muted hover:bg-border-light transition-colors"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-light transition-colors"
            onClick={onEdit}
          >
            Editar usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;