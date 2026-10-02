import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import './css/CommentList.css';

const CommentList = ({ tripId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            const response = await api.get(`/trips/${tripId}/comments`);
            setComments(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar comentarios');
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    if (loading) return <p className="muted">Cargando comentarios...</p>;

    return (
        <div className="comment-list">
            {comments.length === 0 ? (
                <p className="muted">No hay comentarios aún. ¡Sé el primero!</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment._id} className="comment">
                        <span className="comment-avatar" aria-hidden="true">
                            {(comment.user?.username || '?').slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                            <strong>{comment.user?.username || 'Usuario'}</strong>
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentList;