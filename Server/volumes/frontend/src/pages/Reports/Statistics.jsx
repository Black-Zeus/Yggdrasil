
import React, { useState } from 'react';
import Header from './Statistics/Header';
import KPIGrid from './Statistics/KPIGrid';
import ChartCard from './Statistics/Charts/ChartCard';
import UsageChart from './Statistics/Charts/UsageChart';
import ActivityChart from './Statistics/Charts/ActivityChart';
import DeviceDistribution from './Statistics/Charts/DeviceDistribution';
import CompletionRate from './Statistics/Charts/CompletionRate';
import ResponseTimes from './Statistics/Charts/ResponseTimes';
import ActivityHeatmap from './Statistics/Charts/ActivityHeatmap';
import TopForms from './Statistics/Charts/TopForms';

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock data - Esto vendría de una API
  const kpiData = {
    totalForms: 1234,
    avgTime: '8.5m',
    completionRate: '94%',
    mobileUsage: '68%',
    trends: {
      forms: '+12.5%',
      time: '-1.2m',
      completion: '+3%',
      mobile: '+5%'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Header 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <KPIGrid data={kpiData} />

      {/* Primera fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Uso por Categoría">
          <UsageChart period={selectedPeriod} />
        </ChartCard>

        <ChartCard title="Actividad Diaria">
          <ActivityChart period={selectedPeriod} />
        </ChartCard>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Distribución por Dispositivo">
          <DeviceDistribution period={selectedPeriod} />
        </ChartCard>

        <ChartCard title="Tasa de Completitud">
          <CompletionRate period={selectedPeriod} />
        </ChartCard>
      </div>

      {/* Gráfico completo */}
      <div className="mb-6">
        <ChartCard title="Tiempos de Respuesta por Categoría" fullWidth>
          <ResponseTimes period={selectedPeriod} />
        </ChartCard>
      </div>

      {/* Última fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Mapa de Calor de Actividad">
          <ActivityHeatmap period={selectedPeriod} />
        </ChartCard>

        <ChartCard title="Top Formularios">
          <TopForms period={selectedPeriod} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Statistics;