import React from 'react';
import './css/TestimonialsSection.css';
import { FaUser } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'María González',
            text: 'Gracias a Traveldaring, tuve un viaje increíble. Las recomendaciones fueron perfectas y todo estuvo organizado a la perfección.',
        },
        {
            name: 'Juan Pérez',
            text: 'La IA de Traveldaring hizo que planificar mi viaje fuera muy fácil. ¡Definitivamente usaré sus servicios de nuevo!',
        },
        {
            name: 'Ana López',
            text: 'Me encantaron las sugerencias de restaurantes y actividades. Cada día fue una nueva aventura.',
        },
        {
            name: 'Carlos Sánchez',
            text: 'El mejor servicio de planificación de viajes que he usado. Muy intuitivo y personalizado.',
        },
        {
            name: 'Laura Martínez',
            text: 'Mis viajes nunca habían sido tan bien organizados. ¡Gracias, Traveldaring!',
        },
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <h2 className="section-title">Testimonios</h2>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <FaUser className="testimonial-icon" />
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <h4 className="testimonial-name">- {testimonial.name}</h4>
                        </div>
                    ))}
                </div>
                <div className="testimonials-carousel">
                    <Slider {...sliderSettings}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <FaUser className="testimonial-icon" />
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <h4 className="testimonial-name">- {testimonial.name}</h4>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;