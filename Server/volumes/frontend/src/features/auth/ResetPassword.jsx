import React, { useState, useRef, useEffect } from 'react';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

import logger from '../../utils/logger';

const ResetPassword = () => {
  // Estado para almacenar el código ingresado
  const [code, setCode] = useState(Array(8).fill(""));
  
  // Email del usuario que solicitó la recuperación (normalmente vendría de un parámetro de URL o estado global)
  const [userEmail, setUserEmail] = useState("usuario@ejemplo.com");
  
  // Referencias para los inputs
  const inputRefs = useRef([]);
  
  // Al cargar el componente, establecer el foco en el primer input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Manejar el cambio en cada input
  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Solo aceptar números
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    // Solo tomar el último caracter ingresado
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    
    // Si se ingresó un número y no es el último input, mover al siguiente
    if (value && index < 7) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Manejar las teclas especiales (borrar, flechas)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Si el input actual está vacío y se presiona backspace, ir al input anterior
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Navegar a la izquierda
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      // Navegar a la derecha
      inputRefs.current[index + 1].focus();
    }
  };

  // Manejar pegar código
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedCode = pastedData.replace(/[^\d]/g, '').substring(0, 8).split('');
    
    const newCode = [...code];
    pastedCode.forEach((digit, index) => {
      if (index < 8) {
        newCode[index] = digit;
      }
    });
    
    setCode(newCode);
    
    // Mover el foco al siguiente input vacío o al último si todos están llenos
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (pastedCode.length > 0) {
      inputRefs.current[Math.min(7, pastedCode.length - 1)].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const completeCode = code.join("");
    logger.info('RecoverPass','Reset attempt with code:', completeCode, 'for email:', userEmail);
    // Aquí iría la lógica para verificar el código y permitir el restablecimiento
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
            {/* Reset Form Section - Full width on mobile, 40% on desktop */}
            <div className="w-full md:w-2/5 p-4 sm:p-6 md:p-10">
              <div className="mb-2">
                <a href="/recover" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <IconResolve_RI name="RiArrowLeftSLine" size={16} className="mr-1" />
                  <span>Volver a recuperación</span>
                </a>
              </div>
              
              <div className="mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900">Verificación</h2>
                <p className="text-gray-500 text-sm">
                  Ingrese el código de 8 dígitos enviado al correo <span className="font-medium break-all">{userEmail}</span>
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Código de verificación
                  </label>
                  {/* En pantallas muy pequeñas, mostrar inputs en 2 filas de 4 */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2">
                    {Array(8).fill(0).map((_, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className="w-full min-w-0 aspect-square p-0 text-center bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-base sm:text-xl font-bold"
                        value={code[index]}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : null} // Solo permitir pegar en el primer input
                        required
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Ingrese los 8 dígitos del código de verificación enviado a su correo.
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200 font-medium"
                  disabled={code.some(digit => !digit)} // Deshabilitar si algún dígito está vacío
                >
                  VERIFICAR CÓDIGO
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button 
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => logger.info('ResetPass','Reenviar código a:', userEmail)}
                >
                  ¿No recibió el código? Reenviar
                </button>
                <p className="text-gray-500 text-xs mt-2">
                  Este código expirará en 10 minutos.
                </p>
              </div>
            </div>
            
            {/* Illustration Section - Hidden on mobile, 60% on desktop */}
            <div className="hidden md:block md:w-3/5 bg-gray-500 relative">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/aside.jpg" 
                  alt="Reset Illustration" 
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

export default ResetPassword;