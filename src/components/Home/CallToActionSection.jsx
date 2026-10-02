import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import Reveal from '../Layout/Reveal';
import DemoButton from '../Auth/DemoButton';

const CallToActionSection = () => {
    return (
        <section className="home-section cta-section">
            <div className="home-container">
                <Reveal className="cta-panel">
                    <FaPaperPlane className="cta-plane" aria-hidden="true" />
                    <h2 className="cta-title">¡Comienza a Planificar tu Viaje Hoy!</h2>
                    <p className="cta-description">
                        Descubre cómo nuestra inteligencia artificial puede transformar tus viajes en
                        experiencias inolvidables. Pruébalo ahora con la cuenta demo, sin registrarte.
                    </p>
                    <div className="cta-actions">
                        <DemoButton className="btn-primary btn-lg cta-button">Probar la demo</DemoButton>
                        <Link to="/suggested" className="btn-ghost btn-lg">Ver itinerarios</Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default CallToActionSection;
