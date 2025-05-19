// SysLog.jsx
import React, { useState } from 'react';
import LogsHeader from './SysLog/LogsHeader';
import LogsFilters from './SysLog/LogsFilters';
import LogsTable from './SysLog/LogsTable';
import LogsPagination from './SysLog/LogsPagination';
import logger from '../../utils/logger';

const SysLog = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [filters, setFilters] = useState({
    search: '',
    severity: 'all',
    module: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data para ejemplo
  const mockLogs = [
    {
      id: 1,
      timestamp: '2025-04-20 10:30:25',
      user: 'juan.perez',
      action: 'Formulario creado',
      module: 'Formularios',
      severity: 'info',
      device: 'iPad Pro',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2025-04-20 10:28:15',
      user: 'admin',
      action: 'Cambio de permisos',
      module: 'Usuarios',
      severity: 'warning',
      device: 'Chrome/Windows',
      ip: '192.168.1.50'
    },
    {
      id: 3,
      timestamp: '2025-04-20 10:25:10',
      user: 'sistema',
      action: 'Error de sincronización',
      module: 'Sistema',
      severity: 'error',
      device: 'Server',
      ip: '192.168.1.1'
    }
  ];

  const handleSearch = (searchText) => {
    setFilters(prev => ({ ...prev, search: searchText }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleExport = () => {
    logger.info('SysLog','Exportando logs...');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LogsHeader onExport={handleExport} />
      
      <LogsFilters 
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <div className="bg-white rounded-lg shadow-sm">
        <LogsTable logs={mockLogs} />
        <LogsPagination 
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          totalItems={97}
        />
      </div>
    </div>
  );
};

export default SysLog;