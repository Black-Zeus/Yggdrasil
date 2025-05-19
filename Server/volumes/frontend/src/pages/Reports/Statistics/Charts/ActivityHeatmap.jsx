// Statistics/Charts/ActivityHeatmap.jsx
import React from 'react';

const ActivityHeatmap = ({ period }) => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data = Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
  );

  return (
    <div className="w-full h-full overflow-auto">
      <div className="grid grid-cols-[auto,repeat(24,minmax(30px,1fr))] gap-1">
        <div className=""></div>
        {hours.map(hour => (
          <div key={hour} className="text-xs text-center text-gray-500">
            {hour}h
          </div>
        ))}
        {days.map((day, i) => (
          <React.Fragment key={day}>
            <div className="text-xs text-gray-500 pr-2">{day}</div>
            {data[i].map((value, j) => (
              <div
                key={j}
                className="aspect-square rounded"
                style={{
                  backgroundColor: `rgba(65, 105, 225, ${value / 100})`
                }}
                title={`${value} actividades`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ActivityHeatmap;