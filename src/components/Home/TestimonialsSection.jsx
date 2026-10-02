import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import Reveal from '../Layout/Reveal';

const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} />);
    }
    if (halfStar) {
        stars.push(<FaStarHalfAlt key="half" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} />);
    }

    return <div className="star-rating" aria-label={`${rating} de 5 estrellas`}>{stars}</div>;
};

const testimonials = [
    {
        name: 'María González',
        text: 'Gracias a Traveldaring, tuve un viaje increíble. Las recomendaciones fueron perfectas y todo estuvo organizado a la perfección.',
        rating: 5,
        photo: 'https://media.istockphoto.com/id/1386479313/es/foto/feliz-mujer-de-negocios-afroamericana-millennial-posando-aislada-en-blanco.jpg?s=612x612&w=0&k=20&c=JP0NBxlxG2-bdpTRPlTXBbX13zkNj0mR5g1KoOdbtO4=',
    },
    {
        name: 'Ana López',
        text: 'La IA de Traveldaring hizo que planificar mi viaje fuera muy fácil. ¡Definitivamente usaré sus servicios de nuevo!',
        rating: 4.5,
        photo: 'https://media.istockphoto.com/id/682897825/es/foto/confident-businesswoman-over-gray-background.jpg?s=612x612&w=0&k=20&c=WSlpnPQfEqYL77qKRBZ49wbUd4Ey6rd1RB1HCNKOusQ=',
    },
    {
        name: 'Juan Pérez',
        text: 'Me encantaron las sugerencias de restaurantes y actividades. Cada día fue una nueva aventura.',
        rating: 5,
        photo: 'https://static.vecteezy.com/system/resources/thumbnails/026/570/649/small/close-up-profile-view-of-pensive-upset-african-american-man-look-in-distance-thinking-of-personal-problems-thoughtful-sad-biracial-male-feel-depressed-lost-in-thoughts-pondering-having-dilemma-photo.jpg',
    },
    {
        name: 'Carla Sánchez',
        text: 'El mejor servicio de planificación de viajes que he usado. Muy intuitivo y personalizado.',
        rating: 4,
        photo: 'https://img.freepik.com/foto-gratis/retrato-hermoso-mujer-joven-posicion-pared-gris_231208-10760.jpg?semt=ais_hybrid',
    },
    {
        name: 'Tomas Martínez',
        text: 'Mis viajes nunca habían sido tan bien organizados. ¡Gracias, Traveldaring!',
        rating: 5,
        photo: 'https://media.istockphoto.com/id/1171169099/es/foto/hombre-con-brazos-cruzados-aislados-sobre-fondo-gris.jpg?s=612x612&w=0&k=20&c=8qDLKdLMm2i8DHXY6crX6a5omVh2IxqrOxJV2QGzgFg=',
    },
];

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('');

// Si la foto no carga, se muestra un avatar con las iniciales.
const Avatar = ({ testimonial }) => {
    const [failed, setFailed] = React.useState(false);

    if (failed) {
        return <span className="testimonial-photo testimonial-photo--fallback">{initials(testimonial.name)}</span>;
    }
    return (
        <img
            src={testimonial.photo}
            alt={testimonial.name}
            className="testimonial-photo"
            loading="lazy"
            onError={() => setFailed(true)}
        />
    );
};

const TestimonialCard = ({ testimonial, hidden }) => (
    <article className="testimonial-card" aria-hidden={hidden || undefined}>
        <FaQuoteLeft className="testimonial-quote" aria-hidden="true" />
        <StarRating rating={testimonial.rating} />
        <p className="testimonial-text">{testimonial.text}</p>
        <footer className="testimonial-author">
            <Avatar testimonial={testimonial} />
            <div>
                <h4 className="testimonial-name">{testimonial.name}</h4>
                <span className="testimonial-role">Viajó con Traveldaring</span>
            </div>
        </footer>
    </article>
);

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="home-section testimonials-section">
            <div className="home-container">
                <Reveal className="section-head">
                    <span className="page-eyebrow">Testimonios</span>
                    <h2 className="section-title">Lo que dicen quienes ya han viajado</h2>
                </Reveal>
            </div>

            {/* Cinta continua: la lista se duplica para que el bucle no tenga saltos. */}
            <Reveal className="testimonials-marquee">
                <div className="testimonials-track">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.name} testimonial={testimonial} />
                    ))}
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={`${testimonial.name}-copy`} testimonial={testimonial} hidden />
                    ))}
                </div>
            </Reveal>
        </section>
    );
};

export default TestimonialsSection;
