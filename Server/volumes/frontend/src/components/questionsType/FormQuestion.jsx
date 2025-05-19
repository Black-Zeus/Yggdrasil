import React, { useState, useEffect } from 'react';
import useFormEngineStore from '../../store/formEngineStore';

// Importación de componentes individuales por tipo de pregunta
import TextQuestion from './TextQuestion';
import DropdownQuestion from './DropdownQuestion';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import DateQuestion from './DateQuestion';
import TimeQuestion from './TimeQuestion';
import RangeQuestion from './RangeQuestion';
import FileUploadQuestion from './FileUploadQuestion';
import YesNoQuestion from './YesNoQuestion';
import TextareaQuestion from './TextareaQuestion';
import MatrixQuestion from './MatrixQuestion';
import RankingQuestion from './RankingQuestion';

// Componente principal que determina qué tipo de componente renderizar
const FormQuestion = ({ question, onValueChange, isPreview = false }) => {
  // Obtener funciones del store para manipular las opciones (si es necesario)
  const { updateOptionInQuestion, addOptionToQuestion, deleteOptionFromQuestion } = useFormEngineStore();

  // Inicialización del valor basado en el tipo de pregunta
  const [value, setValue] = useState(() => {
    if (question.value !== undefined) return question.value;
    
    // Obtener el tipo de la estructura anidada
    const type = question.question?.type;
    
    switch (type) {
      case 'multiple_choice':
        return [];
      case 'matrix':
        return {};
      default:
        return '';
    }
  });

  // Actualizar el valor y notificar al padre
  const handleChange = (newValue) => {
    setValue(newValue);
    if (onValueChange && !isPreview) {
      onValueChange(question.id, newValue);
    }
  };

  // Función para manejar la adición de opciones en tipos de preguntas que lo permiten
  const handleAddOption = () => {
    if (!isPreview) {
      addOptionToQuestion(question.id);
    }
  };

  // Función para manejar la eliminación de opciones
  const handleDeleteOption = (optionId) => {
    if (!isPreview) {
      deleteOptionFromQuestion(question.id, optionId);
    }
  };

  // Función para manejar la edición de opciones
  const handleEditOption = (optionId, newText) => {
    if (!isPreview) {
      updateOptionInQuestion(question.id, optionId, newText);
    }
  };

  // Renderizar el componente adecuado según el tipo
  const renderQuestionComponent = () => {
    // Acceder correctamente a las propiedades según la estructura anidada
    const { id, title } = question;
    const questionData = question.question || {}; // Manejar el caso donde question es undefined
    const { type, required, prompt, options, items } = questionData;
    
    // Si estamos en modo vista previa, pasamos props adicionales
    const additionalProps = isPreview 
      ? { 
          disabled: true, 
          preview: true
        } 
      : { 
          onAddOption: handleAddOption,
          onDeleteOption: handleDeleteOption,
          onEditOption: handleEditOption
        };

    switch (type) {
      case 'text':
        return (
          <TextQuestion 
            id={id} 
            prompt={prompt} 
            required={required} 
            validation={question.validation}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'dropdown':
        return (
          <DropdownQuestion 
            id={id} 
            prompt={prompt} 
            required={required} 
            options={options || []}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'single_choice':
        return (
          <SingleChoiceQuestion 
            id={id} 
            prompt={prompt} 
            required={required} 
            options={options || []}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion 
            id={id} 
            prompt={prompt} 
            required={required} 
            options={options || []}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'date':
        return (
          <DateQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'time':
        return (
          <TimeQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'range':
        return (
          <RangeQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            value={value}
            min={question.min || 0}
            max={question.max || 10}
            step={question.step || 1}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'file_upload':
        return (
          <FileUploadQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'yes_no':
        return (
          <YesNoQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'textarea':
        return (
          <TextareaQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'matrix':
        return (
          <MatrixQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            items={items || []}
            options={options || []}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      case 'ranking':
        return (
          <RankingQuestion 
            id={id} 
            prompt={prompt} 
            required={required}
            items={items || []}
            value={value}
            onChange={handleChange}
            {...additionalProps}
          />
        );
      default:
        return <div>Tipo de pregunta no soportado: {type}</div>;
    }
  };

  return (
    <div className="mb-6 p-4 border border-border dark:border-border-dark rounded-lg bg-background-light dark:bg-secondary-dark">
      <div className="mb-2">
        <label htmlFor={question.id} className="block text-lg font-medium text-text dark:text-text-dark">
          {question.title} {question.required && <span className="text-danger dark:text-danger-light">*</span>}
        </label>
        {question.description && <p className="text-sm text-text-muted dark:text-text-dark">{question.description}</p>}
      </div>
      {renderQuestionComponent()}
      
      {/* Botones para añadir opciones (solo para ciertos tipos y no en vista previa) */}
      {!isPreview && ['dropdown', 'single_choice', 'multiple_choice'].includes(question.type) && (
        <div className="mt-2">
          <button 
            type="button" 
            onClick={handleAddOption}
            className="px-3 py-1 text-sm bg-primary-light dark:bg-primary text-primary dark:text-white rounded-md hover:bg-primary-lighter dark:hover:bg-primary-dark"
          >
            + Añadir opción
          </button>
        </div>
      )}
    </div>
  );
};

export default FormQuestion;