// Guides.jsx
import React, { useState } from 'react';
import Sidebar from './Guides/Sidebar';
import MainContent from './Guides/MainContent';

const Guides = () => {
  const [activeSection, setActiveSection] = useState('admin');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <MainContent
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default Guides;