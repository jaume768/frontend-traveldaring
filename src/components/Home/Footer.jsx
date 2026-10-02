import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="home-container footer-content">
                <div className="footer-brand">
                    <img src="/images/TD.png" alt="" className="footer-logo-img" />
                    <div>
                        <h3 className="footer-logo">Traveldaring</h3>
                        <p className="footer-description">
                            Planifica tus viajes de manera inteligente y personalizada con nuestra IA.
                        </p>
                    </div>
                </div>
                <nav className="footer-links" aria-label="Enlaces del pie">
                    <a href="#home">Inicio</a>
                    <a href="#how">Sobre Nosotros</a>
                    <a href="#features">Funcionalidades</a>
                    <a href="#testimonials">Testimonios</a>
                    <Link to="/suggested">Sugeridos</Link>
                </nav>
            </div>
            <p className="footer-copy">&copy; {new Date().getFullYear()} Traveldaring. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;
