import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import './css/NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <FaPaperPlane className="notfound-icon" aria-hidden="true" />
                <h1 className="gradient-text">404</h1>
                <h2>Página No Encontrada</h2>
                <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
                <Link to="/" className="btn-primary notfound-button">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
