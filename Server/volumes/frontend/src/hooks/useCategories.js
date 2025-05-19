import { useState, useEffect } from 'react';
import logger from '../utils/logger';
/**
 * Hook personalizado para cargar y gestionar categorías desde un archivo JSON o API
 * @returns {Object} Objeto con datos de categorías y funciones de gestión
 */
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // En el futuro, esto podría ser una llamada a API
        const response = await fetch('/data/categories.json');
        
        if (!response.ok) {
          throw new Error(`Error al cargar categorías: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
        setError(null);
      } catch (err) {
        logger.error('useCategories','Error cargando categorías:', err);
        setError(err.message);
        
        // Fallback a un conjunto de datos mínimo en caso de error
        setCategories([
          {
            id: 'default',
            name: 'Categoría por defecto',
            subcategories: [
              { id: 'default_sub', name: 'Subcategoría por defecto' }
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Función para obtener una categoría por su ID
  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || null;
  };

  // Función para obtener una subcategoría por su ID dentro de una categoría
  const getSubcategoryById = (categoryId, subcategoryId) => {
    const category = getCategoryById(categoryId);
    if (!category) return null;
    
    return category.subcategories.find(sub => sub.id === subcategoryId) || null;
  };

  // Obtener las subcategorías de una categoría específica
  const getSubcategories = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category ? category.subcategories : [];
  };

  // Obtener la información de visualización basada en IDs
  const getCategoryInfo = (categoryId, subcategoryId) => {
    const category = getCategoryById(categoryId);
    if (!category) return { categoryName: '', subcategoryName: '' };
    
    const subcategory = subcategoryId ? 
      category.subcategories.find(sub => sub.id === subcategoryId) : null;
    
    return {
      categoryName: category.name,
      subcategoryName: subcategory ? subcategory.name : ''
    };
  };

  return {
    categories,
    isLoading,
    error,
    getCategoryById,
    getSubcategoryById,
    getSubcategories,
    getCategoryInfo
  };
};

export default useCategories;