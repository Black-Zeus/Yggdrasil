import api from './http';

// Re-exportación completa
export default api;

// Re-exportación individual para compatibilidad
export const axiosInstance = api;
export const authClient = api.auth;
export const withGlobalSpinner = api.withGlobalSpinner;
export const withLocalSpinner = api.withLocalSpinner;