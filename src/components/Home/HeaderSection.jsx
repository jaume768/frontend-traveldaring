import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import DemoButton from '../Auth/DemoButton';

const HeaderSection = () => {
  return (
    <header id="home" className="hero">
      <div className="hero-bg" aria-hidden="true" style={{ backgroundImage: 'url(/images/fondo.jpg)' }} />
      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">
            Tu próximo viaje,
            <br />
            <span className="gradient-text">planificado en segundos</span>
          </h1>
          <p className="hero-subtitle">
            Cuéntanos cómo te gusta viajar y Traveldaring crea un itinerario día a día
            con actividades, alojamiento y transporte a tu medida.
          </p>
          <div className="hero-actions">
            <DemoButton className="btn-primary btn-lg">Probar la demo</DemoButton>
            <a href="#how" className="btn-ghost btn-lg">Cómo funciona</a>
          </div>
          <p className="hero-note">Sin registro · Hasta 10 viajes en la cuenta demo</p>
        </div>

      </div>

      <a href="#how" className="hero-scroll" aria-label="Ver más">
        <FaChevronDown />
      </a>
    </header>
  );
};

export default HeaderSection;
