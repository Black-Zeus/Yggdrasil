import { useEffect } from 'react';

/**
 * Componente para actualizar el título de la página
 * usando una prop explícita `title`.
 *
 * @example
 * <PageTitle title="Panel de Control" />
 */
const PageTitle = ({ title }) => {
  useEffect(() => {
    if (typeof title === 'string') {
      document.title = title;
    }
  }, [title]);

  return null;
};

export default PageTitle;
