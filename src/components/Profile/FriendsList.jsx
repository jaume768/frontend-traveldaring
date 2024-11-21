import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import './css/FriendsList.css';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFriends = async () => {
        try {
            const response = await api.get('/users/friends');
            setFriends(response.data.friends);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar amigos');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    if (loading) return <p>Cargando amigos...</p>;

    return (
        <div className="friends-list">
            <h3>Mis Amigos</h3>
            {friends.length === 0 ? (
                <p>No tienes amigos aún.</p>
            ) : (
                friends.map((friend) => (
                    <div key={friend._id} className="friend">
                        <p>{friend.username}</p>
                        <Link to={`/users/${friend._id}/trips`} className="btn-secondary">
                            Ver Itinerarios
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendsList;