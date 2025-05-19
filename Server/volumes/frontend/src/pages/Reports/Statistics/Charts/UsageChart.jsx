// Statistics/Charts/UsageChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UsageChart = ({ period }) => {
  const data = [
    { name: 'Evaluaciones', value: 400 },
    { name: 'Operaciones', value: 300 },
    { name: 'Soporte', value: 200 },
    { name: 'Seguridad', value: 150 },
    { name: 'Personalizados', value: 100 }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4169E1" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsageChart;