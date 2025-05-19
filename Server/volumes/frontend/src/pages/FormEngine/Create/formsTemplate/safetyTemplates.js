/**
 * Plantillas de formularios para seguridad y prevención
 */
import {
    createBaseForm,
    createTextQuestion,
    createTextareaQuestion,
    createMultipleChoiceQuestion,
    createMatrixQuestion,
    createRangeQuestion,
    createDateQuestion,
    createYesNoQuestion
  } from './baseComponents';
  
  /**
   * Crea una plantilla para Inspección de Seguridad
   * @returns {Object} Formulario completo con preguntas predefinidas
   */
  export const createSafetyInspectionTemplate = () => {
    const form = createBaseForm({
      title: 'Inspección de Seguridad',
      description: 'Formulario para realizar inspecciones de seguridad en instalaciones',
      categoryId: 'seguridad',
      categoryName: 'Seguridad y Prevención',
      subcategoryId: 'inspecciones',
      subcategoryName: 'Inspecciones de Seguridad',
      requireSignature: true,
      requireInstitutionalEmail: true
    });
  
    // Agregar preguntas específicas
    form.configuration.questions = [
      createTextQuestion({
        order: 0,
        title: 'Nombre del Inspector',
        description: 'Nombre completo de quien realiza la inspección',
        prompt: 'Ejemplo: María González',
        required: true
      }),
      createDateQuestion({
        order: 1,
        title: 'Fecha de inspección',
        description: 'Fecha en que se realiza la inspección',
        prompt: 'Seleccione la fecha',
        required: true
      }),
      createTextQuestion({
        order: 2,
        title: 'Ubicación/Área',
        description: 'Indique la ubicación o área inspeccionada',
        prompt: 'Ejemplo: Bodega central, Piso 3',
        required: true
      }),
      createMatrixQuestion({
        order: 3,
        title: 'Lista de verificación',
        description: 'Evalúe los siguientes aspectos de seguridad',
        prompt: 'Seleccione el estado para cada ítem',
        required: true,
        items: [
          { id: 'extintores', label: 'Extintores accesibles y en buen estado' },
          { id: 'salidas', label: 'Salidas de emergencia despejadas' },
          { id: 'senaletica', label: 'Señalética visible y en buen estado' },
          { id: 'equipos', label: 'Equipos eléctricos en buen estado' },
          { id: 'epp', label: 'Personal utilizando EPP adecuado' }
        ],
        options: [
          { value: 'cumple', label: 'Cumple' },
          { value: 'cumple_parcial', label: 'Cumple parcialmente' },
          { value: 'no_cumple', label: 'No cumple' },
          { value: 'no_aplica', label: 'No aplica' }
        ]
      }),
      createMultipleChoiceQuestion({
        order: 4,
        title: 'Riesgos identificados',
        description: 'Seleccione todos los riesgos identificados durante la inspección',
        prompt: 'Puede seleccionar múltiples opciones',
        options: [
          { value: 'caidas', label: 'Riesgo de caídas' },
          { value: 'electrico', label: 'Riesgo eléctrico' },
          { value: 'incendio', label: 'Riesgo de incendio' },
          { value: 'quimico', label: 'Riesgo químico' },
          { value: 'ergonomico', label: 'Riesgo ergonómico' },
          { value: 'biologico', label: 'Riesgo biológico' },
          { value: 'otro', label: 'Otro' }
        ]
      }),
      createRangeQuestion({
        order: 5,
        title: 'Nivel de riesgo general',
        description: 'Evalúe el nivel de riesgo general del área inspeccionada',
        prompt: 'Escala: 1 (Bajo) a 10 (Alto)',
        required: true,
        min: 1,
        max: 10,
        step: 1
      }),
      createTextareaQuestion({
        order: 6,
        title: 'Observaciones',
        description: 'Describa con detalle los hallazgos y recomendaciones',
        prompt: 'Ingrese sus observaciones',
        required: true
      }),
      createYesNoQuestion({
        order: 7,
        title: '¿Requiere acción inmediata?',
        description: 'Indique si algún hallazgo requiere atención inmediata',
        prompt: '¿Se requieren acciones inmediatas?',
        required: true
      })
    ];
  
    return form;
  };
  
  // Metadata para las plantillas de esta categoría
  export const safetyTemplatesList = [
    {
      id: 'safety_inspection',
      name: 'Inspección de Seguridad',
      description: 'Formulario para inspecciones de seguridad en instalaciones',
      questionCount: 8,
      generator: createSafetyInspectionTemplate
    }
  ];