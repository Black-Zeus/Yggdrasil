import React from "react";
import ChartCard from "./ChartCard";

const ChartSection = ({ chartData }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Formularios por Categoría (30 días)"
          type="line"
          data={chartData.categoryTrend}
        />
        <ChartCard
          title="Distribución por Estado"
          type="pie"
          data={chartData.statusDistribution}
        />
      </div>
    );
  };

export default ChartSection;