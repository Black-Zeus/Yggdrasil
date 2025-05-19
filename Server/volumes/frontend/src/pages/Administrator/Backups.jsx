// Backups.jsx
import React, { useState } from 'react';
import ManualBackup from './Backups/ManualBackup';
import AutomaticBackup from './Backups/AutomaticBackup';
import BackupHistory from './Backups/BackupHistory';
import logger from '../../utils/logger';

const Backups = () => {
  const [selectedBackupType, setSelectedBackupType] = useState('database');
  const [scheduledBackups, setScheduledBackups] = useState({
    database: { enabled: true, cron: '0 0 * * *' },
    minio: { enabled: true, cron: '0 0 * * 6' },
    full: { enabled: false, cron: '0 0 * * 0' }
  });

  const handleBackupStart = (type) => {
    logger.info('Backups',`Starting ${type} backup...`);
    // Implementar lógica de backup
  };

  const handleScheduleUpdate = (type, schedule) => {
    setScheduledBackups(prev => ({
      ...prev,
      [type]: { ...prev[type], ...schedule }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Manual Backup Section */}
      <ManualBackup
        selectedType={selectedBackupType}
        onTypeSelect={setSelectedBackupType}
        onBackupStart={handleBackupStart}
      />

      {/* Automatic Backup Section */}
      <AutomaticBackup
        schedules={scheduledBackups}
        onScheduleUpdate={handleScheduleUpdate}
      />

      {/* Backup History Section */}
      <BackupHistory />
    </div>
  );
};

export default Backups;