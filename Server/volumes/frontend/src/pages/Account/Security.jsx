import React, { useState } from 'react';
import PasswordSection from './Security/PasswordSection';
import TwoFactorSection from './Security/TwoFactorSection';
import AccessLogSection from './Security/AccessLogSection';
import SessionsSection from './Security/SessionsSection';
import logger from '../../utils/logger';

const Security = () => {
  // Estado para el formulario de cambio de contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Estado para la última fecha de cambio de contraseña
  const [lastPasswordChange] = useState('12/03/2025');
  
  // Estado para el 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+52 55 1234 5678');
  
  // Registro de accesos (simulado)
  const [accessLogs] = useState([
    { id: 1, date: '20/04/2025 10:35 AM', ip: '192.168.1.1', location: 'Ciudad de México, México', device: 'Chrome en Windows', status: 'Exitoso' },
    { id: 2, date: '18/04/2025 08:22 AM', ip: '192.168.1.1', location: 'Ciudad de México, México', device: 'Chrome en Windows', status: 'Exitoso' },
    { id: 3, date: '15/04/2025 12:45 PM', ip: '192.168.1.1', location: 'Ciudad de México, México', device: 'Safari en iPhone', status: 'Exitoso' },
    { id: 4, date: '10/04/2025 09:30 AM', ip: '200.68.128.25', location: 'Guadalajara, México', device: 'Firefox en Windows', status: 'Fallido' },
  ]);
  
  // Sesiones activas (simuladas)
  const [activeSessions] = useState([
    { id: 1, device: 'Chrome en Windows', location: 'Ciudad de México, México', lastActive: 'Hoy, 10:35 AM', isCurrent: true, deviceType: 'desktop' },
    { id: 2, device: 'Safari en iPhone', location: 'Ciudad de México, México', lastActive: '15/04/2025, 12:45 PM', isCurrent: false, deviceType: 'mobile' },
  ]);

  // Manejadores de eventos
  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const handleChangePassword = (currentPassword, newPassword) => {
    // Aquí iría la lógica para cambiar la contraseña
    logger.info('Security','Cambiando contraseña:', { currentPassword, newPassword });
    // Después de cambiar la contraseña exitosamente
    setShowPasswordForm(false);
    // En una aplicación real, aquí actualizaríamos lastPasswordChange
    alert('Contraseña actualizada exitosamente');
  };

  const handleToggleTwoFactor = (enabled) => {
    setTwoFactorEnabled(enabled);
  };

  const handleUpdatePhoneNumber = (number) => {
    setPhoneNumber(number);
    // Aquí iría la lógica para verificar el número
  };

  const handleSessionLogout = (sessionId) => {
    // Aquí iría la lógica para cerrar una sesión específica
    logger.info('Security','Cerrando sesión:', sessionId);
  };

  const handleLogoutAllSessions = () => {
    // Aquí iría la lógica para cerrar todas las sesiones
    logger.info('Security','Cerrando todas las sesiones');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-subtle overflow-hidden mb-6">
        {/* Sección de Contraseña */}
        <PasswordSection 
          lastPasswordChange={lastPasswordChange}
          showForm={showPasswordForm}
          onToggleForm={togglePasswordForm}
          onChangePassword={handleChangePassword}
        />
        
        {/* Sección de Autenticación de Dos Factores */}
        <TwoFactorSection 
          enabled={twoFactorEnabled}
          phoneNumber={phoneNumber}
          onToggle={handleToggleTwoFactor}
          onUpdatePhoneNumber={handleUpdatePhoneNumber}
        />
        
        {/* Sección de Registro de Acceso */}
        <AccessLogSection logs={accessLogs} />
        
        {/* Sección de Sesiones Activas */}
        <SessionsSection 
          sessions={activeSessions}
          onLogoutSession={handleSessionLogout}
          onLogoutAllSessions={handleLogoutAllSessions}
        />
      </div>
    </div>
  );
};

export default Security;