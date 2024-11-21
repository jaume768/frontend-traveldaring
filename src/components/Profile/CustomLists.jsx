import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import './css/CustomLists.css';

const CustomLists = () => {
    const [lists, setLists] = useState([]);
    const [listName, setListName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchLists = async () => {
        try {
            const response = await api.get('/users/custom-lists');
            setLists(response.data.customLists);
        } catch (err) {
            console.error('Error al cargar las listas personalizadas');
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const createList = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/custom-lists/create', { name: listName });
            setSuccess(response.data.msg);
            setListName('');
            fetchLists();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response.data.msg || 'Error al crear la lista');
        }
    };

    return (
        <div className="custom-lists">
            <h3>Listas Personalizadas</h3>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={createList} className="create-list-form">
                <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Nombre de la lista"
                    required
                />
                <button type="submit" className="btn-primary">
                    Crear Lista
                </button>
            </form>
            {lists.length === 0 ? (
                <p>No tienes listas personalizadas.</p>
            ) : (
                lists.map((list) => (
                    <div key={list._id} className="custom-list">
                        <h4>{list.name}</h4>
                        {list.trips.length === 0 ? (
                            <p>No hay itinerarios en esta lista.</p>
                        ) : (
                            <ul>
                                {list.trips.map((trip) => (
                                    <li key={trip._id}>
                                        <Link to={`/trips/${trip._id}`}>{trip.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default CustomLists;