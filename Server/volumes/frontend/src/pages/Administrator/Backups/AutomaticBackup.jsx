// Backups/AutomaticBackup.jsx
import React from 'react';
import CronScheduler from './CronScheduler';


const AutomaticBackup = ({ schedules, onScheduleUpdate }) => {
  const schedulers = [
    {
      type: 'database',
      title: 'Base de Datos',
      iconName: "RiDatabase2Line"
    },
    {
      type: 'minio',
      title: 'Minio Buckets',
      iconName: "RiHardDriveLine"
    },
    {
      type: 'full',
      title: 'Backup Completo',
      iconName: "RiArchiveLine"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Backup Automático</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedulers.map((scheduler) => (
            <CronScheduler
              key={scheduler.type}
              {...scheduler}
              schedule={schedules[scheduler.type]}
              onUpdate={onScheduleUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomaticBackup;