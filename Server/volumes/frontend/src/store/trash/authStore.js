// authStore.js - Store unificado para autenticación y sesión

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import logger from '../../utils/logger';
import authService from '../../services/authService';
import toastNotification from '../../services/toastNotification';
import { isTokenExpired, getTokenPayload } from '../../utils/jwtUtils';
import useLoadingStore from '../loadingStore';

// Intervalo de tiempo para programar refresco de token
let refreshTokenTimeout = null;

/**
 * Store unificado para gestionar la autenticación y sesión de usuario
 * Combina funcionalidades del antiguo authStore y SessionProvider
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado de autenticación
      user: null, // Información completa del usuario
      accessToken: null, // Token JWT de acceso
      refreshToken: null, // Token JWT de refresco
      isAuthenticated: false, // Indicador general de autenticación
      
      // Estado de sesión (migrado desde SessionProvider)
      sessionStatus: 'checking', // 'checking', 'authenticated', 'unauthenticated', 'expired', 'error'
      isSessionChecking: true, // Indicador de verificación en curso
      sessionSpinnerMessage: 'Verificando sesión...', // Mensaje para el spinner de verificación
      
      /**
       * Inicia sesión de usuario
       * @param {string} email - Correo electrónico del usuario
       * @param {string} password - Contraseña del usuario
       * @returns {Promise<Object>} Resultado de la operación
       */
      loginUser: async (email, password) => {
        try {
          // Mostrar indicación de carga
          get().showSessionLoadingSpinner('Iniciando sesión...');
          
          // Usar authService centralizado para login
          const result = await authService.login(email, password);
          
          if (result.error) {
            throw new Error(result.message);
          }
          
          const { data } = result;
          
          // Guardar datos en el store
          set({
            user: data.user,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            sessionStatus: 'authenticated'
          });

          // Programar el refresco automático
          get().scheduleTokenRefresh();
          
          logger.info('Auth', 'Inicio de sesión exitoso');
          return { success: true };
        } catch (err) {
          logger.error('Auth', `Error en login: ${err.message}`, err);
          authService.handleAuthError(err);
          
          // Actualizar estado de sesión
          set({
            sessionStatus: 'error',
            isAuthenticated: false
          });
          
          return {
            error: true,
            message: err.message
          };
        } finally {
          get().hideSessionLoadingSpinner();
        }
      },

      /**
       * Cierra la sesión del usuario
       * @returns {Promise<Object>} Resultado de la operación
       */
      logoutUser: async () => {
        logger.info('Auth', 'Cerrando sesión');
        
        try {
          get().showSessionLoadingSpinner('Cerrando sesión...');
          
          // Intentar logout en el servidor a través de authService
          const token = get().accessToken;
          if (token) {
            await authService.logout(token);
          }
          
          // Limpiar el timeout de refresco si existe
          if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
            refreshTokenTimeout = null;
          }
          
          // Limpiar el estado
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            sessionStatus: 'unauthenticated'
          });
          
          logger.info('Auth', 'Sesión cerrada correctamente');
          
          // Limpiar localStorage para evitar problemas de formato
          try {
            localStorage.removeItem('auth-storage');
          } catch (e) {
            logger.error('Auth', 'Error al limpiar localStorage', e);
          }
          
          return { success: true };
        } catch (error) {
          logger.error('Auth', 'Error al cerrar sesión', error);
          
          // Aún así, limpiar el estado
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            sessionStatus: 'unauthenticated'
          });
          
          return { 
            success: true, 
            warning: 'Se cerró la sesión localmente, pero hubo un error en el servidor' 
          };
        } finally {
          get().hideSessionLoadingSpinner();
        }
      },

      /**
       * Refresca el token de acceso usando el token de refresco
       * @returns {Promise<string>} Nuevo token de acceso
       */
      refreshAccessToken: async () => {
        try {
          const token = get().refreshToken;
          
          if (!token) {
            throw new Error('No hay token de refresco disponible');
          }

          logger.info('Auth', 'Intentando refrescar token');
          
          // Usar authService para refrescar token
          const result = await authService.refreshToken(token);
          
          if (result.error) {
            throw new Error(result.message);
          }

          // Actualizar token en el estado
          set({ 
            accessToken: result.accessToken,
            sessionStatus: 'authenticated'
          });
          
          // Programar siguiente refresco
          get().scheduleTokenRefresh();

          logger.info('Auth', 'Token refrescado correctamente');
          return result.accessToken;
          
        } catch (err) {
          logger.error('Auth', 'Error al refrescar token', err);
          
          // Si falla el refresco, hacer logout
          get().logoutUser();
          toastNotification.auth.sessionExpired();
          
          throw new Error('Error al refrescar la sesión');
        }
      },

      /**
       * Programa el refresco automático del token antes de que expire
       */
      scheduleTokenRefresh: () => {
        try {
          // Limpiar cualquier timeout existente
          if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
            refreshTokenTimeout = null;
          }
          
          // Obtener token actual
          const token = get().accessToken;
          
          if (!token) {
            logger.warn('Auth', 'No hay token para programar refresco');
            return;
          }

          // Calcular tiempo hasta expiración (con 2 minutos de margen)
          const tokenPayload = getTokenPayload(token);
          if (!tokenPayload || !tokenPayload.exp) {
            logger.warn('Auth', 'Token no contiene fecha de expiración');
            return;
          }
          
          const expirationTime = tokenPayload.exp * 1000;
          const currentTime = Date.now();
          const remainingMs = expirationTime - currentTime;
          const refreshInMs = Math.max(0, remainingMs - (120 * 1000)); // 2 minutos antes
          
          // Si el token ya expiró o está muy próximo a expirar
          if (refreshInMs <= 0) {
            logger.warn('Auth', 'Token ya expirado o próximo a expirar, refrescando inmediatamente');
            get().refreshAccessToken().catch(err =>
              logger.error('Auth', 'Error en refresco inmediato', err)
            );
            return;
          }

          // Programar refresco automático
          logger.info('Auth', `Refresco programado en ${Math.floor(refreshInMs / 1000)} segundos`);
          
          refreshTokenTimeout = setTimeout(() => {
            logger.info('Auth', 'Ejecutando refresco programado');
            get().refreshAccessToken().catch(err => {
              logger.error('Auth', 'Error en refresco programado', err);
            });
          }, refreshInMs);
          
        } catch (e) {
          logger.warn('Auth', 'Error al programar refresco automático', e);
        }
      },

      /**
       * Inicializa y verifica el estado de la sesión al cargar la aplicación
       */
      initializeSession: () => {
        try {
          const { accessToken, refreshToken, isAuthenticated } = get();
          
          // Si no hay sesión activa, salir
          if (!accessToken || !refreshToken || !isAuthenticated) {
            logger.info('Auth', 'No hay sesión activa');
            set({ 
              sessionStatus: 'unauthenticated',
              isSessionChecking: false
            });
            return;
          }

          logger.info('Auth', 'Verificando estado de sesión existente');
          
          // Verificar validez del token actual usando authService
          if (authService.isTokenValid(accessToken, 300)) { // 5 minutos de margen
            // Si el token es válido, programar refresco
            get().scheduleTokenRefresh();
            set({ 
              sessionStatus: 'authenticated',
              isSessionChecking: false
            });
            logger.info('Auth', 'Sesión válida');
          } else {
            // Si el token está próximo a expirar, refrescar inmediatamente
            logger.info('Auth', 'Token próximo a expirar al iniciar, refrescando...');
            get().refreshAccessToken()
              .then(() => {
                set({ 
                  sessionStatus: 'authenticated',
                  isSessionChecking: false 
                });
                logger.info('Auth', 'Sesión válida y refrescada');
              })
              .catch(err => {
                logger.error('Auth', 'Error al refrescar token en inicio', err);
                get().logoutUser();
                set({ 
                  sessionStatus: 'expired',
                  isSessionChecking: false
                });
              });
          }
        } catch (e) {
          logger.error('Auth', 'Error inesperado al inicializar sesión', e);
          get().logoutUser();
          set({ 
            sessionStatus: 'error',
            isSessionChecking: false 
          });
        }
      },

      /**
       * Valida y verifica la sesión actual (completa)
       */
      validateSession: async () => {
        try {
          const { accessToken, isAuthenticated, refreshAccessToken, logoutUser } = get();
          
          // Iniciar verificación
          set({ 
            sessionStatus: 'checking',
            isSessionChecking: true,
            sessionSpinnerMessage: 'Verificando sesión...'
          });
          
          // Si no hay token o no está autenticado, terminar verificación
          if (!accessToken || !isAuthenticated) {
            logger.info('Auth', 'No hay sesión activa');
            set({ 
              sessionStatus: 'unauthenticated',
              isSessionChecking: false 
            });
            return;
          }

          // Verificar si el token está expirado usando authService
          if (!authService.isTokenValid(accessToken)) {
            logger.info('Auth', 'Token expirado, intentando renovar');
            try {
              set({ sessionSpinnerMessage: 'Renovando sesión...' });
              useLoadingStore.getState().showGlobalLoading('Renovando sesión...', 'session-refresh');
              await refreshAccessToken();
              logger.info('Auth', 'Token renovado correctamente');
              set({ sessionStatus: 'authenticated' });
            } catch (err) {
              logger.error('Auth', 'Error al renovar token', err);
              logoutUser();
              set({ sessionStatus: 'expired' });
            } finally {
              useLoadingStore.getState().hideGlobalLoading('session-refresh');
            }
          } else {
            logger.info('Auth', 'Sesión válida');
            set({ sessionStatus: 'authenticated' });
          }
        } catch (err) {
          logger.error('Auth', 'Error al validar sesión', err);
          get().logoutUser();
          set({ sessionStatus: 'error' });
        } finally {
          // Inicializar la sesión en el store
          get().initializeSession();
          set({ isSessionChecking: false });
        }
      },
      
      /**
       * Muestra el spinner de sesión con un mensaje personalizado
       * @param {string} message - Mensaje a mostrar
       */
      showSessionLoadingSpinner: (message = 'Cargando...') => {
        set({ 
          isSessionChecking: true,
          sessionSpinnerMessage: message
        });
        
        // También activamos el spinner global para consistencia UX
        useLoadingStore.getState().showGlobalLoading(message, 'session-operation');
      },
      
      /**
       * Oculta el spinner de sesión
       */
      hideSessionLoadingSpinner: () => {
        set({ isSessionChecking: false });
        
        // También desactivamos el spinner global
        useLoadingStore.getState().hideGlobalLoading('session-operation');
      },

      /**
       * Verifica si el token actual es válido
       * @param {number} marginSeconds - Margen de tiempo en segundos antes de considerar expirado
       * @returns {boolean} True si el token es válido
       */
      isCurrentTokenValid: (marginSeconds = 30) => {
        const token = get().accessToken;
        // Usar authService para validar token
        return authService.isTokenValid(token, marginSeconds);
      },

      /**
       * Obtiene el rol del usuario actual
       * @returns {string|number|null} ID del perfil o rol, o null si no está autenticado
       */
      getCurrentUserRole: () => {
        const user = get().user;
        
        if (!user) return null;
        
        // Prioridad: profileId, luego role, luego el primer elemento de roles si existe
        return user.profileId || 
               user.role || 
               (Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : null);
      },
      
      /**
       * Verifica si el usuario actual tiene un rol específico
       * @param {string|string[]} requiredRoles - Rol o roles requeridos
       * @returns {boolean} True si el usuario tiene el rol requerido
       */
      hasUserRole: (requiredRoles) => {
        const user = get().user;
        
        if (!user) return false;
        
        const userRole = get().getCurrentUserRole();
        const userRoles = Array.isArray(user.roles) ? user.roles : 
                          userRole ? [userRole] : [];
        
        if (Array.isArray(requiredRoles)) {
          return requiredRoles.some(role => userRoles.includes(role));
        }
        
        return userRoles.includes(requiredRoles);
      },
      
      /**
       * Verifica si el usuario tiene un permiso específico
       * @param {string|string[]} permissions - Permiso o permisos requeridos
       * @returns {boolean} True si el usuario tiene los permisos
       */
      hasUserPermission: (permissions) => {
        const user = get().user;
        
        if (!user || !user.permissions) return false;
        
        const userPermissions = Array.isArray(user.permissions) ? 
                               user.permissions : [];
        
        if (Array.isArray(permissions)) {
          return permissions.some(perm => userPermissions.includes(perm));
        }
        
        return userPermissions.includes(permissions);
      },
      
      /**
       * Obtiene información del perfil del usuario actual
       * @returns {Object} Objeto con información básica del usuario
       */
      getUserProfile: () => {
        const user = get().user;
        
        if (!user) {
          return {
            isLoggedIn: false,
            name: 'Invitado',
            role: null,
            avatar: null
          };
        }
        
        return {
          isLoggedIn: true,
          id: user.id || user.userId,
          name: user.name || user.username || user.email,
          email: user.email,
          role: get().getCurrentUserRole(),
          avatar: user.avatar,
          lastLogin: user.lastLogin
        };
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      
      // Función para manejar errores en la deserialización
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (e) {
          logger.error('Auth', 'Error al deserializar datos de autenticación', e);
          // En caso de error, eliminar datos corruptos
          localStorage.removeItem('auth-storage');
          // Devolver estado limpio
          return {
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            sessionStatus: 'unauthenticated',
            isSessionChecking: false
          };
        }
      },
      
      // Especificar qué campos se guardan en localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        // No persistir estados de verificación de sesión
        // sessionStatus: state.sessionStatus,
        // isSessionChecking: state.isSessionChecking
      })
    }
  )
);

// Inicializar sesión al importar el store
setTimeout(() => {
  useAuthStore.getState().validateSession();
}, 0);

export default useAuthStore;