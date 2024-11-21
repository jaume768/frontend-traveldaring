import React from 'react';
import './css/AboutSection.css';

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2 className="section-title">Sobre Nosotros</h2>
        <p className="section-description">
          En Traveldaring, utilizamos la inteligencia artificial para crear itinerarios de viaje personalizados que se adaptan a tus gustos y preferencias. Te aconsejamos sobre los mejores hoteles, actividades y restaurantes para que tu experiencia sea inolvidable.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;