import React from 'react';
import './css/TestimonialsSection.css';
import { FaUser, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} color="#ffc107" />);
    }
    if (halfStar) {
        stars.push(<FaStarHalfAlt key="half" color="#ffc107" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} color="#ffc107" />);
    }

    return <div className="star-rating">{stars}</div>;
};

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'María González',
            text: 'Gracias a Traveldaring, tuve un viaje increíble. Las recomendaciones fueron perfectas y todo estuvo organizado a la perfección.',
            rating: 5,
            photo: 'https://media.istockphoto.com/id/1386479313/es/foto/feliz-mujer-de-negocios-afroamericana-millennial-posando-aislada-en-blanco.jpg?s=612x612&w=0&k=20&c=JP0NBxlxG2-bdpTRPlTXBbX13zkNj0mR5g1KoOdbtO4=',
        },
        {
            name: 'Juan Pérez',
            text: 'La IA de Traveldaring hizo que planificar mi viaje fuera muy fácil. ¡Definitivamente usaré sus servicios de nuevo!',
            rating: 4.5,
            photo: 'https://media.istockphoto.com/id/682897825/es/foto/confident-businesswoman-over-gray-background.jpg?s=612x612&w=0&k=20&c=WSlpnPQfEqYL77qKRBZ49wbUd4Ey6rd1RB1HCNKOusQ=',
        },
        {
            name: 'Ana López',
            text: 'Me encantaron las sugerencias de restaurantes y actividades. Cada día fue una nueva aventura.',
            rating: 5,
            photo: 'https://static.vecteezy.com/system/resources/thumbnails/026/570/649/small/close-up-profile-view-of-pensive-upset-african-american-man-look-in-distance-thinking-of-personal-problems-thoughtful-sad-biracial-male-feel-depressed-lost-in-thoughts-pondering-having-dilemma-photo.jpg',
        },
        {
            name: 'Carlos Sánchez',
            text: 'El mejor servicio de planificación de viajes que he usado. Muy intuitivo y personalizado.',
            rating: 4,
            photo: 'https://img.freepik.com/foto-gratis/retrato-hermoso-mujer-joven-posicion-pared-gris_231208-10760.jpg?semt=ais_hybrid',
        },
        {
            name: 'Laura Martínez',
            text: 'Mis viajes nunca habían sido tan bien organizados. ¡Gracias, Traveldaring!',
            rating: 5,
            photo: 'https://media.istockphoto.com/id/1171169099/es/foto/hombre-con-brazos-cruzados-aislados-sobre-fondo-gris.jpg?s=612x612&w=0&k=20&c=8qDLKdLMm2i8DHXY6crX6a5omVh2IxqrOxJV2QGzgFg=',
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
                            <img src={testimonial.photo} alt={testimonial.name} className="testimonial-photo" />
                            <StarRating rating={testimonial.rating} />
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <h4 className="testimonial-name">- {testimonial.name}</h4>
                        </div>
                    ))}
                </div>
                <div className="testimonials-carousel">
                    <Slider {...sliderSettings}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <img src={testimonial.photo} alt={testimonial.name} className="testimonial-photo" />
                                <StarRating rating={testimonial.rating} />
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