// Dashboard.jsx
import React, { useState } from 'react';
import DateSelector from './Dashboard/DateSelector';
import KPICard from './Dashboard/KPICard';
import ChartCard from './Dashboard/ChartCard';
import CategoryMetrics from './Dashboard/CategoryMetrics';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const kpiData = [
    {
      title: "Total Formularios",
      value: "1,847",
      trend: "+12.5%",
      trendText: "vs período anterior",
      icon: "https://placehold.co/150x150/png"
    },
    {
      title: "Tiempo Promedio",
      value: "5.2m",
      trend: "-0.8m",
      trendText: "mejora",
      icon: "https://placehold.co/150x150/png"
    },
    {
      title: "Uso Tablet",
      value: "68%",
      trend: "+5%",
      trendText: "vs mes anterior",
      icon: "https://placehold.co/150x150/png"
    },
    {
      title: "Tasa Completitud",
      value: "94.3%",
      trend: "+2.1%",
      trendText: "vs objetivo",
      icon: "https://placehold.co/150x150/png"
    }
  ];

  const categoryData = {
    evaluaciones: {
      title: "Evaluaciones y Control",
      metrics: [
        { name: "Tiempo promedio", value: "8.5 minutos" },
        { name: "Tasa de completitud", value: "96%" },
        { name: "Uso en PC", value: "75%" },
        { name: "Formularios activos", value: "6/6" }
      ]
    },
    operaciones: {
      title: "Operaciones en Terreno",
      metrics: [
        { name: "Tiempo promedio", value: "12.3 minutos" },
        { name: "Uso en tablet", value: "92%" },
        { name: "Formularios offline", value: "34%" },
        { name: "Fotos adjuntas (promedio)", value: "3.2 por formulario" }
      ]
    },
    soporte: {
      title: "Soporte Técnico",
      metrics: [
        { name: "Tiempo promedio", value: "15.7 minutos" },
        { name: "Uso en tablet", value: "88%" },
        { name: "Satisfacción cliente", value: "4.6/5.0" },
        { name: "Tiempo respuesta", value: "< 24h: 95%" }
      ]
    },
    seguridad: {
      title: "Seguridad y Prevención",
      metrics: [
        { name: "Cumplimiento", value: "98.5%" },
        { name: "Reportes críticos", value: "2 esta semana" },
        { name: "Tiempo respuesta incidentes", value: "< 1h: 100%" },
        { name: "Inspecciones completadas", value: "45 esta semana" }
      ]
    },
    personalizados: {
      title: "Formularios Personalizados",
      metrics: [
        { name: "Formularios creados", value: "12 activos" },
        { name: "Uso promedio", value: "8.3 por día" },
        { name: "Tasa de adopción", value: "76%" },
        { name: "Tiempo promedio", value: "6.8 minutos" }
      ]
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <DateSelector 
          selectedPeriod={selectedPeriod} 
          onPeriodChange={setSelectedPeriod} 
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Uso por Categoría"
          type="bar"
          options={['Últimos 7 días', 'Último mes', 'Último año']}
        />
        <ChartCard
          title="Tendencia Temporal"
          type="line"
          options={['Por hora', 'Por día', 'Por semana']}
        />
      </div>

      {/* Category Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(categoryData).map((key) => (
          <CategoryMetrics
            key={key}
            title={categoryData[key].title}
            metrics={categoryData[key].metrics}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;