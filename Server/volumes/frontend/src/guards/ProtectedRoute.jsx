import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import logger from '../utils/logger';

/**
 * Componente para proteger rutas que requieren autenticación
 * - Redirige a login si el usuario no está autenticado
 * - Opcionalmente verifica roles requeridos
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, sessionStatus, getCurrentUserRole, hasUserRole } = useAuthStore();
  
  // Obtener el rol del usuario desde el store
  const userRole = getCurrentUserRole();

  // Verificar autenticación
  if (!isAuthenticated || sessionStatus === 'unauthenticated' || sessionStatus === 'expired' || sessionStatus === 'error') {
    logger.info('ProtectedRoute', `Acceso no autorizado a ${location.pathname}. Redirigiendo a login.`);
    // Guardar la ruta a la que intentaba acceder para redirigir después del login
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Verificar roles si es necesario
  if (requiredRoles.length > 0 && !hasUserRole(requiredRoles)) {
    logger.warn('ProtectedRoute', `Usuario con rol ${userRole} intentó acceder a ruta que requiere: ${requiredRoles.join(', ')}`);
    return <Navigate to="/forbidden" replace />;
  }

  // Si todo está bien, renderizar el componente hijo o el Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;