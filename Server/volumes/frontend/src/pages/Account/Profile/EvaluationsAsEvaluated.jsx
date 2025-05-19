import React from 'react';

const EvaluationsAsEvaluated = ({ evaluations, onAction }) => {
  // Si no hay evaluaciones, mostrar mensaje
  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-subtle mb-6 p-6">
        <h2 className="text-xl font-semibold text-primary mb-4 border-b border-border pb-2">
          Mis Evaluaciones
        </h2>
        <p className="text-text-muted py-4 text-center">No tienes evaluaciones registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-subtle mb-6">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-4 border-b border-border pb-2">
          Mis Evaluaciones
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-highlight">
                <th className="py-3 px-4 text-left font-medium text-primary">Título</th>
                <th className="py-3 px-4 text-left font-medium text-primary">Evaluador</th>
                <th className="py-3 px-4 text-left font-medium text-primary">Fecha</th>
                <th className="py-3 px-4 text-left font-medium text-primary">Estado</th>
                <th className="py-3 px-4 text-left font-medium text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="border-b border-border-light">
                  <td className="py-3 px-4">{evaluation.title}</td>
                  <td className="py-3 px-4">{evaluation.evaluator}</td>
                  <td className="py-3 px-4">{evaluation.date}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={evaluation.status} />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-info hover:text-info-dark focus:outline-none"
                      onClick={() => onAction(evaluation.id, evaluation.action)}
                    >
                      {evaluation.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar el estado con colores apropiados
const StatusBadge = ({ status }) => {
  let colorClass = '';
  
  switch (status) {
    case 'Completada':
      colorClass = 'text-success-dark font-medium';
      break;
    case 'Pendiente':
      colorClass = 'text-warning-dark font-medium';
      break;
    case 'En progreso':
      colorClass = 'text-info-dark font-medium';
      break;
    default:
      colorClass = 'text-text-muted';
  }
  
  return <span className={colorClass}>{status}</span>;
};

export default EvaluationsAsEvaluated;