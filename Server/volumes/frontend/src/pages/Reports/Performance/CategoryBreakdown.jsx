import React from "react";
import CategoryItem from "./CategoryItem";

const CategoryBreakdown = ({ categories }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Rendimiento por Categoría
        </h3>
        {categories.map((category, index) => (
          <CategoryItem key={index} {...category} />
        ))}
      </div>
    );
  };

export default CategoryBreakdown;