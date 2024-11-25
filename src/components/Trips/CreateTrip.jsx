import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
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
            type: '', // Añadido
        },
        budget: {
            total: 0,
        },
        interests: [],
        accommodationPreferences: {
            type: '',
        },
        transportPreferences: {
            preferredMode: '',
        },
        foodPreferences: [],
        travelCompanion: {
            type: '',
        },
        activityLevel: {
            pace: '',
        },
        additionalPreferences: '',
        numberOfCities: 3,
    });

    const [error, setError] = useState('');

    const interestOptions = [
        { value: 'aventura', label: 'Aventura' },
        { value: 'cultura', label: 'Cultura' },
        { value: 'gastronomia', label: 'Gastronomía' },
        { value: 'relax', label: 'Relax' },
        { value: 'vida_nocturna', label: 'Vida Nocturna' },
    ];

    const foodOptions = [
        { value: 'local', label: 'Local' },
        { value: 'vegetariana', label: 'Vegetariana' },
        { value: 'vegana', label: 'Vegana' },
        { value: 'mariscos', label: 'Mariscos' },
        { value: 'internacional', label: 'Internacional' },
    ];

    const accommodationOptions = [
        { value: 'hotel', label: 'Hotel' },
        { value: 'hostel', label: 'Hostel' },
        { value: 'apartamento', label: 'Apartamento' },
        { value: 'villa', label: 'Villa' },
    ];

    const transportOptions = [
        { value: 'avion', label: 'Avión' },
        { value: 'tren', label: 'Tren' },
        { value: 'coche', label: 'Coche' },
        { value: 'autobus', label: 'Autobús' },
        { value: 'bicicleta', label: 'Bicicleta' },
    ];

    const travelCompanionOptions = [
        { value: 'solo', label: 'Solo' },
        { value: 'pareja', label: 'Pareja' },
        { value: 'familia', label: 'Familia' },
        { value: 'grupo', label: 'Grupo' },
    ];

    const activityLevelOptions = [
        { value: 'relajado', label: 'Relajado' },
        { value: 'moderado', label: 'Moderado' },
        { value: 'activo', label: 'Activo' },
        { value: 'intenso', label: 'Intenso' },
    ];

    const destinationTypeOptions = [
        { value: 'Playa', label: 'Playa' },
        { value: 'Montaña', label: 'Montaña' },
        { value: 'Ciudad', label: 'Ciudad' },
        { value: 'Campo', label: 'Campo' },
    ];

    const handleSelectChange = (selectedOptions, actionMeta) => {
        const { name } = actionMeta;
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData({
            ...formData,
            [name]: values,
        });
    };

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: type === 'checkbox' ? checked : value,
                },
            });
        } else if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/trips/create', formData);
            navigate(`/trips/${response.data._id}`);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al crear el itinerario');
        }
    };

    return (
        <div className="create-trip-form">
            <h2>Crear Nuevo Itinerario</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={onSubmit}>
                {/* Título */}
                <div className="form-group">
                    <label>Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={onChange}
                        required
                        placeholder="Ingrese el título del itinerario"
                    />
                </div>

                {/* Descripción */}
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        required
                        placeholder="Ingrese una descripción detallada"
                    ></textarea>
                </div>

                {/* Hacer Público */}
                <div className="form-group checkbox-group">
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

                {/* Fecha de Inicio */}
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

                {/* Fecha de Fin */}
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

                {/* País de Destino */}
                <div className="form-group">
                    <label>País de Destino</label>
                    <input
                        type="text"
                        name="destinationPreferences.country"
                        value={formData.destinationPreferences.country}
                        onChange={onChange}
                        required
                        placeholder="Ingrese el país de destino"
                    />
                </div>

                {/* Tipo de Destino (Añadido) */}
                <div className="form-group">
                    <label>Tipo de Destino</label>
                    <Select
                        name="destinationPreferences.type"
                        options={destinationTypeOptions}
                        isClearable
                        value={destinationTypeOptions.find(option => option.value === formData.destinationPreferences.type)}
                        onChange={(selectedOption) => {
                            setFormData({
                                ...formData,
                                destinationPreferences: {
                                    ...formData.destinationPreferences,
                                    type: selectedOption ? selectedOption.value : '',
                                },
                            });
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Seleccione un tipo de destino"
                    />
                </div>

                {/* Presupuesto Total */}
                <div className="form-group">
                    <label>Presupuesto Total (USD)</label>
                    <input
                        type="number"
                        name="budget.total"
                        value={formData.budget.total}
                        onChange={onChange}
                        required
                        min="0"
                        placeholder="Ingrese el presupuesto total"
                    />
                </div>

                {/* Número de Ciudades */}
                <div className="form-group">
                    <label>Número de Ciudades</label>
                    <input
                        type="number"
                        name="numberOfCities"
                        value={formData.numberOfCities}
                        onChange={onChange}
                        required
                        min="1"
                        placeholder="Ingrese el número de ciudades"
                    />
                </div>

                {/* Intereses */}
                <div className="form-group">
                    <label>Intereses</label>
                    <Select
                        name="interests"
                        options={interestOptions}
                        isMulti
                        value={interestOptions.filter(option => formData.interests.includes(option.value))}
                        onChange={handleSelectChange}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Seleccione sus intereses"
                    />
                </div>

                {/* Preferencias de Comida */}
                <div className="form-group">
                    <label>Preferencias de Comida</label>
                    <Select
                        name="foodPreferences"
                        options={foodOptions}
                        isMulti
                        value={foodOptions.filter(option => formData.foodPreferences.includes(option.value))}
                        onChange={handleSelectChange}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Seleccione sus preferencias de comida"
                    />
                </div>

                {/* Preferencia de Alojamiento */}
                <div className="form-group">
                    <label>Preferencia de Alojamiento</label>
                    <Select
                        name="accommodationPreferences.type"
                        options={accommodationOptions}
                        isClearable
                        value={accommodationOptions.find(option => option.value === formData.accommodationPreferences.type)}
                        onChange={(selectedOption) => {
                            setFormData({
                                ...formData,
                                accommodationPreferences: {
                                    ...formData.accommodationPreferences,
                                    type: selectedOption ? selectedOption.value : '',
                                },
                            });
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Seleccione una opción"
                    />
                </div>

                {/* Preferencia de Transporte */}
                <div className="form-group">
                    <label>Preferencia de Transporte</label>
                    <Select
                        name="transportPreferences.preferredMode"
                        options={transportOptions}
                        isClearable
                        value={transportOptions.find(option => option.value === formData.transportPreferences.preferredMode)}
                        onChange={(selectedOption) => {
                            setFormData({
                                ...formData,
                                transportPreferences: {
                                    ...formData.transportPreferences,
                                    preferredMode: selectedOption ? selectedOption.value : '',
                                },
                            });
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Seleccione una opción"
                    />
                </div>

                {/* Compañero de Viaje */}
                <div className="form-group">
                    <label>Compañero de Viaje</label>
                    <Select
                        name="travelCompanion.type"
                        options={travelCompanionOptions}
                        isClearable
                        value={travelCompanionOptions.find(option => option.value === formData.travelCompanion.type)}
                        onChange={(selectedOption) => {
                            setFormData({
                                ...formData,
                                travelCompanion: {
                                    ...formData.travelCompanion,
                                    type: selectedOption ? selectedOption.value : '',
                                },
                            });
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Seleccione una opción"
                    />
                </div>

                {/* Nivel de Actividad */}
                <div className="form-group">
                    <label>Nivel de Actividad</label>
                    <Select
                        name="activityLevel.pace"
                        options={activityLevelOptions}
                        isClearable
                        value={activityLevelOptions.find(option => option.value === formData.activityLevel.pace)}
                        onChange={(selectedOption) => {
                            setFormData({
                                ...formData,
                                activityLevel: {
                                    ...formData.activityLevel,
                                    pace: selectedOption ? selectedOption.value : '',
                                },
                            });
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Seleccione una opción"
                    />
                </div>

                {/* Preferencias Adicionales */}
                <div className="form-group">
                    <label>Preferencias Adicionales</label>
                    <textarea
                        name="additionalPreferences"
                        value={formData.additionalPreferences}
                        onChange={onChange}
                        placeholder="Escribe cualquier preferencia adicional..."
                    ></textarea>
                </div>

                {/* Botón de Envío */}
                <button type="submit" className="btn-primary">
                    Crear Itinerario
                </button>
            </form>
        </div>
    );
};

export default CreateTrip;