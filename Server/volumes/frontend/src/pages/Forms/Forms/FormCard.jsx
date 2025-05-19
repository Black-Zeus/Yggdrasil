// Forms/FormCard.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const FormCard = ({ form }) => {
  const getAccessIcon = () => {
    switch (form.type) {
      case 'public':
        return <IconResolve_RI name="RiGlobeLine" className="w-5 h-5 text-blue-600" />;
      case 'private':
        return form.hasAccess ? 
          <IconResolve_RI name="RiLocklockLine" className="w-5 h-5 text-green-600" /> : 
          <IconResolve_RI name="RiLockUnlockLine" className="w-5 h-5 text-red-600" />;
      case 'restricted':
        return <IconResolve_RI name="RiShieldLine" className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <img 
        src={form.image} 
        alt={form.title}
        className="w-full h-40 object-cover bg-gray-100"
      />
      
      <div className="p-5">
        <div className="flex items-start mb-3">
          <h3 className="text-base font-semibold text-gray-900 flex-1">
            {form.title}
          </h3>
          <div className="ml-3">
            {getAccessIcon()}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {form.description}
        </p>

        <div className="flex gap-2">
          {form.isCompleted && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Completado
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            form.allowMultiple
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {form.allowMultiple ? 'Múltiples respuestas' : 'Respuesta única'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormCard;