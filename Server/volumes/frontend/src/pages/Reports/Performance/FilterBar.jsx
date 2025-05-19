import React from "react";

const FilterBar = ({ filters, options, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm text-gray-600 mb-1">Período</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.period}
          onChange={(e) => onChange("period", e.target.value)}
        >
          {options.periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm text-gray-600 mb-1">Categoría</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          {options.categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm text-gray-600 mb-1">Departamento</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.department}
          onChange={(e) => onChange("department", e.target.value)}
        >
          {options.departments.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;