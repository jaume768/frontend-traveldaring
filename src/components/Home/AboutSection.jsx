import React from 'react';
import { FaSlidersH, FaMagic, FaSuitcaseRolling } from 'react-icons/fa';
import Reveal from '../Layout/Reveal';

const steps = [
  {
    icon: <FaSlidersH />,
    title: 'Cuéntanos tu viaje',
    text: 'Destino, fechas, presupuesto, intereses y ritmo. Solo lo que te importa.',
  },
  {
    icon: <FaMagic />,
    title: 'La IA lo organiza',
    text: 'Combinamos tus preferencias con actividades reales de cada ciudad.',
  },
  {
    icon: <FaSuitcaseRolling />,
    title: 'Viaja y compártelo',
    text: 'Edita el plan, descárgalo en PDF y compártelo con quien viaje contigo.',
  },
];

const AboutSection = () => {
  return (
    <section id="how" className="home-section about-section">
      <div className="home-container">
        <Reveal className="section-head">
          <span className="page-eyebrow">Sobre nosotros</span>
          <h2 className="section-title">Viajar bien empieza por un buen plan</h2>
          <p className="section-description">
            En Traveldaring, utilizamos la inteligencia artificial para crear itinerarios de viaje
            personalizados que se adaptan a tus gustos y preferencias. Te aconsejamos sobre los mejores
            hoteles, actividades y restaurantes para que tu experiencia sea inolvidable.
          </p>
        </Reveal>

        <div className="steps">
          {steps.map((step, index) => (
            <Reveal key={step.title} className="step" delay={index * 120}>
              <span className="step-number">0{index + 1}</span>
              <span className="step-icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
