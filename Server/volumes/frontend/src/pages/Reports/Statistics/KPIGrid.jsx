// Statistics/KPIGrid.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const KPICard = ({ title, value, trend, trendText }) => {
  const isPositive = trend.startsWith('+');
  const TrendIcon = isPositive ? "RiArrowLeftUpBoxFill " : "RiArrowLeftDownBoxFill ";
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mb-2">{value}</p>
      <div className={`flex items-center text-sm ${trendColor}`}>
        <IconResolve_RI name={TrendIcon} className="w-4 h-4 mr-1" />
        <span>{trend} {trendText}</span>
      </div>
    </div>
  );
};

const KPIGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <KPICard
        title="Total Formularios"
        value={data.totalForms}
        trend={data.trends.forms}
        trendText="vs período anterior"
      />
      <KPICard
        title="Tiempo Promedio"
        value={data.avgTime}
        trend={data.trends.time}
        trendText="mejora"
      />
      <KPICard
        title="Tasa de Completitud"
        value={data.completionRate}
        trend={data.trends.completion}
        trendText="este mes"
      />
      <KPICard
        title="Uso Móvil"
        value={data.mobileUsage}
        trend={data.trends.mobile}
        trendText="vs mes anterior"
      />
    </div>
  );
};

export default KPIGrid;