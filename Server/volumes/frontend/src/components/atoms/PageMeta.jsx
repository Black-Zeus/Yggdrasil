import { Helmet } from 'react-helmet-async';

/**
 * Componente para definir el <title> y múltiples <meta> tags.
 * Ideal para SEO, accesibilidad y configuración avanzada.
 *
 * @example
 * <PageMeta>
 *   <title>Acerca del Sistema</title>
 *   <meta name="description" content="Sistema de gestión de formularios" />
 * </PageMeta>
 */
const PageMeta = ({ children }) => {
  return <Helmet>{children}</Helmet>;
};

export default PageMeta;
