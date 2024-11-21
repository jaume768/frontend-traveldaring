import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import './css/Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchFavorites = async () => {
        try {
            const response = await api.get(`/users/favorites?page=${page}&limit=${limit}`);
            setFavorites(response.data.favorites);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los favoritos');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [page]);

    if (loading) return <p>Cargando favoritos...</p>;

    return (
        <div className="favorites">
            <h3>Itinerarios Favoritos</h3>
            {error && <div className="error-message">{error}</div>}
            {favorites.length === 0 ? (
                <p>No tienes itinerarios favoritos.</p>
            ) : (
                favorites.map((trip) => (
                    <div key={trip._id} className="favorite-trip">
                        <p>{trip.title}</p>
                        <Link to={`/trips/${trip._id}`} className="btn-secondary">
                            Ver Itinerario
                        </Link>
                    </div>
                ))
            )}
            <div className="pagination">
                {page > 1 && (
                    <button onClick={() => setPage(page - 1)} className="btn-secondary">
                        Anterior
                    </button>
                )}
                <span>Página {page}</span>
                {favorites.length === limit && (
                    <button onClick={() => setPage(page + 1)} className="btn-secondary">
                        Siguiente
                    </button>
                )}
            </div>
        </div>
    );
};

export default Favorites;