import React, { useState } from 'react';

const TwoFactorSection = ({ enabled, phoneNumber, onToggle, onUpdatePhoneNumber }) => {
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber);

  const handleToggle = () => {
    if (enabled) {
      // Si está habilitado y se va a deshabilitar, solo llamar a onToggle
      onToggle(false);
    } else {
      // Si está deshabilitado y se va a habilitar, iniciar proceso de verificación
      // Solo para efectos de demo, en realidad aquí se enviaría un SMS
      setVerificationSent(true);
    }
  };

  const handleVerify = () => {
    // En una aplicación real, aquí se verificaría el código
    if (verificationCode.length === 6) {
      onToggle(true);
      onUpdatePhoneNumber(localPhoneNumber);
      setVerificationSent(false);
      setVerificationCode('');
    }
  };

  const handleSendVerification = () => {
    // Actualizar el número y "enviar" un nuevo código
    onUpdatePhoneNumber(localPhoneNumber);
    setVerificationSent(true);
    // En una aplicación real, aquí enviaríamos el SMS
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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <h2 className="text-lg font-semibold text-primary">Autenticación de Dos Factores (2FA)</h2>
      </div>
      
      <p className="text-sm mb-4">
        Añade una capa adicional de seguridad a tu cuenta requiriendo un código de verificación 
        además de tu contraseña cuando inicias sesión.
      </p>
      
      <div className="flex items-center mb-5">
        <div className="relative inline-block w-12 h-6 mr-3">
          <input 
            type="checkbox" 
            className="opacity-0 w-0 h-0"
            checked={enabled}
            onChange={handleToggle}
            id="toggle-2fa"
          />
          <label 
            htmlFor="toggle-2fa"
            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition duration-300 ${
              enabled ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span 
              className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                enabled ? 'transform translate-x-6' : ''
              }`}
            ></span>
          </label>
        </div>
        <span className="text-sm">Habilitar autenticación de dos factores vía SMS</span>
      </div>
      
      <div className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="phone-number">
            Número de teléfono
          </label>
          <div className="flex">
            <input
              id="phone-number"
              type="tel"
              className="flex-1 p-2 border border-border rounded-l-md text-sm"
              value={localPhoneNumber}
              onChange={(e) => setLocalPhoneNumber(e.target.value)}
              disabled={enabled && !verificationSent}
            />
            <button
              onClick={handleSendVerification}
              className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-light transition-colors"
              disabled={enabled && !verificationSent}
            >
              {enabled ? 'Cambiar' : 'Verificar'}
            </button>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Recibirás un código de verificación por SMS a este número cuando inicies sesión.
          </p>
        </div>
        
        {verificationSent && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="verification-code">
              Código de verificación
            </label>
            <div className="flex">
              <input
                id="verification-code"
                type="text"
                className="flex-1 p-2 border border-border rounded-l-md text-sm"
                placeholder="Ingresa el código de 6 dígitos"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              />
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-light transition-colors"
                disabled={verificationCode.length !== 6}
              >
                Validar
              </button>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Hemos enviado un código de verificación al número {localPhoneNumber}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSection;