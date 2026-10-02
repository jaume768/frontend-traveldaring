import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import TripList from '../components/Trips/TripList';

const SearchResultsPage = () => {
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        setQuery(q);
    }, [location]);

    useEffect(() => {
        if (query.trim() !== '') {
            const fetchResults = async () => {
                setLoading(true);
                setError('');
                try {
                    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
                    setResults(response.data);
                } catch (error) {
                    console.error('Error al buscar:', error);
                    setError('Error al cargar los resultados de búsqueda.');
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <span className="page-eyebrow"><FaSearch /> Búsqueda</span>
                    <h1 className="page-title search-title">
                        Resultados para <span className="gradient-text">“{query}”</span>
                    </h1>
                    {!loading && !error && (
                        <p className="page-subtitle">
                            {results.length} {results.length === 1 ? 'itinerario encontrado' : 'itinerarios encontrados'}
                        </p>
                    )}
                </div>
            </header>

            {loading ? (
                <p className="loading-text">Cargando resultados...</p>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : results.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><FaSearch /></div>
                    <p>No se encontraron resultados.</p>
                </div>
            ) : (
                <TripList trips={results} />
            )}
        </div>
    );
};

export default SearchResultsPage;
