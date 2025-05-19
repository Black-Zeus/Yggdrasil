// Forms/FormGrid.jsx
import React from 'react';
import FormCard from './FormCard';

const FormGrid = ({ forms }) => {
  if (!forms?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay formularios disponibles en esta sección.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map(form => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
};

export default FormGrid;