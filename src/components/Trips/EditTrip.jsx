import React, { useState } from 'react';
import api from '../../utils/api';
import './css/Modal.css';
import './css/EditTrip.css';

const EditTrip = ({ trip, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: trip.title,
        description: trip.description,
        itinerary: { ...trip.itinerary },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (dayKey, value) => {
        setFormData(prev => ({
            ...prev,
            itinerary: {
                ...prev.itinerary,
                [dayKey]: {
                    ...prev.itinerary[dayKey],
                    fecha: value,
                },
            },
        }));
    };

    const handleActivityChange = (dayKey, activityIndex, field, value) => {
        setFormData(prev => {
            const updatedActivities = prev.itinerary[dayKey].actividades.map((actividad, idx) => {
                if (idx === activityIndex) {
                    return { ...actividad, [field]: value };
                }
                return actividad;
            });

            return {
                ...prev,
                itinerary: {
                    ...prev.itinerary,
                    [dayKey]: {
                        ...prev.itinerary[dayKey],
                        actividades: updatedActivities,
                    },
                },
            };
        });
    };

    const addActivity = (dayKey) => {
        setFormData(prev => ({
            ...prev,
            itinerary: {
                ...prev.itinerary,
                [dayKey]: {
                    ...prev.itinerary[dayKey],
                    actividades: [
                        ...prev.itinerary[dayKey].actividades,
                        { hora: '', actividad: '', ubicación: '' },
                    ],
                },
            },
        }));
    };

    const removeActivity = (dayKey, activityIndex) => {
        setFormData(prev => {
            const updatedActivities = prev.itinerary[dayKey].actividades.filter((_, idx) => idx !== activityIndex);
            return {
                ...prev,
                itinerary: {
                    ...prev.itinerary,
                    [dayKey]: {
                        ...prev.itinerary[dayKey],
                        actividades: updatedActivities,
                    },
                },
            };
        });
    };

    const handleAdditionalInfoChange = (dayKey, field, value) => {
        setFormData(prev => ({
            ...prev,
            itinerary: {
                ...prev.itinerary,
                [dayKey]: {
                    ...prev.itinerary[dayKey],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.put(`/trips/${trip._id}`, formData);
            onUpdate(response.data.trip);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Error al actualizar el itinerario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-content">
                <h3>Editar Itinerario</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Título:
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <h4>Itinerario:</h4>
                    {Object.keys(formData.itinerary).sort((a, b) => {
                        const dayA = parseInt(a.replace('dia', ''));
                        const dayB = parseInt(b.replace('dia', ''));
                        return dayA - dayB;
                    }).map((dayKey, dayIndex) => (
                        <div key={dayKey} className="itinerary-day-edit">
                            <h5>Día {dayIndex + 1}</h5>
                            <label>
                                Fecha:
                                <input
                                    type="date"
                                    value={formData.itinerary[dayKey].fecha}
                                    onChange={(e) => handleDateChange(dayKey, e.target.value)}
                                    required
                                />
                            </label>
                            <div className="activities-edit">
                                <h6>Actividades:</h6>
                                {formData.itinerary[dayKey].actividades.map((actividad, activityIndex) => (
                                    <div key={activityIndex} className="activity-edit">
                                        <label>
                                            Hora:
                                            <input
                                                type="time"
                                                value={actividad.hora}
                                                onChange={(e) => handleActivityChange(dayKey, activityIndex, 'hora', e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Actividad:
                                            <input
                                                type="text"
                                                value={actividad.actividad}
                                                onChange={(e) => handleActivityChange(dayKey, activityIndex, 'actividad', e.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Ubicación:
                                            <input
                                                type="text"
                                                value={actividad.ubicación}
                                                onChange={(e) => handleActivityChange(dayKey, activityIndex, 'ubicación', e.target.value)}
                                                required
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            className="btn btn-remove-activity"
                                            onClick={() => removeActivity(dayKey, activityIndex)}
                                        >
                                            Eliminar Actividad
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-add-activity"
                                    onClick={() => addActivity(dayKey)}
                                >
                                    Agregar Actividad
                                </button>
                            </div>
                            <div className="additional-info-edit">
                                <label>
                                    Alojamiento:
                                    <input
                                        type="text"
                                        value={formData.itinerary[dayKey].alojamiento}
                                        onChange={(e) => handleAdditionalInfoChange(dayKey, 'alojamiento', e.target.value)}
                                        required
                                    />
                                </label>
                                <label>
                                    Transporte:
                                    <input
                                        type="text"
                                        value={formData.itinerary[dayKey].transporte}
                                        onChange={(e) => handleAdditionalInfoChange(dayKey, 'transporte', e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                    {error && <div className="error-message">{error}</div>}
                    <div className="modal-actions">
                        <button type="submit" className="btn btn-save" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
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

export default EditTrip;