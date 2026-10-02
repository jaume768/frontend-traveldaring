import React, { useEffect, useState, useContext, useCallback } from 'react';
import api, { uploadTripImage } from '../../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import EditTrip from './EditTrip';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaBed, FaBus, FaEdit, FaTrash, FaCamera, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    const fetchTrip = useCallback(async () => {
        try {
            const response = await api.get(`/trips/${tripId}`);
            setTrip(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar el itinerario');
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        fetchTrip();
    }, [fetchTrip]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setUploadError('Solo se permiten imágenes JPG, PNG y GIF.');
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setUploadError('La imagen excede el tamaño máximo de 5MB.');
                return;
            }

            setImageFile(file);
            setUploadError('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadImage = async () => {
        if (!imageFile) {
            setUploadError('Por favor, selecciona una imagen primero.');
            return;
        }

        setUploading(true);
        setUploadError('');

        try {
            const token = authState.token;
            const response = await uploadTripImage(tripId, imageFile, token);
            setTrip((prevTrip) => ({
                ...prevTrip,
                imageUrl: response.data.imageUrl,
            }));
            setImageFile(null);
            setPreviewImage(null);
            alert('Imagen subida exitosamente');
        } catch (err) {
            console.error(err);
            setUploadError(err.response?.data?.msg || 'Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="page"><p className="loading-text">Cargando...</p></div>;
    if (error) return <div className="page page--narrow"><div className="error-message">{error}</div></div>;
    if (!trip) return <div className="page page--narrow"><p className="error-message">Itinerario no encontrado.</p></div>;

    const userId = authState.user ? authState.user._id : null;
    const isCreator = userId && trip.createdBy && trip.createdBy._id.toString() === userId;
    const isCollaborator = userId && trip.collaborators && trip.collaborators.some(collab => collab._id.toString() === userId);

    // Los itinerarios de ejemplo no se pueden modificar desde la cuenta demo.
    const isLocked = Boolean(trip.isSample && authState.user?.isDemo);
    const canEdit = (isCreator || isCollaborator) && !isLocked;
    const canDelete = isCreator && !isLocked;
    const canShare = isCreator && !isLocked;
    const canDownload = authState.user && ['premium', 'pro', 'vip'].includes(authState.user.role);

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
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error al eliminar el itinerario');
        }
    };

    const handleUpdate = async () => {
        await fetchTrip();
        setShowEdit(false);
    };

    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const tripDates = trip.travelDates?.startDate && trip.travelDates?.endDate
        ? `${new Date(trip.travelDates.startDate).toLocaleDateString('es-ES', dateOptions)} - ${new Date(trip.travelDates.endDate).toLocaleDateString('es-ES', dateOptions)}`
        : null;
    const country = trip.destinationPreferences?.countryName;

    return (
        <div className="page trip-detail">
            <header
                className={`trip-hero ${trip.imageUrl ? 'trip-hero--image' : ''}`}
                style={trip.imageUrl ? { backgroundImage: `url(${trip.imageUrl})` } : undefined}
            >
                <div className="trip-hero-content">
                    <div className="trip-meta">
                        {country && <span className="badge"><FaMapMarkerAlt /> {country}</span>}
                        {tripDates && <span className="badge"><FaCalendarAlt /> {tripDates}</span>}
                        <span className="badge">{sortedDays.length} {sortedDays.length === 1 ? 'día' : 'días'}</span>
                        {trip.isSample && <span className="badge">Itinerario de ejemplo</span>}
                    </div>
                    <h1 className="trip-title">{trip.title}</h1>
                    <p className="trip-description">{trip.description}</p>
                    {trip.createdBy && (
                        <div className="creator-info">
                            Hecho por <Link to={`/users/${trip.createdBy._id}/profile`}>{trip.createdBy.username}</Link>
                        </div>
                    )}
                    <div className="trip-actions">
                        {canEdit && (
                            <button className="btn-secondary btn-edit" onClick={() => setShowEdit(true)}>
                                <FaEdit /> Editar
                            </button>
                        )}
                        {canShare && (
                            <button className="btn-secondary btn-upload-photo" onClick={() => document.getElementById('imageInput').click()}>
                                <FaCamera /> {trip.imageUrl ? 'Cambiar Foto' : 'Añadir Foto'}
                            </button>
                        )}
                        {canDownload && (
                            <button className="btn-primary btn-download" onClick={handleDownload}>
                                <FaFilePdf /> Descargar PDF
                            </button>
                        )}
                        {canDelete && (
                            <button className="btn btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                                <FaTrash /> Eliminar
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {uploadError && !imageFile && <p className="error-message">{uploadError}</p>}

            {/* Previsualización y controles de subida */}
            {canEdit && imageFile && (
                <div className="card upload-card">
                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Previsualización" className="itinerary-image-preview" />
                        </div>
                    )}
                    <div className="upload-controls">
                        <button className="btn-primary btn-upload" onClick={handleUploadImage} disabled={uploading}>
                            {uploading ? 'Subiendo...' : 'Subir Imagen'}
                        </button>
                        <button className="btn-secondary btn-cancel" onClick={() => { setImageFile(null); setPreviewImage(null); }} disabled={uploading}>
                            Cancelar
                        </button>
                    </div>
                    {uploadError && <p className="error-message">{uploadError}</p>}
                </div>
            )}

            <section className="trip-section">
                <h2 className="section-title-intinerari">Itinerario</h2>
                <div className="itinerary">
                    {sortedDays.map((day, index) => (
                        <article key={index} className="itinerary-day" style={{ animationDelay: `${Math.min(index, 8) * 90}ms` }}>
                            <div className="day-marker">{index + 1}</div>
                            <div className="day-card">
                                <div className="day-header">
                                    <h4>Día {index + 1}</h4>
                                    {day.fecha && (
                                        <span className="day-date">
                                            {new Date(day.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </span>
                                    )}
                                </div>
                                <div className="activities">
                                    {(day.actividades || []).map((actividad, idx) => (
                                        <div key={idx} className="activity">
                                            <div className="activity-time"><FaClock /> {actividad.hora}</div>
                                            <div className="activity-details">
                                                <p className="activity-name">{actividad.actividad}</p>
                                                {actividad.ubicación && (
                                                    <p className="activity-location"><FaMapMarkerAlt /> {actividad.ubicación}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="additional-info">
                                    {day.alojamiento && <p><FaBed /> <span><strong>Alojamiento:</strong> {day.alojamiento}</span></p>}
                                    {day.transporte && <p><FaBus /> <span><strong>Transporte:</strong> {day.transporte}</span></p>}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="trip-section">
                <h2 className="section-title-intinerari">Actividades Recomendadas</h2>
                <div className="recommended-activities">
                    {trip.activitiesPerCity && Object.keys(trip.activitiesPerCity).length > 0 ? (
                        Object.entries(trip.activitiesPerCity).map(([city, activities], index) => (
                            <div key={index} className="city-activities">
                                <h4>{city}</h4>
                                <div className="activities-list">
                                    {activities.length > 0 ? (
                                        activities.map((activity, idx) => (
                                            <a
                                                key={idx}
                                                href={activity.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="recommended-activity"
                                            >
                                                <div className="activity-image-wrap">
                                                    <img
                                                        src={activity.imageUrl}
                                                        alt={activity.title}
                                                        className="activity-image"
                                                        loading="lazy"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                </div>
                                                <div className="activity-info">
                                                    <h5>{activity.title}</h5>
                                                    {activity.price && <p className="activity-price">{activity.price}</p>}
                                                    <span className="activity-link">Ver Detalles <FaExternalLinkAlt /></span>
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="muted">No hay actividades recomendadas para esta ciudad.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="muted">No hay actividades recomendadas disponibles.</p>
                    )}
                </div>
            </section>

            <section className="trip-section">
                <h2 className="section-title-intinerari">Comentarios</h2>
                <div className="card">
                    <CommentList tripId={tripId} />
                    {authState.token && <CommentForm tripId={tripId} refreshTrip={fetchTrip} />}
                </div>
            </section>

            {showEdit && <EditTrip trip={trip} onClose={() => setShowEdit(false)} onUpdate={handleUpdate} />}
            {showDeleteConfirm && <ConfirmDeleteModal onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} />}

            {canEdit && (
                <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            )}
        </div>
    );
};

export default TripDetail;