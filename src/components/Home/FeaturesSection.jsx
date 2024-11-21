import React from 'react';
import './css/FeaturesSection.css';
import { FaHotel, FaConciergeBell, FaUtensils, FaRobot } from 'react-icons/fa';

const FeaturesSection = () => {
    return (
        <section id="features" className="features-section">
            <div className="container">
                <h2 className="section-title">Nuestras Funcionalidades</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <FaRobot className="feature-icon" />
                        <h3>Itinerarios Personalizados</h3>
                        <p>
                            Nuestra IA analiza tus preferencias para crear un itinerario de viaje único y adaptado a ti.
                        </p>
                    </div>
                    <div className="feature-card">
                        <FaHotel className="feature-icon" />
                        <h3>Recomendación de Hoteles</h3>
                        <p>
                            Te sugerimos los mejores hoteles que se ajustan a tu presupuesto y necesidades.
                        </p>
                    </div>
                    <div className="feature-card">
                        <FaConciergeBell className="feature-icon" />
                        <h3>Actividades Exclusivas</h3>
                        <p>
                            Descubre actividades únicas y experiencias inolvidables en tu destino.
                        </p>
                    </div>
                    <div className="feature-card">
                        <FaUtensils className="feature-icon" />
                        <h3>Restaurantes Recomendados</h3>
                        <p>
                            Explora los mejores restaurantes locales seleccionados por nuestra IA.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;