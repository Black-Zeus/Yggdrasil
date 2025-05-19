// Statistics/Charts/ActivityChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ period }) => {
  const data = Array.from({ length: 7 }, (_, i) => ({
    day: `Día ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 50
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#4169E1" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;