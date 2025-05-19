/**
 * Punto de entrada principal para las plantillas de formularios
 * Este archivo exporta todos los componentes y plantillas de formularios disponibles
 */

// Exportar componentes base
export * from './baseComponents';

// Exportar plantillas por categoría
import { 
  createPerformanceEvaluationTemplate, 
  createCustomerSatisfactionTemplate, 
  performanceTemplatesList 
} from './performanceTemplates';

import { 
  createSafetyInspectionTemplate,
  safetyTemplatesList 
} from './safetyTemplates';

// Exportamos cada plantilla individualmente
export {
  createPerformanceEvaluationTemplate,
  createCustomerSatisfactionTemplate,
  createSafetyInspectionTemplate
};

/**
 * Obtiene todas las plantillas disponibles agrupadas por categoría
 * @returns {Array} Array de plantillas agrupadas
 */
export const getAllTemplates = () => {
  return [
    {
      category: 'Evaluaciones y Control de Desempeño',
      templates: performanceTemplatesList
    },
    {
      category: 'Seguridad y Prevención',
      templates: safetyTemplatesList
    }
  ];
};

/**
 * Obtiene una plantilla específica por su ID
 * @param {string} templateId - ID de la plantilla a obtener
 * @returns {Object|null} Plantilla generada o null si no existe
 */
export const getTemplateById = (templateId) => {
  const allTemplates = getAllTemplates();
  
  // Buscar la plantilla en todas las categorías
  for (const category of allTemplates) {
    const template = category.templates.find(t => t.id === templateId);
    if (template) {
      return template.generator();
    }
  }
  
  return null;
};

export default {
  getAllTemplates,
  getTemplateById
};