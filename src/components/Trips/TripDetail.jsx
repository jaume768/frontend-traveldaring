import React, { useEffect, useState, useContext } from 'react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import ReviewList from '../Reviews/ReviewList';
import ReviewForm from '../Reviews/ReviewForm';
import './css/TripDetail.css';

const TripDetail = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTrip = async () => {
        try {
            const response = await api.get(`/trips/${tripId}`);
            setTrip(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar el itinerario');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrip();
    }, [tripId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <div className="error-message">{error}</div>;
    if (!trip) return <p>Itinerario no encontrado.</p>;

    return (
        <div className="trip-detail">
            <h2>{trip.title}</h2>
            <p>{trip.description}</p>
            <h3>Itinerario</h3>
            <pre>{JSON.stringify(trip.itinerary, null, 2)}</pre>

            <h3>Reseñas</h3>
            <ReviewList tripId={tripId} />
            <ReviewForm tripId={tripId} refreshTrip={fetchTrip} />

            <h3>Comentarios</h3>
            <CommentList tripId={tripId} />
            <CommentForm tripId={tripId} refreshTrip={fetchTrip} />
        </div>
    );
};

export default TripDetail;