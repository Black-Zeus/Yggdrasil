import React from 'react';

const ProfileInfo = ({ userData, onEditProfile, onResetPassword }) => {
  if (!userData) return null;

  return (
    <div className="bg-white rounded-lg shadow-subtle mb-6">
      <div className="p-6">
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          {/* Columna de avatar */}
          <div className="w-full md:w-auto flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-highlight flex items-center justify-center text-5xl font-bold text-primary border-4 border-white shadow-md mb-4">
              {userData.initials}
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-success-light text-success-dark">
              {userData.status}
            </span>
          </div>
          
          {/* Columna de información */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary mb-1">{userData.name}</h1>
            <p className="text-text-muted mb-6">{userData.role} · {userData.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm font-medium text-text-muted mb-1">Nombre completo</div>
                <div className="text-primary">{userData.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-text-muted mb-1">Correo electrónico</div>
                <div className="text-primary">{userData.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-text-muted mb-1">Departamento</div>
                <div className="text-primary">{userData.department}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-text-muted mb-1">Cargo</div>
                <div className="text-primary">{userData.position}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-text-muted mb-1">Fecha de ingreso</div>
                <div className="text-primary">{userData.joinDate}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-text-muted mb-1">Última actividad</div>
                <div className="text-primary">{userData.lastActivity}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onEditProfile}
                className="flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-highlight transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Editar Perfil
              </button>
              <button
                onClick={onResetPassword}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Restablecer Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;