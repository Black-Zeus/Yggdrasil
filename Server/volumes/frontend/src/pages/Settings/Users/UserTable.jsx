import React from 'react';

const UserTable = ({ users, onEdit, onViewDetails, onToggleStatus }) => {
  // Renderizar el badge de estado de usuario con el color apropiado
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">Activo</span>;
      case 'inactive':
        return <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-danger/10 text-danger">Inactivo</span>;
      case 'pending':
        return <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning">Pendiente</span>;
      default:
        return null;
    }
  };

  // Renderizar botón de acción según el estado del usuario
  const renderActionButton = (user) => {
    if (user.status === 'active') {
      return (
        <button 
          className="p-1 text-text-muted hover:text-primary transition-colors" 
          onClick={() => onToggleStatus(user)}
          title="Desactivar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      );
    } else if (user.status === 'inactive') {
      return (
        <button 
          className="p-1 text-text-muted hover:text-primary transition-colors" 
          onClick={() => onToggleStatus(user)}
          title="Activar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </button>
      );
    } else if (user.status === 'pending') {
      return (
        <button 
          className="p-1 text-text-muted hover:text-primary transition-colors" 
          onClick={() => onToggleStatus(user)}
          title="Reenviar invitación"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </button>
      );
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 bg-highlight text-text font-semibold border-b border-border-light">Usuario</th>
              <th className="text-left py-3 px-4 bg-highlight text-text font-semibold border-b border-border-light">Rol</th>
              <th className="text-left py-3 px-4 bg-highlight text-text font-semibold border-b border-border-light">Departamento</th>
              <th className="text-left py-3 px-4 bg-highlight text-text font-semibold border-b border-border-light">Estado</th>
              <th className="text-left py-3 px-4 bg-highlight text-text font-semibold border-b border-border-light">Último acceso</th>
              <th className="text-left py-3 px-4 bg-highlight text-text font-semibold border-b border-border-light">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-highlight/50 cursor-pointer" onClick={() => onViewDetails(user)}>
                <td className="py-3 px-4 border-b border-border-light">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-light flex items-center justify-center text-white font-semibold mr-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium text-text">{user.name}</div>
                      <div className="text-xs text-text-muted">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 border-b border-border-light">{user.role}</td>
                <td className="py-3 px-4 border-b border-border-light">{user.department}</td>
                <td className="py-3 px-4 border-b border-border-light">
                  {renderStatusBadge(user.status)}
                </td>
                <td className="py-3 px-4 border-b border-border-light">{user.lastLogin}</td>
                <td className="py-3 px-4 border-b border-border-light">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="p-1 text-text-muted hover:text-primary transition-colors" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(user);
                      }}
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    {renderActionButton(user)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-text-muted">
          Mostrando 1-5 de 25 usuarios
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-border rounded-md text-sm bg-background-light text-text-muted cursor-not-allowed opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Anterior
          </button>
          <button className="px-3 py-2 border border-primary rounded-md text-sm bg-highlight text-primary">1</button>
          <button className="px-3 py-2 border border-border rounded-md text-sm bg-background-light hover:bg-highlight hover:border-primary-light transition-colors">2</button>
          <button className="px-3 py-2 border border-border rounded-md text-sm bg-background-light hover:bg-highlight hover:border-primary-light transition-colors">3</button>
          <button className="px-3 py-2 border border-border rounded-md text-sm bg-background-light hover:bg-highlight hover:border-primary-light transition-colors">4</button>
          <button className="px-3 py-2 border border-border rounded-md text-sm bg-background-light hover:bg-highlight hover:border-primary-light transition-colors">5</button>
          <button className="px-3 py-2 border border-border rounded-md text-sm bg-background-light hover:bg-highlight hover:border-primary-light transition-colors">
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;