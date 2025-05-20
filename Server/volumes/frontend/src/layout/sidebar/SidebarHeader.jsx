// src/layout/sidebar/SidebarHeader.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';
import SvgIcon from '../../components/atoms/SvgIcon';
import ImageTextBlock from '../../components/atoms/ImageTextBlock';

/**
 * SidebarHeader - Componente para el encabezado del sidebar
 * con el logo enlazado a la página principal y transiciones optimizadas
 * 
 * @param {Object} props
 * @param {boolean} props.textVisible - Si el texto debe estar visible
 */
const SidebarHeader = ({ textVisible = true }) => {
  const { collapsed } = useSidebarStore();
  // Estado para controlar las transiciones
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFullLogo, setShowFullLogo] = useState(!collapsed);

  // Efecto para manejar las transiciones de forma suave
  useEffect(() => {
    if (collapsed && showFullLogo) {
      // Si se colapsa, empezamos la transición
      setIsTransitioning(true);
      // Después de un delay, cambiamos la visualización
      const timer = setTimeout(() => {
        setShowFullLogo(false);
        setIsTransitioning(false);
      }, 150); // Tiempo ligeramente inferior a la duración de la transición
      return () => clearTimeout(timer);
    } else if (!collapsed && !showFullLogo) {
      // Si se expande, mostramos inmediatamente el logo completo
      setIsTransitioning(true);
      setShowFullLogo(true);
      // Después de que la transición termine, limpiamos el estado
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [collapsed, showFullLogo]);

  return (
    <div className={`border-b border-border-sidebar flex items-center transition-all duration-300 ease-in-out ${
      collapsed ? 'justify-center p-3' : 'p-5'
    }`}>
      <Link
        to="/"
        className={`rounded-sidebar-logo flex items-center justify-center text-white font-bold text-lg flex-shrink-0 hover:bg-white/30 transition-colors duration-200 ${
          collapsed ? 'w-12 h-12 p-1' : 'w-full p-2'
        }`}
        title="Go to Home"
      >
        {showFullLogo ? (
          // Logo completo con texto
          <div className={`w-full transition-all duration-300 ease-in-out ${
            isTransitioning ? (collapsed ? 'opacity-0 scale-90' : 'opacity-100 scale-100') : ''
          }`}>
            <ImageTextBlock
              imageSrc="/assets/logo/yggdrasil.svg"
              imageAlt="Árbol natural"
              position="top"
              className="transition-all duration-300 ease-in-out"
            >
              <h2 className={`text-xl font-semibold mb-2 transition-all duration-300 ease-in-out ${
                isTransitioning && collapsed ? 'opacity-0' : 'opacity-100'
              }`}>
                Yggdrasil
              </h2>
            </ImageTextBlock>
          </div>
        ) : (
          // Solo icono
          <div className={`flex justify-center items-center transition-all duration-300 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}>
            <SvgIcon
              path="/assets/logo/yggdrasil.svg"
              className="w-10 h-10 transition-all duration-300 ease-in-out"
              alt="Árbol Yggdrasil"
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default SidebarHeader;