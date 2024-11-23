import React from 'react';
import { Link } from 'react-router-dom';
import './css/HeaderSection.css';

const HeaderSection = () => {
  return (
    <header id="home" className="header">
      <div className="overlay">
        <h1 className="header-title">¡Bienvenido a Traveldaring!</h1>
        <h2 className="header-subtitle">Planifica tus viajes con itinerarios personalizados generados por IA.</h2>
        <Link to="/dashboard" className="header-button">
          Empieza Ahora
        </Link>
      </div>
    </header>
  );
};

export default HeaderSection;