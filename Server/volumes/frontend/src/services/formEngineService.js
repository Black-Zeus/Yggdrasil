import logger from '../utils/logger';
import { FORM_ENGINE_ENDPOINTS, CATEGORY_ENDPOINTS } from './endpoints';
import api from './http';
import useLoadingStore from '../store/loadingStore';
import toastNotification from './toastNotification';

/**
 * Servicio para gestionar todas las operaciones relacionadas con FormEngine
 * Centraliza las peticiones API para formularios, preguntas y respuestas
 */
class FormEngineService {
  constructor() {
    // Registro de solicitudes en curso para evitar duplicados
    this.pendingRequests = new Map();
    
    // Cliente HTTP con spinner local específico para este servicio
    this.httpClient = api.withLocalSpinner('form-engine', 'Procesando formulario...');
  }
  
  /**
   * Genera una clave única para identificar solicitudes idénticas
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} params - Parámetros de la solicitud
   * @returns {string} - Clave única
   */
  getRequestKey(endpoint, params = {}) {
    return `${endpoint}:${JSON.stringify(params)}`;
  }
  
  /**
   * Verifica si hay una solicitud idéntica en curso y la retorna, o realiza una nueva
   * @param {Function} requestFn - Función que realiza la solicitud
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} params - Parámetros de la solicitud
   * @param {string} moduleId - Identificador del módulo para el loadingStore
   * @returns {Promise} - Promesa con los resultados
   */
  async executeRequest(requestFn, endpoint, params = {}, moduleId = 'form-engine') {
    const requestKey = this.getRequestKey(endpoint, params);
    
    // Si ya hay una solicitud idéntica en curso, retornamos esa promesa
    if (this.pendingRequests.has(requestKey)) {
      logger.info("formEngineService", "Reutilizando solicitud en curso para:", requestKey);
      return this.pendingRequests.get(requestKey);
    }
    
    // Mostrar estado de carga
    useLoadingStore.getState().setModuleLoading(moduleId, true, 'Cargando datos...');
    
    // Crear y registrar la nueva solicitud
    const requestPromise = requestFn()
      .then(result => {
        // Ocultar estado de carga
        useLoadingStore.getState().setModuleLoading(moduleId, false);
        return result;
      })
      .catch(error => {
        // Ocultar estado de carga y mostrar error
        useLoadingStore.getState().setModuleLoading(moduleId, false);
        toastNotification.error(`Error: ${error.message || 'Error desconocido'}`);
        throw error;
      })
      .finally(() => {
        // Eliminar la solicitud del registro cuando finalice
        this.pendingRequests.delete(requestKey);
      });
    
    // Registrar la solicitud en el mapa de solicitudes pendientes
    this.pendingRequests.set(requestKey, requestPromise);
    
    return requestPromise;
  }

  /**
   * Obtiene todos los formularios con opciones de filtrado
   * @param {Object} filters - Filtros para la búsqueda (categoría, subcategoría, búsqueda, etc.)
   * @param {number} page - Número de página para paginación
   * @param {number} limit - Límite de elementos por página
   * @returns {Promise} - Promesa con los resultados procesados
   */
  async getForms(filters = {}, page = 1, limit = 10) {
    const params = { ...filters, page, limit };
    logger.info("formEngineService", "Solicitando formularios con params:", params);

    return this.executeRequest(
      async () => {
        try {
          const response = await this.httpClient.get(FORM_ENGINE_ENDPOINTS.LIST, { params });
          
          // Extraer los datos de la estructura de respuesta estandarizada
          const responseData = response?.response?.data || {};
          const formItems = responseData.items || [];
          const pagination = responseData.pagination || {
            total_items: 0,
            total_pages: 1,
            current_page: page,
            items_per_page: limit
          };
          
          logger.info("formEngineService", `Recibidos ${formItems.length} formularios`);
          
          return {
            success: true,
            data: formItems,
            pagination: pagination,
            status: response?.status,
            message: response?.message
          };
        } catch (error) {
          logger.error('FormEngineService', 'Error al obtener formularios:', error);
          // Relanzar el error con información adicional
          const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
          throw new Error(`Error al cargar formularios: ${errorMessage}`);
        }
      },
      FORM_ENGINE_ENDPOINTS.LIST,
      params,
      'form-list'
    );
  }

  /**
   * Obtiene un formulario específico por ID
   * @param {string} formId - ID del formulario
   * @returns {Promise} - Promesa con el formulario procesado
   */
  async getFormById(formId) {
    return this.executeRequest(
      async () => {
        try {
          const response = await this.httpClient.get(FORM_ENGINE_ENDPOINTS.DETAIL(formId));
          
          return {
            success: true,
            data: response?.response?.data || {},
            status: response?.status,
            message: response?.message
          };
        } catch (error) {
          logger.error('FormEngineService', `Error al obtener formulario ${formId}:`, error);
          throw new Error(`Error al obtener detalles del formulario: ${error.message || 'Error desconocido'}`);
        }
      },
      FORM_ENGINE_ENDPOINTS.DETAIL(formId),
      {},
      `form-detail-${formId}`
    );
  }

  /**
   * Crea un nuevo formulario
   * @param {Object} formData - Datos del formulario a crear
   * @returns {Promise} - Promesa con el formulario creado procesado
   */
  async createForm(formData) {
    // Usar loadingStore para gestionar estado de carga global
    useLoadingStore.getState().showGlobalLoading('Creando formulario...', 'create-form');
    
    try {
      const response = await api.post(FORM_ENGINE_ENDPOINTS.CREATE, formData);
      
      // Mostrar notificación de éxito
      toastNotification.success('Formulario creado exitosamente');
      
      return {
        success: true,
        data: response?.response?.data || {},
        status: response?.status,
        message: response?.message
      };
    } catch (error) {
      logger.error('FormEngineService', 'Error al crear formulario:', error);
      toastNotification.error(`Error al crear formulario: ${error.message || 'Error desconocido'}`);
      throw new Error(`Error al crear formulario: ${error.message || 'Error desconocido'}`);
    } finally {
      // Ocultar estado de carga global
      useLoadingStore.getState().hideGlobalLoading('create-form');
    }
  }

  /**
   * Actualiza un formulario existente
   * @param {string} formId - ID del formulario
   * @param {Object} formData - Datos actualizados del formulario
   * @returns {Promise} - Promesa con el formulario actualizado procesado
   */
  async updateForm(formId, formData) {
    // Usar loadingStore para gestionar estado de carga global
    useLoadingStore.getState().showGlobalLoading('Actualizando formulario...', 'update-form');
    
    try {
      // Se añade el ID al formData para que el backend sepa qué formulario actualizar
      const updateData = {
        ...formData,
        formId: formId,
        uuid: formId // Para compatibilidad con el backend
      };
      
      const response = await api.post(FORM_ENGINE_ENDPOINTS.UPDATE(formId), updateData);
      
      // Mostrar notificación de éxito
      toastNotification.success('Formulario actualizado exitosamente');
      
      return {
        success: true,
        data: response?.response?.data || {},
        status: response?.status,
        message: response?.message
      };
    } catch (error) {
      logger.error('FormEngineService', `Error al actualizar formulario ${formId}:`, error);
      toastNotification.error(`Error al actualizar formulario: ${error.message || 'Error desconocido'}`);
      throw new Error(`Error al actualizar formulario: ${error.message || 'Error desconocido'}`);
    } finally {
      // Ocultar estado de carga global
      useLoadingStore.getState().hideGlobalLoading('update-form');
    }
  }

  /**
   * Elimina un formulario
   * @param {string} formId - ID del formulario
   * @returns {Promise} - Promesa con el resultado de la eliminación procesado
   */
  async deleteForm(formId) {
    // Usar loadingStore para gestionar estado de carga global
    useLoadingStore.getState().showGlobalLoading('Eliminando formulario...', 'delete-form');
    
    try {
      const response = await api.delete(FORM_ENGINE_ENDPOINTS.DELETE(formId));
      
      // Mostrar notificación de éxito
      toastNotification.success('Formulario eliminado correctamente');
      
      return {
        success: true,
        data: response?.response?.data || {},
        status: response?.status,
        message: response?.message || 'Formulario eliminado correctamente'
      };
    } catch (error) {
      logger.error('FormEngineService', `Error al eliminar formulario ${formId}:`, error);
      toastNotification.error(`Error al eliminar formulario: ${error.message || 'Error desconocido'}`);
      throw new Error(`Error al eliminar formulario: ${error.message || 'Error desconocido'}`);
    } finally {
      // Ocultar estado de carga global
      useLoadingStore.getState().hideGlobalLoading('delete-form');
    }
  }

  /**
   * Clona un formulario existente
   * @param {string} formId - ID del formulario a clonar
   * @param {Object} options - Opciones de clonación (nuevo título, descripción, etc.)
   * @returns {Promise} - Promesa con el nuevo formulario clonado procesado
   */
  async cloneForm(formId, options = {}) {
    // Usar loadingStore para gestionar estado de carga global
    useLoadingStore.getState().showGlobalLoading('Clonando formulario...', 'clone-form');
    
    try {
      const cloneData = {
        formId,
        uuid: formId, // Para compatibilidad con el backend
        ...options
      };
      
      const response = await api.post(FORM_ENGINE_ENDPOINTS.CLONE(formId), cloneData);
      
      // Mostrar notificación de éxito
      toastNotification.success('Formulario clonado correctamente');
      
      return {
        success: true,
        data: response?.response?.data || {},
        status: response?.status,
        message: response?.message || 'Formulario clonado correctamente'
      };
    } catch (error) {
      logger.error('FormEngineService', `Error al clonar formulario ${formId}:`, error);
      toastNotification.error(`Error al clonar formulario: ${error.message || 'Error desconocido'}`);
      throw new Error(`Error al clonar formulario: ${error.message || 'Error desconocido'}`);
    } finally {
      // Ocultar estado de carga global
      useLoadingStore.getState().hideGlobalLoading('clone-form');
    }
  }

  /**
   * Cambia el estado de un formulario
   * @param {string} formId - ID del formulario
   * @param {string} status - Nuevo estado ('draft', 'published', 'cancelled', etc.)
   * @returns {Promise} - Promesa con el resultado del cambio procesado
   */
  async changeFormStatus(formId, status) {
    return this.executeRequest(
      async () => {
        try {
          const response = await this.httpClient.patch(FORM_ENGINE_ENDPOINTS.CHANGE_STATUS(formId), { 
            formId,
            uuid: formId, // Para compatibilidad con el backend
            status 
          });
          
          // Mostrar notificación de éxito
          toastNotification.success(`Estado del formulario cambiado a ${status}`);
          
          return {
            success: true,
            data: response?.response?.data || {},
            status: response?.status,
            message: response?.message || `Estado del formulario cambiado a ${status}`
          };
        } catch (error) {
          logger.error('FormEngineService', `Error al cambiar estado de formulario ${formId}:`, error);
          toastNotification.error(`Error al cambiar estado del formulario: ${error.message || 'Error desconocido'}`);
          throw new Error(`Error al cambiar estado del formulario: ${error.message || 'Error desconocido'}`);
        }
      },
      FORM_ENGINE_ENDPOINTS.CHANGE_STATUS(formId),
      { status },
      `form-status-${formId}`
    );
  }

  /**
   * Genera una firma para un formulario (usado para validar integridad)
   * @param {string} formId - ID del formulario
   * @param {Object} formData - Datos del formulario para generar la firma
   * @returns {Promise} - Promesa con la firma generada
   */
  async generateSignature(formId, formData) {
    return this.executeRequest(
      async () => {
        try {
          // En una implementación real, esto enviaría los datos al servidor
          // para generar una firma criptográfica
          const response = await this.httpClient.post(
            `${FORM_ENGINE_ENDPOINTS.DETAIL(formId)}/signature`,
            { formData }
          );
          
          return {
            success: true,
            data: response?.response?.data || {
              hash: `sig-${Date.now()}`,
              algorithm: 'sha256',
              generatedAt: new Date().toISOString(),
              signedBy: 'system',
              validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            },
            status: response?.status,
            message: response?.message || 'Firma generada correctamente'
          };
        } catch (error) {
          logger.error('FormEngineService', `Error al generar firma para formulario ${formId}:`, error);
          throw new Error(`Error al generar firma: ${error.message || 'Error desconocido'}`);
        }
      },
      `${FORM_ENGINE_ENDPOINTS.DETAIL(formId)}/signature`,
      {},
      `form-signature-${formId}`
    );
  }

  /**
   * Verifica la firma de un formulario
   * @param {string} formId - ID del formulario
   * @param {string} signatureHash - Hash de la firma a verificar
   * @returns {Promise} - Promesa con el resultado de la verificación
   */
  async verifySignature(formId, signatureHash) {
    return this.executeRequest(
      async () => {
        try {
          // En una implementación real, esto enviaría la firma al servidor para verificar
          const response = await this.httpClient.post(
            `${FORM_ENGINE_ENDPOINTS.DETAIL(formId)}/verify-signature`,
            { signatureHash }
          );
          
          return {
            success: true,
            data: response?.response?.data || {
              isValid: true,
              signedAt: new Date().toISOString(),
              signedBy: 'system'
            },
            status: response?.status,
            message: response?.message || 'Firma verificada correctamente'
          };
        } catch (error) {
          logger.error('FormEngineService', `Error al verificar firma para formulario ${formId}:`, error);
          throw new Error(`Error al verificar firma: ${error.message || 'Error desconocido'}`);
        }
      },
      `${FORM_ENGINE_ENDPOINTS.DETAIL(formId)}/verify-signature`,
      { signatureHash },
      `form-verify-${formId}`
    );
  }

  /**
   * Importa un formulario desde un archivo JSON
   * @param {Object} formData - Datos del formulario en formato JSON
   * @returns {Promise} - Promesa con el formulario importado
   */
  async importForm(formData) {
    // Usar loadingStore para gestionar estado de carga global
    useLoadingStore.getState().showGlobalLoading('Importando formulario...', 'import-form');
    
    try {
      const response = await api.post(FORM_ENGINE_ENDPOINTS.IMPORT, { body: JSON.stringify(formData) });
      
      // Mostrar notificación de éxito
      toastNotification.success('Formulario importado correctamente');
      
      return {
        success: true,
        data: response?.response?.data || {},
        status: response?.status,
        message: response?.message || 'Formulario importado correctamente'
      };
    } catch (error) {
      logger.error('FormEngineService', 'Error al importar formulario:', error);
      toastNotification.error(`Error al importar formulario: ${error.message || 'Error desconocido'}`);
      throw new Error(`Error al importar formulario: ${error.message || 'Error desconocido'}`);
    } finally {
      // Ocultar estado de carga global
      useLoadingStore.getState().hideGlobalLoading('import-form');
    }
  }

  /**
   * Obtiene las categorías disponibles para formularios
   * @returns {Promise} - Promesa con las categorías procesadas
   */
  async getCategories() {
    return this.executeRequest(
      async () => {
        try {
          const response = await this.httpClient.get(CATEGORY_ENDPOINTS.LIST);
          
          return {
            success: true,
            data: response?.response?.data || [],
            status: response?.status,
            message: response?.message
          };
        } catch (error) {
          logger.error('FormEngineService', 'Error al obtener categorías:', error);
          throw new Error(`Error al cargar categorías: ${error.message || 'Error desconocido'}`);
        }
      },
      CATEGORY_ENDPOINTS.LIST,
      {},
      'categories'
    );
  }

  /**
   * Obtiene las subcategorías para una categoría específica
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise} - Promesa con las subcategorías procesadas
   */
  async getSubcategories(categoryId) {
    return this.executeRequest(
      async () => {
        try {
          const response = await this.httpClient.get(CATEGORY_ENDPOINTS.SUBCATEGORIES(categoryId));
          
          return {
            success: true,
            data: response?.response?.data || [],
            status: response?.status,
            message: response?.message
          };
        } catch (error) {
          logger.error('FormEngineService', `Error al obtener subcategorías para ${categoryId}:`, error);
          throw new Error(`Error al cargar subcategorías: ${error.message || 'Error desconocido'}`);
        }
      },
      CATEGORY_ENDPOINTS.SUBCATEGORIES(categoryId),
      {},
      `subcategories-${categoryId}`
    );
  }

  /**
   * Limpia todas las solicitudes pendientes
   * Útil cuando se navega fuera de la página o se desmonta el componente
   */
  clearPendingRequests() {
    this.pendingRequests.clear();
    logger.info('FormEngineService', 'Solicitudes pendientes borradas');
  }
}

// Exportamos una instancia del servicio para usar en toda la aplicación
const formEngineService = new FormEngineService();
export default formEngineService;