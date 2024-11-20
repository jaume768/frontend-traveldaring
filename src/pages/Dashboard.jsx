import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import TripList from '../components/Trips/TripList';
import { Link } from 'react-router-dom';
import './Dashboard.css';

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
        <div className="dashboard">
            <h2>Mis Itinerarios de Viaje</h2>
            <Link to="/trips/create" className="btn-primary">
                Crear Nuevo Itinerario
            </Link>
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : trips.length === 0 ? (
                <p>No tienes itinerarios creados.</p>
            ) : (
                <TripList trips={trips} />
            )}
        </div>
    );
};

export default Dashboard;