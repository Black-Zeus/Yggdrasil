import React, { useEffect, useState } from 'react';
import FormQuestion from '../../../components/questionsType/FormQuestion';
import AccordionMedia from '../../../components/ui/Accordion/AccordionMedia';
import Button from '../../../components/atoms/Button';
import useFormEngineStore from '../../../store/formEngineStore';
import QuestionConfigModal from './QuestionConfigModal';
import { AlertModal } from '../../../components/ui/Modal/Modal';
import useQuestionTypes from '../../../hooks/useQuestionTypes';

const QuestionsTab = () => {
    // Obtener los tipos de preguntas desde el custom hook
    const { questionTypes, getTypeByName } = useQuestionTypes();
    
    // Obtener el estado y las acciones del store
    const { 
        getQuestions,
        getFormConfig,
        addQuestion, 
        deleteQuestion,
        updateQuestion, 
        reorderQuestions,
        isLoading
    } = useFormEngineStore();
    
    // Obtener preguntas y formulario
    const questions = getQuestions();
    const formConfig = getFormConfig();
    
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    
    // Estado para el modal de configuración
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState(null);
    const [selectedTypeInfo, setSelectedTypeInfo] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null); // Para edición de preguntas existentes
    
    // Estado para alertas
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('info');

    // Función para obtener el texto descriptivo de un tipo de pregunta
    const getTypeText = (typeName) => {
        const typeMap = {
            'text': 'Texto Simple',
            'textarea': 'Texto Largo',
            'dropdown': 'Lista Desplegable',
            'single_choice': 'Selección Única',
            'multiple_choice': 'Selección Múltiple',
            'date': 'Fecha',
            'time': 'Hora',
            'range': 'Rango Numérico',
            'file_upload': 'Subida de Archivo',
            'yes_no': 'Sí/No',
            'matrix': 'Matriz',
            'ranking': 'Ranking',
            'email': 'Correo Electrónico'
        };
        return typeMap[typeName] || typeName;
    };

    // Manejar la selección de tipo de pregunta para abrir el modal
    const handleSelectQuestionType = (type, typeInfo) => {
        setSelectedQuestionType(type);
        setSelectedTypeInfo(typeInfo);
        setEditingQuestion(null); // Asegurar que no estamos en modo edición
        setModalOpen(true);
    };
    
    // Función para abrir el modal de edición para una pregunta existente
    const handleEditQuestionViaModal = (question) => {
        setSelectedQuestionType(question.question.type);
        setSelectedTypeInfo(getTypeByName(question.question.type));
        setEditingQuestion(question); // Almacenar la pregunta que estamos editando
        setModalOpen(true);
    };
    
    // Manejar la adición o actualización de una pregunta desde el modal
    const handleSaveQuestion = (questionConfig) => {
        if (editingQuestion) {
            // Si estamos editando una pregunta existente
            const updatedQuestion = {
                ...editingQuestion,
                title: questionConfig.title,
                description: questionConfig.description,
                question: {
                    ...editingQuestion.question,
                    required: questionConfig.question?.required || false,
                    prompt: questionConfig.question?.prompt || questionConfig.title,
                }
            };
            
            // Añadir propiedades específicas según el tipo
            switch (editingQuestion.question.type) {
                case 'dropdown':
                case 'single_choice':
                case 'multiple_choice':
                    updatedQuestion.question.options = questionConfig.question?.options || editingQuestion.question.options;
                    break;
                
                case 'matrix':
                    updatedQuestion.question.items = questionConfig.question?.items || editingQuestion.question.items;
                    updatedQuestion.question.options = questionConfig.question?.options || editingQuestion.question.options;
                    break;
                
                case 'ranking':
                    updatedQuestion.question.items = questionConfig.question?.items || editingQuestion.question.items;
                    break;
                
                case 'range':
                    updatedQuestion.question.min = questionConfig.question?.min !== undefined ? questionConfig.question.min : editingQuestion.question.min;
                    updatedQuestion.question.max = questionConfig.question?.max !== undefined ? questionConfig.question.max : editingQuestion.question.max;
                    updatedQuestion.question.step = questionConfig.question?.step !== undefined ? questionConfig.question.step : editingQuestion.question.step;
                    break;
                
                case 'date':
                    updatedQuestion.question.format = questionConfig.question?.format || editingQuestion.question.format;
                    updatedQuestion.question.minDate = questionConfig.question?.minDate;
                    updatedQuestion.question.maxDate = questionConfig.question?.maxDate;
                    break;
                
                case 'time':
                    updatedQuestion.question.format = questionConfig.question?.format || editingQuestion.question.format;
                    updatedQuestion.question.is24Hour = questionConfig.question?.is24Hour !== undefined ? 
                        questionConfig.question.is24Hour : editingQuestion.question.is24Hour;
                    break;
                
                case 'yes_no':
                    updatedQuestion.question.yesLabel = questionConfig.question?.yesLabel || 'Sí';
                    updatedQuestion.question.noLabel = questionConfig.question?.noLabel || 'No';
                    break;
            }
            
            // Actualizar la pregunta en el store
            updateQuestion(editingQuestion.id, updatedQuestion);
            setAlertMessage(`Pregunta "${updatedQuestion.title}" actualizada correctamente`);
            setAlertVariant('success');
            setEditingQuestion(null); // Limpiar el estado de edición
        } else {
            // Si estamos creando una nueva pregunta
            const newQuestion = addQuestion(selectedQuestionType, questionConfig);
            setAlertMessage(`Pregunta de tipo "${getTypeText(selectedQuestionType)}" añadida correctamente`);
            setAlertVariant('success');
        }
        
        setAlertOpen(true);
    };

    // Función para manejar cambios en el valor de una pregunta
    const handleQuestionValueChange = (questionId, value) => {
        updateQuestion(questionId, { value });
    };

    // Funciones para manejar el arrastre y reordenamiento
    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        // Añadir estilos visuales si es necesario
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        
        if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
            return;
        }
        
        // Usar la función del store para reordenar
        reorderQuestions(draggedItemIndex, dropIndex);
        setDraggedItemIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    // Función para eliminar una pregunta
    const handleDeleteQuestion = (id) => {
        deleteQuestion(id);
        setAlertMessage("La pregunta ha sido eliminada");
        setAlertVariant('warning');
        setAlertOpen(true);
    };

    // Función para ediciones simples en línea (no mediante el modal)
    const handleQuickEditQuestion = (id, data) => {
        // Asegurémonos de que estamos manteniendo la estructura correcta
        const updatedData = { ...data };
        
        // Si el objeto question no existe y estamos tratando de actualizar required
        if (data['question.required'] !== undefined && !updatedData.question) {
            const question = questions.find(q => q.id === id)?.question || {};
            updatedData.question = {
                ...question,
                required: data['question.required']
            };
            delete updatedData['question.required'];
        }
        
        updateQuestion(id, updatedData);
        setAlertMessage("Cambios guardados");
        setAlertVariant('info');
        setAlertOpen(true);
    };

    // Determinar si un tipo de pregunta debe usar edición avanzada
    const shouldUseAdvancedEdit = (questionType) => {
        // Tipos complejos que siempre deben usar el modal completo para edición
        const complexTypes = [
            'dropdown', 
            'single_choice', 
            'multiple_choice', 
            'date', 
            'time', 
            'range', 
            'matrix', 
            'ranking', 
            'yes_no'
        ];
        
        return complexTypes.includes(questionType);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary dark:text-primary-light">Añadir Preguntas</h2>
                
                {/* Información del formulario */}
                <div className="text-sm">
                    <span className="text-text-muted dark:text-text-dark">
                        {formConfig.metadata.title}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-white text-xs ${
                        formConfig.metadata.status === 'published' ? 'bg-success' : 
                        formConfig.metadata.status === 'draft' ? 'bg-warning' : 'bg-primary'
                    }`}>
                        {formConfig.metadata.status === 'published' ? 'Publicado' : 
                         formConfig.metadata.status === 'draft' ? 'Borrador' : 'Nuevo'}
                    </span>
                </div>
            </div>

            {/* Sección de botones para añadir preguntas - siempre visible */}
            <div className="border border-dashed border-border dark:border-border-dark rounded-lg p-4 mb-4 bg-highlight dark:bg-secondary-dark">
                <h3 className="text-md font-medium mb-3 text-text dark:text-text-dark">
                    Selecciona un tipo de pregunta para añadir:
                </h3>

                {/* Grilla con botones uniformes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {questionTypes.map((questionType) => (
                        <div key={questionType.type} title={questionType.description}>
                            <Button
                                text={questionType.text}
                                icon={questionType.icon}
                                onClick={() => handleSelectQuestionType(questionType.type, questionType)}
                                size="sm"
                                bgColor="bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary w-full"
                                textColor="text-white"
                                className="w-[160px] min-h-[40px] flex items-center justify-center text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de lista de preguntas */}
            <div className="border border-dashed border-border dark:border-border-dark rounded-lg p-6 mb-6 bg-highlight dark:bg-secondary-dark">
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-text-muted dark:text-text-dark mb-4 text-center">
                            Aún no has añadido ninguna pregunta a esta evaluación.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((question, index) => (
                            <div 
                                key={question.id}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`
                                    transition-all duration-200
                                    ${draggedItemIndex === index ? 'opacity-50' : 'opacity-100'}
                                    ${draggedItemIndex !== null && draggedItemIndex !== index ? 'border-t-2 border-primary' : ''}
                                `}
                            >
                                <AccordionMedia
                                    title={`${index + 1}.- ${question.title} (${getTypeText(question.question.type)})`}
                                    isDraggable={true}
                                    onDragStart={() => handleDragStart(index)}
                                    onDragEnd={handleDragEnd}
                                    onDelete={() => handleDeleteQuestion(question.id)}
                                    onEdit={(data) => handleQuickEditQuestion(question.id, data)}
                                    onEditViaModal={() => handleEditQuestionViaModal(question)}
                                    editData={question}
                                    editFields={[
                                        { name: 'title', label: 'Título', type: 'text' },
                                        { name: 'description', label: 'Descripción', type: 'text' },
                                        { name: 'question.required', label: '¿Es obligatoria?', type: 'checkbox' }
                                    ]}
                                >
                                    <div className="relative">
                                        {shouldUseAdvancedEdit(question.question.type) && (
                                            <div className="hidden absolute right-0 top-0 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs text-blue-600 dark:text-blue-300 mb-2">
                                                Use el botón de edición avanzada ⚙️ para configurar todas las opciones
                                            </div>
                                        )}
                                        <FormQuestion
                                            question={question}
                                            onValueChange={(value) => handleQuestionValueChange(question.id, value)}
                                        />
                                    </div>
                                </AccordionMedia>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <div className="bg-info-light dark:bg-info-dark/20 p-4 rounded border-l-4 border-info dark:border-info-dark mb-8 flex-1 mr-4">
                    <p className="text-info-dark dark:text-info-light text-sm">
                        <strong>Consejo:</strong> Puedes arrastrar las preguntas para cambiar su orden. Para preguntas complejas, 
                        usa el botón de edición avanzada <span className="inline-block bg-green-100 dark:bg-green-900/30 px-1 rounded">⚙️</span> para configurar todas las opciones.
                    </p>
                </div>
                
                <div className="bg-success-light dark:bg-success-dark/20 p-4 rounded border-l-4 border-success dark:border-success-light mb-8 flex-1 ml-4">
                    <p className="text-success-dark dark:text-success-light text-sm">
                        <strong>Estado:</strong> Tienes {questions.length} pregunta(s) en esta evaluación.
                        {formConfig.metadata.status === 'published' && " Este formulario ya está publicado."}
                    </p>
                </div>
            </div>

            {/* Modal de configuración de pregunta */}
            <QuestionConfigModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingQuestion(null); // Limpiar estado de edición al cerrar
                }}
                questionType={selectedQuestionType}
                questionTypeInfo={selectedTypeInfo}
                questionData={editingQuestion} // Pasar la pregunta que estamos editando
                onSave={handleSaveQuestion}
                isEditing={!!editingQuestion} // Indicar si estamos en modo edición
            />
            
            {/* Modal de alerta para operaciones exitosas */}
            <AlertModal
                isOpen={alertOpen}
                onClose={() => setAlertOpen(false)}
                message={alertMessage}
                variant={alertVariant}
            />
        </div>
    );
};

export default QuestionsTab;