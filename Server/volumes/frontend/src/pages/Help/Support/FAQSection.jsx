// Support/FAQSection.jsx
import React, { useState } from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: '¿Cómo puedo importar un archivo JSON?',
      answer: 'Para importar un archivo JSON, ve a la sección de Importación y arrastra tu archivo o haz clic para seleccionarlo. El sistema validará automáticamente la estructura.'
    },
    {
      id: 2,
      question: '¿Qué tipos de preguntas son compatibles?',
      answer: 'El sistema soporta: texto libre, selección única, selección múltiple, fecha, hora, rango numérico, carga de archivos, Sí/No, área de texto, matriz de evaluación y ranking.'
    },
    {
      id: 3,
      question: '¿Cómo puedo editar un formulario existente?',
      answer: 'Ve a la sección de edición, selecciona el formulario y utiliza los controles de edición inline o modal según tus necesidades.'
    },
    {
      id: 4,
      question: '¿Cómo exporto mis formularios?',
      answer: 'Puedes exportar tus formularios en formato JSON desde la sección de gestión de formularios. Selecciona el formulario y haz clic en el botón de exportar.'
    },
    {
      id: 5,
      question: '¿Hay límite en el número de preguntas por formulario?',
      answer: 'No hay un límite estricto, pero recomendamos mantener los formularios concisos para una mejor experiencia de usuario. Los formularios muy largos pueden afectar el rendimiento.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-12 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Preguntas Frecuentes
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center py-4 text-left"
            >
              <span className="font-medium text-gray-800 dark:text-white">
                {faq.question}
              </span>
              <IconResolve_RI 
                name="RiArrowDownSLine" 
                className={`text-xl text-gray-500 transition-transform duration-200 ${
                  activeIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                activeIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;