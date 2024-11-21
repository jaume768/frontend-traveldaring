import React, { useState } from 'react';
import api from '../../utils/api';
import './css/ReviewForm.css';

const ReviewForm = ({ tripId, refreshTrip }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/trips/${tripId}/reviews`, { rating, comment });
            setRating(5);
            setComment('');
            refreshTrip();
        } catch (err) {
            setError(err.response.data.msg || 'Error al agregar la reseña');
        }
    };

    return (
        <div className="review-form">
            <h4>Agregar Reseña</h4>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Calificación</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Comentario</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Escribe tu reseña aquí..."
                    ></textarea>
                </div>
                <button type="submit" className="btn-primary">
                    Publicar
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;