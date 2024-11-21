import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';
import './css/SliderSection.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    '/images/slider-img.jpg',
    '/images/slider-img.jpg',
    '/images/slider-img.jpg',
  ];

  const handlePrev = () => {
    setCurrentSlide((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentSlide((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="home">
      <section className="slider_section position-relative">
        <div className="slider_bg-container"></div>
        <div className="slider-container">
          <div className="detail-box">
            <h1>
              Bienvenido a <br />
              TravelDaring
            </h1>
            <p>
              Planifica tus viajes con itinerarios personalizados generados por IA.
            </p>
            <div>
              <Link to="/register" className="slider-link">
                Empieza Ahora
              </Link>
            </div>
          </div>
          <div className="img-box">
            <div className="carousel">
              <div className="carousel-inner">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${
                      index === currentSlide ? 'active' : ''
                    }`}
                  >
                    <img src={image} alt={`Slide ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" onClick={handlePrev}>
                <span className="sr-only">Previous</span>
              </button>
              <button className="carousel-control-next" onClick={handleNext}>
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;