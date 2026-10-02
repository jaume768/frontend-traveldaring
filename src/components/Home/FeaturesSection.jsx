import React from 'react';
import { FaHotel, FaConciergeBell, FaUtensils, FaRobot } from 'react-icons/fa';
import Reveal from '../Layout/Reveal';

const features = [
    {
        icon: <FaRobot />,
        title: 'Itinerarios Personalizados',
        text: 'Nuestra IA analiza tus preferencias para crear un itinerario de viaje único y adaptado a ti.',
    },
    {
        icon: <FaHotel />,
        title: 'Recomendación de Hoteles',
        text: 'Te sugerimos los mejores hoteles que se ajustan a tu presupuesto y necesidades.',
    },
    {
        icon: <FaConciergeBell />,
        title: 'Actividades Exclusivas',
        text: 'Descubre actividades únicas y experiencias inolvidables en tu destino.',
    },
    {
        icon: <FaUtensils />,
        title: 'Restaurantes Recomendados',
        text: 'Explora los mejores restaurantes locales seleccionados por nuestra IA.',
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="home-section features-section">
            <div className="home-container">
                <Reveal className="section-head">
                    <span className="page-eyebrow">Funcionalidades</span>
                    <h2 className="section-title">Todo lo que necesita tu viaje</h2>
                </Reveal>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <Reveal key={feature.title} className="feature-card" delay={index * 90}>
                            <span className="feature-icon">{feature.icon}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
