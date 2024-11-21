import React from 'react';
import { Link } from 'react-router-dom';
import './css/CallToActionSection.css';

const CallToActionSection = () => {
    return (
        <section className="cta-section">
            <div className="cta-content">
                <h2 className="cta-title">¡Comienza a Planificar tu Viaje Hoy!</h2>
                <p className="cta-description">
                    Únete a Traveldaring y descubre cómo nuestra inteligencia artificial puede transformar tus viajes en experiencias inolvidables.
                </p>
                <Link to="/register" className="cta-button">
                    Regístrate Ahora
                </Link>
            </div>
        </section>
    );
};

export default CallToActionSection;