/**
 * Plantillas de formularios para evaluación de desempeño
 */
import {
    createBaseForm,
    createTextQuestion,
    createTextareaQuestion,
    createSingleChoiceQuestion, 
    createMultipleChoiceQuestion,
    createDropdownQuestion,
    createMatrixQuestion,
    createRangeQuestion
  } from './baseComponents';
  
  /**
   * Crea una plantilla para Evaluación de Desempeño
   * @returns {Object} Formulario completo con preguntas predefinidas
   */
  export const createPerformanceEvaluationTemplate = () => {
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
  
  /**
   * Crea una plantilla para Satisfacción del Cliente
   * @returns {Object} Formulario completo con preguntas predefinidas
   */
  export const createCustomerSatisfactionTemplate = () => {
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
  
  // Metadata para las plantillas de esta categoría
  export const performanceTemplatesList = [
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
  ];