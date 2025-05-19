// src/layout/sidebar/SidebarHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLayoutStore } from '../../store/layoutStore';
import SvgIcon from '../../components/atoms/SvgIcon'
import ImageTextBlock from '../../components/atoms/ImageTextBlock';

/**
 * SidebarHeader - Componente para el encabezado del sidebar
 * con el logo enlazado a la página principal
 * 
 * @param {Object} props
 * @param {boolean} props.textVisible - Si el texto debe estar visible
 */
const SidebarHeader = ({ textVisible = true }) => {
  const { collapsed } = useLayoutStore();

  return (
    <div className={`p-6 border-b border-border-sidebar flex items-center gap-4 transition-all duration-300 ${collapsed ? 'justify-center p-4' : ''
      }`}>
      {/* Logo con enlace a la página principal */}
      <Link
        to="/"
        className="w-full p-2 rounded-sidebar-logo flex items-center justify-center text-white font-bold text-lg flex-shrink-0 hover:bg-white/30 transition-colors duration-200"
        title="Go to Home"
      >

        <ImageTextBlock
          imageSrc="/assets/logo/yggdrasil.svg"
          imageAlt="Árbol natural"
          position="up"
        >
          <h2 className="text-xl font-semibold mb-2">Yggdrasil</h2>
        </ImageTextBlock>

      </Link>


    </div>
  );
};

export default SidebarHeader;