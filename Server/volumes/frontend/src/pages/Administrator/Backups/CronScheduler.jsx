// Backups/CronScheduler.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const CronScheduler = ({ type, title, iconName, schedule, onUpdate }) => {
  const nextRunDate = new Date();
  nextRunDate.setDate(nextRunDate.getDate() + 1);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <IconResolve_RI name={iconName} className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={schedule.enabled}
            onChange={(e) => onUpdate(type, { enabled: e.target.checked })}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programación (Cron)
          </label>
          <input
            type="text"
            value={schedule.cron}
            onChange={(e) => onUpdate(type, { cron: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0 0 * * *"
          />
        </div>

        <div className="text-sm text-gray-500">
          Próxima ejecución: {nextRunDate.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default CronScheduler;