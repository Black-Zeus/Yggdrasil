// Results/CategorySelector.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const CategorySelector = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onChange
}) => {
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="flex gap-4">
      {/* Selector de Categoría */}
      <div className="relative flex-1">
        <select
          value={selectedCategory}
          onChange={(e) => onChange(e.target.value, '')}
          className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <IconResolve_RI name="RiArrowDownSLine" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Selector de Subcategoría */}
      <div className="relative flex-1">
        <select
          value={selectedSubcategory}
          onChange={(e) => onChange(selectedCategory, e.target.value)}
          disabled={!selectedCategory}
          className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Selecciona una subcategoría</option>
          {selectedCategoryData?.subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
        <IconResolve_RI name="RiArrowDownSLine" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default CategorySelector;