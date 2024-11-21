import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './css/ReviewList.css';

const ReviewList = ({ tripId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/trips/${tripId}/reviews`);
            setReviews(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar reseñas');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [tripId]);

    if (loading) return <p>Cargando reseñas...</p>;

    return (
        <div className="review-list">
            {reviews.length === 0 ? (
                <p>No hay reseñas aún.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="review">
                        <strong>{review.user.username}</strong>
                        <p>Calificación: {review.rating}/5</p>
                        <p>{review.comment}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;