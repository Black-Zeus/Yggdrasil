import ENV from "../utils/envConfig";

/**
 * Definición de endpoints para consumo de API
 * Este archivo centraliza todas las rutas de API que consume la aplicación
 */

// URL base de la API
const API_BASE_URL = ENV.API_BASE_URL

// Endpoints para autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  RECOVER_PASSWORD: `${API_BASE_URL}/auth/recover`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
};

// Endpoints para usuarios
export const USER_ENDPOINTS = {
  LIST: `${API_BASE_URL}/users`,
  DETAIL: (userId) => `${API_BASE_URL}/users/${userId}`,
  CREATE: `${API_BASE_URL}/users`,
  UPDATE: (userId) => `${API_BASE_URL}/users/${userId}`,
  DELETE: (userId) => `${API_BASE_URL}/users/${userId}`,
  CHANGE_STATUS: (userId) => `${API_BASE_URL}/users/${userId}/status`,
  ROLES: (userId) => `${API_BASE_URL}/users/${userId}/roles`,
  PERMISSIONS: (userId) => `${API_BASE_URL}/users/${userId}/permissions`,
};

// Endpoints para roles y permisos
export const ROLE_ENDPOINTS = {
  LIST: `${API_BASE_URL}/roles`,
  DETAIL: (roleId) => `${API_BASE_URL}/roles/${roleId}`,
  CREATE: `${API_BASE_URL}/roles`,
  UPDATE: (roleId) => `${API_BASE_URL}/roles/${roleId}`,
  DELETE: (roleId) => `${API_BASE_URL}/roles/${roleId}`,
  PERMISSIONS: (roleId) => `${API_BASE_URL}/roles/${roleId}/permissions`,
};

// Endpoints para categorías y subcategorías
export const CATEGORY_ENDPOINTS = {
  LIST: `${API_BASE_URL}/categories`,
  DETAIL: (categoryId) => `${API_BASE_URL}/categories/${categoryId}`,
  CREATE: `${API_BASE_URL}/categories`,
  UPDATE: (categoryId) => `${API_BASE_URL}/categories/${categoryId}`,
  DELETE: (categoryId) => `${API_BASE_URL}/categories/${categoryId}`,
  SUBCATEGORIES: (categoryId) => `${API_BASE_URL}/categories/${categoryId}/subcategories`,
};

// Endpoints para menús
export const MENU_ENDPOINTS = {
  LIST: `${API_BASE_URL}/menus`,
  DETAIL: (menuId) => `${API_BASE_URL}/menus/${menuId}`,
  CREATE: `${API_BASE_URL}/menus`,
  UPDATE: (menuId) => `${API_BASE_URL}/menus/${menuId}`,
  DELETE: (menuId) => `${API_BASE_URL}/menus/${menuId}`,
  ITEMS: (menuId) => `${API_BASE_URL}/menus/${menuId}/items`,
  ADD_ITEM: (menuId) => `${API_BASE_URL}/menus/${menuId}/items`,
  UPDATE_ITEM: (menuId, itemId) => `${API_BASE_URL}/menus/${menuId}/items/${itemId}`,
  DELETE_ITEM: (menuId, itemId) => `${API_BASE_URL}/menus/${menuId}/items/${itemId}`,
  REORDER: (menuId) => `${API_BASE_URL}/menus/${menuId}/reorder`,
};

// Endpoints para FormEngine - Ajustados según la estructura del backend
export const FORM_ENGINE_ENDPOINTS = {
  // Formularios
  LIST: `${API_BASE_URL}/form-engine/`,
  DETAIL: (formId) => `${API_BASE_URL}/form-engine/${formId}`,
  CREATE: `${API_BASE_URL}/form-engine/create-form`,
  UPDATE: (formId) => `${API_BASE_URL}/form-engine/create-update`,
  DELETE: (formId) => `${API_BASE_URL}/form-engine/${formId}`,
  CHANGE_STATUS: (formId) => `${API_BASE_URL}/form-engine/${formId}/status`,
  PUBLISH: (formId) => `${API_BASE_URL}/form-engine/form-publish`,
  CLONE: (formId) => `${API_BASE_URL}/form-engine/clone-form`,
  DISABLE: (formId) => `${API_BASE_URL}/form-engine/disabled-form`,
  IMPORT: `${API_BASE_URL}/form-engine/import`,
  EXPORT: (formId) => `${API_BASE_URL}/form-engine/${formId}/export`,
  TEMPLATES: `${API_BASE_URL}/form-engine/templates`,
  
  // Listas específicas
  PUBLISHED_FORMS: `${API_BASE_URL}/form-engine/published`,
  DRAFT_FORMS: `${API_BASE_URL}/form-engine/drafts`,
  SYNC_FORMS: `${API_BASE_URL}/form-engine/sync`,
  
  // Estadísticas
  STATS: `${API_BASE_URL}/form-engine/stats`,
  FORM_STATS: (formId) => `${API_BASE_URL}/form-engine/${formId}/stats`,

  // Preguntas
  QUESTIONS: (formId) => `${API_BASE_URL}/form-engine/${formId}/questions`,
  QUESTION_DETAIL: (formId, questionId) => `${API_BASE_URL}/form-engine/${formId}/questions/${questionId}`,
  CREATE_QUESTION: (formId) => `${API_BASE_URL}/form-engine/${formId}/questions`,
  UPDATE_QUESTION: (formId, questionId) => `${API_BASE_URL}/form-engine/${formId}/questions/${questionId}`,
  DELETE_QUESTION: (formId, questionId) => `${API_BASE_URL}/form-engine/${formId}/questions/${questionId}`,
  REORDER_QUESTIONS: (formId) => `${API_BASE_URL}/form-engine/${formId}/questions/reorder`,

  // Respuestas
  RESPONSES: (formId) => `${API_BASE_URL}/form-engine/${formId}/responses`,
  RESPONSE_DETAIL: (formId, responseId) => `${API_BASE_URL}/form-engine/${formId}/responses/${responseId}`,
  CREATE_RESPONSE: (formId) => `${API_BASE_URL}/form-engine/${formId}/responses`,
  UPDATE_RESPONSE: (formId, responseId) => `${API_BASE_URL}/form-engine/${formId}/responses/${responseId}`,
  DELETE_RESPONSE: (formId, responseId) => `${API_BASE_URL}/form-engine/${formId}/responses/${responseId}`,
  
  // Permisos de formularios
  PERMISSIONS: (formId) => `${API_BASE_URL}/form-engine/${formId}/permissions`,
  SET_PERMISSIONS: (formId) => `${API_BASE_URL}/form-engine/${formId}/permissions`,
  
  // Auditoría
  AUDIT_LOG: (formId) => `${API_BASE_URL}/form-engine/${formId}/audit`,
};

// Endpoints para notificaciones
export const NOTIFICATION_ENDPOINTS = {
  LIST: `${API_BASE_URL}/notifications`,
  DETAIL: (notificationId) => `${API_BASE_URL}/notifications/${notificationId}`,
  MARK_READ: (notificationId) => `${API_BASE_URL}/notifications/${notificationId}/read`,
  DELETE: (notificationId) => `${API_BASE_URL}/notifications/${notificationId}`,
  MARK_ALL_READ: `${API_BASE_URL}/notifications/read-all`,
};

// Endpoints para reportes
export const REPORT_ENDPOINTS = {
  GENERAL_STATS: `${API_BASE_URL}/reports/stats`,
  FORM_USAGE: `${API_BASE_URL}/reports/form-usage`,
  USER_ACTIVITY: `${API_BASE_URL}/reports/user-activity`,
  CUSTOM_REPORT: `${API_BASE_URL}/reports/custom`,
  EXPORT_REPORT: (reportId) => `${API_BASE_URL}/reports/${reportId}/export`,
};

// Endpoints para configuraciones
export const SETTINGS_ENDPOINTS = {
  GENERAL: `${API_BASE_URL}/settings/general`,
  UPDATE_GENERAL: `${API_BASE_URL}/settings/general`,
  APPEARANCE: `${API_BASE_URL}/settings/appearance`,
  UPDATE_APPEARANCE: `${API_BASE_URL}/settings/appearance`,
  SECURITY: `${API_BASE_URL}/settings/security`,
  UPDATE_SECURITY: `${API_BASE_URL}/settings/security`,
  EMAIL_TEMPLATES: `${API_BASE_URL}/settings/email-templates`,
  UPDATE_EMAIL_TEMPLATE: (templateId) => `${API_BASE_URL}/settings/email-templates/${templateId}`,
};

// Endpoints para dispositivos
export const DEVICE_ENDPOINTS = {
  LIST: `${API_BASE_URL}/devices`,
  DETAIL: (deviceId) => `${API_BASE_URL}/devices/${deviceId}`,
  REGISTER: `${API_BASE_URL}/devices/register`,
  UPDATE: (deviceId) => `${API_BASE_URL}/devices/${deviceId}`,
  DELETE: (deviceId) => `${API_BASE_URL}/devices/${deviceId}`,
};

// Exportar todos los endpoints como un objeto único
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  ROLE: ROLE_ENDPOINTS,
  CATEGORY: CATEGORY_ENDPOINTS,
  MENU: MENU_ENDPOINTS,
  FORM_ENGINE: FORM_ENGINE_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
  DEVICE: DEVICE_ENDPOINTS,
};

export default ENDPOINTS;