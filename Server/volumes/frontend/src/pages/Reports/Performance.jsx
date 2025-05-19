import React, { useState, useEffect } from "react";
import PerformanceHeader from "./Performance/PerformanceHeader";
import FilterBar from "./Performance/FilterBar";
import MetricsGrid from "./Performance/MetricsGrid";
import ChartSection from "./Performance/ChartSection";
import CategoryBreakdown from "./Performance/CategoryBreakdown";
import RecentFormsTable from "./Performance/RecentFormsTable";
import logger from "../../utils/logger";

const Performance = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    filters: {
      period: "30",
      category: "all",
      department: "all",
    },
    filterOptions: {
      periods: [
        { value: "7", label: "Últimos 7 días" },
        { value: "30", label: "Últimos 30 días" },
        { value: "90", label: "Últimos 90 días" },
        { value: "custom", label: "Personalizado" },
      ],
      categories: [
        { value: "all", label: "Todas las categorías" },
        { value: "evaluaciones", label: "Evaluaciones" },
        { value: "servicios", label: "Servicios en terreno" },
        { value: "soporte", label: "Soporte" },
        { value: "safety", label: "Safety" },
        { value: "custom", label: "Custom" },
      ],
      departments: [
        { value: "all", label: "Todos los departamentos" },
        { value: "operaciones", label: "Operaciones" },
        { value: "rrhh", label: "Recursos Humanos" },
        { value: "calidad", label: "Calidad" },
      ],
    },
    metrics: [
      {
        title: "Total Formularios",
        value: "2,847",
        trend: "↑ 12% vs período anterior",
        trendType: "up",
      },
      {
        title: "Tasa de Completitud",
        value: "94.2%",
        trend: "↑ 3.5% vs período anterior",
        trendType: "up",
      },
      {
        title: "Tiempo Promedio",
        value: "12.5 min",
        trend: "↓ 2.3 min vs período anterior",
        trendType: "down",
      },
      {
        title: "Error de Validación",
        value: "5.8%",
        trend: "↓ 1.2% vs período anterior",
        trendType: "down",
      },
    ],
    chartData: {
      categoryTrend: {
        labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
        datasets: [
          {
            label: "Evaluaciones",
            data: [65, 59, 80, 81],
            borderColor: "#1D3B7A",
            fill: false,
          },
          {
            label: "Servicios",
            data: [28, 48, 40, 19],
            borderColor: "#4169E1",
            fill: false,
          },
        ],
      },
      statusDistribution: {
        labels: ["Completados", "Pendientes", "Con Error"],
        datasets: [
          {
            data: [85, 10, 5],
            backgroundColor: ["#28A745", "#FFA500", "#DC3545"],
          },
        ],
      },
    },
    categories: [
      {
        name: "Evaluaciones",
        icon: "📋",
        count: 1245,
        completionRate: 96.5,
      },
      {
        name: "Servicios en Terreno",
        icon: "🛠️",
        count: 892,
        completionRate: 92.8,
      },
      {
        name: "Soporte",
        icon: "💬",
        count: 456,
        completionRate: 89.7,
      },
      {
        name: "Safety",
        icon: "🛡️",
        count: 187,
        completionRate: 98.2,
      },
      {
        name: "Custom",
        icon: "⚙️",
        count: 67,
        completionRate: 91.0,
      },
    ],
    recentForms: [
      {
        id: "#F1234",
        title: "Evaluación de Desempeño Q1",
        category: "Evaluaciones",
        user: "Juan Pérez",
        time: "15 min",
        status: "completed",
        statusLabel: "Completado",
      },
      {
        id: "#F1235",
        title: "Inspección de Safety - Planta 2",
        category: "Safety",
        user: "María García",
        time: "28 min",
        status: "completed",
        statusLabel: "Completado",
      },
      {
        id: "#F1236",
        title: "Servicio Técnico - Cliente ABC",
        category: "Servicios en Terreno",
        user: "Carlos López",
        time: "45 min",
        status: "pending",
        statusLabel: "Pendiente",
      },
      {
        id: "#F1237",
        title: "Ticket de Soporte #789",
        category: "Soporte",
        user: "Ana Torres",
        time: "10 min",
        status: "error",
        statusLabel: "Error",
      },
      {
        id: "#F1238",
        title: "Formulario Personalizado - Inventario",
        category: "Custom",
        user: "Pedro Sánchez",
        time: "22 min",
        status: "completed",
        statusLabel: "Completado",
      },
    ],
  });

  const handleFilterChange = (filterType, value) => {
    setLoading(true);
    setData((prevData) => ({
      ...prevData,
      filters: {
        ...prevData.filters,
        [filterType]: value,
      },
    }));

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleViewAll = () => {
    logger.info('Performance',"Ver todos los formularios");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PerformanceHeader
        title="Desempeño de Formularios"
        subtitle="Análisis y métricas de rendimiento del sistema de formularios"
      />

      <FilterBar
        filters={data.filters}
        options={data.filterOptions}
        onChange={handleFilterChange}
      />

      <MetricsGrid metrics={data.metrics} />

      <ChartSection chartData={data.chartData} />

      <CategoryBreakdown categories={data.categories} />

      <RecentFormsTable forms={data.recentForms} onViewAll={handleViewAll} />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;