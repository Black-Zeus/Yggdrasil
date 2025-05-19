import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const ActionButtons = ({ formId, formData, status, onAction }) => {
  // Determinar permisos basados en estado
  const canEdit = status === 'draft' || status === 'pending';
  const canDelete = status === 'draft' || status === 'pending';
  const canCancel = status === 'active' || status === 'published'; // Cambio: publicado también puede anularse
  const canClone = true; // Siempre se puede clonar un formulario
  const canView = true;  // Siempre se puede ver un formulario

  return (
    <div className="flex space-x-1">
      {/* Botón para ver */}
      <button 
        className="inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors text-info hover:bg-highlight dark:hover:bg-secondary-dark"
        onClick={() => onAction('view', formId, formData)}
        title="Ver formulario"
      >
        <IconResolve_RI name="RiEyeLine" size={16} />
      </button>
      
      {/* Botón para editar */}
      <button 
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors
          ${canEdit ? 'text-info hover:bg-highlight dark:hover:bg-secondary-dark' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
        disabled={!canEdit}
        onClick={() => canEdit && onAction('edit', formId, formData)}
        title={canEdit ? 'Editar' : 'No se puede editar - Estado ' + status}
      >
        <IconResolve_RI name="RiEdit2Line" size={16} />
      </button>
      
      {/* Botón para clonar */}
      <button 
        className="inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors text-primary hover:bg-highlight dark:hover:bg-secondary-dark"
        onClick={() => onAction('clone', formId, formData)}
        title="Clonar formulario"
      >
        <IconResolve_RI name="RiFileCopyLine" size={16} />
      </button>
      
      {/* Botón para eliminar */}
      <button 
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors
          ${canDelete ? 'text-danger hover:bg-highlight dark:hover:bg-secondary-dark' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
        disabled={!canDelete}
        onClick={() => canDelete && onAction('delete', formId, formData)}
        title={canDelete ? 'Eliminar' : 'No se puede eliminar - Estado ' + status}
      >
        <IconResolve_RI name="RiDeleteBinLine" size={16} />
      </button>
      
      {/* Botón para anular */}
      <button 
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors
          ${canCancel ? 'text-warning hover:bg-highlight dark:hover:bg-secondary-dark' : 'text-text-muted opacity-50 cursor-not-allowed'}`}
        disabled={!canCancel}
        onClick={() => canCancel && onAction('cancel', formId, formData)}
        title={canCancel ? 'Anular' : 'No disponible - Estado ' + status}
      >
        <IconResolve_RI name="RiCloseCircleLine" size={16} />
      </button>
    </div>
  );
};

export default ActionButtons;