import React from 'react';
import PropTypes from 'prop-types';

const OptionCard = ({ 
  title, 
  icon, 
  description, 
  buttonText, 
  buttonAction, 
  color = '#1e50a0'
}) => {
  // Función para obtener clases de tailwind basadas en color
  const getButtonClasses = (color) => {
    const colorMap = {
      '#1e50a0': 'bg-blue-700 hover:bg-blue-800',
      '#ff8000': 'bg-orange-500 hover:bg-orange-600',
      '#6c757d': 'bg-gray-600 hover:bg-gray-700',
      '#20c997': 'bg-emerald-500 hover:bg-emerald-600',
      '#7b2ff7': 'bg-purple-600 hover:bg-purple-700',
      '#fd7e14': 'bg-orange-500 hover:bg-orange-600'
    };
    return colorMap[color] || 'bg-blue-700 hover:bg-blue-800';
  };

  const getIconBgClasses = (color) => {
    const colorMap = {
      '#1e50a0': 'bg-blue-100 text-blue-700',
      '#ff8000': 'bg-orange-100 text-orange-500',
      '#6c757d': 'bg-gray-100 text-gray-600',
      '#20c997': 'bg-emerald-100 text-emerald-500',
      '#7b2ff7': 'bg-purple-100 text-purple-600',
      '#fd7e14': 'bg-orange-100 text-orange-500'
    };
    return colorMap[color] || 'bg-blue-100 text-blue-700';
  };

  const getBorderClasses = (color) => {
    const colorMap = {
      '#1e50a0': 'border-blue-700',
      '#ff8000': 'border-orange-500',
      '#6c757d': 'border-gray-600',
      '#20c997': 'border-emerald-500',
      '#7b2ff7': 'border-purple-600',
      '#fd7e14': 'border-orange-500'
    };
    return colorMap[color] || 'border-blue-700';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 flex flex-col h-full border-t-4 ${getBorderClasses(color)} transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}>
      <div className={`w-12 h-12 ${getIconBgClasses(color)} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <button 
        className={`${getButtonClasses(color)} text-white font-medium py-2 px-4 rounded transition-opacity duration-200 hover:opacity-90`}
        onClick={buttonAction}
      >
        {buttonText}
      </button>
    </div>
  );
};

OptionCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonAction: PropTypes.func.isRequired,
  color: PropTypes.string
};

export default OptionCard;