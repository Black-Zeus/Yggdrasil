import React from 'react';
import Header from './About/Header';
import Description from './About/Description';
import Features from './About/Features';
import Technologies from './About/Technologies';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <Header />
      <Description />
      <Features />
      <Technologies />

      {/* Version Info */}
      <div className="text-center mt-12 pt-6 border-t border-border-light dark:border-border-dark">
        <p className="text-sm text-text-muted dark:text-text-dark">
          Versión 1.0.0 | Última actualización: Abril 2025
        </p>
        <p className="text-sm text-text-muted dark:text-text-dark">
          © 2025 Nombre de la Empresa. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default About;
