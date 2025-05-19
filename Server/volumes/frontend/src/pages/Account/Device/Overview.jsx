// Device/Overview.jsx
import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const OverviewCard = ({ title, value, meta }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200">
    <div className="text-sm text-gray-500 mb-2">{title}</div>
    <div className="text-3xl font-semibold text-gray-900">{value}</div>
    <div className="flex items-center mt-2 text-sm text-green-600">
      <IconResolve_RI name="RiLineChartLine" className="w-4 h-4 mr-1" />
      {meta}
    </div>
  </div>
);

const Overview = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OverviewCard 
        title="Dispositivos Totales"
        value={data.totalDevices}
        meta={`↑ ${data.newDevices} este mes`}
      />
      <OverviewCard 
        title="Dispositivos Activos"
        value={data.activeDevices}
        meta={`${Math.round((data.activeDevices/data.totalDevices)*100)}% del total`}
      />
      <OverviewCard 
        title="Formularios Sincronizados"
        value={data.syncedForms}
        meta="↑ 123 esta semana"
      />
      <OverviewCard 
        title="Versión Actual"
        value={data.currentVersion}
        meta={`${data.updatedDevices} actualizados`}
      />
    </div>
  );
};

export default Overview;