// Backups/ManualBackup.jsx
import React from 'react';
import BackupTypeCard from './BackupTypeCard';


const ManualBackup = ({ selectedType, onTypeSelect, onBackupStart }) => {
  const backupTypes = [
    {
      type: 'database',
      title: 'Base de Datos',
      description: 'Backup completo de MySQL',
      iconName: "RiDatabase2Line"
    },
    {
      type: 'minio',
      title: 'Minio Buckets',
      description: 'Backup de archivos almacenados',
      iconName: "RiHardDriveLine"
    },
    {
      type: 'full',
      title: 'Backup Completo',
      description: 'Base de datos + Archivos',
      iconName: "RiArchiveLine"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Backup Manual</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {backupTypes.map((backup) => (
            <BackupTypeCard
              key={backup.type}
              {...backup}
              isSelected={selectedType === backup.type}
              onClick={onTypeSelect}
            />
          ))}
        </div>

        <button
          onClick={() => onBackupStart(selectedType)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Backup
        </button>
      </div>
    </div>
  );
};

export default ManualBackup;