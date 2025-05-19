import React from 'react';

const NotificationFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'Todas' },
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Esta semana' },
    { id: 'month', label: 'Este mes' }
  ];

  return (
    <div className="flex flex-wrap p-3 bg-highlight border-b border-border-light">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`px-4 py-2 text-sm rounded-md mx-1 ${
            activeFilter === filter.id
              ? 'bg-primary text-white'
              : 'hover:bg-gray-200'
          }`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default NotificationFilters;