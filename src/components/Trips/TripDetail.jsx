import React, { useEffect, useState, useContext } from 'react';
import api from '../../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import ReviewList from '../Reviews/ReviewList';
import ReviewForm from '../Reviews/ReviewForm';
import EditTrip from './EditTrip';
import ShareTripModal from './ShareTripModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { AuthContext } from '../../context/AuthContext';
import './css/TripDetail.css';

const TripDetail = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const fetchTrip = async () => {
        try {
            const response = await api.get(`/trips/${tripId}`);
            setTrip(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar el itinerario');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrip();
    }, [tripId]);

    if (loading) return <p className="loading-text">Cargando...</p>;
    if (error) return <div className="error-message">{error}</div>;
    if (!trip) return <p>Itinerario no encontrado.</p>;

    const isCreator = trip.createdBy._id === authState.user._id;
    const isCollaborator = trip.collaborators.some(collab => collab._id === authState.user._id);
    const canEdit = isCreator || isCollaborator;
    const canDelete = isCreator;
    const canShare = isCreator;
    const canDownload = ['premium', 'pro', 'vip'].includes(authState.user.role);

    const sortedDays = Object.keys(trip.itinerary)
        .sort((a, b) => {
            const dayA = parseInt(a.replace('dia', ''));
            const dayB = parseInt(b.replace('dia', ''));
            return dayA - dayB;
        })
        .map(dayKey => trip.itinerary[dayKey]);

    const handleDownload = async () => {
        try {
            const response = await api.get(`/trips/download/${tripId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${trip.title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error al descargar el itinerario');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/trips/${tripId}`);
            alert('Itinerario eliminado exitosamente');
            navigate('/dashboard'); // Redirigir al dashboard o a otra página
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error al eliminar el itinerario');
        }
    };

    const handleUpdate = (updatedTrip) => {
        setTrip(updatedTrip);
        setShowEdit(false);
    };

    const handleShare = () => {
        setShowShare(true);
    };

    return (
        <div className="trip-detail">
            <div className="trip-header">
                <h2>{trip.title}</h2>
                <p>{trip.description}</p>
                <div className="trip-actions">
                    {canEdit && <button className="btn btn-edit" onClick={() => setShowEdit(true)}>Editar</button>}
                    {canDelete && <button className="btn btn-delete" onClick={() => setShowDeleteConfirm(true)}>Eliminar</button>}
                    {canShare && <button className="btn btn-share" onClick={handleShare}>Compartir</button>}
                    {canDownload && <button className="btn btn-download" onClick={handleDownload}>Descargar PDF</button>}
                </div>
            </div>
            
            <h3>Itinerario</h3>
            <div className="itinerary">
                {sortedDays.map((day, index) => (
                    <div key={index} className="itinerary-day">
                        <div className="day-header">
                            <h4>Día {index + 1} - {new Date(day.fecha).toLocaleDateString()}</h4>
                        </div>
                        <div className="activities">
                            {day.actividades.map((actividad, idx) => (
                                <div key={idx} className="activity">
                                    <div className="activity-time">{actividad.hora}</div>
                                    <div className="activity-details">
                                        <p className="activity-name">{actividad.actividad}</p>
                                        <p className="activity-location">{actividad.ubicación}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="additional-info">
                            <p><strong>Alojamiento:</strong> {day.alojamiento}</p>
                            <p><strong>Transporte:</strong> {day.transporte}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h3>Reseñas</h3>
            <ReviewList tripId={tripId} />
            <ReviewForm tripId={tripId} refreshTrip={fetchTrip} />

            <h3>Comentarios</h3>
            <CommentList tripId={tripId} />
            <CommentForm tripId={tripId} refreshTrip={fetchTrip} />

            {showEdit && <EditTrip trip={trip} onClose={() => setShowEdit(false)} onUpdate={handleUpdate} />}
            {showShare && <ShareTripModal tripId={tripId} onClose={() => setShowShare(false)} onShare={fetchTrip} />}
            {showDeleteConfirm && <ConfirmDeleteModal onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} />}
        </div>
    );
};

export default TripDetail;