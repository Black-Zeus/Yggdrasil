import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-blue-50 rounded-lg p-6 transition-all hover:-translate-y-1">
    <IconResolve_RI name={icon} className="w-8 h-8 text-blue-600 mb-3" />
    <h3 className="font-semibold text-blue-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const features = [
  {
    icon: "RiWifiLine",
    title: "Trabajo Offline",
    description: "Capacidad de trabajo sin conexión con sincronización automática"
  },
  {
    icon: "RiComputerLine",
    title: "Multiplataforma",
    description: "Acceso desde cualquier dispositivo y navegador"
  },
  {
    icon: "RiShieldLine",
    title: "Seguridad Avanzada",
    description: "Protección de datos y control de acceso granular"
  }
];

const Features = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-8 mb-6">
      <h2 className="text-xl font-semibold text-blue-900 mb-6">
        Características Principales
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
