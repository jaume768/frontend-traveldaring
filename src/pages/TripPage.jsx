import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useParams } from 'react-router-dom';
import TripList from '../components/Trips/TripList';
import './css/TripPage.css';

const TripPage = () => {
    const { friendId } = useParams();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFriendTrips = async () => {
        try {
            const response = await api.get(`/users/${friendId}/trips`);
            setTrips(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los itinerarios del amigo');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendTrips();
    }, [friendId]);

    if (loading) return <p>Cargando itinerarios...</p>;
    if (error) return <div className="error-message">{error}</div>;
    if (trips.length === 0) return <p>Este usuario no tiene itinerarios públicos o no eres amigo.</p>;

    return (
        <div className="friend-trips">
            <h2>Itinerarios de tu Amigo</h2>
            <TripList trips={trips} />
        </div>
    );
};

export default TripPage;