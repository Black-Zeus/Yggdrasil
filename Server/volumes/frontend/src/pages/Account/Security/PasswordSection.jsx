import React, { useState } from 'react';

const PasswordSection = ({ lastPasswordChange, showForm, onToggleForm, onChangePassword }) => {
  // Estados locales para los campos del formulario
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Calcular días desde el último cambio (ejemplo simple)
  const getDaysSinceChange = () => {
    const today = new Date();
    const lastChange = new Date(lastPasswordChange.split('/').reverse().join('/'));
    const diffTime = Math.abs(today - lastChange);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Si todo está bien, llamar a la función de cambio de contraseña
    onChangePassword(currentPassword, newPassword);
    
    // Limpiar el formulario
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="p-6 border-b border-border-light">
      <div className="flex items-center mb-5">
        <svg 
          className="w-6 h-6 mr-3 text-primary" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Contraseña y Autenticación</h2>
      </div>
      
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <div className="flex items-center mb-1">
            <div className="font-medium">Última actualización de contraseña</div>
            <div className="text-text-muted ml-2">{lastPasswordChange} (hace {getDaysSinceChange()} días)</div>
          </div>
        </div>
        
        <button
          onClick={onToggleForm}
          className={`px-4 py-2 rounded-md transition-colors ${
            showForm 
              ? 'bg-border-light text-text-muted hover:bg-border' 
              : 'bg-primary text-white hover:bg-primary-light'
          }`}
        >
          {showForm ? 'Cancelar' : 'Cambiar contraseña'}
        </button>
      </div>
      
      {showForm && (
        <>
          <div className="h-px bg-border-light my-4"></div>
          
          <form onSubmit={handleSubmit} className="max-w-md">
            {error && (
              <div className="mb-4 p-2 bg-danger-light text-danger-dark text-sm rounded">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="current-password">
                Contraseña actual
              </label>
              <input
                id="current-password"
                type="password"
                className="w-full p-2 border border-border rounded-md text-sm"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="new-password">
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                className="w-full p-2 border border-border rounded-md text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-text-muted mt-1">
                Mín. 8 caracteres, incluir mayúsculas, números y símbolos.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full p-2 border border-border rounded-md text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
            >
              Actualizar contraseña
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default PasswordSection;