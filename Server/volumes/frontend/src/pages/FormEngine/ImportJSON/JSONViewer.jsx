// ImportJSON/JSONViewer.jsx
import React from 'react';

const JSONViewer = ({ 
  content, 
  height = '100%', 
  width = '100%',
  maxHeight = '96',
  className = '' 
}) => {
  // Función para aplicar resaltado de sintaxis al JSON
  const syntaxHighlight = (json) => {
    if (!json) return '';
    
    // Si el contenido ya es una cadena formateada, úsala directamente
    if (typeof json === 'string') {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        // Clases con soporte para dark mode usando la configuración de Tailwind
        let cls = 'text-amber-600 dark:text-orange-400'; // número
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-blue-600 dark:text-cyan-400 font-medium'; // key
          } else {
            cls = 'text-green-600 dark:text-emerald-400'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-purple-600 dark:text-violet-400'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-500 dark:text-gray-400'; // null
        }
        return `<span class="${cls}">${match}</span>`;
      });
    }
    
    return '';
  };

  // Función para añadir números de línea
  const addLineNumbers = (code) => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(3, ' ');
      return `<span class="inline-block w-12 text-gray-400 dark:text-gray-500 select-none text-right pr-4 border-r border-gray-200 dark:border-gray-700">${lineNumber}</span>${line}`;
    }).join('\n');
  };

  // Preprocesar el contenido para resaltado
  const highlightedContent = syntaxHighlight(content);
  const contentWithLineNumbers = addLineNumbers(highlightedContent);

  // Determinar el estilo basado en las props
  const getStyle = () => {
    const style = {};
    
    if (height !== 'auto') {
      style.height = height;
    }
    
    if (width !== 'auto') {
      style.width = width;
    }
    
    return style;
  };

  // Determinar las clases basadas en las props
  const getClasses = () => {
    let classes = 'p-4 overflow-auto text-sm font-mono bg-gray-50 dark:bg-background-dark rounded-lg';
    
    // Si maxHeight es un número, convertirlo a clase de Tailwind
    if (maxHeight && !isNaN(maxHeight)) {
      classes += ` max-h-${maxHeight}`;
    } else if (maxHeight) {
      // Si es un valor personalizado (ej: '500px')
      classes += ` max-h-[${maxHeight}]`;
    }
    
    // Añadir clases personalizadas si existen
    if (className) {
      classes += ` ${className}`;
    }
    
    return classes;
  };

  return (
    <pre 
      className={getClasses()}
      style={getStyle()}
    >
      <code 
        dangerouslySetInnerHTML={{ __html: contentWithLineNumbers }}
        className="block whitespace-pre text-gray-800 dark:text-gray-200"
      />
    </pre>
  );
};

export default JSONViewer;