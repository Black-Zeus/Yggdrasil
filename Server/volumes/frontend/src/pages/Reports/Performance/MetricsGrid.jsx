import React from "react";
import MetricCard from "./MetricCard";

const MetricsGrid = ({ metrics }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    );
  };

  export default MetricsGrid;