
import React, { useState, useEffect } from 'react';
import { FormModal } from '../../../components/ui/Modal/Modal';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';
import useQuestionTypes from '../../../hooks/useQuestionTypes';
import AccordionMedia from '../../../components/ui/Accordion/AccordionMedia';

const QuestionConfigModal = ({ 
    isOpen, 
    onClose, 
    questionType, 
    onSave, 
    questionTypeInfo, 
    questionData = null, // Datos de la pregunta en caso de edición
    isEditing = false // Si estamos en modo edición
}) => {
    // Obtenemos la información de tipos de preguntas desde el hook
    const { getTypeByName } = useQuestionTypes();

    // Si no recibimos questionTypeInfo, intentamos obtenerlo del hook
    const typeInfo = questionTypeInfo || (questionType ? getTypeByName(questionType) : null);

    const [questionConfig, setQuestionConfig] = useState({
        title: '',
        description: '',
        required: false,
    });

    // Opciones para tipos de preguntas que las requieren
    const [options, setOptions] = useState([
        { id: `option_${Date.now()}_1`, value: 'opcion1', label: 'Opción 1' }
    ]);

    // Items para matriz o ranking
    const [items, setItems] = useState([
        { id: `item_${Date.now()}_1`, label: 'Item 1' }
    ]);

    // Opciones específicas para matriz (eje X)
    const [matrixOptions, setMatrixOptions] = useState([
        { id: `matrix_option_${Date.now()}_1`, value: 'excelente', label: 'Excelente' },
        { id: `matrix_option_${Date.now()}_2`, value: 'bueno', label: 'Bueno' },
        { id: `matrix_option_${Date.now()}_3`, value: 'regular', label: 'Regular' },
        { id: `matrix_option_${Date.now()}_4`, value: 'deficiente', label: 'Deficiente' }
    ]);

    // Propiedades específicas para rango
    const [rangeProps, setRangeProps] = useState({
        min: 0,
        max: 10,
        step: 1
    });

    // Propiedades para campos específicos
    const [dateProps, setDateProps] = useState({
        format: 'DD/MM/YYYY',
        minDate: '',
        maxDate: ''
    });

    const [timeProps, setTimeProps] = useState({
        format: 'HH:MM',
        is24Hour: true
    });

    // Opciones para preguntas tipo yes_no
    const [yesNoLabels, setYesNoLabels] = useState({
        yesLabel: 'Sí',
        noLabel: 'No'
    });

    // Cargar datos en el formulario cuando se abre o cambian los datos de edición
    useEffect(() => {
        if (isOpen) {
            if (isEditing && questionData) {
                // Modo edición: cargar datos de la pregunta existente
                setQuestionConfig({
                    title: questionData.title || '',
                    description: questionData.description || '',
                    required: questionData.question?.required || false,
                });

                // Cargar opciones específicas según el tipo de pregunta
                switch (questionType) {
                    case 'dropdown':
                    case 'single_choice':
                    case 'multiple_choice':
                        if (questionData.question.options && questionData.question.options.length > 0) {
                            // Generar IDs únicos para las opciones (para la interfaz)
                            const loadedOptions = questionData.question.options.map((opt, index) => ({
                                id: `option_${Date.now()}_${index}`,
                                value: opt.value,
                                label: opt.label
                            }));
                            setOptions(loadedOptions);
                        } else {
                            setOptions([
                                { id: `option_${Date.now()}_1`, value: 'opcion1', label: 'Opción 1' },
                                { id: `option_${Date.now()}_2`, value: 'opcion2', label: 'Opción 2' }
                            ]);
                        }
                        break;

                    case 'matrix':
                        if (questionData.question.items && questionData.question.items.length > 0) {
                            // Generar IDs únicos para los items (para la interfaz)
                            const loadedItems = questionData.question.items.map((item, index) => ({
                                id: item.id || `item_${Date.now()}_${index}`,
                                label: item.label
                            }));
                            setItems(loadedItems);
                        } else {
                            setItems([
                                { id: `item_${Date.now()}_1`, label: 'Item 1' },
                                { id: `item_${Date.now()}_2`, label: 'Item 2' }
                            ]);
                        }
                        
                        if (questionData.question.options && questionData.question.options.length > 0) {
                            // Generar IDs únicos para las opciones (para la interfaz)
                            const loadedMatrixOptions = questionData.question.options.map((opt, index) => ({
                                id: `matrix_option_${Date.now()}_${index}`,
                                value: opt.value,
                                label: opt.label
                            }));
                            setMatrixOptions(loadedMatrixOptions);
                        } else {
                            setMatrixOptions([
                                { id: `matrix_option_${Date.now()}_1`, value: 'excelente', label: 'Excelente' },
                                { id: `matrix_option_${Date.now()}_2`, value: 'bueno', label: 'Bueno' },
                                { id: `matrix_option_${Date.now()}_3`, value: 'regular', label: 'Regular' },
                                { id: `matrix_option_${Date.now()}_4`, value: 'deficiente', label: 'Deficiente' }
                            ]);
                        }
                        break;

                    case 'ranking':
                        if (questionData.question.items && questionData.question.items.length > 0) {
                            // Si es un array de strings
                            if (typeof questionData.question.items[0] === 'string') {
                                setItems(questionData.question.items.map((item, index) => ({
                                    id: `item_${Date.now()}_${index}`,
                                    label: item
                                })));
                            } else {
                                // Si es un array de objetos
                                const loadedItems = questionData.question.items.map((item, index) => ({
                                    id: item.id || `item_${Date.now()}_${index}`,
                                    label: item.label || item
                                }));
                                setItems(loadedItems);
                            }
                        } else {
                            setItems([
                                { id: `item_${Date.now()}_1`, label: 'Item 1' },
                                { id: `item_${Date.now()}_2`, label: 'Item 2' },
                                { id: `item_${Date.now()}_3`, label: 'Item 3' }
                            ]);
                        }
                        break;

                    case 'range':
                        setRangeProps({
                            min: questionData.question.min !== undefined ? questionData.question.min : 0,
                            max: questionData.question.max !== undefined ? questionData.question.max : 10,
                            step: questionData.question.step !== undefined ? questionData.question.step : 1
                        });
                        break;

                    case 'date':
                        // Cargar propiedades de fecha
                        if (questionData.question.format) {
                            setDateProps({
                                format: questionData.question.format || 'DD/MM/YYYY',
                                minDate: questionData.question.minDate || '',
                                maxDate: questionData.question.maxDate || ''
                            });
                        }
                        break;

                    case 'time':
                        // Cargar propiedades de tiempo
                        if (questionData.question.format) {
                            setTimeProps({
                                format: questionData.question.format || 'HH:MM',
                                is24Hour: questionData.question.is24Hour !== false
                            });
                        }
                        break;

                    case 'yes_no':
                        // Cargar etiquetas de Sí/No
                        if (questionData.question.yesLabel || questionData.question.noLabel) {
                            setYesNoLabels({
                                yesLabel: questionData.question.yesLabel || 'Sí',
                                noLabel: questionData.question.noLabel || 'No'
                            });
                        }
                        break;
                }
            } else {
                // Modo creación: valores por defecto
                setQuestionConfig({
                    title: `Nueva pregunta de tipo ${typeInfo?.text || getQuestionTypeText(questionType)}`,
                    description: '',
                    required: false,
                });

                // Valores por defecto según el tipo
                switch (questionType) {
                    case 'dropdown':
                    case 'single_choice':
                    case 'multiple_choice':
                        setOptions([
                            { id: `option_${Date.now()}_1`, value: 'opcion1', label: 'Opción 1' },
                            { id: `option_${Date.now()}_2`, value: 'opcion2', label: 'Opción 2' }
                        ]);
                        break;

                    case 'matrix':
                        setItems([
                            { id: `item_${Date.now()}_1`, label: 'Item 1' },
                            { id: `item_${Date.now()}_2`, label: 'Item 2' }
                        ]);
                        setMatrixOptions([
                            { id: `matrix_option_${Date.now()}_1`, value: 'excelente', label: 'Excelente' },
                            { id: `matrix_option_${Date.now()}_2`, value: 'bueno', label: 'Bueno' },
                            { id: `matrix_option_${Date.now()}_3`, value: 'regular', label: 'Regular' },
                            { id: `matrix_option_${Date.now()}_4`, value: 'deficiente', label: 'Deficiente' }
                        ]);
                        break;

                    case 'ranking':
                        setItems([
                            { id: `item_${Date.now()}_1`, label: 'Item 1' },
                            { id: `item_${Date.now()}_2`, label: 'Item 2' },
                            { id: `item_${Date.now()}_3`, label: 'Item 3' }
                        ]);
                        break;

                    case 'range':
                        setRangeProps({
                            min: 0,
                            max: 10,
                            step: 1
                        });
                        break;

                    case 'date':
                        setDateProps({
                            format: 'DD/MM/YYYY',
                            minDate: '',
                            maxDate: ''
                        });
                        break;

                    case 'time':
                        setTimeProps({
                            format: 'HH:MM',
                            is24Hour: true
                        });
                        break;

                    case 'yes_no':
                        setYesNoLabels({
                            yesLabel: 'Sí',
                            noLabel: 'No'
                        });
                        break;
                }
            }
        }
    }, [isOpen, questionType, isEditing, questionData, typeInfo]);

    // No renderizar nada si no hay tipo seleccionado
    if (!questionType) return null;

    // Función para obtener el texto legible del tipo de pregunta
    function getQuestionTypeText(type) {
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
        return typeMap[type] || type;
    }

    // Manejar cambios en los campos básicos
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuestionConfig({
            ...questionConfig,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Manejar cambios en campos específicos
    const handleDatePropsChange = (e) => {
        const { name, value } = e.target;
        setDateProps(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimePropsChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTimeProps(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleYesNoLabelsChange = (e) => {
        const { name, value } = e.target;
        setYesNoLabels(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Añadir una nueva opción
    const handleAddOption = () => {
        const newOption = {
            id: `option_${Date.now()}_${options.length + 1}`,
            value: `opcion${options.length + 1}`,
            label: `Opción ${options.length + 1}`
        };
        setOptions([...options, newOption]);
    };

    // Eliminar una opción
    const handleRemoveOption = (id) => {
        if (options.length > 1) {
            setOptions(options.filter(option => option.id !== id));
        } else {
            alert('Debe haber al menos una opción');
        }
    };

    // Actualizar una opción
    const handleOptionChange = (id, value) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, label: value } : option
        ));
    };

    // Añadir una nueva opción de matriz (eje X)
    const handleAddMatrixOption = () => {
        const newOption = {
            id: `matrix_option_${Date.now()}_${matrixOptions.length + 1}`,
            value: `opcion${matrixOptions.length + 1}`,
            label: `Opción ${matrixOptions.length + 1}`
        };
        setMatrixOptions([...matrixOptions, newOption]);
    };

    // Eliminar una opción de matriz
    const handleRemoveMatrixOption = (id) => {
        if (matrixOptions.length > 1) {
            setMatrixOptions(matrixOptions.filter(option => option.id !== id));
        } else {
            alert('Debe haber al menos una opción');
        }
    };

    // Actualizar una opción de matriz
    const handleMatrixOptionChange = (id, value) => {
        setMatrixOptions(matrixOptions.map(option =>
            option.id === id ? { ...option, label: value } : option
        ));
    };

    // Añadir un nuevo item para matriz o ranking
    const handleAddItem = () => {
        const newItem = {
            id: `item_${Date.now()}_${items.length + 1}`,
            label: `Item ${items.length + 1}`
        };
        setItems([...items, newItem]);
    };

    // Eliminar un item
    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        } else {
            alert('Debe haber al menos un item');
        }
    };

    // Actualizar un item
    const handleItemChange = (id, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, label: value } : item
        ));
    };

    // Manejar cambios en propiedades de rango
    const handleRangeChange = (e) => {
        const { name, value } = e.target;
        setRangeProps({
            ...rangeProps,
            [name]: parseInt(value, 10)
        });
    };

    // Crear y guardar la pregunta
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto

        // Validar que haya un título
        if (!questionConfig.title.trim()) {
            alert('El título de la pregunta es obligatorio');
            return;
        }

        // Ya no construimos aquí la estructura completa de la pregunta
        // Solo pasamos la configuración y dejamos que el store se encargue de la estructura
        const config = {
            title: questionConfig.title,
            description: questionConfig.description,
            question: {
                required: questionConfig.required,
                prompt: questionConfig.title
            }
        };

        // Añadir configuraciones específicas según el tipo
        switch (questionType) {
            case 'dropdown':
            case 'single_choice':
            case 'multiple_choice':
                config.question.options = options.map(opt => ({
                    value: opt.value,
                    label: opt.label
                }));
                break;

            case 'matrix':
                config.question.items = items.map(item => ({
                    id: item.id.replace(/^item_[0-9]+_/, ''),
                    label: item.label
                }));
                // Ahora también incluimos las opciones personalizadas para matriz
                config.question.options = matrixOptions.map(opt => ({
                    value: opt.value,
                    label: opt.label
                }));
                break;

            case 'ranking':
                config.question.items = items.map(item => item.label);
                break;

            case 'range':
                config.question.min = rangeProps.min;
                config.question.max = rangeProps.max;
                config.question.step = rangeProps.step;
                break;

            case 'date':
                config.question.format = dateProps.format;
                if (dateProps.minDate) config.question.minDate = dateProps.minDate;
                if (dateProps.maxDate) config.question.maxDate = dateProps.maxDate;
                break;

            case 'time':
                config.question.format = timeProps.format;
                config.question.is24Hour = timeProps.is24Hour;
                break;

            case 'yes_no':
                config.question.yesLabel = yesNoLabels.yesLabel;
                config.question.noLabel = yesNoLabels.noLabel;
                break;
        }

        onSave(config);
        onClose();
    };

    // Determinar título del modal y obtener el tipo de pregunta legible
    const questionTypeText = getQuestionTypeText(questionType);
    const modalTitle = isEditing 
        ? `Editar pregunta: ${questionData.title}`
        : `Configurar pregunta de tipo: ${typeInfo?.text || questionTypeText}`;

    // Obtener ícono según el tipo de pregunta
    const getTypeIcon = () => {
        switch (questionType) {
            case 'text': return <IconResolve_RI name="RiFontSize" size={18} />;
            case 'textarea': return <IconResolve_RI name="RiAlignLeft" size={18} />;
            case 'date': return <IconResolve_RI name="RiCalendarLine" size={18} />;
            case 'time': return <IconResolve_RI name="RiTimeLine" size={18} />;
            case 'yes_no': return <><IconResolve_RI name="RiThumbUpLine" size={16} className="mr-1" /><IconResolve_RI name="RiThumbDownLine" size={16} /></>;
            case 'file_upload': return <IconResolve_RI name="RiFileTextLine" size={18} />;
            default: return null;
        }
    };

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={(e) => handleSubmit(e)}
            title={modalTitle}
            submitText={isEditing ? "Guardar cambios" : "Crear pregunta"}
        >
            {/* Indicador de tipo de pregunta */}
            <div className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center">
                {getTypeIcon()}
                <span className="ml-2 font-medium">
                    Tipo: <span className="text-primary dark:text-primary-light">{questionTypeText}</span>
                </span>
            </div>

            {/* Campos básicos */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block font-medium mb-1 text-text dark:text-text-dark">
                        Título de la pregunta <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={questionConfig.title}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Ingrese el título de la pregunta"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1 text-text dark:text-text-dark">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={questionConfig.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-20"
                        placeholder="Ingrese una descripción opcional"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="required"
                        name="required"
                        checked={questionConfig.required}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="required" className="text-gray-700 dark:text-gray-300">
                        Esta pregunta es obligatoria
                    </label>
                </div>
            </div>

            {/* Configuración específica para Fecha */}
            {questionType === 'date' && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                        <IconResolve_RI name="RiCalendarLine" size={16} className="mr-2" />
                        Configuración de Fecha
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Formato
                            </label>
                            <select
                                name="format"
                                value={dateProps.format}
                                onChange={handleDatePropsChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                                <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                                <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Fecha mínima (opcional)
                            </label>
                            <input
                                type="date"
                                name="minDate"
                                value={dateProps.minDate}
                                onChange={handleDatePropsChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Fecha máxima (opcional)
                            </label>
                            <input
                                type="date"
                                name="maxDate"
                                value={dateProps.maxDate}
                                onChange={handleDatePropsChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Configuración específica para Hora */}
            {questionType === 'time' && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                        <IconResolve_RI name="RiTimeLine" size={16} className="mr-2" />
                        Configuración de Hora
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Formato
                            </label>
                            <select
                                name="format"
                                value={timeProps.format}
                                onChange={handleTimePropsChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="HH:MM">HH:MM (24 horas)</option>
                                <option value="hh:mm a">hh:mm AM/PM (12 horas)</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is24Hour"
                                name="is24Hour"
                                checked={timeProps.is24Hour}
                                onChange={handleTimePropsChange}
                                className="mr-2"
                            />
                            <label htmlFor="is24Hour" className="text-gray-700 dark:text-gray-300">
                                Usar formato de 24 horas
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Configuración específica para Sí/No */}
            {questionType === 'yes_no' && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                        <IconResolve_RI name="RiThumbUpLine" size={16} className="mr-1" />
                        <IconResolve_RI name="RiThumbDownLine" size={16} className="mr-2" />
                        Configuración de Sí/No
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Etiqueta para "Sí"
                            </label>
                            <input
                                type="text"
                                name="yesLabel"
                                value={yesNoLabels.yesLabel}
                                onChange={handleYesNoLabelsChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Sí"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Etiqueta para "No"
                            </label>
                            <input
                                type="text"
                                name="noLabel"
                                value={yesNoLabels.noLabel}
                                onChange={handleYesNoLabelsChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="No"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Configuración específica por tipo */}
            {['dropdown', 'single_choice', 'multiple_choice'].includes(questionType) && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Opciones
                    </h4>
                    <div className="space-y-3">
                        {options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={option.label}
                                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Texto de la opción"
                                />
                                <button
                                    onClick={() => handleRemoveOption(option.id)}
                                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                    title="Eliminar opción"
                                    type="button"
                                >
                                    <IconResolve_RI name="RiCloseLine" size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={handleAddOption}
                            className="mt-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
                            type="button"
                        >
                            <IconResolve_RI name="RiAddLine" size={16} className="mr-1" /> Añadir opción
                        </button>
                    </div>
                </div>
            )}

            {/* Configuración para matriz */}
            {questionType === 'matrix' && (
                <div className="space-y-6">
                    <AccordionMedia
                        title="Filas (Items)"
                        isDraggable={false}
                        isEditable={false}
                        isDeleted={false}
                    >
                        {/* Filas (eje Y) */}
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => handleItemChange(item.id, e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Texto del item"
                                    />
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                        title="Eliminar item"
                                        type="button"
                                    >
                                        <IconResolve_RI name="RiCloseLine" size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={handleAddItem}
                                className="mt-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
                                type="button"
                            >
                                <IconResolve_RI name="RiAddLine" size={16} className="mr-1" /> Añadir fila
                            </button>
                        </div>
                    </AccordionMedia>

                    {/* Columnas (eje X) */}
                    <AccordionMedia
                        title="Columnas (Opciones)"
                        isDraggable={false}
                        isEditable={false}
                        isDeleted={false}
                    >
                        <div className="space-y-3">
                            {matrixOptions.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) => handleMatrixOptionChange(option.id, e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Texto de la opción"
                                    />
                                    <button
                                        onClick={() => handleRemoveMatrixOption(option.id)}
                                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                        title="Eliminar opción"
                                        type="button"
                                    >
                                        <IconResolve_RI name="RiCloseLine"  size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={handleAddMatrixOption}
                                className="mt-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
                                type="button"
                            >
                                <IconResolve_RI name="RiAddLine" size={16} className="mr-1" /> Añadir columna
                            </button>
                        </div>
                    </AccordionMedia>
                </div>
            )}

            {/* Configuración para ranking */}
            {questionType === 'ranking' && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Items a ordenar
                    </h4>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => handleItemChange(item.id, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Texto del item"
                                />
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                    title="Eliminar item"
                                    type="button"
                                >
                                    <IconResolve_RI name="RiCloseLine"  size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={handleAddItem}
                            className="mt-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
                            type="button"
                        >
                            <IconResolve_RI name="RiAddLine" size={16} className="mr-1" /> Añadir item
                        </button>
                    </div>
                </div>
            )}

            {/* Configuración para rango */}
            {questionType === 'range' && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Configuración del rango
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Valor mínimo
                            </label>
                            <input
                                type="number"
                                name="min"
                                value={rangeProps.min}
                                onChange={handleRangeChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Valor máximo
                            </label>
                            <input
                                type="number"
                                name="max"
                                value={rangeProps.max}
                                onChange={handleRangeChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-text dark:text-text-dark">
                                Paso
                            </label>
                            <input
                                type="number"
                                name="step"
                                value={rangeProps.step}
                                onChange={handleRangeChange}
                                min="0.1"
                                step="0.1"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block font-medium mb-1 text-text dark:text-text-dark">
                            Vista previa:
                        </label>
                        <input
                            type="range"
                            min={rangeProps.min}
                            max={rangeProps.max}
                            step={rangeProps.step}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>{rangeProps.min}</span>
                            <span>{rangeProps.max}</span>
                        </div>
                    </div>
                </div>
            )}
        </FormModal>
    );
};

export default QuestionConfigModal;