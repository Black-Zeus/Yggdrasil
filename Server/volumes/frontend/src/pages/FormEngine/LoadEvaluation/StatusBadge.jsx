import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { 
      label: 'Activo', 
      className: 'bg-success-light text-success dark:bg-success-dark dark:text-success-light w-full' 
    },
    pending: { 
      label: 'Pendiente', 
      className: 'bg-warning-light text-warning dark:bg-warning-dark dark:text-warning-light w-full' 
    },
    draft: { 
      label: 'Borrador', 
      className: 'bg-secondary-light text-text-muted dark:bg-secondary-dark dark:text-text-dark w-full' 
    },
    cancelled: { 
      label: 'Anulado', 
      className: 'bg-danger-light text-danger dark:bg-danger-dark dark:text-danger-light w-full' 
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;