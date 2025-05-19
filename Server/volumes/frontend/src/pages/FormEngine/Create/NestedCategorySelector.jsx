import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import useCategories from '../../../hooks/useCategories';

/**
 * Componente para seleccionar categorías y subcategorías anidadas
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.value - Valor actual {categoryId, subcategoryId}
 * @param {Function} props.onChange - Función que se llama al cambiar la selección
 * @param {string} props.mainLabel - Etiqueta para el selector de categoría principal
 * @param {string} props.subLabel - Etiqueta para el selector de subcategoría
 * @param {boolean} props.required - Indica si los campos son obligatorios
 * @param {Object} props.className - Clases adicionales para personalizar el estilo
 * @returns {JSX.Element} Componente de selección de categorías anidadas
 */
const NestedCategorySelector = ({
    value = {},
    onChange,
    mainLabel = "Categoría",
    subLabel = "Subcategoría",
    required = false,
    className = {}
}) => {
    // Estados para controlar la visibilidad de los dropdowns
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);

    // Estado para almacenar valores seleccionados
    const [selectedCategory, setSelectedCategory] = useState(value?.categoryId || '');
    const [selectedSubcategory, setSelectedSubcategory] = useState(value?.subcategoryId || '');

    // Obtener datos de categorías usando nuestro hook personalizado
    const {
        categories,
        isLoading,
        error,
        getSubcategories,
        getCategoryInfo
    } = useCategories();

    // Clases CSS personalizables con valores por defecto
    const styles = {
        container: className.container || "relative space-y-3",
        label: className.label || "block font-semibold mb-2 text-gray-700 dark:text-gray-300",
        dropdown: className.dropdown || "w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-left flex justify-between items-center",
        dropdownMenu: className.dropdownMenu || "absolute z-30 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto",
        dropdownItem: className.dropdownItem || "px-4 py-2 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200 cursor-pointer",
        badge: className.badge || "mt-2 py-1 px-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm inline-block",
        requiredMark: className.requiredMark || "text-red-500 ml-1",
    };

    // Cuando cambian los valores seleccionados o las categorías se cargan, actualizar
    useEffect(() => {
        // Si hay un valor inicial, asegurarse de que se establezca
        if (value?.categoryId && !selectedCategory) {
            setSelectedCategory(value.categoryId);
        }
        if (value?.subcategoryId && !selectedSubcategory) {
            setSelectedSubcategory(value.subcategoryId);
        }
    }, [value, categories]);

    // Actualizar el valor externo cuando cambian las selecciones
    useEffect(() => {
        if (selectedCategory) {
            const { categoryName, subcategoryName } = getCategoryInfo(selectedCategory, selectedSubcategory);

            onChange({
                categoryId: selectedCategory,
                categoryName,
                subcategoryId: selectedSubcategory,
                subcategoryName,
                // Campo formateado para compatibilidad
                display: selectedSubcategory ? `${categoryName} - ${subcategoryName}` : categoryName
            });
        }
    }, [selectedCategory, selectedSubcategory]);

    // Manejar selección de categoría
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedSubcategory('');
        setCategoryDropdownOpen(false);
        
        // No abrimos automáticamente el dropdown de subcategoría para evitar comportamiento inesperado
        // setSubcategoryDropdownOpen(true);
    };

    // Manejar selección de subcategoría
    const handleSubcategorySelect = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
        setSubcategoryDropdownOpen(false);
    };

    // Obtener nombres de categoría y subcategoría para mostrar
    const { categoryName, subcategoryName } = getCategoryInfo(selectedCategory, selectedSubcategory);

    // Obtener subcategorías para la categoría seleccionada o array vacío
    const subcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

    // Mostrar mensaje de carga durante la inicialización
    if (isLoading) {
        return <div className="text-gray-500">Cargando categorías...</div>;
    }

    // Mostrar mensaje de error si la carga falló
    if (error && categories.length === 0) {
        return <div className="text-red-500">Error al cargar categorías: {error}</div>;
    }

    return (
        <div className={styles.container}>
            {/* Selector de Categoría - Siempre visible */}
            <div className="relative">
                <label className={styles.label}>
                    {mainLabel} {required && <span className={styles.requiredMark}>*</span>}
                </label>
                <button
                    type="button"
                    className={styles.dropdown}
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                >
                    <span>{categoryName || `Seleccione una ${mainLabel.toLowerCase()}`}</span>
                    <FaChevronDown className={`transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className={styles.dropdownItem}
                                onClick={() => handleCategorySelect(category.id)}
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selector de Subcategoría - Siempre visible, pero deshabilitado si no hay categoría */}
            <div className="relative">
                <label className={styles.label}>
                    {subLabel} {required && <span className={styles.requiredMark}>*</span>}
                </label>
                <button
                    type="button"
                    className={`${styles.dropdown} ${!selectedCategory ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={() => selectedCategory && setSubcategoryDropdownOpen(!subcategoryDropdownOpen)}
                    disabled={!selectedCategory}
                >
                    <span>
                        {subcategoryName || 
                         (selectedCategory ? `Seleccione una ${subLabel.toLowerCase()}` : `Primero seleccione una ${mainLabel.toLowerCase()}`)}
                    </span>
                    <FaChevronDown className={`transition-transform duration-200 ${subcategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {subcategoryDropdownOpen && selectedCategory && (
                    <div className={styles.dropdownMenu}>
                        {subcategories.map(subcategory => (
                            <div
                                key={subcategory.id}
                                className={styles.dropdownItem}
                                onClick={() => handleSubcategorySelect(subcategory.id)}
                            >
                                {subcategory.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Badge de visualización (opcional) */}
            {selectedCategory && selectedSubcategory && (
                <div className={styles.badge}>
                    {categoryName} - {subcategoryName}
                </div>
            )}
        </div>
    );
};

export default NestedCategorySelector;