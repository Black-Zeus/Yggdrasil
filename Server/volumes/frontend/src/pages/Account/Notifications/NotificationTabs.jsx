import React from 'react';

const NotificationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'Todas' },
    { id: 'unread', label: 'No leídas' },
    { id: 'evaluations', label: 'Evaluaciones' },
    { id: 'system', label: 'Sistema' }
  ];

  return (
    <div className="flex border-b border-border-light">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-6 py-4 text-sm font-medium relative ${
            activeTab === tab.id
              ? 'text-primary'
              : 'text-text-muted hover:text-primary hover:bg-highlight'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default NotificationTabs;