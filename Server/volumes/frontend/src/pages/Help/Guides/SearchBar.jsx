// Guides/SearchBar.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar guías..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <IconResolve_RI name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
};

export default SearchBar;