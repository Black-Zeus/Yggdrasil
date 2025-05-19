// Statistics/Charts/TopForms.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopForms = ({ period }) => {
  const data = [
    { name: 'Evaluación Desempeño', value: 150 },
    { name: 'Inspección Técnica', value: 120 },
    { name: 'Orden de Servicio', value: 100 },
    { name: 'Control Calidad', value: 80 },
    { name: 'Check Seguridad', value: 60 }
  ].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip />
        <Bar dataKey="value" fill="#4169E1" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopForms;