import React from "react";

const ChartCard = ({ title, type, data }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">{title}</h3>
        <div className="h-64 bg-blue-50 rounded flex items-center justify-center text-gray-500">
          {/* Aquí iría la integración con una librería de gráficos como Chart.js o Recharts */}
          [{title} - {type} chart will be rendered here]
        </div>
      </div>
    );
  };

export default ChartCard;