import { useState, useCallback, useEffect, useMemo } from 'react';
import useLoadingStore from '../store/loadingStore';
import logger from '../utils/logger';

/**
 * Hook personalizado para gestionar estados de carga en componentes
 * Proporciona una API sencilla para manejar cargas locales o globales
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.moduleId - Identificador único del módulo/componente
 * @param {boolean} options.useModuleState - Si debe usar el estado del store (true) o estado local (false)
 * @param {boolean} options.isGlobal - Si debe mostrar spinner global en lugar de local
 * @param {string} options.defaultMessage - Mensaje por defecto para el spinner
 * @returns {Object} API de control de carga
 */
const useLoading = (options = {}) => {
  const {
    moduleId = '', 
    useModuleState = false,
    isGlobal = false,
    defaultMessage = 'Cargando...'
  } = options;
  
  // Generar ID único para el componente si no se proporcionó uno
  const componentId = useMemo(() => 
    moduleId || `loading-${Math.random().toString(36).substr(2, 9)}`,
    [moduleId]
  );
  
  // Estado local para cuando no se usa el store
  const [isLocalLoading, setLocalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(defaultMessage);
  
  // Selectores optimizados del store (solo se re-renderiza si cambia este valor específico)
  const isModuleLoading = useLoadingStore(
    state => componentId ? state.isModuleLoading(componentId) : false
  );
  
  const moduleLoadingState = useLoadingStore(
    state => componentId ? state.getModuleLoadingState(componentId) : null
  );
  
  // Determinar si está cargando basado en la configuración
  const isLoading = useMemo(() => {
    if (isGlobal) {
      return useLoadingStore.getState().isGlobalLoading;
    }
    
    return useModuleState && componentId 
      ? isModuleLoading 
      : isLocalLoading;
  }, [isGlobal, useModuleState, componentId, isModuleLoading, isLocalLoading]);
  
  // Funciones para iniciar/detener carga
  const startLoading = useCallback((message = defaultMessage) => {
    if (isGlobal) {
      // Usar spinner global
      useLoadingStore.getState().showGlobalLoading(message, componentId);
      logger.info('useLoading', `Iniciando carga global: ${componentId}`);
      return;
    }
    
    if (useModuleState && componentId) {
      // Usar estado del módulo en el store
      useLoadingStore.getState().setModuleLoading(componentId, true, message);
      logger.info('useLoading', `Iniciando carga de módulo: ${componentId}`);
    } else {
      // Usar estado local del componente
      setLocalLoading(true);
      setLoadingMessage(message);
      logger.info('useLoading', `Iniciando carga local: ${componentId}`);
    }
  }, [isGlobal, useModuleState, componentId, defaultMessage]);
  
  const stopLoading = useCallback(() => {
    if (isGlobal) {
      // Detener spinner global
      useLoadingStore.getState().hideGlobalLoading(componentId);
      logger.info('useLoading', `Deteniendo carga global: ${componentId}`);
      return;
    }
    
    if (useModuleState && componentId) {
      // Actualizar estado del módulo en el store
      useLoadingStore.getState().setModuleLoading(componentId, false);
      logger.info('useLoading', `Deteniendo carga de módulo: ${componentId}`);
    } else {
      // Actualizar estado local
      setLocalLoading(false);
      logger.info('useLoading', `Deteniendo carga local: ${componentId}`);
    }
  }, [isGlobal, useModuleState, componentId]);
  
  // Función para ejecutar una operación asíncrona con manejo automático de carga
  const withLoading = useCallback(async (asyncFn, message = defaultMessage) => {
    try {
      startLoading(message);
      return await asyncFn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, defaultMessage]);
  
  // Limpiar estado al desmontar el componente
  useEffect(() => {
    return () => {
      // Si se estaba usando el estado global o del módulo, limpiarlo
      if (isLoading) {
        if (isGlobal) {
          useLoadingStore.getState().hideGlobalLoading(componentId);
          logger.info('useLoading', `Limpiando carga global al desmontar: ${componentId}`);
        } else if (useModuleState && componentId) {
          useLoadingStore.getState().setModuleLoading(componentId, false);
          logger.info('useLoading', `Limpiando carga de módulo al desmontar: ${componentId}`);
        }
      }
    };
  }, [isGlobal, useModuleState, componentId, isLoading]);
  
  // Obtener el mensaje actual de forma optimizada
  const message = useMemo(() => {
    if (isGlobal) {
      return useLoadingStore.getState().globalLoadingMessage || defaultMessage;
    }
    
    if (useModuleState && componentId) {
      return moduleLoadingState?.message || defaultMessage;
    }
    
    return loadingMessage || defaultMessage;
  }, [isGlobal, useModuleState, componentId, moduleLoadingState, loadingMessage, defaultMessage]);
  
  // Devolver la API del hook
  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    withLoading,
    
    // Métodos auxiliares
    reset: useCallback(() => {
      if (isGlobal) {
        useLoadingStore.getState().resetGlobalLoading();
      } else if (useModuleState && componentId) {
        useLoadingStore.getState().setModuleLoading(componentId, false);
      } else {
        setLocalLoading(false);
      }
    }, [isGlobal, useModuleState, componentId]),
    
    // Para casos especiales donde se necesita más control
    setCustomMessage: useCallback((newMessage) => {
      if (!isGlobal && !useModuleState) {
        setLoadingMessage(newMessage);
      } else {
        logger.warn('useLoading', 'setCustomMessage solo funciona con estado local');
      }
    }, [isGlobal, useModuleState])
  };
};

export default useLoading;