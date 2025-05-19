// Forms.jsx
import React from 'react';
import FormHeader from './Forms/FormHeader';
import SectionDivider from './Forms/SectionDivider';
import FormGrid from './Forms/FormGrid';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

const Forms = ({ Title = "Categoría formulario tipo", Description = "Descripción de la categoría o tipo de formulario" }) => {
  // Data mock - esto vendría de una API
  const publicForms = [
    {
      id: 1,
      title: "Evaluación de Desempeño",
      description: "Formulario estándar para evaluación anual de desempeño",
      image: "https://placehold.co/150x150/png",
      isCompleted: true,
      allowMultiple: true,
      type: "public"
    },
    {
      id: 2,
      title: "Evaluación de Desempeño 2",
      description: "Formulario estándar para evaluación anual de desempeño",
      image: "https://placehold.co/150x150/png",
      isCompleted: true,
      allowMultiple: true,
      type: "public"
    },
    {
      id: 3,
      title: "Evaluación de Desempeño 3",
      description: "Formulario estándar para evaluación anual de desempeño",
      image: "https://placehold.co/150x150/png",
      isCompleted: true,
      allowMultiple: true,
      type: "public"
    }
  ];

  const privateForms = [
    {
      id: 4,
      title: "Inspección Técnica",
      description: "Checklist para inspecciones de equipamiento",
      image: "https://placehold.co/150x150/png",
      isCompleted: false,
      allowMultiple: false,
      type: "private",
      hasAccess: true
    },
    {
      id: 5,
      title: "Inspección Técnica 5",
      description: "Checklist para inspecciones de equipamiento",
      image: "https://placehold.co/150x150/png",
      isCompleted: false,
      allowMultiple: false,
      type: "private",
      hasAccess: false
    }
  ];

  const restrictedForms = [
    {
      id: 6,
      title: "Auditoría Interna",
      description: "Formulario específico para auditores internos",
      image: "https://placehold.co/150x150/png",
      isCompleted: true,
      allowMultiple: true,
      type: "restricted"
    },
    {
      id: 7,
      title: "Auditoría Interna 7",
      description: "Formulario específico para auditores internos",
      image: "https://placehold.co/150x150/png",
      isCompleted: false,
      allowMultiple: false,
      type: "restricted"
    },
    {
      id: 8,
      title: "Auditoría Interna 8",
      description: "Formulario específico para auditores internos",
      image: "https://placehold.co/150x150/png",
      isCompleted: true,
      allowMultiple: false,
      type: "restricted"
    },
    {
      id: 9,
      title: "Auditoría Interna 9",
      description: "Formulario específico para auditores internos",
      image: "https://placehold.co/150x150/png",
      isCompleted: false,
      allowMultiple: true,
      type: "restricted"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FormHeader 
        title={Title}
        description={Description}
      />

      {/* Sección Pública */}
      <SectionDivider 
        title="Formularios Públicos"
        icon={<IconResolve_RI name="RiGlobeLine" className="w-6 h-6 text-blue-600" />}
      />
      <FormGrid forms={publicForms} />

      {/* Sección Privada */}
      <SectionDivider 
        title="Formularios Privados"
        icon={<IconResolve_RI name="RiLockUnlockLine" className="w-6 h-6 text-blue-600" />}
      />
      <FormGrid forms={privateForms} />

      {/* Sección Restringida */}
      <SectionDivider 
        title="Formularios Restringidos"
        icon={<IconResolve_RI name="RiShieldLine" className="w-6 h-6 text-blue-600" />}
      />
      <FormGrid forms={restrictedForms} />
    </div>
  );
};

export default Forms;