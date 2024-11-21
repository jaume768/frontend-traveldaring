import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Bienvenido a TravelDaring</h1>
      <p>Planifica tus viajes con itinerarios personalizados generados por IA.</p>
      <Link to="/register" className="btn-primary">
        Empieza Ahora
      </Link>
    </div>
  );
};

export default Home;