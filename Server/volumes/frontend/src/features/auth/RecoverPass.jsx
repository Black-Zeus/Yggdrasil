import React, { useState } from 'react';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

import logger from '../../utils/logger';

const RecoverPass = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    logger.info('RecoverPass','Recovery attempt with email:', email);
    // Here you would typically handle password recovery logic
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">    
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('/assets/background-auth.jpg')" }}
      ></div>
    
      {/* Main Content - Responsive Container */}
      <main className="flex-grow flex items-center justify-center p-4 relative z-10 w-full mx-auto max-w-4xl my-4">
        <div className="bg-white rounded-3xl shadow-xl w-full overflow-hidden max-h-full">
          <div className="flex flex-col md:flex-row">
            {/* Recovery Form Section - Full width on mobile, 40% on desktop */}
            <div className="w-full md:w-2/5 p-6 md:p-10">
              <div className="mb-2">
                <a href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <IconResolve_RI name="RiArrowLeftSLine" size={16} className="mr-1" />
                  <span>Volver al inicio de sesión</span>
                </a>
              </div>
              
              <div className="mb-6 md:mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Recuperar contraseña</h2>
                <p className="text-gray-500 text-sm">Ingrese su correo electrónico para comenzar el proceso de recuperación</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <IconResolve_RI name="RiUserLine" size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-3 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200 font-medium"
                >
                  ENVIAR INSTRUCCIONES
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-xs">
                  Recibirá un correo electrónico con instrucciones para restablecer su contraseña.
                </p>
              </div>
            </div>
            
            {/* Illustration Section - Hidden on mobile, 60% on desktop */}
            <div className="hidden md:block md:w-3/5 bg-gray-500 relative">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/aside.jpg" 
                  alt="Recovery Illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Small note at the bottom */}
      <div className="py-2 text-center text-gray-500 text-xs relative z-10">
        <p>© 2025 yggdrasil. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default RecoverPass;