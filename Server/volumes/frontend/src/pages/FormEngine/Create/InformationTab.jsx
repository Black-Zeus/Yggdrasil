import React from 'react';
import { FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import NestedCategorySelector from './NestedCategorySelector';
import useFormEngineStore from '../../../store/formEngineStore';

const InformationTab = () => {
    // Usar el store para acceder a la configuración
    const { 
        configuration, 
        updateFormConfig,
        getFormConfig,
        getFlatFormConfig
    } = useFormEngineStore();

    // Obtener la configuración anidada y plana
    const formConfig = getFormConfig();
    const flatConfig = getFlatFormConfig(); // Para compatibilidad con componentes existentes

    // Manejar cambios en campos básicos
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Manejar diferentes tipos de campos
        if (type === 'checkbox') {
            // Los checkboxes van a diferentes nodos según su propósito
            if (['allowAnonymous', 'requireInstitutionalEmail', 'limitOneResponsePerPerson'].includes(name)) {
                // Estos pertenecen a visibility
                updateFormConfig({ [name]: checked });
            } else if (name === 'requireSignature') {
                // Este pertenece a requirements
                updateFormConfig({ [name]: checked });
            } else {
                // Otros checkboxes
                updateFormConfig({ [name]: checked });
            }
        } else {
            // Manejar los campos de texto según su propósito
            if (name === 'title' || name === 'description') {
                // Estos van al nodo metadata
                updateFormConfig({ [name]: value });
            } else if (name === 'visibility') {
                // Este configura el tipo de visibilidad
                updateFormConfig({ [name]: value });
            } else if (name === 'deadline' || name === 'time') {
                // Estos van al nodo timing
                updateFormConfig({ [name]: value });
            } else {
                // Otros campos
                updateFormConfig({ [name]: value });
            }
        }
    };

    // Manejar cambios en la categoría y subcategoría
    const handleCategoryChange = (categoryData) => {
        updateFormConfig({
            categoryId: categoryData.categoryId,
            categoryName: categoryData.categoryName,
            subcategoryId: categoryData.subcategoryId,
            subcategoryName: categoryData.subcategoryName,
            category: categoryData.display || ''
        });
    };

    return (
        <div>
            {/* Información General */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-primary dark:text-primary-light">Información General</h2>

                <div className="mb-4">
                    <label className="block font-semibold mb-2 text-text dark:text-text-dark" htmlFor="title">
                        Título de la Evaluación <span className="text-danger dark:text-danger-light">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formConfig.metadata.title}
                        onChange={handleInputChange}
                        placeholder="Ej: Evaluación de Desempeño - Área Técnica"
                        className="w-full p-2 border border-border dark:border-border-dark rounded bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none"
                    />
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <NestedCategorySelector
                            value={{
                                categoryId: formConfig.category.categoryId,
                                subcategoryId: formConfig.category.subcategoryId
                            }}
                            onChange={handleCategoryChange}
                            mainLabel="Categoría"
                            subLabel="Tipo de Formulario"
                            required={true}
                            className={{
                                label: "block font-semibold mb-2 text-text dark:text-text-dark",
                                dropdown: "w-full p-2 border border-border dark:border-border-dark rounded bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none text-left flex justify-between items-center",
                                badge: "mt-2 py-1 px-3 bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light rounded-full text-sm inline-block"
                            }}
                        />
                    </div>

                    <div className="w-1/2">
                        <label className="block font-semibold mb-2 text-text dark:text-text-dark" htmlFor="visibility">
                            Visibilidad
                        </label>
                        <select
                            id="visibility"
                            name="visibility"
                            value={formConfig.visibility.type}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border dark:border-border-dark rounded appearance-none bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none"
                        >
                            <option value="Pública">Pública</option>
                            <option value="Privada">Privada</option>
                            <option value="Restringida">Restringida</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2 text-text dark:text-text-dark" htmlFor="description">
                        Descripción <span className="text-danger dark:text-danger-light">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formConfig.metadata.description}
                        onChange={handleInputChange}
                        placeholder="Describe el propósito de esta evaluación..."
                        className="w-full p-2 border border-border dark:border-border-dark rounded h-32 bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none"
                    />
                </div>
            </div>

            {/* Opciones Adicionales */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-primary dark:text-primary-light">
                    Opciones Adicionales
                </h2>

                {/* Contenedor en 2 columnas iguales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

                    {/* Columna izquierda: Checkboxes */}
                    <div className="flex flex-col gap-3 justify-center h-full">
                        <label className="flex items-center text-text dark:text-text-dark">
                            <input
                                type="checkbox"
                                name="allowAnonymous"
                                checked={formConfig.visibility.allowAnonymous}
                                onChange={handleInputChange}
                                className="mr-2 text-primary focus:ring-primary"
                            />
                            Permitir respuestas anónimas
                        </label>
                        <label className="flex items-center text-text dark:text-text-dark">
                            <input
                                type="checkbox"
                                name="requireInstitutionalEmail"
                                checked={formConfig.visibility.requireInstitutionalEmail}
                                onChange={handleInputChange}
                                className="mr-2 text-primary focus:ring-primary"
                            />
                            Requerir correo institucional
                        </label>
                        <label className="flex items-center text-text dark:text-text-dark">
                            <input
                                type="checkbox"
                                name="limitOneResponsePerPerson"
                                checked={formConfig.visibility.limitOneResponsePerPerson}
                                onChange={handleInputChange}
                                className="mr-2 text-primary focus:ring-primary"
                            />
                            Limitar a una respuesta por persona
                        </label>
                        {/* Nuevo checkbox para Firma Manual */}
                        <label className="flex items-center text-text dark:text-text-dark">
                            <input
                                type="checkbox"
                                name="requireSignature"
                                checked={formConfig.requirements.requireSignature}
                                onChange={handleInputChange}
                                className="mr-2 text-primary focus:ring-primary"
                            />
                            Insertar Firma manual
                        </label>
                    </div>

                    {/* Columna derecha: Fecha y hora centradas y alineadas */}
                    <div className="flex flex-col gap-4 justify-center h-full">
                        <label className="block text-sm font-semibold text-text dark:text-text-dark">
                            Fecha límite
                            <div className="flex mt-1">
                                <input
                                    type="text"
                                    id="deadline"
                                    name="deadline"
                                    value={formConfig.timing.deadline}
                                    onChange={handleInputChange}
                                    placeholder="DD/MM/AAAA"
                                    className="w-full p-2 border border-border dark:border-border-dark rounded-l bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:ring-1 focus:ring-primary outline-none"
                                />
                                <button className="bg-secondary border border-border border-l-0 px-3 rounded-r hover:bg-secondary-light">
                                    <FaCalendarAlt className="text-text-muted" />
                                </button>
                            </div>
                        </label>

                        <label className="block text-sm font-semibold text-text dark:text-text-dark">
                            Hora
                            <div className="flex mt-1">
                                <input
                                    type="text"
                                    id="time"
                                    name="time"
                                    value={formConfig.timing.time}
                                    onChange={handleInputChange}
                                    placeholder="HH:MM"
                                    className="w-full p-2 border border-border dark:border-border-dark rounded-l bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:ring-1 focus:ring-primary outline-none"
                                />
                                <button className="bg-secondary border border-border border-l-0 px-3 rounded-r hover:bg-secondary-light">
                                    <FaClock className="text-text-muted" />
                                </button>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Opciones de Versión y Estado */}
            <div className="mb-6 border border-border dark:border-border-dark rounded-lg p-4 bg-highlight dark:bg-secondary-dark">
                <h2 className="text-lg font-semibold mb-3 text-primary dark:text-primary-light">
                    Información Adicional
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-2 text-text dark:text-text-dark" htmlFor="version">
                            Versión
                        </label>
                        <input
                            type="text"
                            id="version"
                            name="version"
                            value={formConfig.metadata.version}
                            onChange={handleInputChange}
                            placeholder="Ej: 1.0.0"
                            className="w-full p-2 border border-border dark:border-border-dark rounded bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2 text-text dark:text-text-dark" htmlFor="status">
                            Estado
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formConfig.metadata.status}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border dark:border-border-dark rounded appearance-none bg-background-light dark:bg-secondary-dark text-text dark:text-text-dark focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none"
                        >
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                            <option value="archived">Archivado</option>
                            <option value="deprecated">Obsoleto</option>
                        </select>
                    </div>
                </div>
                
                <div className="mt-3 text-sm text-text-muted dark:text-text-dark">
                    <div className="mb-1">ID: {formConfig.metadata.id}</div>
                    <div className="mb-1">Creado: {new Date(formConfig.metadata.createdAt).toLocaleString()}</div>
                    <div>Última modificación: {new Date(formConfig.metadata.updatedAt).toLocaleString()}</div>
                </div>
            </div>

            {/* Aviso de campos obligatorios */}
            <div className="bg-warning-light dark:bg-warning-dark/20 p-3 rounded text-warning-dark dark:text-warning-light text-sm mb-6 flex items-center">
                <FaExclamationTriangle className="text-warning dark:text-warning-light mr-2" />
                Los campos marcados con <span className="text-danger dark:text-danger-light mx-1">*</span> son obligatorios
            </div>
        </div>
    );
};

export default InformationTab;