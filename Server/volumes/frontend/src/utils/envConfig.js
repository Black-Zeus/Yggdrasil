// utils/envConfig.js
/**
 * Configuración centralizada de variables de entorno
 * Proporciona acceso estructurado a todas las variables de entorno de la aplicación
 */
const ENV = {
    // API y conexiones
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/services',
    API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
    
    // Entorno de ejecución
    FRONTEND_ENV: import.meta.env.VITE_FRONTEND_ENV || 'Desconocido',
    FRONTEND_VERSION: import.meta.env.VITE_FRONTEND_VERSION || '1.0.0',
    
    // Información de servidor y hosting
    FRONTEND_PORT: import.meta.env.VITE_FRONTEND_PORT,
    FRONTEND_HOST: import.meta.env.VITE_FRONTEND_HOST || 'http://localhost',
    
    // Flags y estados derivados
    IS_DEV: import.meta.env.VITE_FRONTEND_ENV === 'DEV',
    IS_PROD: import.meta.env.VITE_FRONTEND_ENV === 'PROD',
    IS_TEST: import.meta.env.VITE_FRONTEND_ENV === 'TEST',
  };
  
  // Método de ayuda para obtener valores de entorno con fallback
  ENV.get = (key, fallback = null) => {
    return ENV[key] !== undefined ? ENV[key] : fallback;
  };
  
  // Logs para depuración durante el desarrollo
  if (ENV.IS_DEV) {
    console.group('🔧 Variables de entorno cargadas:');
    Object.keys(ENV).forEach(key => {
      if (typeof ENV[key] !== 'function') {
        console.log(`${key}: ${ENV[key]}`);
      }
    });
    console.groupEnd();
  }
  
  // Exponer todos los valores como propiedades inmutables
  Object.freeze(ENV);
  
  export default ENV;