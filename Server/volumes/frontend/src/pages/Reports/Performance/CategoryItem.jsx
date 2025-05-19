import React from "react";

const CategoryItem = ({ name, icon, count, completionRate }) => {
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
            {icon}
          </div>
          <div>
            <div className="font-medium text-blue-900">{name}</div>
            <div className="text-sm text-gray-600">{count} formularios</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-blue-700">{completionRate}%</div>
          <div className="text-sm text-gray-600">Completitud</div>
        </div>
      </div>
    );
  };

export default CategoryItem;