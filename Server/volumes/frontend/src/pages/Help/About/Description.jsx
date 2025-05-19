import React from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const Description = () => {
  return (
    <section className="bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark rounded-xl shadow-sm p-8 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <IconResolve_RI name="RiInformationLine" className="w-6 h-6 text-primary-light dark:text-primary-dark" />
        <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
          Descripción General
        </h2>
      </div>
      
      <p className="text-text-muted dark:text-text-dark leading-relaxed">
        Sistema desarrollado para optimizar la gestión de formularios digitales, 
        permitiendo la creación, distribución y análisis de diversos tipos de documentos 
        en formato digital. Diseñado para mejorar la eficiencia operativa y reducir 
        el uso de papel en procesos administrativos.
      </p>
    </section>
  );
};

export default Description;
