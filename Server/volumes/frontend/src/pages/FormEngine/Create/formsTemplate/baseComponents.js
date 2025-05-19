/**
 * Componentes base para formularios
 * Estas funciones proporcionan la estructura básica para crear preguntas
 * y formularios completos
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Crea un formulario base con la estructura correcta y mínima
 * @param {Object} options - Opciones para la creación del formulario
 * @returns {Object} Formulario base con estructura correcta
 */
export const createBaseForm = (options = {}) => {
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
export const createTextQuestion = (options = {}) => {
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
export const createTextareaQuestion = (options = {}) => {
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
export const createSingleChoiceQuestion = (options = {}) => {
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
export const createMultipleChoiceQuestion = (options = {}) => {
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
export const createDropdownQuestion = (options = {}) => {
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
export const createMatrixQuestion = (options = {}) => {
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
export const createRangeQuestion = (options = {}) => {
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
export const createDateQuestion = (options = {}) => {
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
export const createTimeQuestion = (options = {}) => {
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
export const createYesNoQuestion = (options = {}) => {
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
export const createRankingQuestion = (options = {}) => {
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