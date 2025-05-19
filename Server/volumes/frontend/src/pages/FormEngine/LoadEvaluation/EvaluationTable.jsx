import React from 'react';
import ActionButtons from './ActionButtons';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import logger from '../../../utils/logger';

const EvaluationTable = ({ 
  forms, 
  onAction, 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) => {
  return (
    <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-semibold text-primary-dark dark:text-text-dark flex items-center justify-between">
          <span>Formularios</span>
          <span className="text-sm font-normal text-text-muted">
            Total: {forms.length} {forms.length === 1 ? 'formulario' : 'formularios'}
          </span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-highlight dark:bg-secondary-dark">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                Subcategoría
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                Última Modificación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted dark:text-text-dark uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {forms.map(form => (
              <tr key={form.id} className="hover:bg-highlight dark:hover:bg-secondary-dark">
                <td className="px-4 py-3 text-sm text-text dark:text-text-dark">
                  {form.id}
                </td>
                <td className="px-4 py-3 text-sm text-text dark:text-text-dark">
                  {form.name || form.title}
                </td>
                <td className="px-4 py-3 text-sm text-text dark:text-text-dark">
                  {form.category}
                </td>
                <td className="px-4 py-3 text-sm text-text dark:text-text-dark">
                  {form.subcategory}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={form.status} />
                </td>
                <td className="px-4 py-3 text-sm text-text dark:text-text-dark">
                  {formatDate(form.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm text-text dark:text-text-dark">
                  {formatDate(form.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <ActionButtons 
                    formId={form.id}
                    formData={form}
                    status={form.status}
                    onAction={onAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            logger.info('EvaluationTable', 'Cambio de página:', page);
            onPageChange(page);
          }}
        />
      )}
    </div>
  );
};

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

export default EvaluationTable;