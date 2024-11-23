import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import TripList from '../components/Trips/TripList';
import { Link } from 'react-router-dom';
import './css/Dashboard.css';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips/user');
            setTrips(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los viajes');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-overlay">
                <div className="dashboard-content">
                    <h2 className="dashboard-title">Mis Itinerarios de Viaje</h2>
                    <Link to="/trips/create" className="dashboard-button">
                        Crear Nuevo Itinerario
                    </Link>
                    {loading ? (
                        <p className="loading-text">Cargando...</p>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : trips.length === 0 ? (
                        <p className="no-trips-text">No tienes itinerarios creados.</p>
                    ) : (
                        <TripList trips={trips} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;