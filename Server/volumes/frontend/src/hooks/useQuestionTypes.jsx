import React from 'react';
import IconResolve_RI from '../components/atoms/IconResolve_RI';

/**
 * Custom hook que proporciona los tipos de preguntas disponibles con sus iconos y descripciones
 * @returns {Array} Array de objetos con información de los tipos de preguntas
 */
const useQuestionTypes = () => {
    const questionTypes = [
        {
            type: 'text',
            icon: <IconResolve_RI name="RiFontSize" size={16} />,
            text: "Texto",
            description: "Campo para respuestas cortas"
        },
        {
            type: 'textarea',
            icon: <IconResolve_RI name="RiQuoteText" size={16} />,
            text: "Área de texto",
            description: "Para respuestas extensas"
        },
        {
            type: 'dropdown',
            icon: <IconResolve_RI name="RiListUnordered" size={16} />,
            text: "Desplegable",
            description: "Selección de una lista"
        },
        {
            type: 'single_choice',
            icon: <IconResolve_RI name="RiCheckboxFill" size={16} />,
            text: "Opción única",
            description: "Seleccionar solo una opción"
        },
        {
            type: 'multiple_choice',
            icon: <IconResolve_RI name="RiAlignLeft" size={16} />,
            text: "Selección múltiple",
            description: "Varias opciones posibles"
        },
        {
            type: 'date',
            icon: <IconResolve_RI name="RiCalendarLine" size={16} />,
            text: "Fecha",
            description: "Selección de un día"
        },
        {
            type: 'time',
            icon: <IconResolve_RI name="RiTimeLine" size={16} />,
            text: "Hora",
            description: "Selección de hora"
        },
        {
            type: 'range',
            icon: <IconResolve_RI name="RiSlideshowLine" size={16} />,
            text: "Rango",
            description: "Valor en una escala"
        },
        {
            type: 'file_upload',
            icon: <IconResolve_RI name="RiUploadCloud2Line" size={16} />,
            text: "Archivo",
            description: "Subir documentos"
        },
        {
            type: 'yes_no',
            icon: <IconResolve_RI name="RiThumbUpLine" size={16} />,
            text: "Sí/No",
            description: "Preguntas de confirmación"
        },
        {
            type: 'matrix',
            icon: <IconResolve_RI name="RiGridLine" size={16} />,
            text: "Matriz",
            description: "Evaluar varios aspectos"
        },
        {
            type: 'ranking',
            icon: <IconResolve_RI name="RiArrowUpDownLine" size={16} />,
            text: "Ranking",
            description: "Ordenar opciones por importancia"
        }
    ];

    // Función para obtener un tipo específico por su nombre
    const getTypeByName = (typeName) => {
        return questionTypes.find(type => type.type === typeName) || null;
    };

    // Funciones adicionales que podrían ser útiles
    const getGroupedTypes = () => {
        return {
            basic: questionTypes.filter(type => ['text', 'textarea', 'yes_no'].includes(type.type)),
            selection: questionTypes.filter(type => ['dropdown', 'single_choice', 'multiple_choice'].includes(type.type)),
            dateTime: questionTypes.filter(type => ['date', 'time'].includes(type.type)),
            advanced: questionTypes.filter(type => ['range', 'file_upload', 'matrix', 'ranking'].includes(type.type))
        };
    };

    return {
        questionTypes,
        getTypeByName,
        getGroupedTypes
    };
};

export default useQuestionTypes;