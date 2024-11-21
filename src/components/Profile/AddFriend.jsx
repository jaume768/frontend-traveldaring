import React, { useState } from 'react';
import api from '../../utils/api';
import './css/AddFriend.css';

const AddFriend = () => {
    const [friendEmail, setFriendEmail] = useState('');
    const [message, setMessage] = useState('');

    const addFriend = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/add-friend', { friendId: friendEmail });
            setMessage('Solicitud de amistad enviada');
            setFriendEmail('');
        } catch (err) {
            setMessage(err.response.data.msg || 'Error al enviar la solicitud');
        }
    };

    return (
        <div className="add-friend">
            <h3>Agregar Amigo</h3>
            {message && <div className="message">{message}</div>}
            <form onSubmit={addFriend}>
                <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="Email del amigo"
                    required
                />
                <button type="submit" className="btn-primary">
                    Enviar Solicitud
                </button>
            </form>
        </div>
    );
};

export default AddFriend;