import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { useParams } from 'react-router-dom';
import { FaUserFriends } from 'react-icons/fa';
import TripList from '../components/Trips/TripList';

const TripPage = () => {
    const { friendId } = useParams();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFriendTrips = useCallback(async () => {
        try {
            const response = await api.get(`/users/${friendId}/trips`);
            if (Array.isArray(response.data)) {
                setTrips(response.data);
            } else {
                setTrips([]);
                setError('Respuesta inesperada del servidor');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener los itinerarios:', err);
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Error al cargar los itinerarios del amigo');
            }
            setLoading(false);
        }
    }, [friendId]);

    useEffect(() => {
        if (friendId) {
            fetchFriendTrips();
        } else {
            setError('ID de amigo no proporcionado');
            setLoading(false);
        }
    }, [fetchFriendTrips, friendId]);

    return (
        <div className="page friend-trips">
            <header className="page-header">
                <div>
                    <span className="page-eyebrow"><FaUserFriends /> Amigos</span>
                    <h1 className="page-title">Itinerarios de tu Amigo</h1>
                </div>
            </header>

            {loading ? (
                <p className="loading-text">Cargando itinerarios...</p>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : trips.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><FaUserFriends /></div>
                    <p>Este usuario no tiene itinerarios públicos o no eres amigo.</p>
                </div>
            ) : (
                <TripList trips={trips} />
            )}
        </div>
    );
};

export default TripPage;
