import React from 'react';
import { FaEye, FaPaperPlane, FaExclamationTriangle, FaSignature, FaCheckCircle, FaHistory, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import useFormEngineStore from '../../../store/formEngineStore';
import FormQuestion from '../../../components/questionsType/FormQuestion';

const PreviewTab = () => {
  // Obtener tanto la configuración del formulario como las preguntas desde el store
  const { 
    getFormConfig, 
    getQuestions, 
    getSignature,
    verifySignature
  } = useFormEngineStore();
  
  const formConfig = getFormConfig();
  const questions = getQuestions();
  const signature = getSignature();
  const signatureStatus = verifySignature();

  // Función para renderizar cada tipo de pregunta en el preview
  const renderQuestionPreview = (question, index) => {
    return (
      <div key={question.id} className="border-b border-border dark:border-border-dark py-4 last:border-b-0">
        <div className="mb-2">
          <span className="font-bold text-primary dark:text-primary-light">
            {index + 1}. 
          </span>
          <span className="font-semibold ml-2">{question.title}</span>
          {question.question.required && (
            <span className="text-danger dark:text-danger-light ml-1">*</span>
          )}
        </div>
        
        <div className="pl-6">
          <FormQuestion 
            question={question} 
            onValueChange={() => {}} 
            isPreview={true} 
          />
        </div>
      </div>
    );
  };

  // Renderizar área de firma si está habilitada
  const renderSignatureArea = () => {
    if (!formConfig.requirements.requireSignature) return null;
    
    return (
      <div className="border-t border-border dark:border-border-dark py-4 mt-4">
        <div className="mb-3">
          <span className="font-bold text-primary dark:text-primary-light flex items-center">
            <FaSignature className="mr-2" /> Firma del respondiente
          </span>
        </div>
        <div className="h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-text-muted dark:text-text-dark">
          <p className="text-center">Aquí aparecerá el área para la firma manual</p>
        </div>
      </div>
    );
  };

  // Renderizar información sobre la firma digital
  const renderDigitalSignature = () => {
    if (!signature.hash) return null;
    
    return (
      <div className={`mt-4 p-4 rounded-lg border ${signatureStatus.isValid ? 'border-success bg-success-light/20 dark:bg-success-dark/10' : 'border-warning bg-warning-light/20 dark:bg-warning-dark/10'}`}>
        <h4 className="font-semibold flex items-center mb-2">
          <FaShieldAlt className={`mr-2 ${signatureStatus.isValid ? 'text-success' : 'text-warning'}`} />
          Firma Digital
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Estado: </span>
            <span className={signatureStatus.isValid ? 'text-success' : 'text-warning'}>
              {signatureStatus.isValid ? 'Válida' : 'Inválida'}
            </span>
          </div>
          <div>
            <span className="font-medium">Algoritmo: </span>
            <span>{signature.algorithm}</span>
          </div>
          <div>
            <span className="font-medium">Generada: </span>
            <span>{new Date(signature.generatedAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium">Firmado por: </span>
            <span>{signature.signedBy}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-text-muted break-all">
          <span className="font-medium">Hash: </span>
          <span className="font-mono">{signature.hash}</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-primary dark:text-primary-light">Vista Previa de la Evaluación</h2>
      
      {/* Metadatos del formulario */}
      <div className="bg-background dark:bg-background-dark p-3 rounded-lg mb-4 text-sm flex justify-between">
        <div>
          <span className="font-medium text-text-muted">ID: </span>
          <span className="font-mono">{formConfig.metadata.id}</span>
        </div>
        <div>
          <span className="font-medium text-text-muted">Versión: </span>
          <span>{formConfig.metadata.version}</span>
        </div>
        <div>
          <span className={`px-2 py-0.5 rounded-full text-white ${
            formConfig.metadata.status === 'published' ? 'bg-success' : 
            formConfig.metadata.status === 'draft' ? 'bg-warning' : 
            formConfig.metadata.status === 'archived' ? 'bg-text-muted' : 'bg-danger'
          }`}>
            {formConfig.metadata.status === 'published' ? 'Publicado' : 
             formConfig.metadata.status === 'draft' ? 'Borrador' : 
             formConfig.metadata.status === 'archived' ? 'Archivado' : 'Obsoleto'}
          </span>
        </div>
      </div>
      
      <div className="bg-highlight dark:bg-secondary-dark rounded-lg p-6 border border-border dark:border-border-dark mb-6">
        <h3 className="text-lg font-bold mb-3 text-primary dark:text-primary-light">
          {formConfig.metadata.title || "Título de la Evaluación"}
        </h3>
        
        <div className="text-sm text-text-muted dark:text-text-dark mb-4">
          Categoría: {formConfig.category.display || "No especificada"}
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-text dark:text-text-dark">Descripción:</h4>
          <p className="text-text dark:text-text-dark">
            {formConfig.metadata.description || "No hay descripción disponible."}
          </p>
        </div>
        
        <div className="bg-background-light dark:bg-secondary-dark p-4 rounded border border-border dark:border-border-dark mb-6">
          {questions.length > 0 ? (
            <div>
              {questions.map((question, index) => renderQuestionPreview(question, index))}
              {renderSignatureArea()}
            </div>
          ) : (
            <p className="text-text-muted dark:text-text-dark italic text-center">
              No hay preguntas para mostrar en la vista previa.
            </p>
          )}
        </div>
        
        <div className="text-sm text-text-muted dark:text-text-dark grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          <div>
            <strong>Respuestas anónimas:</strong> {formConfig.visibility.allowAnonymous ? 'Permitidas' : 'No permitidas'}
          </div>
          <div>
            <strong>Correo institucional:</strong> {formConfig.visibility.requireInstitutionalEmail ? 'Requerido' : 'No requerido'}
          </div>
          <div>
            <strong>Respuestas por persona:</strong> {formConfig.visibility.limitOneResponsePerPerson ? 'Limitada a una' : 'Sin límite'}
          </div>
          <div>
            <strong>Firma manual:</strong> {formConfig.requirements.requireSignature ? 'Requerida' : 'No requerida'}
          </div>
          {(formConfig.timing.deadline || formConfig.timing.time) && (
            <div className="col-span-2">
              <strong>Fecha límite:</strong> {formConfig.timing.deadline} {formConfig.timing.time ? `a las ${formConfig.timing.time}` : ''}
            </div>
          )}
        </div>

        {/* Información de la firma digital */}
        {renderDigitalSignature()}
      </div>
      
      <div className="bg-warning-light dark:bg-warning-dark/20 p-4 rounded border-l-4 border-warning dark:border-warning-light mb-6">
        <p className="text-warning-dark dark:text-warning-light text-sm">
          <FaExclamationTriangle className="inline mr-2" />
          <strong>Nota:</strong> Esta es solo una vista previa. La evaluación no se publicará hasta que hagas clic en el botón "Publicar Evaluación".
        </p>
      </div>
      
      {/* Información histórica */}
      <div className="bg-info-light dark:bg-info-dark/20 p-4 rounded border-l-4 border-info dark:border-info-light mb-6">
        <h4 className="flex items-center font-semibold text-info dark:text-info-light mb-2">
          <FaHistory className="mr-2" /> Información del documento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-info-dark dark:text-info-light">
          <div>
            <strong>Creado:</strong> {new Date(formConfig.metadata.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Actualizado:</strong> {new Date(formConfig.metadata.updatedAt).toLocaleString()}
          </div>
          <div>
            <strong>Versión:</strong> {formConfig.metadata.version}
          </div>
        </div>
      </div>
      
      {questions.length > 0 && (
        <div className="bg-success-light dark:bg-success-dark/20 p-4 rounded border-l-4 border-success dark:border-success-light mb-6">
          <p className="text-success-dark dark:text-success-light text-sm">
            <FaCheckCircle className="inline mr-2" />
            <strong>Listo para publicar:</strong> Has añadido {questions.length} pregunta(s) a esta evaluación.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewTab;