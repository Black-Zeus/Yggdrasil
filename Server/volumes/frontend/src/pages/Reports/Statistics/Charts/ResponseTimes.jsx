import React from 'react';
import {
  ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Bar, Line
} from 'recharts';

const ResponseTimes = ({ period }) => {
  const data = [
    { category: 'Evaluaciones', min: 2, median: 6, max: 12 },
    { category: 'Operaciones', min: 5, median: 10, max: 15 },
    { category: 'Soporte', min: 3, median: 7, max: 13 },
    { category: 'Seguridad', min: 4, median: 8, max: 14 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="min" fill="#69b3a2" name="Tiempo mínimo" />
        <Bar dataKey="max" fill="#d75c5c" name="Tiempo máximo" />
        <Line type="monotone" dataKey="median" stroke="#4169E1" name="Mediana" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ResponseTimes;
