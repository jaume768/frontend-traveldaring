import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import TripList from '../components/Trips/TripList';
import Pagination from '../components/Trips/Pagination';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaSuitcaseRolling } from 'react-icons/fa';
import { AuthContext, DEMO_MAX_TRIPS } from '../context/AuthContext';
import './css/Dashboard.css';

const Dashboard = () => {
    const { authState } = useContext(AuthContext);
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const tripsPerPage = 6;

    const userId = authState.user?._id;
    const isDemo = Boolean(authState.user?.isDemo);

    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips/user');
            const sortedTrips = response.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setTrips(sortedTrips);
            setFilteredTrips(sortedTrips);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los viajes');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredTrips(trips);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = trips.filter(trip =>
                (trip.title || '').toLowerCase().includes(lowerCaseQuery) ||
                (trip.description || '').toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredTrips(filtered);
        }
        setCurrentPage(1);
    }, [searchQuery, trips]);

    const indexOfLastTrip = currentPage * tripsPerPage;
    const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
    const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);

    const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [currentPage]);

    // Viajes generados por la cuenta: no cuentan los compartidos ni los de ejemplo.
    const ownTrips = trips.filter((trip) => {
        const creatorId = trip.createdBy?._id || trip.createdBy;
        return !trip.isSample && (!userId || String(creatorId) === String(userId));
    }).length;
    const demoLimitReached = isDemo && ownTrips >= DEMO_MAX_TRIPS;

    return (
        <div className="page dashboard">
            <header className="page-header">
                <div>
                    <span className="page-eyebrow"><FaSuitcaseRolling /> Tu espacio</span>
                    <h1 className="page-title dashboard-title">Mis Itinerarios de Viaje</h1>
                    <p className="page-subtitle">Crea, edita y comparte tus planes de viaje generados con IA.</p>
                </div>
                {demoLimitReached ? (
                    <span className="btn-primary" aria-disabled="true" style={{ opacity: 0.55, cursor: 'not-allowed' }}>
                        <FaPlus /> Límite demo alcanzado
                    </span>
                ) : (
                    <Link to="/trips/create" className="btn-primary">
                        <FaPlus /> Crear Nuevo Itinerario
                    </Link>
                )}
            </header>

            {isDemo && !loading && (
                <div className={`demo-usage ${demoLimitReached ? 'demo-usage--full' : ''}`}>
                    <div className="demo-usage-text">
                        <span className="badge badge--demo">Cuenta demo</span>
                        <span>
                            {ownTrips} de {DEMO_MAX_TRIPS} viajes generados
                            {demoLimitReached && ' · elimina alguno para crear otro'}
                        </span>
                    </div>
                    <div className="demo-usage-bar">
                        <span style={{ width: `${Math.min(100, (ownTrips / DEMO_MAX_TRIPS) * 100)}%` }} />
                    </div>
                </div>
            )}

            <div className="search-container-dashboard">
                <FaSearch aria-hidden="true" />
                <input
                    type="search"
                    placeholder="Buscar itinerarios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-dashboard"
                />
            </div>

            {loading ? (
                <p className="loading-text">Cargando...</p>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : filteredTrips.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><FaSuitcaseRolling /></div>
                    <p className="no-trips-text" style={{ padding: 0 }}>
                        {trips.length === 0
                            ? 'Todavía no tienes itinerarios. ¡Crea el primero!'
                            : 'No se encontraron itinerarios.'}
                    </p>
                </div>
            ) : (
                <>
                    <TripList trips={currentTrips} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </>
            )}
        </div>
    );
};

export default Dashboard;
