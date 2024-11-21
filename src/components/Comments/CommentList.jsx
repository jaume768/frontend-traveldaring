import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './css/CommentList.css';

const CommentList = ({ tripId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/trips/${tripId}/comments`);
            setComments(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar comentarios');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [tripId]);

    if (loading) return <p>Cargando comentarios...</p>;

    return (
        <div className="comment-list">
            {comments.length === 0 ? (
                <p>No hay comentarios aún.</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment._id} className="comment">
                        <strong>{comment.user.username}</strong>
                        <p>{comment.content}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentList;