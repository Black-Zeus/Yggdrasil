// Backups/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    running: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };

  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.default}`}>
      {statusText}
    </span>
  );
};

export default StatusBadge;