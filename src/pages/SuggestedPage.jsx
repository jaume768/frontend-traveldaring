import React, { useEffect, useState } from 'react';
import { FaCompass } from 'react-icons/fa';
import api from '../utils/api';
import TripList from '../components/Trips/TripList';

const SuggestedPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPopularTrips = async () => {
        try {
            const response = await api.get('/trips/popular');
            setTrips(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los itinerarios sugeridos');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularTrips();
    }, []);

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <span className="page-eyebrow"><FaCompass /> Inspiración</span>
                    <h1 className="page-title suggested-title">Itinerarios Sugeridos</h1>
                    <p className="page-subtitle">Viajes públicos creados por la comunidad para darte ideas.</p>
                </div>
            </header>

            {loading ? (
                <p className="loading-text">Cargando...</p>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : trips.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><FaCompass /></div>
                    <p>No hay itinerarios sugeridos en este momento.</p>
                </div>
            ) : (
                <TripList trips={trips} />
            )}
        </div>
    );
};

export default SuggestedPage;
