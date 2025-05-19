import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para renderizar íconos SVG desde una ruta proporcionada.
 * Soporta paso de clases Tailwind u otras mediante `className`.
 */
const SvgIcon = ({ path, className = '', alt = 'Ícono' }) => {
  if (!path) return null;

  return (
    <img
      src={path}
      alt={alt}
      className={className}
      loading="lazy"
      draggable={false}
    />
  );
};

SvgIcon.propTypes = {
  path: PropTypes.string.isRequired,
  className: PropTypes.string,
  alt: PropTypes.string
};

export default SvgIcon;
