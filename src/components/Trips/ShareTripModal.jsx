import React, { useState } from 'react';
import api from '../../utils/api';
import './css/Modal.css';
import './css/ShareTripModal.css';

const ShareTripModal = ({ tripId, onClose, onShare }) => {
    const [collaborator, setCollaborator] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const userResponse = await api.get(`/users/search`, { params: { username: collaborator } });
            const collaboratorId = userResponse.data.user._id;

            await api.post('/trips/share', { tripId, collaboratorId });
            setSuccess('Colaborador agregado exitosamente');
            onShare();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Error al compartir el itinerario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Compartir Itinerario</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre de Usuario del Colaborador:
                        <input
                            type="text"
                            value={collaborator}
                            onChange={(e) => setCollaborator(e.target.value)}
                            required
                        />
                    </label>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <div className="modal-actions">
                        <button type="submit" className="btn btn-share" disabled={loading}>
                            {loading ? 'Compartiendo...' : 'Compartir'}
                        </button>
                        <button type="button" className="btn btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareTripModal;