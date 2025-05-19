import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger';
import formEngineService from '../../services/formEngineService';
import toastNotification from '../../services/toastNotification';

/**
 * Store para la gestión de formularios del FormEngine
 * Maneja la configuración, preguntas y firma de formularios
 */
const useFormEngineStore = create(
  persist(
    (set, get) => ({
      // Estado inicial de la configuración
      configuration: {
        formConfig: {
          metadata: {
            id: uuidv4(), // Generar un UUID nuevo al iniciar
            title: '',
            description: '',
            version: '1.0.0',
            status: 'draft', // Por defecto es un borrador
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          category: {
            categoryId: '',
            categoryName: '',
            subcategoryId: '',
            subcategoryName: '',
            display: ''
          },
          visibility: {
            type: 'Pública',
            allowAnonymous: false,
            requireInstitutionalEmail: false,
            limitOneResponsePerPerson: false
          },
          timing: {
            deadline: '',
            time: ''
          },
          requirements: {
            requireSignature: false
          }
        },
        questions: []
      },

      // Estado inicial de la firma
      signature: {
        hash: '',
        algorithm: 'sha256',
        generatedAt: '',
        signedBy: '',
        validUntil: '',
        certificateId: '',
        verificationUrl: ''
      },

      // Estado de carga
      isLoading: false,
      error: null,

      // Establecer estado de carga
      setLoading: (loading) => set({ isLoading: loading }),

      // Establecer error
      setError: (error) => set({ error }),

      // Métodos de acceso directo (getters)
      getFormConfig: () => get().configuration.formConfig,
      getQuestions: () => get().configuration.questions,
      getSignature: () => get().signature,

      // Actualizar la configuración del formulario con estructura anidada
      updateFormConfig: (updates) => {
        const currentConfig = get().configuration.formConfig;
        const newConfig = { ...currentConfig };

        // Manejar actualizaciones en estructura plana para compatibilidad
        if (updates.title !== undefined) {
          newConfig.metadata.title = updates.title;
        }
        if (updates.description !== undefined) {
          newConfig.metadata.description = updates.description;
        }
        if (updates.status !== undefined) {
          newConfig.metadata.status = updates.status;
        }
        if (updates.version !== undefined) {
          newConfig.metadata.version = updates.version;
        }

        // Manejar categoría
        if (updates.categoryId !== undefined) {
          newConfig.category.categoryId = updates.categoryId;
        }
        if (updates.categoryName !== undefined) {
          newConfig.category.categoryName = updates.categoryName;
        }
        if (updates.subcategoryId !== undefined) {
          newConfig.category.subcategoryId = updates.subcategoryId;
        }
        if (updates.subcategoryName !== undefined) {
          newConfig.category.subcategoryName = updates.subcategoryName;
        }
        if (updates.category !== undefined) {
          newConfig.category.display = updates.category;
        }

        // Manejar visibilidad
        if (updates.visibility !== undefined) {
          newConfig.visibility.type = updates.visibility;
        }
        if (updates.allowAnonymous !== undefined) {
          newConfig.visibility.allowAnonymous = updates.allowAnonymous;
        }
        if (updates.requireInstitutionalEmail !== undefined) {
          newConfig.visibility.requireInstitutionalEmail = updates.requireInstitutionalEmail;
        }
        if (updates.limitOneResponsePerPerson !== undefined) {
          newConfig.visibility.limitOneResponsePerPerson = updates.limitOneResponsePerPerson;
        }

        // Manejar tiempo
        if (updates.deadline !== undefined) {
          newConfig.timing.deadline = updates.deadline;
        }
        if (updates.time !== undefined) {
          newConfig.timing.time = updates.time;
        }

        // Manejar requisitos
        if (updates.requireSignature !== undefined) {
          newConfig.requirements.requireSignature = updates.requireSignature;
        }

        // Actualizar fecha de modificación
        newConfig.metadata.updatedAt = new Date().toISOString();

        // Actualizar la configuración en el estado
        set((state) => ({
          configuration: {
            ...state.configuration,
            formConfig: newConfig
          },
          // Resetear firma cuando se modifica la configuración
          signature: {
            ...state.signature,
            hash: '',
            generatedAt: ''
          }
        }));

        logger.info('formEngineStore', 'Configuración del formulario actualizada y guardada');
      },

      // Obtener configuración en formato plano para compatibilidad con componentes existentes
      getFlatFormConfig: () => {
        const config = get().configuration.formConfig;
        return {
          title: config.metadata.title,
          description: config.metadata.description,
          category: config.category.display,
          categoryId: config.category.categoryId,
          categoryName: config.category.categoryName,
          subcategoryId: config.category.subcategoryId,
          subcategoryName: config.category.subcategoryName,
          visibility: config.visibility.type,
          allowAnonymous: config.visibility.allowAnonymous,
          requireInstitutionalEmail: config.visibility.requireInstitutionalEmail,
          limitOneResponsePerPerson: config.visibility.limitOneResponsePerPerson,
          requireSignature: config.requirements.requireSignature,
          deadline: config.timing.deadline,
          time: config.timing.time,
          status: config.metadata.status,
          version: config.metadata.version,
          id: config.metadata.id,
          createdAt: config.metadata.createdAt,
          updatedAt: config.metadata.updatedAt
        };
      },

      /**
       * Cargar un formulario desde el backend por su ID
       * @param {string} formId - ID del formulario a cargar
       * @returns {Promise<Object>} Resultado de la operación
       */
      loadFormById: async (formId) => {
        set({ isLoading: true, error: null });

        try {
          logger.info('formEngineStore', `Cargando formulario con ID: ${formId}`);

          // Usar el servicio para obtener el formulario
          const result = await formEngineService.getFormById(formId);

          if (!result.success) {
            throw new Error(result.message || 'Error al cargar formulario');
          }

          // Convertir el formato del backend al formato del store
          const formData = result.data;

          // Actualizar el estado con los datos del formulario
          set({
            configuration: formData.configuration || {
              formConfig: {
                metadata: {
                  ...get().configuration.formConfig.metadata,
                  id: formData.id || formId
                },
                ...get().configuration.formConfig
              },
              questions: formData.questions || []
            },
            signature: formData.signature || {
              hash: '',
              algorithm: 'sha256',
              generatedAt: '',
              signedBy: '',
              validUntil: '',
              certificateId: '',
              verificationUrl: ''
            },
            isLoading: false
          });

          logger.info('formEngineStore', 'Formulario cargado exitosamente');
          return { success: true };
        } catch (error) {
          logger.error('formEngineStore', 'Error al cargar formulario:', error);
          set({ error: error.message, isLoading: false });
          toastNotification.error(`Error al cargar formulario: ${error.message}`);
          return { error: true, message: error.message };
        }
      },

      /**
       * Importar un formulario desde un objeto de datos
       * @param {Object} formData - Datos del formulario a importar
       * @returns {Promise<Object>} Resultado de la operación
       */
      importFormData: async (formData) => {
        set({ isLoading: true, error: null });

        try {
          logger.info('formEngineStore', 'Importando datos de formulario');

          // Usar el servicio para importar el formulario
          const result = await formEngineService.importForm(formData);

          if (!result.success) {
            throw new Error(result.message || 'Error al importar formulario');
          }

          // Extraer los datos importados
          const importedForm = result.data;

          // Actualizar el estado con los datos importados
          set({
            configuration: importedForm.configuration,
            signature: importedForm.signature,
            isLoading: false
          });

          logger.info('formEngineStore', 'Formulario importado exitosamente');
          return { success: true };
        } catch (error) {
          logger.error('formEngineStore', 'Error al importar formulario:', error);
          set({ error: error.message, isLoading: false });
          toastNotification.error(`Error al importar formulario: ${error.message}`);
          return { error: true, message: error.message };
        }
      },

      // Añadir una nueva pregunta
      addQuestion: (questionType, questionConfig = null) => {
        const questions = get().configuration.questions;
        const nextNumber = questions.length + 14; // Empezamos en q14 ya que tienes hasta q13

        // Si recibimos un questionConfig desde el modal, lo usamos como base
        if (questionConfig) {
          // Crear la nueva pregunta con la estructura correcta
          const newQuestion = {
            id: `q${nextNumber}`,
            order: questions.length,
            title: questionConfig.title || `Nueva pregunta ${questions.length + 1}`,
            description: questionConfig.description || '',
            question: {
              type: questionType,
              prompt: questionConfig.question?.prompt || questionConfig.title || `Pregunta ${questions.length + 1}`,
              required: questionConfig.question?.required || false
            }
          };

          // Añadir propiedades específicas según el tipo
          switch (questionType) {
            case 'dropdown':
            case 'single_choice':
            case 'multiple_choice':
              newQuestion.question.options = questionConfig.question?.options || [
                { value: 'opcion1', label: 'Opción 1' },
                { value: 'opcion2', label: 'Opción 2' }
              ];
              break;

            case 'matrix':
              newQuestion.question.items = questionConfig.question?.items || [
                { id: 'item1', label: 'Item 1' },
                { id: 'item2', label: 'Item 2' }
              ];
              // Usar las opciones personalizadas para matriz si se proporcionan
              newQuestion.question.options = questionConfig.question?.options || [
                { value: 'excelente', label: 'Excelente' },
                { value: 'bueno', label: 'Bueno' },
                { value: 'regular', label: 'Regular' },
                { value: 'deficiente', label: 'Deficiente' }
              ];
              break;

            case 'ranking':
              newQuestion.question.items = questionConfig.question?.items || [
                'Item 1', 'Item 2', 'Item 3'
              ];
              break;

            case 'range':
              newQuestion.question.min = questionConfig.question?.min || 0;
              newQuestion.question.max = questionConfig.question?.max || 10;
              newQuestion.question.step = questionConfig.question?.step || 1;
              break;

            case 'text':
              newQuestion.question.prompt = 'Ejemplo: ' + newQuestion.title;
              break;

            case 'email':
              newQuestion.question.prompt = 'Ejemplo: usuario@dominio.com';
              newQuestion.question.validation = {
                regex: 'email',
                errorMessage: 'Correo inválido'
              };
              break;
          }

          set((state) => ({
            configuration: {
              ...state.configuration,
              questions: [...questions, newQuestion],
              formConfig: {
                ...state.configuration.formConfig,
                metadata: {
                  ...state.configuration.formConfig.metadata,
                  updatedAt: new Date().toISOString()
                }
              }
            },
            // Resetear firma al añadir pregunta
            signature: {
              ...state.signature,
              hash: '',
              generatedAt: ''
            }
          }));

          logger.info('formEngineStore', 'Pregunta configurada añadida y guardada');
          return newQuestion;
        }

        // Si no recibimos configuración, creamos una pregunta básica
        const newQuestion = {
          id: `q${nextNumber}`,
          order: questions.length,
          title: `Nueva pregunta ${questions.length + 1}`,
          description: '',
          question: {
            type: questionType,
            prompt: `Ejemplo para ${questionType}`,
            required: false
          }
        };

        // Configuración específica según el tipo de pregunta
        switch (questionType) {
          case 'multiple_choice':
          case 'single_choice':
          case 'dropdown':
            newQuestion.question.options = [
              { value: 'opcion1', label: 'Opción 1' },
              { value: 'opcion2', label: 'Opción 2' }
            ];
            break;

          case 'matrix':
            newQuestion.question.items = [
              { id: 'item1', label: 'Item 1' },
              { id: 'item2', label: 'Item 2' }
            ];
            newQuestion.question.options = [
              { value: 'opcion1', label: 'Opción 1' },
              { value: 'opcion2', label: 'Opción 2' }
            ];
            break;

          case 'ranking':
            newQuestion.question.items = ['Item 1', 'Item 2', 'Item 3'];
            break;

          case 'range':
            newQuestion.question.min = 0;
            newQuestion.question.max = 10;
            newQuestion.question.step = 1;
            break;

          case 'text':
            newQuestion.question.prompt = 'Ejemplo: ' + newQuestion.title;
            break;

          case 'email':
            newQuestion.question.prompt = 'Ejemplo: usuario@dominio.com';
            newQuestion.question.validation = {
              regex: 'email',
              errorMessage: 'Correo inválido'
            };
            break;
        }

        set((state) => ({
          configuration: {
            ...state.configuration,
            questions: [...questions, newQuestion],
            formConfig: {
              ...state.configuration.formConfig,
              metadata: {
                ...state.configuration.formConfig.metadata,
                updatedAt: new Date().toISOString()
              }
            }
          },
          signature: {
            ...state.signature,
            hash: '',
            generatedAt: ''
          }
        }));

        logger.info('formEngineStore', 'Pregunta añadida y guardada');
        return newQuestion;
      },

      // Eliminar una pregunta por ID
      deleteQuestion: (questionId) => {
        const questions = get().configuration.questions.filter(q => q.id !== questionId);
        // Actualizar el orden de las preguntas restantes
        const updatedQuestions = questions.map((question, index) => ({
          ...question,
          order: index
        }));

        set((state) => ({
          configuration: {
            ...state.configuration,
            questions: updatedQuestions,
            formConfig: {
              ...state.configuration.formConfig,
              metadata: {
                ...state.configuration.formConfig.metadata,
                updatedAt: new Date().toISOString()
              }
            }
          },
          signature: {
            ...state.signature,
            hash: '',
            generatedAt: ''
          }
        }));

        logger.info('formEngineStore', `Pregunta ${questionId} eliminada y cambios guardados`);
      },

      // Editar una pregunta existente
      updateQuestion: (questionId, newData) => {
        const questions = get().configuration.questions.map(question =>
          question.id === questionId ? { ...question, ...newData } : question
        );

        set((state) => ({
          configuration: {
            ...state.configuration,
            questions: questions,
            formConfig: {
              ...state.configuration.formConfig,
              metadata: {
                ...state.configuration.formConfig.metadata,
                updatedAt: new Date().toISOString()
              }
            }
          },
          signature: {
            ...state.signature,
            hash: '',
            generatedAt: ''
          }
        }));

        logger.info('formEngineStore', `Pregunta ${questionId} actualizada y cambios guardados`);
      },

      // Reordenar las preguntas
      reorderQuestions: (fromIndex, toIndex) => {
        const questions = [...get().configuration.questions];

        // Obtener la pregunta a mover
        const [movedQuestion] = questions.splice(fromIndex, 1);

        // Insertarla en la nueva posición
        questions.splice(toIndex, 0, movedQuestion);

        // Actualizar el orden de todas las preguntas
        const updatedQuestions = questions.map((question, index) => ({
          ...question,
          order: index
        }));

        set((state) => ({
          configuration: {
            ...state.configuration,
            questions: updatedQuestions,
            formConfig: {
              ...state.configuration.formConfig,
              metadata: {
                ...state.configuration.formConfig.metadata,
                updatedAt: new Date().toISOString()
              }
            }
          },
          signature: {
            ...state.signature,
            hash: '',
            generatedAt: ''
          }
        }));

        logger.info('formEngineStore', `Preguntas reordenadas y cambios guardados`);
      },

      /**
       * Genera una firma para el formulario actual usando el servicio
       * @returns {Promise<Object>} Firma generada
       */
      generateSignature: async () => {
        try {
          const formId = get().configuration.formConfig.metadata.id;
          const formData = get().configuration;

          // Usar el servicio para generar una firma
          const result = await formEngineService.generateSignature(formId, formData);

          if (!result.success) {
            throw new Error(result.message || 'Error al generar firma');
          }

          // Actualizar el estado con la firma generada
          const newSignature = result.data;
          set({ signature: newSignature });

          logger.info('formEngineStore', 'Firma generada para el formulario');
          return newSignature;
        } catch (error) {
          logger.error('formEngineStore', 'Error al generar firma:', error);
          toastNotification.error(`Error al generar firma: ${error.message}`);
          return {
            error: true,
            message: error.message
          };
        }
      },

      /**
       * Verifica la firma actual usando el servicio
       * @returns {Promise<Object>} Resultado de la verificación
       */
      verifySignature: async () => {
        try {
          const signature = get().signature;

          // Si no hay firma, no es válida
          if (!signature.hash || signature.hash === '') {
            return {
              isValid: false,
              reason: 'No hay firma para este formulario'
            };
          }

          const formId = get().configuration.formConfig.metadata.id;

          // Usar el servicio para verificar la firma
          const result = await formEngineService.verifySignature(formId, signature.hash);

          if (!result.success) {
            throw new Error(result.message || 'Error al verificar firma');
          }

          return result.data;
        } catch (error) {
          logger.error('formEngineStore', 'Error al verificar firma:', error);
          return {
            isValid: false,
            reason: `Error: ${error.message}`
          };
        }
      },

      /**
       * Guarda el formulario actual en el servidor
       * @returns {Promise<Object>} Resultado de la operación
       */
      saveForm: async () => {
        try {
          const formData = {
            configuration: get().configuration,
            signature: get().signature
          };

          const formId = get().configuration.formConfig.metadata.id;
          const isNew = !formId || formId === uuidv4(); // Si es un ID nuevo (generado localmente)

          let result;

          if (isNew) {
            // Si es un formulario nuevo, crear
            result = await formEngineService.createForm(formData);
          } else {
            // Si ya existe, actualizar
            result = await formEngineService.updateForm(formId, formData);
          }

          if (!result.success) {
            throw new Error(result.message || 'Error al guardar formulario');
          }

          // Si necesitamos actualizar el ID después de crear
          if (isNew && result.data.id) {
            // Actualizar el ID en el store con el asignado por el servidor
            set((state) => ({
              configuration: {
                ...state.configuration,
                formConfig: {
                  ...state.configuration.formConfig,
                  metadata: {
                    ...state.configuration.formConfig.metadata,
                    id: result.data.id
                  }
                }
              }
            }));
          }

          // Generar firma si no existe
          if (!get().signature.hash) {
            await get().generateSignature();
          }

          return {
            success: true,
            data: result.data
          };
        } catch (error) {
          logger.error('formEngineStore', 'Error al guardar formulario:', error);
          toastNotification.error(`Error al guardar formulario: ${error.message}`);
          return {
            error: true,
            message: error.message
          };
        }
      },

      /**
       * Función para limpiar completamente el store
       */
      resetStore: () => {
        set({
          configuration: {
            formConfig: {
              metadata: {
                id: uuidv4(),
                title: '',
                description: '',
                version: '1.0.0',
                status: 'draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              category: {
                categoryId: '',
                categoryName: '',
                subcategoryId: '',
                subcategoryName: '',
                display: ''
              },
              visibility: {
                type: 'Pública',
                allowAnonymous: false,
                requireInstitutionalEmail: false,
                limitOneResponsePerPerson: false
              },
              timing: {
                deadline: '',
                time: ''
              },
              requirements: {
                requireSignature: false
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
          },
          isLoading: false,
          error: null
        });
        logger.info('formEngineStore', 'Store reiniciado completamente');
      }
    }),
    {
      name: 'form-engine-storage', // Nombre único para el localStorage
      storage: createJSONStorage(() => localStorage) // Usamos localStorage en vez de sessionStorage para que persista entre sesiones
    }
  )
);

export default useFormEngineStore;