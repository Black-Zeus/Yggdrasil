// Statistics/Charts/DeviceDistribution.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DeviceDistribution = ({ period }) => {
  const data = [
    { name: 'Tablet', value: 68 },
    { name: 'Web', value: 22 },
    { name: 'Móvil', value: 10 }
  ];

  const COLORS = ['#4169E1', '#48BB78', '#ED8936'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DeviceDistribution;