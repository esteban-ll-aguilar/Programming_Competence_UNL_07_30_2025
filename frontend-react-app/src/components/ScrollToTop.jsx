import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Este componente detecta cambios en la ruta y hace scroll hacia arriba
// cuando el usuario navega a una nueva página
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando cambia la ruta, hacer scroll hacia arriba
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Usar 'instant' en lugar de 'smooth' para evitar animaciones no deseadas
    });
  }, [pathname]);

  return null; // Este componente no renderiza nada
};

export default ScrollToTop;
