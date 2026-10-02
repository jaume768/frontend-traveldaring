import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Vuelve al inicio de la página al cambiar de ruta.
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
