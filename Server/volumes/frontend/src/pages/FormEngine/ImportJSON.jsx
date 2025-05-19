// ImportJSON.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UploadArea from './ImportJSON/UploadArea';
import JSONViewer from './ImportJSON/JSONViewer';
import JSONDefinition from './ImportJSON/JSONDefinition';
import AccordionMedia from '../../components/ui/Accordion/AccordionMedia';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';
import LoadingSpinner from '../../components/ui/spinners/LoadingSpinner';
import { ConfirmModal, AlertModal } from '../../components/ui/Modal/Modal';
import logger from '../../utils/logger';
import formEngineService from '../../services/formEngineService';

const ImportJSON = () => {
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(null);
  const [jsonContent, setJsonContent] = useState('');
  const [isValidForm, setIsValidForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasFileSelected, setHasFileSelected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para modales
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [importedFormId, setImportedFormId] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Función para validar la estructura del formulario JSON
  const validateFormStructure = (data) => {
    const errors = [];

    // Validaciones básicas de estructura
    if (!data?.configuration?.formConfig?.metadata?.id) {
      errors.push("Falta ID de formulario");
    }
    if (!data?.configuration?.formConfig?.metadata?.title) {
      errors.push("Falta título de formulario");
    }
    if (!data?.configuration?.questions || data.configuration.questions.length === 0) {
      errors.push("El formulario no contiene preguntas");
    }

    // Verificar preguntas duplicadas por ID
    const questionIds = new Set();
    data?.configuration?.questions?.forEach(q => {
      if (questionIds.has(q.id)) {
        errors.push(`ID de pregunta duplicado: ${q.id}`);
      }
      questionIds.add(q.id);
    });

    // Verificar que cada pregunta tenga la estructura correcta
    data?.configuration?.questions?.forEach((question, index) => {
      if (!question.id) errors.push(`Pregunta ${index + 1}: Falta ID`);
      if (!question.title) errors.push(`Pregunta ${index + 1}: Falta título`);
      if (!question.question?.type) errors.push(`Pregunta ${index + 1}: Falta tipo de pregunta`);
    });

    return errors;
  };

  const processFile = async (file) => {
    setHasFileSelected(true);
    // Pequeño delay para permitir que la animación comience
    setTimeout(() => {
      setIsProcessing(true);
    }, 300);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);

        // Simular un pequeño delay para mostrar el spinner más claramente
        setTimeout(() => {
          setJsonData(parsedData);
          setJsonContent(JSON.stringify(parsedData, null, 2));

          // Validar la estructura del JSON
          const errors = validateFormStructure(parsedData);
          setValidationErrors(errors);
          setIsValidForm(errors.length === 0);
          setIsProcessing(false);
        }, 1000);

      } catch (error) {
        toast.error('Error al procesar el archivo JSON');
        setIsValidForm(false);
        setValidationErrors(['El archivo no es un JSON válido']);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      toast.error('Error al leer el archivo');
      setIsProcessing(false);
      setHasFileSelected(false);
    };

    reader.readAsText(file);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    processFile(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = async () => {
    if (jsonData && isValidForm) {
      try {
        setIsSaving(true);
        
        // Preparar los datos para guardar
        // Asegurarnos de que el estado sea 'draft' independientemente de lo que tenga el JSON
        const formDataToSave = {
          ...jsonData,
          configuration: {
            ...jsonData.configuration,
            formConfig: {
              ...jsonData.configuration.formConfig,
              metadata: {
                ...jsonData.configuration.formConfig.metadata,
                status: 'draft',  // Forzar estado borrador
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
          }
        };
        
        logger.info('ImportJSON', 'Guardando formulario en la base de datos');
        
        // Llamar al servicio para guardar el formulario
        const response = await formEngineService.importFormFromJson(formDataToSave);
        
        // Guardar el ID para usarlo en la redirección
        setImportedFormId(response.id || response.uuid);
        
        // Mostrar modal de éxito
        setIsSuccessModalOpen(true);
        
      } catch (error) {
        // Preparar mensaje de error para modal
        setErrorMessage(error.message || 'Error desconocido al importar el formulario');
        setIsErrorModalOpen(true);
        logger.error('ImportJSON', 'Error al guardar formulario:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Si hay errores, mostrar una notificación
      toast.error('Por favor, corrige los errores antes de guardar el formulario');
    }
  };

  // Función para navegar al formulario importado
  const navigateToForm = () => {
    if (importedFormId) {
      navigate(`/FormEngine/CreateEvaluation/${importedFormId}`);
    }
    setIsSuccessModalOpen(false);
  };

  // Función para reiniciar el componente
  const resetComponent = () => {
    setJsonData(null);
    setJsonContent('');
    setIsValidForm(false);
    setValidationErrors([]);
    setSelectedFile(null);
    setHasFileSelected(false);
    setIsSaving(false);
    setImportedFormId(null);
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      {/* Contenedor principal con animación */}
      <div className={`transition-all duration-500 ease-in-out ${hasFileSelected ? 'grid grid-cols-12 gap-6' : ''}`}>
        {/* Upload Area - Se anima a la izquierda cuando se selecciona un archivo */}
        <div className={`transition-all duration-500 ease-in-out ${hasFileSelected ? 'col-span-2' : 'w-full'}`}>
          <div className="relative">
            <UploadArea
              onFileSelect={handleFileSelect}
              height="250px"
              width="100%"
            />
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-background-dark/80 rounded-lg">
                <LoadingSpinner
                  size="xl"
                  message="Procesando..."
                  overlay={false}
                />
              </div>
            )}
          </div>

          {/* Información del archivo - Se muestra después de seleccionar */}
          {selectedFile && !isProcessing && (
            <div className="mt-4 space-y-2 transition-all duration-300 ease-in-out">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Archivo: <span className="font-normal">{selectedFile.name}</span>
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tamaño: <span className="font-normal">{formatFileSize(selectedFile.size)}</span>
                </p>
                <p className={`text-sm font-medium ${isValidForm ? 'text-success' : 'text-danger'}`}>
                  Estado: <span className="font-normal">
                    {isValidForm ? 'Formato válido ✓' : 'Formato inválido ✗'}
                  </span>
                </p>
              </div>

              {/* Botón guardar */}
              {jsonData && (
                <button
                  onClick={handleSave}
                  disabled={!isValidForm || isSaving}
                  className={`w-full px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2
                    ${isValidForm && !isSaving
                      ? 'bg-success text-white hover:bg-success-dark cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="xs" />
                      <span>Procesando importación...</span>
                    </>
                  ) : (
                    <>
                      <IconResolve_RI name="RiSave3Line" size={20} />
                      <span>Guardar como Borrador</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: acordeones - Se muestran con animación */}
        {hasFileSelected && jsonData && (
          <div className="col-span-10 transition-all duration-500 ease-in-out opacity-0"
            style={{ animation: 'fadeIn 0.5s ease-in-out 0.3s forwards' }}>
            {/* Mostrar errores de validación si existen */}
            {validationErrors.length > 0 && (
              <div className="bg-danger-light border border-danger rounded-lg p-4 mb-4">
                <h3 className="text-danger font-semibold mb-2">Errores de validación:</h3>
                <ul className="list-disc pl-5">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-danger text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4">
              {/* Acordeón para definición JSON */}
              <AccordionMedia
                title="Definición del JSON"
                isEditable={false}
                isDeleted={false}
                isDraggable={false}
                isOpen={true}
                contentHeight="600px"
              >
                <JSONDefinition data={jsonData} className="h-full overflow-auto w-full" />
              </AccordionMedia>
            </div>

            {/* Acordeón para contenido JSON */}
            <div className="mb-4">
              <AccordionMedia
                title="Contenido JSON"
                isEditable={false}
                isDeleted={false}
                isDraggable={false}
                isOpen={false}
                contentHeight="600px"
              >
                <JSONViewer
                  content={jsonContent}
                  height="100%"
                  maxHeight="none"
                  className="h-full"
                />
              </AccordionMedia>
            </div>
          </div>
        )}
      </div>

      {/* Modal de éxito */}
      <ConfirmModal
        isOpen={isSuccessModalOpen}
        onClose={resetComponent}
        onConfirm={navigateToForm}
        title="Importación Exitosa"
        message="El formulario se ha importado correctamente. ¿Desea acceder al editor para continuar trabajando con este formulario?"
      />

      {/* Modal de error */}
      <AlertModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={errorMessage}
        variant="error"
      />

      {/* Agregar estilos para la animación de fadeIn */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ImportJSON;