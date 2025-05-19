import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaFileSignature } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { AlertModal, ConfirmModal, FormModal } from '../../components/ui/Modal/Modal';
import LoadingSpinner from '../../components/ui/spinners/LoadingSpinner';

import InformationTab from './Create/InformationTab';
import QuestionsTab from './Create/QuestionsTab';
import PreviewTab from './Create/PreviewTab';
import NavigationControls from './Create/NavigationControls';

import formEngineService from '../../services/formEngineService';
import { getAllTemplates } from './Create/formsTemplate/index';
import logger from '../../utils/logger';

import useFormEngineStore from '../../store/formEngineStore';

const EvaluationCreate = () => {
  // Obtener el formId de los parámetros de la URL (si existe)
  const { formId } = useParams();
  const navigate = useNavigate();
  
  // Usar el store para acceder a la configuración, preguntas y firma
  const { 
    configuration,
    signature,
    getFormConfig,
    getQuestions,
    getFlatFormConfig,
    loadFormData,
    saveFormData, 
    resetStore,
    generateSignature,
    verifySignature,
    isLoading,
    error,
    setLoading,
    setError
  } = useFormEngineStore();
  
  // Estado para la navegación entre pestañas
  const [currentTab, setCurrentTab] = useState('información');
  
  // Estado para modales
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('info');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [draftLoadModalOpen, setDraftLoadModalOpen] = useState(false);
  
  // Estado para indicar si estamos en modo edición
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('empty');
  const [savedDraft, setSavedDraft] = useState(null);
  
  // Obtener formulario y preguntas de la configuración
  const formConfig = getFormConfig();
  const questions = getQuestions();
  
  // Para compatibilidad con componentes existentes
  const flatFormConfig = getFlatFormConfig();

  // Cargar datos al iniciar el componente
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Si hay un formId en la URL, cargamos ese formulario (modo edición)
        if (formId) {
          setLoading(true);
          setIsEditMode(true);
          
          try {
            // Obtener el formulario del servidor
            const response = await formEngineService.getFormById(formId);
            
            // Verificar si el formulario está publicado (solo puede verse, no editarse)
            if (response.configuration?.formConfig?.metadata?.status === 'published') {
              showAlert(
                'Este formulario ya está publicado y no puede editarse. Puede crear una copia para modificarlo.',
                'warning'
              );
            }
            
            // Cargar los datos en el store
            loadFormData(response);
            
          } catch (error) {
            setError(`Error al cargar el formulario: ${error.message || 'Error desconocido'}`);
            showAlert(`No se pudo cargar el formulario. ${error.message || 'Error desconocido'}`, 'error');
          } finally {
            setLoading(false);
          }
        } else {
          // Modo creación - verificar si hay un borrador guardado
          const draftData = localStorage.getItem('evaluation-draft');
          
          if (draftData) {
            try {
              // Guardar el borrador para cargarlo si el usuario lo confirma
              setSavedDraft(JSON.parse(draftData));
              // Mostrar modal de confirmación para cargar borrador
              setDraftLoadModalOpen(true);
            } catch (error) {
              logger.error('EvaluationCreate', 'Error al procesar el borrador:', error);
              // Si hay error en el borrador, mostrar plantillas
              setTemplateModalOpen(true);
            }
          } else {
            // Sin borrador, mostrar plantillas
            setTemplateModalOpen(true);
          }
        }
        
        // Cargar plantillas disponibles
        setTemplates(getAllTemplates());
        
      } catch (error) {
        logger.error('EvaluationCreate', 'Error en la inicialización:', error);
        setError(`Error al inicializar el componente: ${error.message}`);
      }
    };
    
    initializeComponent();
  }, [formId]);
  
  // Función para mostrar alertas
  const showAlert = (message, variant = 'info') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertModalOpen(true);
  };
  
  // Función para cambiar de pestaña
  const changeTab = (tab) => {
    setCurrentTab(tab);
  };
  
  // Función para el botón siguiente
  const handleNext = () => {
    if (currentTab === 'información') {
      // Validar campos requeridos antes de avanzar
      if (!formConfig.metadata.title || !formConfig.category.display || !formConfig.metadata.description) {
        showAlert('Por favor completa todos los campos obligatorios', 'error');
        return;
      }
      changeTab('preguntas');
    } else if (currentTab === 'preguntas') {
      changeTab('vistaPrevia');
    }
  };
  
  // Función para el botón anterior
  const handlePrevious = () => {
    if (currentTab === 'preguntas') {
      changeTab('información');
    } else if (currentTab === 'vistaPrevia') {
      changeTab('preguntas');
    }
  };
  
  // Función para el botón cancelar
  const handleCancel = () => {
    // La lógica de confirmación se maneja en el modal
    setResetModalOpen(true);
  };
  
  // Función para el botón de guardar borrador
  const saveDraft = async () => {
    // Validar campos mínimos
    if (!formConfig.metadata.title) {
      showAlert('El título de la evaluación es obligatorio para guardar', 'warning');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Actualizar el estado a borrador
      const currentConfig = { ...configuration };
      currentConfig.formConfig.metadata.status = 'draft';
      
      // Usar la función del store para guardar con formato correcto
      const completeData = saveFormData();
      
      // Guardar en localStorage
      localStorage.setItem('evaluation-draft', JSON.stringify(completeData));
      
      // Si estamos en modo edición, también guardamos en el servidor
      if (isEditMode && formId) {
        await formEngineService.updateForm(formId, completeData);
        showAlert('Formulario actualizado correctamente', 'success');
      } else {
        showAlert('Borrador guardado correctamente', 'success');
      }
    } catch (error) {
      logger.error('EvaluationCreate', 'Error al guardar borrador:', error);
      showAlert(`Error al guardar: ${error.message || 'Error desconocido'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Función para generar/renovar la firma
  const handleGenerateSignature = () => {
    generateSignature();
    setSignatureModalOpen(false);
    showAlert('Firma digital generada correctamente', 'success');
  };
  
  // Función para publicar la evaluación
  const handlePublishConfirm = () => {
    // Validar que haya al menos una pregunta
    if (questions.length === 0) {
      showAlert('Debes añadir al menos una pregunta antes de publicar la evaluación', 'error');
      return;
    }
    
    // Validar que los campos obligatorios estén completados
    if (!formConfig.metadata.title || !formConfig.category.display || !formConfig.metadata.description) {
      showAlert('Por favor completa todos los campos obligatorios en la pestaña de Información', 'error');
      changeTab('información');
      return;
    }
    
    // Verificar si es necesario generar una firma
    if (!signature.hash || signature.hash === '') {
      setSignatureModalOpen(true);
      return;
    }
    
    // Si todo está bien, mostrar el modal de confirmación de publicación
    setPublishModalOpen(true);
  };
  
  // Función que se ejecuta al confirmar la publicación
  const publishEvaluation = async () => {
    try {
      setIsSaving(true);
      
      // Actualizar el estado a publicado
      const currentConfig = { ...configuration };
      currentConfig.formConfig.metadata.status = 'published';
      useFormEngineStore.setState({
        configuration: currentConfig
      });
      
      // Guardar datos completos
      const completeData = saveFormData();
      
      logger.info('EvaluationCreate', 'Publicando evaluación...');
      
      // Si estamos en modo edición, actualizamos el formulario existente
      if (isEditMode && formId) {
        await formEngineService.updateForm(formId, completeData);
        // Y luego lo publicamos
        await formEngineService.publishForm(formId);
      } else {
        // Si estamos creando uno nuevo, lo guardamos primero
        const newForm = await formEngineService.createForm(completeData);
        // Y luego lo publicamos
        await formEngineService.publishForm(newForm.id || newForm.uuid);
      }
      
      // Mostrar alerta de éxito
      showAlert('Evaluación publicada correctamente', 'success');
      
      // Redirigir a la lista de evaluaciones
      setTimeout(() => {
        navigate('/FormEngine/LoadEvaluation');
      }, 2000);
      
    } catch (error) {
      logger.error('EvaluationCreate', 'Error al publicar evaluación:', error);
      showAlert(`Error al publicar: ${error.message || 'Error desconocido'}`, 'error');
    } finally {
      setIsSaving(false);
      setPublishModalOpen(false);
    }
  };

  // Función para cargar una plantilla
  const handleTemplateSelect = (templateId) => {
    try {
      if (templateId === 'empty') {
        // No hacer nada, el formulario ya está vacío
        setTemplateModalOpen(false);
        return;
      }
      
      // Buscar la plantilla seleccionada
      let selectedTemplate = null;
      templates.forEach(category => {
        const template = category.templates.find(t => t.id === templateId);
        if (template) {
          selectedTemplate = template;
        }
      });
      
      if (selectedTemplate) {
        // Resetear el store para limpiarlo
        resetStore();
        
        // Generar la plantilla y cargarla
        const templateData = selectedTemplate.generator();
        loadFormData(templateData);
        
        toast.success(`Plantilla "${selectedTemplate.name}" cargada correctamente`);
      }
      
      setTemplateModalOpen(false);
    } catch (error) {
      logger.error('EvaluationCreate', 'Error al cargar plantilla:', error);
      showAlert(`Error al cargar plantilla: ${error.message || 'Error desconocido'}`, 'error');
    }
  };

  // Función para cargar el borrador guardado
  const handleLoadDraft = () => {
    try {
      if (savedDraft) {
        // Si el borrador tiene el formato nuevo con configuration y signature
        if (savedDraft.configuration && savedDraft.signature !== undefined) {
          useFormEngineStore.setState({
            configuration: savedDraft.configuration,
            signature: savedDraft.signature
          });
        } 
        // Si tiene otro formato, usar loadFormData que puede manejar diferentes formatos
        else {
          loadFormData({ body: JSON.stringify(savedDraft) });
        }
        
        showAlert('Borrador cargado correctamente', 'success');
      }
      
      setDraftLoadModalOpen(false);
    } catch (error) {
      logger.error('EvaluationCreate', 'Error al cargar borrador:', error);
      showAlert('Error al cargar el borrador guardado', 'error');
      setDraftLoadModalOpen(false);
      // Si falla al cargar el borrador, mostrar plantillas
      setTemplateModalOpen(true);
    }
  };
  
  // Verificar si hay una firma válida
  const signatureStatus = verifySignature();
  
  return (
    <div className="bg-background dark:bg-background-dark p-6">
      <div className="max-w-6xl mx-auto bg-background-light dark:bg-secondary-dark rounded-lg shadow-subtle dark:shadow-deep overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner
              size="xl"
              message="Cargando evaluación..."
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm text-text-muted dark:text-text-dark mb-2 flex items-center justify-between">
                <div>
                  Inicio / {isEditMode ? 'Editar' : 'Crear'} Evaluación
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-sm">
                    Estado: 
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-white ${
                      formConfig.metadata.status === 'published' ? 'bg-success' : 
                      formConfig.metadata.status === 'draft' ? 'bg-warning' : 'bg-primary'
                    }`}>
                      {formConfig.metadata.status === 'published' ? 'Publicado' : 
                       formConfig.metadata.status === 'draft' ? 'Borrador' : 'Nuevo'}
                    </span>
                  </span>
                  
                  {signatureStatus.isValid ? (
                    <span className="flex items-center text-success">
                      <FaCheckCircle className="mr-1" /> Firmado
                    </span>
                  ) : (
                    <span className="flex items-center text-warning">
                      <FaExclamationTriangle className="mr-1" /> Sin firmar
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary dark:text-primary-light">
                  {isEditMode ? 'Editar' : 'Nueva'} Evaluación: {formConfig.metadata.title || "Sin título"}
                </h1>
                <div className="flex space-x-2">
                  <button 
                    className="bg-danger dark:bg-danger-light text-white px-3 py-1 rounded text-sm hover:bg-danger-dark dark:hover:bg-danger transition-colors"
                    onClick={handleCancel}
                    title="Reiniciar completamente el formulario y las preguntas"
                  >
                    Reiniciar Todo
                  </button>
                  <button 
                    className="bg-primary dark:bg-primary-light text-white px-4 py-2 rounded font-semibold hover:bg-primary-dark dark:hover:bg-primary transition-colors flex items-center"
                    onClick={saveDraft}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <LoadingSpinner size="xs" />
                        <span className="ml-2">Guardando...</span>
                      </>
                    ) : (
                      'Guardar Borrador'
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex border-b border-border dark:border-border-dark mb-6">
              <button 
                className={`py-3 px-6 ${currentTab === 'información' ? 'bg-primary dark:bg-primary-light text-white font-bold' : 'text-text-muted dark:text-text-dark hover:bg-highlight dark:hover:bg-secondary-dark'}`}
                onClick={() => changeTab('información')}
              >
                Información
              </button>
              <button 
                className={`py-3 px-6 ${currentTab === 'preguntas' ? 'bg-primary dark:bg-primary-light text-white font-bold' : 'text-text-muted dark:text-text-dark hover:bg-highlight dark:hover:bg-secondary-dark'}`}
                onClick={() => changeTab('preguntas')}
              >
                Preguntas {questions.length > 0 && <span className="ml-1 bg-primary-light dark:bg-primary text-primary dark:text-white rounded-full px-2 py-0.5 text-xs">{questions.length}</span>}
              </button>
              <button 
                className={`py-3 px-6 ${currentTab === 'vistaPrevia' ? 'bg-primary dark:bg-primary-light text-white font-bold' : 'text-text-muted dark:text-text-dark hover:bg-highlight dark:hover:bg-secondary-dark'}`}
                onClick={() => changeTab('vistaPrevia')}
              >
                Vista Previa
              </button>
            </div>
            
            <div>
              {currentTab === 'información' && <InformationTab />}
              {currentTab === 'preguntas' && <QuestionsTab />}
              {currentTab === 'vistaPrevia' && <PreviewTab />}
            </div>
            
            <NavigationControls
              currentTab={currentTab}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              handleCancel={handleCancel}
              publishEvaluation={handlePublishConfirm}
              isPublished={formConfig.metadata.status === 'published'}
            />
            
            {/* Información sobre persistencia */}
            <div className="mt-6 bg-info-light dark:bg-info-dark/20 p-3 rounded border-l-4 border-info dark:border-info-light text-sm text-info-dark dark:text-info-light">
              <p>
                <strong>Nota:</strong> Los cambios se guardan automáticamente en tu navegador. Puedes cerrar esta página y volver más tarde para continuar donde lo dejaste.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Modales */}
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        message={alertMessage}
        variant={alertVariant}
      />
      
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={resetStore}
        title="Reiniciar formulario"
        message="¿Estás seguro de que deseas reiniciar completamente el formulario? Se perderán todos los datos ingresados hasta ahora."
      />
      
      <ConfirmModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={publishEvaluation}
        title="Publicar evaluación"
        message="¿Estás seguro de que deseas publicar esta evaluación? Una vez publicada, estará disponible para ser respondida."
      />
      
      <ConfirmModal
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        onConfirm={handleGenerateSignature}
        title="Firma digital requerida"
        message="Para publicar esta evaluación, es necesario generar una firma digital que garantice la integridad del documento. ¿Deseas generar la firma ahora?"
        icon={<FaFileSignature size={24} className="text-primary" />}
        confirmText="Generar firma"
      />

      {/* Modal para cargar borrador */}
      <ConfirmModal
        isOpen={draftLoadModalOpen}
        onClose={() => {
          setDraftLoadModalOpen(false);
          setTemplateModalOpen(true); // Si no carga el borrador, mostrar plantillas
        }}
        onConfirm={handleLoadDraft}
        title="Borrador disponible"
        message="Se encontró un borrador guardado. ¿Deseas cargarlo para continuar trabajando desde donde lo dejaste?"
        confirmText="Cargar borrador"
        cancelText="Empezar nuevo"
      />

      {/* Modal de selección de plantilla */}
      <FormModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          handleTemplateSelect(selectedTemplate);
        }}
        title="Seleccionar Plantilla"
      >
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Puedes comenzar con un formulario vacío o seleccionar una de nuestras plantillas predefinidas:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="radio"
                id="empty-template"
                name="template"
                value="empty"
                checked={selectedTemplate === 'empty'}
                onChange={() => setSelectedTemplate('empty')}
                className="mt-1 mr-3"
              />
              <label htmlFor="empty-template" className="cursor-pointer">
                <div className="font-medium text-gray-800 dark:text-gray-200">Formulario Vacío</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Comienza con un formulario sin preguntas para diseñar desde cero.
                </p>
              </label>
            </div>
            
            {templates.map((category, index) => (
              <div key={index} className="mt-4">
                <h3 className="font-medium text-primary dark:text-primary-light mb-2">
                  {category.category}
                </h3>
                <div className="space-y-3 ml-2">
                  {category.templates.map((template) => (
                    <div key={template.id} className="flex items-start">
                      <input
                        type="radio"
                        id={template.id}
                        name="template"
                        value={template.id}
                        checked={selectedTemplate === template.id}
                        onChange={() => setSelectedTemplate(template.id)}
                        className="mt-1 mr-3"
                      />
                      <label htmlFor={template.id} className="cursor-pointer">
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {template.name}
                          <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                            {template.questionCount} preguntas
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {template.description}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default EvaluationCreate;