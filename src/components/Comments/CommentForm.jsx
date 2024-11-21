import React, { useState } from 'react';
import api from '../../utils/api';
import './css/CommentForm.css';

const CommentForm = ({ tripId, refreshTrip }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await api.post(`/trips/${tripId}/comments`, { content });
            setContent('');
            refreshTrip();
        } catch (err) {
            setError(err.response.data.msg || 'Error al agregar el comentario');
        }
    };

    return (
        <div className="comment-form">
            <h4>Agregar Comentario</h4>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={onSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Escribe tu comentario aquí..."
                ></textarea>
                <button type="submit" className="btn-primary">
                    Publicar
                </button>
            </form>
        </div>
    );
};

export default CommentForm;