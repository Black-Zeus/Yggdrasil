// Results/FormList.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const FormList = ({ categoryId, subcategoryId, onFormSelect, selectedForm }) => {
  // Mock data - Esto vendría de una API basado en categoryId y subcategoryId
  const forms = [
    {
      id: 1,
      title: 'Evaluación Q1 2025',
      responseCount: 45,
      lastResponse: '2025-04-20 15:30',
      status: 'active'
    },
    {
      id: 2,
      title: 'Evaluación Q2 2025',
      responseCount: 12,
      lastResponse: '2025-04-19 10:15',
      status: 'active'
    },
    {
      id: 3,
      title: 'Evaluación Especial',
      responseCount: 8,
      lastResponse: '2025-04-18 09:45',
      status: 'completed'
    }
  ];

  if (!categoryId || !subcategoryId) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Selecciona una categoría y subcategoría
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">
          Formularios Disponibles
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {forms.map(form => (
          <div
            key={form.id}
            onClick={() => onFormSelect(form)}
            className={`p-4 cursor-pointer transition-colors ${
              selectedForm?.id === form.id
                ? 'bg-blue-50 hover:bg-blue-100'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900">
                {form.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                form.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {form.status === 'active' ? 'Activo' : 'Completado'}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center">
                <IconResolve_RI name="RiClipboardLine" className="w-4 h-4 mr-1" />
                {form.responseCount} respuestas
              </div>
              <div className="flex items-center">
                <IconResolve_RI name="RiTimeLine" className="w-4 h-4 mr-1" />
                Última: {new Date(form.lastResponse).toLocaleString()}
              </div>
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay formularios disponibles para esta categoría
          </div>
        )}
      </div>
    </div>
  );
};

export default FormList;