// Guides/Sidebar.jsx
import React from 'react';

const NavItem = ({ icon, title, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <img src={icon} alt={title} className="w-5 h-5 mr-3" />
      <span>{title}</span>
    </a>
  </li>
);

const NavSection = ({ title, items, activeSection, onSectionChange }) => (
  <div className="mb-6">
    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {title}
    </h3>
    <ul className="space-y-1">
      {items.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          title={item.title}
          isActive={activeSection === item.id}
          onClick={() => onSectionChange(item.id)}
        />
      ))}
    </ul>
  </div>
);

const Sidebar = ({ activeSection, onSectionChange }) => {
  const sections = {
    roles: {
      title: 'Por Rol',
      items: [
        { id: 'admin', title: 'Administradores', icon: 'https://placehold.co/150x150/png' },
        { id: 'supervisor', title: 'Supervisores', icon: 'https://placehold.co/150x150/png' },
        { id: 'operator', title: 'Operadores', icon: 'https://placehold.co/150x150/png' }
      ]
    },
    functionality: {
      title: 'Por Funcionalidad',
      items: [
        { id: 'forms', title: 'Formularios', icon: 'https://placehold.co/150x150/png' },
        { id: 'offline', title: 'Trabajo Offline', icon: 'https://placehold.co/150x150/png' },
        { id: 'backup', title: 'Backup', icon: 'https://placehold.co/150x150/png' }
      ]
    },
    quick: {
      title: 'Guías Rápidas',
      items: [
        { id: 'quickstart', title: 'Primeros Pasos', icon: 'https://placehold.co/150x150/png' },
        { id: 'faq', title: 'FAQ', icon: 'https://placehold.co/150x150/png' }
      ]
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-5">
      <div className="px-4 py-3 border-b border-gray-200 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Guías del Sistema</h2>
      </div>
      
      <nav>
        {Object.entries(sections).map(([key, section]) => (
          <NavSection
            key={key}
            title={section.title}
            items={section.items}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;