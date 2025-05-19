// ImportJSON/JSONDefinition.jsx
import React from 'react';

const JSONDefinition = ({ data, className = '' }) => {
    // Función para validar y extraer información de configuración del formulario
    const extractFormConfig = (config) => {
        if (!config?.formConfig) return null;

        const { metadata, category, visibility, timing, requirements } = config.formConfig;

        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Identificación del Formulario</h3>
                <div className="grid grid-cols-1 gap-2">
                    <p><span className="font-bold">ID:</span> {metadata?.id}</p>
                    <p><span className="font-bold">Título:</span> {metadata?.title}</p>
                    <p><span className="font-bold">Descripción:</span> {metadata?.description}</p>
                    <p><span className="font-bold">Versión:</span> {metadata?.version}</p>
                    <p><span className="font-bold">Estado:</span> {metadata?.status}</p>
                    <p><span className="font-bold">Categoría:</span> {category?.display}</p>
                    <p><span className="font-bold">Tipo de Visibilidad:</span> {visibility?.type}</p>
                    <p><span className="font-bold">Fecha Límite:</span> {timing?.deadline} {timing?.time}</p>
                    <p><span className="font-bold">Requerimiento Firma Manual:</span> {requirements?.requireSignature ? 'Sí' : 'No'}</p>
                </div>
            </div>
        );
    };

    // Función para agrupar y contar tipos de preguntas
    const analyzeQuestions = (questions) => {
        if (!questions) return null;

        const questionTypes = questions.reduce((acc, q) => {
            const type = q.question.type;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        const typeDescriptions = {
            'text': 'Texto libre',
            'dropdown': 'Lista desplegable',
            'single_choice': 'Selección única',
            'multiple_choice': 'Selección múltiple',
            'date': 'Fecha',
            'time': 'Hora',
            'range': 'Rango numérico',
            'file_upload': 'Carga de archivo',
            'yes_no': 'Sí/No',
            'textarea': 'Área de texto',
            'matrix': 'Matriz de evaluación',
            'ranking': 'Ranking (ordenamiento)'
        };

        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Análisis de Preguntas</h3>
                <p className="mb-2"><span className="font-bold">Total de preguntas:</span> {questions.length}</p>
                <br />
                <h3 className="text-lg font-semibold text-primary mb-3">Tipos de preguntas:</h3>
                <div className="grid grid-cols-1 gap-1">
                    {Object.entries(questionTypes).map(([type, count]) => (
                        <p key={type}>
                            <span className="font-bold">{typeDescriptions[type] || type}:</span> {count} pregunta{count !== 1 ? 's' : ''}
                        </p>
                    ))}
                </div>
            </div>
        );
    };

    // Función para validar reglas de tipos de preguntas
    const validateQuestionType = (question) => {
        const errors = [];

        // Reglas generales para todas las preguntas
        if (!question.type) errors.push("Falta el tipo de pregunta");
        if (!question.prompt) errors.push("Falta el prompt de la pregunta");

        // Reglas específicas por tipo
        switch (question.type) {
            case 'text':
                if (question.validation?.regex === 'email' && !question.validation?.errorMessage) {
                    errors.push("Se requiere mensaje de error para validación de email");
                }
                break;

            case 'dropdown':
            case 'single_choice':
            case 'multiple_choice':
                if (!question.options || question.options.length === 0) {
                    errors.push("Se requieren opciones para este tipo de pregunta");
                }
                question.options?.forEach((opt, idx) => {
                    if (!opt.value || !opt.label) {
                        errors.push(`Opción ${idx + 1} requiere value y label`);
                    }
                });
                break;

            case 'range':
                if (question.min === undefined) errors.push("Falta valor mínimo para rango");
                if (question.max === undefined) errors.push("Falta valor máximo para rango");
                if (question.step === undefined) errors.push("Falta step para rango");
                if (question.min >= question.max) errors.push("Valor mínimo debe ser menor que máximo");
                break;

            case 'matrix':
                if (!question.items || question.items.length === 0) {
                    errors.push("Se requieren items (filas) para matriz");
                }
                if (!question.options || question.options.length === 0) {
                    errors.push("Se requieren opciones (columnas) para matriz");
                }
                question.items?.forEach((item, idx) => {
                    if (!item.id || !item.label) {
                        errors.push(`Item ${idx + 1} requiere id y label`);
                    }
                });
                break;

            case 'ranking':
                if (!question.items || question.items.length === 0) {
                    errors.push("Se requieren items para ranking");
                }
                break;

            case 'date':
            case 'time':
            case 'yes_no':
            case 'textarea':
            case 'file_upload':
                // Estos tipos no requieren validaciones adicionales específicas
                break;

            default:
                errors.push(`Tipo de pregunta no reconocido: ${question.type}`);
        }

        return errors;
    };

    // Función para analizar preguntas por tipo y sus reglas
    const analyzeQuestionDetails = (questions) => {
        if (!questions) return null;

        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Detalles de Preguntas</h3>
                {questions.map((q, index) => {
                    const validationErrors = validateQuestionType(q.question);

                    return (
                        <div key={q.id} className="mb-4 p-3 bg-secondary-light rounded">
                            <p className="font-medium text-primary">Pregunta {index + 1}: {q.title}</p>
                            <p className="text-sm text-text-muted mb-1">Tipo: {q.question.type}</p>
                            <p className="text-sm text-text-muted mb-1">Requerida: {q.question.required ? 'Sí' : 'No'}</p>

                            {validationErrors.length > 0 && (
                                <div className="mt-2 p-2 bg-danger-light rounded">
                                    <p className="text-sm font-medium text-danger">Errores de validación:</p>
                                    <ul className="text-sm text-danger list-disc pl-5">
                                        {validationErrors.map((error, i) => (
                                            <li key={i}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {q.question.validation && (
                                <p className="text-sm text-text-muted mb-1">
                                    Validación: {q.question.validation.regex} - "{q.question.validation.errorMessage}"
                                </p>
                            )}
                            {q.question.options && (
                                <p className="text-sm text-text-muted mb-1">
                                    Opciones: {q.question.options.length} disponibles
                                </p>
                            )}
                            {q.question.type === 'range' && (
                                <p className="text-sm text-text-muted mb-1">
                                    Rango: {q.question.min} - {q.question.max} (paso: {q.question.step})
                                </p>
                            )}
                            {q.question.type === 'matrix' && (
                                <p className="text-sm text-text-muted mb-1">
                                    Matriz: {q.question.items?.length} filas × {q.question.options?.length} columnas
                                </p>
                            )}
                            {q.question.type === 'ranking' && (
                                <p className="text-sm text-text-muted mb-1">
                                    Items para ordenar: {q.question.items?.length}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Función para analizar la firma digital
    const analyzeSignature = (signature) => {
        if (!signature) return null;

        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Firma Digital</h3>
                <div className="grid grid-cols-1 gap-2">
                    <p><span className="font-bold">Hash:</span> {signature.hash?.substring(0, 20)}...</p>
                    <p><span className="font-bold">Algoritmo:</span> {signature.algorithm}</p>
                    <p><span className="font-bold">Firmado por:</span> {signature.signedBy}</p>
                    <p><span className="font-bold">Generado en:</span> {signature.generatedAt}</p>
                    <p><span className="font-bold">Válido hasta:</span> {signature.validUntil}</p>
                    <p><span className="font-bold">ID del certificado:</span> {signature.certificateId}</p>
                </div>
            </div>
        );
    };

    // Función para validar la estructura general del formulario
    const validateFormStructure = () => {
        const issues = [];

        if (!data?.configuration?.formConfig?.metadata?.id) {
            issues.push("Falta ID de formulario");
        }
        if (!data?.configuration?.formConfig?.metadata?.title) {
            issues.push("Falta título de formulario");
        }
        if (!data?.configuration?.questions || data.configuration.questions.length === 0) {
            issues.push("El formulario no contiene preguntas");
        }

        // Verificar preguntas duplicadas por ID
        const questionIds = new Set();
        data?.configuration?.questions?.forEach(q => {
            if (questionIds.has(q.id)) {
                issues.push(`ID de pregunta duplicado: ${q.id}`);
            }
            questionIds.add(q.id);
        });

        // Verificar orden de preguntas
        const orders = data?.configuration?.questions?.map(q => q.order) || [];
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
            issues.push("Hay números de orden duplicados en las preguntas");
        }

        return issues;
    };

    // Función principal para renderizar la definición
    const renderFormDefinition = () => {
        if (!data?.configuration) {
            return <p className="text-text-muted">No se encontró una estructura válida de formulario.</p>;
        }

        const structureIssues = validateFormStructure();

        return (
            <div className="p-4">
                {structureIssues.length > 0 && (
                    <div className="mb-6 p-3 bg-danger-light rounded">
                        <h3 className="text-lg font-semibold text-danger mb-2">Problemas de Estructura</h3>
                        <ul className="list-disc pl-5">
                            {structureIssues.map((issue, i) => (
                                <li key={i} className="text-danger">{issue}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {extractFormConfig(data.configuration)}
                {analyzeQuestions(data.configuration.questions)}
                {analyzeQuestionDetails(data.configuration.questions)}
                {analyzeSignature(data.signature)}

                {structureIssues.length === 0 && (
                    <div className="mt-6 p-3 bg-success-light rounded">
                        <p className="text-success font-medium">✓ El formulario tiene una estructura válida</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`${className}`}>
            {renderFormDefinition()}
        </div>
    );
};

export default JSONDefinition;