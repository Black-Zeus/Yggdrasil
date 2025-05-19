// Results.jsx
import React, { useState } from 'react';
import CategorySelector from './Results/CategorySelector';
import FormList from './Results/FormList';
import QuickDashboard from './Results/QuickDashboard';
import ResponseTable from './Results/ResponseTable';

const Results = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);

  // Simular datos de categorías (esto vendría de una API)
  const categories = [
    {
      id: 'evaluaciones',
      name: 'Evaluaciones y Control de Desempeño',
      subcategories: [
        { id: 'competencias', name: 'Evaluación de competencias laborales' },
        { id: 'desempeno_anual', name: 'Evaluación de desempeño anual' }
      ]
    },
    {
      id: 'operaciones',
      name: 'Operaciones y Servicio en Terreno',
      subcategories: [
        { id: 'orden_terreno', name: 'Orden de trabajo en terreno' },
        { id: 'checklist_inspeccion', name: 'Checklist de inspección técnica' }
      ]
    }
  ];

  const handleCategoryChange = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    setSelectedForm(null); // Reset selección de formulario
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Resultados
        </h1>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onChange={handleCategoryChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Formularios */}
        <div className="lg:col-span-1">
          <FormList
            categoryId={selectedCategory}
            subcategoryId={selectedSubcategory}
            onFormSelect={handleFormSelect}
            selectedForm={selectedForm}
          />
        </div>

        {/* Dashboard y Tabla */}
        <div className="lg:col-span-2">
          {selectedForm && (
            <>
              <QuickDashboard formId={selectedForm.id} />
              <ResponseTable formId={selectedForm.id} />
            </>
          )}
          
          {!selectedForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              Selecciona un formulario para ver sus resultados
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;