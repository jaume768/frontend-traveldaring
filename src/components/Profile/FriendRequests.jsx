import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './css/FriendRequests.css';

const FriendRequests = ({ onFriendAccepted }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        try {
            const response = await api.get('/users/friend-requests');
            setRequests(response.data.friendRequests);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar las solicitudes de amistad', err);
            setError('Error al cargar las solicitudes de amistad');
            setLoading(false);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await api.post('/users/accept-friend', { requestId });
            fetchRequests();
            if (onFriendAccepted) {
                onFriendAccepted();
            }
        } catch (err) {
            console.error('Error al aceptar solicitud', err);
            alert(err.response?.data?.msg || 'Error al aceptar la solicitud');
        }
    };

    const declineRequest = async (requestId) => {
        try {
            await api.post('/users/cancel-friend-request', { friendId: requestId });
            fetchRequests();
        } catch (err) {
            console.error('Error al rechazar solicitud', err);
            alert(err.response?.data?.msg || 'Error al rechazar la solicitud');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) return <p>Cargando solicitudes...</p>;

    return (
        <div className="card friend-requests">
            <h3>Solicitudes de Amistad</h3>
            {error && <div className="error-message">{error}</div>}
            {requests.length === 0 ? (
                <p>No tienes solicitudes de amistad.</p>
            ) : (
                requests.map((request) => (
                    <div key={request._id} className="friend-request">
                        <p>{request.username} te ha enviado una solicitud de amistad.</p>
                        <button onClick={() => acceptRequest(request._id)} className="btn-primary">
                            Aceptar
                        </button>
                        <button onClick={() => declineRequest(request._id)} className="btn-secondary">
                            Rechazar
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendRequests;