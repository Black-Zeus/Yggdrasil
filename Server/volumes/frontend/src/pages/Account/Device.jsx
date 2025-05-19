// Device.jsx
import React, { useState } from 'react';
import Header from './Device/Header';
import Overview from './Device/Overview';
import DeviceList from './Device/DeviceList';
import EnrollModal from './Device/EnrollModal';
import logger from '../../utils/logger';

const Device = () => {
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all'
  });

  // Mock data - esto vendría de una API
  const overviewData = {
    totalDevices: 24,
    activeDevices: 18,
    syncedForms: 1234,
    currentVersion: '1.2.0',
    newDevices: 4,
    updatedDevices: 18
  };

  const devices = [
    {
      id: 1,
      name: 'iPad Pro #1',
      type: 'IOS',
      version: '16.5',
      appVersion: '1.2.0',
      status: 'active',
      offlineForms: 45,
      lastSync: '2h',
    },
    {
      id: 2,
      name: 'Samsung Tab #3',
      type: 'ANDROID',
      version: '13',
      appVersion: '1.1.5',
      status: 'inactive',
      offlineForms: 12,
      lastSync: '3d',
    }
  ];

  const handleEnroll = () => {
    setShowEnrollModal(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDeviceAction = (deviceId, action) => {
    logger.info('Device','Device action:', action, 'for device:', deviceId);
    // Implementar lógica de acciones
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Header onEnroll={handleEnroll} />
      
      <Overview data={overviewData} />
      
      <DeviceList 
        devices={devices}
        filters={filters}
        onFilterChange={handleFilterChange}
        onDeviceAction={handleDeviceAction}
      />

      <EnrollModal 
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)} 
      />
    </div>
  );
};

export default Device;