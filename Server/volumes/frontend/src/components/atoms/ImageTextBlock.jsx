import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';

/**
 * Componente flexible para mostrar imagen o SVG y texto,
 * con posición relativa (izquierda, derecha, arriba, abajo) y espaciado equilibrado.
 */
const ImageTextBlock = ({
  imageSrc,
  imageAlt = 'Imagen',
  position = 'left',
  children,
  className = ''
}) => {
  const isSvg = imageSrc.endsWith('.svg');

  // Configura la dirección del flex y el justificado en función de la posición
  const layoutConfig = {
    left: {
      container: 'flex-col md:flex-row',
      justify: 'md:justify-between',
      textAlign: 'md:text-left'
    },
    right: {
      container: 'flex-col md:flex-row-reverse',
      justify: 'md:justify-between',
      textAlign: 'md:text-left'
    },
    top: {
      container: 'flex-col',
      justify: 'justify-between',
      textAlign: 'text-center'
    },
    bottom: {
      container: 'flex-col-reverse',
      justify: 'justify-between',
      textAlign: 'text-center'
    }
  }[position] || {
    container: 'flex-col',
    justify: 'justify-between',
    textAlign: 'text-center'
  };

  return (
    <div
      className={`flex items-center gap-4 ${layoutConfig.container} ${layoutConfig.justify} ${className}`}
    >
      <div className="w-full max-w-sm flex justify-center">
        {isSvg ? (
          <SvgIcon
            path={imageSrc}
            className="w-24 h-24 text-gray-800 dark:text-white hover:text-orange-500 transition-colors duration-200"
            alt={imageAlt}
          />
        ) : (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full rounded-md shadow-md object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className={`text-base text-gray-800 dark:text-gray-100 ${layoutConfig.textAlign}`}>
        {children}
      </div>
    </div>
  );
};

ImageTextBlock.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default ImageTextBlock;
