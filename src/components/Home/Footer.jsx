import React from 'react';
import './css/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h3 className="footer-logo">Traveldaring</h3>
                <p className="footer-description">
                    Planifica tus viajes de manera inteligente y personalizada con nuestra IA.
                </p>
                <div className="footer-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/about">Sobre Nosotros</Link>
                    <Link to="/contact">Contacto</Link>
                </div>
                <div className="footer-social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
                <p className="footer-copy">&copy; {new Date().getFullYear()} Traveldaring. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;