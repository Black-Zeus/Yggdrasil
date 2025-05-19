import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import logger from '../utils/logger';

/**
 * Guard para rutas de autenticación
 * - Redirige al home si el usuario ya está autenticado
 * - Limpia el localStorage de datos sensibles al entrar a rutas de autenticación
 */
const AuthGuard = () => {
  const location = useLocation();
  // Obtener el estado de autenticación desde el store con los nombres actualizados
  const { isAuthenticated, sessionStatus } = useAuthStore();

  useEffect(() => {
    // Solo limpiamos localStorage si no hay sesión activa
    if (!isAuthenticated) {
      // Lista de claves que deben persistir incluso en páginas de autenticación
      const keysToPreserve = [
        'theme', // Si guardas preferencias de tema
        'language' // Si guardas preferencias de idioma
      ];

      // Obtener todas las claves actuales de localStorage
      const allKeys = Object.keys(localStorage);
      
      // Filtrar las claves relacionadas con la autenticación y sesión
      const keysToRemove = allKeys.filter(key => {
        // Preservar claves específicas
        if (keysToPreserve.includes(key)) return false;
        
        // Eliminar claves que contienen estos términos
        const sensitiveTerms = ['form', 'sidebar'];
        return sensitiveTerms.some(term => key.toLowerCase().includes(term));
      });

      // Eliminar las claves identificadas
      if (keysToRemove.length > 0) {
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          logger.info('AuthGuard', `Eliminada clave de localStorage: ${key}`);
        });
        
        logger.info('AuthGuard', `Se eliminaron ${keysToRemove.length} claves de autenticación de localStorage`);
      }
    }
  }, [location.pathname, isAuthenticated]);

  // Si el usuario está autenticado y trata de acceder a páginas de auth, redirigir al home
  if (isAuthenticated && sessionStatus === 'authenticated') {
    logger.info('AuthGuard', 'Usuario autenticado intentando acceder a ruta de auth, redirigiendo a home');
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, permite acceso a las rutas de auth
  return <Outlet />;
};

export default AuthGuard;