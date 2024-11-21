import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/CreateTrip.css';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        public: true,
        travelDates: {
            startDate: '',
            endDate: '',
        },
        destinationPreferences: {
            country: '',
        },
        budget: {
            total: 0,
        },
    });

    const [error, setError] = useState('');

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('travelDates.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                travelDates: {
                    ...formData.travelDates,
                    [field]: value,
                },
            });
        } else if (name.includes('destinationPreferences.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                destinationPreferences: {
                    ...formData.destinationPreferences,
                    [field]: value,
                },
            });
        } else if (name.includes('budget.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                budget: {
                    ...formData.budget,
                    [field]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/trips/create', formData);
            navigate(`/trips/${response.data._id}`);
        } catch (err) {
            setError(err.response.data.msg || 'Error al crear el itinerario');
        }
    };

    return (
        <div className="create-trip-form">
            <h2>Crear Nuevo Itinerario</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="public"
                            checked={formData.public}
                            onChange={onChange}
                        />
                        Hacer público
                    </label>
                </div>

                <div className="form-group">
                    <label>Fecha de Inicio</label>
                    <input
                        type="date"
                        name="travelDates.startDate"
                        value={formData.travelDates.startDate}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Fecha de Fin</label>
                    <input
                        type="date"
                        name="travelDates.endDate"
                        value={formData.travelDates.endDate}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>País de Destino</label>
                    <input
                        type="text"
                        name="destinationPreferences.country"
                        value={formData.destinationPreferences.country}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Presupuesto Total</label>
                    <input
                        type="number"
                        name="budget.total"
                        value={formData.budget.total}
                        onChange={onChange}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">
                    Crear Itinerario
                </button>
            </form>
        </div>
    );
};

export default CreateTrip;