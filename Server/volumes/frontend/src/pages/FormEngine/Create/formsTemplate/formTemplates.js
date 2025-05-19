/**
 * Plantillas base para formularios
 * Estas plantillas proporcionan estructuras predefinidas para crear
 * nuevos formularios con preguntas comunes según la categoría
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Crea un formulario base con la estructura correcta y mínima
 * @param {Object} options - Opciones para la creación del formulario
 * @returns {Object} Formulario base con estructura correcta
 */
const createBaseForm = (options = {}) => {
  const {
    title = 'Nuevo Formulario',
    description = 'Descripción del formulario',
    categoryId = '',
    categoryName = '',
    subcategoryId = '',
    subcategoryName = '',
    categoryDisplay = '',
    visibility = 'Pública',
    allowAnonymous = false,
    requireInstitutionalEmail = false,
    limitOneResponsePerPerson = true,
    requireSignature = false
  } = options;

  const now = new Date().toISOString();

  return {
    configuration: {
      formConfig: {
        metadata: {
          id: uuidv4(),
          title,
          description,
          version: '1.0.0',
          status: 'draft',
          createdAt: now,
          updatedAt: now
        },
        category: {
          categoryId,
          categoryName,
          subcategoryId,
          subcategoryName,
          display: categoryDisplay || `${categoryName}${subcategoryName ? ` - ${subcategoryName}` : ''}`
        },
        visibility: {
          type: visibility,
          allowAnonymous,
          requireInstitutionalEmail,
          limitOneResponsePerPerson
        },
        timing: {
          deadline: '',
          time: ''
        },
        requirements: {
          requireSignature
        }
      },
      questions: []
    },
    signature: {
      hash: '',
      algorithm: 'sha256',
      generatedAt: '',
      signedBy: '',
      validUntil: '',
      certificateId: '',
      verificationUrl: ''
    }
  };
};

/**
 * Crea una pregunta de texto con estructura completa
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createTextQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de texto',
    description = '',
    prompt = 'Ingrese su respuesta',
    required = false,
    validation = null
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'text',
      prompt,
      required,
      validation
    }
  };
};

/**
 * Crea una pregunta de área de texto
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createTextareaQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de texto largo',
    description = '',
    prompt = 'Ingrese su respuesta detallada',
    required = false
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'textarea',
      prompt,
      required
    }
  };
};

/**
 * Crea una pregunta de selección única
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createSingleChoiceQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de selección única',
    description = '',
    prompt = 'Seleccione una opción',
    required = false,
    options: choiceOptions = [
      { value: 'opcion1', label: 'Opción 1' },
      { value: 'opcion2', label: 'Opción 2' },
      { value: 'opcion3', label: 'Opción 3' }
    ]
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'single_choice',
      prompt,
      required,
      options: choiceOptions
    }
  };
};

/**
 * Crea una pregunta de selección múltiple
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createMultipleChoiceQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de selección múltiple',
    description = '',
    prompt = 'Seleccione una o más opciones',
    required = false,
    options: selectionOptions = [
      { value: 'opcion1', label: 'Opción 1' },
      { value: 'opcion2', label: 'Opción 2' },
      { value: 'opcion3', label: 'Opción 3' }
    ]
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'multiple_choice',
      prompt,
      required,
      options: selectionOptions
    }
  };
};

/**
 * Crea una pregunta tipo dropdown
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createDropdownQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de lista desplegable',
    description = '',
    prompt = 'Seleccione una opción',
    required = false,
    options: dropdownOptions = [
      { value: 'opcion1', label: 'Opción 1' },
      { value: 'opcion2', label: 'Opción 2' },
      { value: 'opcion3', label: 'Opción 3' }
    ]
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'dropdown',
      prompt,
      required,
      options: dropdownOptions
    }
  };
};

/**
 * Crea una pregunta de matriz
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createMatrixQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de matriz',
    description = '',
    prompt = 'Evalúe cada ítem',
    required = false,
    items = [
      { id: 'item1', label: 'Ítem 1' },
      { id: 'item2', label: 'Ítem 2' },
      { id: 'item3', label: 'Ítem 3' }
    ],
    options: matrixOptions = [
      { value: 'excelente', label: 'Excelente' },
      { value: 'bueno', label: 'Bueno' },
      { value: 'regular', label: 'Regular' },
      { value: 'deficiente', label: 'Deficiente' }
    ]
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'matrix',
      prompt,
      required,
      items,
      options: matrixOptions
    }
  };
};

/**
 * Crea una pregunta de rango
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createRangeQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de rango',
    description = '',
    prompt = 'Seleccione un valor',
    required = false,
    min = 1,
    max = 10,
    step = 1
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'range',
      prompt,
      required,
      min,
      max,
      step
    }
  };
};

/**
 * Crea una pregunta de fecha
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createDateQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Fecha',
    description = '',
    prompt = 'Seleccione una fecha',
    required = false
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'date',
      prompt,
      required
    }
  };
};

/**
 * Crea una pregunta de hora
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createTimeQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Hora',
    description = '',
    prompt = 'Seleccione una hora',
    required = false
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'time',
      prompt,
      required
    }
  };
};

/**
 * Crea una pregunta de sí/no
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createYesNoQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de Sí/No',
    description = '',
    prompt = '¿Está de acuerdo?',
    required = false
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'yes_no',
      prompt,
      required
    }
  };
};

/**
 * Crea una pregunta de ranking
 * @param {Object} options - Opciones para la pregunta
 * @returns {Object} Pregunta completa
 */
const createRankingQuestion = (options = {}) => {
  const {
    id = `q${Date.now()}`,
    order = 0,
    title = 'Pregunta de ranking',
    description = '',
    prompt = 'Ordene los siguientes elementos',
    required = false,
    items = [
      'Elemento 1',
      'Elemento 2',
      'Elemento 3',
      'Elemento 4'
    ]
  } = options;

  return {
    id,
    order,
    title,
    description,
    question: {
      type: 'ranking',
      prompt,
      required,
      items
    }
  };
};

// === PLANTILLAS PREDEFINIDAS POR CATEGORÍA ===

// 1. Plantilla para Evaluación de Desempeño
const createPerformanceEvaluationTemplate = () => {
  const form = createBaseForm({
    title: 'Evaluación de Desempeño',
    description: 'Evaluación para medir el desempeño del colaborador en el periodo',
    categoryId: 'evaluaciones',
    categoryName: 'Evaluaciones y Control de Desempeño',
    subcategoryId: 'desempeno',
    subcategoryName: 'Evaluación de Desempeño',
    requireInstitutionalEmail: true,
    limitOneResponsePerPerson: true
  });

  // Agregar preguntas específicas
  form.configuration.questions = [
    createTextQuestion({
      order: 0,
      title: 'Nombre completo del evaluado',
      description: 'Ingrese el nombre completo del colaborador evaluado.',
      prompt: 'Ejemplo: Juan Pérez',
      required: true
    }),
    createTextQuestion({
      order: 1,
      title: 'Correo electrónico institucional',
      description: 'Este campo se utiliza para notificaciones internas.',
      prompt: 'Ejemplo: juan.perez@empresa.cl',
      required: true,
      validation: { regex: 'email', errorMessage: 'Correo inválido' }
    }),
    createDropdownQuestion({
      order: 2,
      title: 'Área de desempeño',
      description: 'Seleccione el área en que se desempeña el evaluado.',
      prompt: 'Seleccione una opción',
      required: true,
      options: [
        { value: 'it', label: 'Tecnologías de la Información' },
        { value: 'rh', label: 'Recursos Humanos' },
        { value: 'ventas', label: 'Ventas' },
        { value: 'operaciones', label: 'Operaciones' },
        { value: 'finanzas', label: 'Finanzas' }
      ]
    }),
    createSingleChoiceQuestion({
      order: 3,
      title: 'Nivel de cumplimiento de metas',
      description: 'Seleccione el nivel alcanzado por el evaluado.',
      prompt: 'Nivel de cumplimiento',
      required: true,
      options: [
        { value: 'alto', label: 'Alto' },
        { value: 'medio', label: 'Medio' },
        { value: 'bajo', label: 'Bajo' }
      ]
    }),
    createMultipleChoiceQuestion({
      order: 4,
      title: 'Fortalezas del evaluado',
      description: 'Seleccione todas las fortalezas que aplica.',
      prompt: 'Puede seleccionar más de una opción.',
      options: [
        { value: 'comunicacion', label: 'Comunicación efectiva' },
        { value: 'liderazgo', label: 'Liderazgo' },
        { value: 'resolucion', label: 'Resolución de problemas' },
        { value: 'colaboracion', label: 'Trabajo colaborativo' },
        { value: 'innovacion', label: 'Innovación' },
        { value: 'adaptabilidad', label: 'Adaptabilidad' }
      ]
    }),
    createMatrixQuestion({
      order: 5,
      title: 'Evaluación por competencias',
      description: 'Evalúe los siguientes aspectos del colaborador.',
      prompt: 'Seleccione una opción por fila.',
      required: true,
      items: [
        { id: 'puntualidad', label: 'Puntualidad' },
        { id: 'autonomia', label: 'Autonomía' },
        { id: 'colaboracion', label: 'Colaboración' },
        { id: 'proactividad', label: 'Proactividad' }
      ],
      options: [
        { value: 'excelente', label: 'Excelente' },
        { value: 'bueno', label: 'Bueno' },
        { value: 'regular', label: 'Regular' },
        { value: 'deficiente', label: 'Deficiente' }
      ]
    }),
    createRangeQuestion({
      order: 6,
      title: 'Autoevaluación del desempeño',
      description: 'Indique el puntaje que considera apropiado para su desempeño.',
      prompt: 'Escala de 1 a 10',
      required: true,
      min: 1,
      max: 10,
      step: 1
    }),
    createTextareaQuestion({
      order: 7,
      title: 'Comentarios generales',
      description: 'Ingrese cualquier observación adicional relevante.',
      prompt: 'Comentario adicional'
    })
  ];

  return form;
};

// 2. Plantilla para Satisfacción del Cliente
const createCustomerSatisfactionTemplate = () => {
  const form = createBaseForm({
    title: 'Encuesta de Satisfacción del Cliente',
    description: 'Evaluación para medir la satisfacción de nuestros clientes con el servicio',
    categoryId: 'evaluaciones',
    categoryName: 'Evaluaciones y Control de Desempeño',
    subcategoryId: 'satisfaccion',
    subcategoryName: 'Satisfacción del Cliente',
    allowAnonymous: true
  });

  // Agregar preguntas específicas
  form.configuration.questions = [
    createSingleChoiceQuestion({
      order: 0,
      title: 'Nivel de satisfacción general',
      description: 'Por favor indique su nivel de satisfacción general con nuestro servicio',
      prompt: 'Seleccione una opción',
      required: true,
      options: [
        { value: 'muy_satisfecho', label: 'Muy satisfecho' },
        { value: 'satisfecho', label: 'Satisfecho' },
        { value: 'neutral', label: 'Neutral' },
        { value: 'insatisfecho', label: 'Insatisfecho' },
        { value: 'muy_insatisfecho', label: 'Muy insatisfecho' }
      ]
    }),
    createMatrixQuestion({
      order: 1,
      title: 'Evalúe los siguientes aspectos',
      description: 'Califique cada aspecto de nuestro servicio',
      prompt: 'Seleccione una calificación para cada ítem',
      required: true,
      items: [
        { id: 'calidad', label: 'Calidad del producto/servicio' },
        { id: 'atencion', label: 'Atención al cliente' },
        { id: 'tiempo', label: 'Tiempo de respuesta' },
        { id: 'precio', label: 'Relación calidad-precio' }
      ],
      options: [
        { value: 'excelente', label: 'Excelente' },
        { value: 'bueno', label: 'Bueno' },
        { value: 'aceptable', label: 'Aceptable' },
        { value: 'malo', label: 'Malo' },
        { value: 'pesimo', label: 'Pésimo' }
      ]
    }),
    createYesNoQuestion({
      order: 2,
      title: '¿Recomendaría nuestro servicio?',
      description: 'Indique si recomendaría nuestros servicios a otras personas',
      prompt: '¿Recomendaría nuestros servicios?',
      required: true
    }),
    createRangeQuestion({
      order: 3,
      title: 'Probabilidad de volver a usar nuestro servicio',
      description: 'En una escala del 1 al 10, ¿qué tan probable es que vuelva a usar nuestro servicio?',
      prompt: 'Seleccione un valor',
      required: true,
      min: 1,
      max: 10,
      step: 1
    }),
    createTextareaQuestion({
      order: 4,
      title: 'Sugerencias de mejora',
      description: 'Comparta cualquier sugerencia para mejorar nuestro servicio',
      prompt: 'Sus comentarios son importantes para nosotros'
    })
  ];

  return form;
};

// 3. Plantilla para Inspección de Seguridad
const createSafetyInspectionTemplate = () => {
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

// Exportamos todas las funciones y plantillas
export {
  // Funciones de creación base
  createBaseForm,
  createTextQuestion,
  createTextareaQuestion,
  createSingleChoiceQuestion,
  createMultipleChoiceQuestion,
  createDropdownQuestion,
  createMatrixQuestion,
  createRangeQuestion,
  createDateQuestion,
  createTimeQuestion,
  createYesNoQuestion,
  createRankingQuestion,
  
  // Plantillas predefinidas
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
      templates: [
        {
          id: 'performance_evaluation',
          name: 'Evaluación de Desempeño',
          description: 'Formulario para evaluar el desempeño de colaboradores',
          questionCount: 8,
          generator: createPerformanceEvaluationTemplate
        },
        {
          id: 'customer_satisfaction',
          name: 'Satisfacción del Cliente',
          description: 'Encuesta para medir la satisfacción de clientes',
          questionCount: 5,
          generator: createCustomerSatisfactionTemplate
        }
      ]
    },
    {
      category: 'Seguridad y Prevención',
      templates: [
        {
          id: 'safety_inspection',
          name: 'Inspección de Seguridad',
          description: 'Formulario para inspecciones de seguridad en instalaciones',
          questionCount: 8,
          generator: createSafetyInspectionTemplate
        }
      ]
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