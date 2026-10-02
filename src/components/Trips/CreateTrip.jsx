import React, { useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './css/CreateTrip.css';
import countries from 'i18n-iso-countries';
import esLocale from 'i18n-iso-countries/langs/es.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faInfoCircle, 
    faGlobe, 
    faCalendarAlt, 
    faDollarSign, 
    faCity, 
    faHeart, 
    faUtensils, 
    faHotel, 
    faCar, 
    faUserFriends, 
    faRunning, 
    faPlusCircle,
    faPlane,
    faCheck,
    faArrowLeft,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { format as formatISODate } from 'date-fns';

countries.registerLocale(esLocale);
registerLocale('es', es);

// Fases del formulario y los campos que se validan al salir de cada una.
const STEPS = [
    { label: 'Lo básico', fields: ['title', 'description'] },
    {
        label: 'Fechas y destino',
        fields: [
            'travelDates.startDate',
            'travelDates.endDate',
            'destinationPreferences.country',
            'destinationPreferences.countryName',
            'destinationPreferences.type',
        ],
    },
    { label: 'Presupuesto', fields: ['budget.total', 'numberOfCities'] },
    {
        label: 'Preferencias',
        fields: [
            'interests',
            'foodPreferences',
            'accommodationPreferences.type',
            'transportPreferences.preferredMode',
            'travelCompanion.type',
            'activityLevel.pace',
        ],
    },
    { label: 'Últimos detalles', fields: [] },
];

const CreateTrip = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        public: true,
        travelDates: {
            // Renombrados a startDate y endDate
            startDate: null,
            endDate: null,
        },
        destinationPreferences: {
            country: '', 
            countryName: '',
            type: '',
            region: '',
            climate: '',
        },
        budget: {
            total: '',
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
        numberOfCities: '',
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);

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
        { value: 'coche', label: 'Coche' },
        { value: 'tren', label: 'Tren' },
        { value: 'autobus', label: 'Autobús' },
        { value: 'tren y autobus', label: 'Tren y Autobús' },
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

    const countryOptions = Object.entries(countries.getNames('es')).map(([code, name]) => ({
        value: code,
        label: name,
    })).sort((a, b) => a.label.localeCompare(b.label));

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevState => {
                const updatedParent = {
                    ...prevState[parent],
                    [child]: type === 'checkbox' ? checked : value,
                };
                
                // Control condicional si es necesario
                if (parent === 'travelDates' && child === 'startDate') {
                    const newStartDate = new Date(value);
                    const currentEndDate = new Date(prevState.travelDates.endDate);
                    if (prevState.travelDates.endDate && currentEndDate < newStartDate) {
                        updatedParent.endDate = null;
                    }
                }

                return {
                    ...prevState,
                    [parent]: updatedParent,
                };
            });
        } else if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    // Devuelve todos los errores de validación del formulario (por nombre de campo).
    const collectErrors = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido.';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida.';
        }
        if (!formData.travelDates.startDate) {
            newErrors['travelDates.startDate'] = 'La fecha de inicio es requerida.';
        }
        if (!formData.travelDates.endDate) {
            newErrors['travelDates.endDate'] = 'La fecha de fin es requerida.';
        } else if (
            formData.travelDates.startDate && 
            formData.travelDates.endDate < formData.travelDates.startDate
        ) {
            newErrors['travelDates.endDate'] = 'La fecha de fin debe ser posterior a la de inicio.';
        }
        if (!formData.destinationPreferences.country) {
            newErrors['destinationPreferences.country'] = 'El país de destino es requerido.';
        }
        if (!formData.destinationPreferences.countryName) {
            newErrors['destinationPreferences.countryName'] = 'El nombre del país es requerido.';
        }
        if (!formData.destinationPreferences.type) {
            newErrors['destinationPreferences.type'] = 'El tipo de destino es requerido.';
        }
        if (formData.budget.total === '' || formData.budget.total === null) {
            newErrors['budget.total'] = 'El presupuesto total es requerido.';
        } else if (formData.budget.total < 0) {
            newErrors['budget.total'] = 'El presupuesto total no puede ser negativo.';
        }
        if (!formData.numberOfCities) {
            newErrors.numberOfCities = 'El número de ciudades es requerido.';
        } else if (formData.numberOfCities < 1) {
            newErrors.numberOfCities = 'El número de ciudades debe ser al menos 1.';
        }
        if (formData.interests.length === 0) {
            newErrors.interests = 'Al menos un interés es requerido.';
        }
        if (formData.foodPreferences.length === 0) {
            newErrors.foodPreferences = 'Al menos una preferencia de comida es requerida.';
        }
        if (!formData.accommodationPreferences.type) {
            newErrors['accommodationPreferences.type'] = 'La preferencia de alojamiento es requerida.';
        }
        if (!formData.transportPreferences.preferredMode) {
            newErrors['transportPreferences.preferredMode'] = 'La preferencia de transporte es requerida.';
        }
        if (!formData.travelCompanion.type) {
            newErrors['travelCompanion.type'] = 'El compañero de viaje es requerido.';
        }
        if (!formData.activityLevel.pace) {
            newErrors['activityLevel.pace'] = 'El nivel de actividad es requerido.';
        }
        return newErrors;
    };

    const errorsForStep = (allErrors, stepIndex) =>
        Object.fromEntries(STEPS[stepIndex].fields.filter((field) => allErrors[field]).map((field) => [field, allErrors[field]]));

    const goToStep = (target) => {
        setStep(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Avanza solo si la fase actual está completa.
    const nextStep = () => {
        const stepErrors = errorsForStep(collectErrors(), step);
        setErrors(stepErrors);
        if (Object.keys(stepErrors).length === 0) {
            goToStep(Math.min(step + 1, STEPS.length - 1));
        }
    };

    const prevStep = () => {
        setErrors({});
        goToStep(Math.max(step - 1, 0));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Enter en una fase intermedia equivale a "Siguiente".
        if (step < STEPS.length - 1) {
            nextStep();
            return;
        }

        setError('');
        const allErrors = collectErrors();
        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            const firstInvalid = STEPS.findIndex((s) => s.fields.some((field) => allErrors[field]));
            goToStep(firstInvalid === -1 ? 0 : firstInvalid);
            return;
        }

        setLoading(true);
        const dataToSubmit = {
            ...formData,
            // Fechas como texto (día local, sin tocar el estado del formulario).
            travelDates: {
                startDate: formatISODate(formData.travelDates.startDate, 'yyyy-MM-dd'),
                endDate: formatISODate(formData.travelDates.endDate, 'yyyy-MM-dd'),
            },
            foodPreferences: { cuisine: formData.foodPreferences },
            additionalPreferences: formData.additionalPreferences.trim() || 'Nada',
        };

        try {
            const response = await api.post('/trips/create', dataToSubmit);
            navigate(`/trips/${response.data._id}`);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al crear el itinerario');
        } finally {
            setLoading(false);
        }
    };

    const labelOf = (options, value) => options.find((option) => option.value === value)?.label || '—';
    const formatDate = (date) => (date ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
    const isLastStep = step === STEPS.length - 1;

    return (
        <div className="create-trip-form-container">
            <span className="page-eyebrow">Nuevo viaje</span>
            <h2>Crear Nuevo Itinerario</h2>
            <p className="create-trip-intro">Cuéntanos cómo quieres viajar y la IA preparará tu plan día a día.</p>
            {error && <div className="error-message">{error}</div>}

            <ol className="wizard-steps" style={{ '--wizard-progress': `${(step / (STEPS.length - 1)) * 100}%` }}>
                {STEPS.map((item, index) => (
                    <li
                        key={item.label}
                        className={`wizard-step ${index === step ? 'is-current' : ''} ${index < step ? 'is-done' : ''}`}
                    >
                        <button
                            type="button"
                            onClick={() => index < step && goToStep(index)}
                            disabled={index > step}
                            aria-current={index === step ? 'step' : undefined}
                        >
                            <span className="wizard-step-number">{index < step ? <FontAwesomeIcon icon={faCheck} /> : index + 1}</span>
                            <span className="wizard-step-label">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ol>

            {/*
              Agregamos autoComplete="off" al form para reforzar
              que no se muestre autocompletado de tarjeta
            */}
            <form onSubmit={onSubmit} autoComplete="off" noValidate>
                <section className="form-section" hidden={step !== 0}>
                    <h3><FontAwesomeIcon icon={faInfoCircle} /> Información Básica *</h3>
                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            placeholder="Ingrese el título del itinerario"
                            className={errors.title ? 'input-error' : ''}
                            // autoComplete adicionalmente en off
                            autoComplete="off"
                        />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faInfoCircle} className="input-icon" />
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            placeholder="Ingrese una descripción detallada"
                            className={errors.description ? 'input-error' : ''}
                            autoComplete="off"
                        ></textarea>
                        {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <FontAwesomeIcon icon={faGlobe} className="input-icon" />
                            <input
                                type="checkbox"
                                name="public"
                                checked={formData.public}
                                onChange={onChange}
                            />
                            Hacer público
                        </label>
                    </div>
                </section>

                <section className="form-section" hidden={step !== 1}>
                    <h3>Fechas del Viaje *</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
                                Fecha de Inicio
                            </label>
                            <DatePicker
                                selected={formData.travelDates.startDate}
                                onChange={(date) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        travelDates: {
                                            ...prevState.travelDates,
                                            startDate: date,
                                            endDate:
                                                prevState.travelDates.endDate && date && prevState.travelDates.endDate < date
                                                    ? null
                                                    : prevState.travelDates.endDate,
                                        },
                                    }));
                                    setErrors(prevErrors => ({
                                        ...prevErrors,
                                        'travelDates.startDate': '',
                                    }));
                                }}
                                selectsStart
                                startDate={formData.travelDates.startDate}
                                endDate={formData.travelDates.endDate}
                                minDate={new Date()} // Fecha mínima: hoy
                                placeholderText="Seleccione la fecha de inicio"
                                className={errors['travelDates.startDate'] ? 'input-error' : ''}
                                dateFormat="yyyy-MM-dd"
                                locale="es"
                                // Importante para que iOS no pida tarjeta:
                                autoComplete="off"
                                name="startDate"
                            />
                            {errors['travelDates.startDate'] && (
                                <span className="error-text">{errors['travelDates.startDate']}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
                                Fecha de Fin
                            </label>
                            <DatePicker
                                selected={formData.travelDates.endDate}
                                onChange={(date) => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        travelDates: {
                                            ...prevState.travelDates,
                                            endDate: date,
                                        },
                                    }));
                                    setErrors(prevErrors => ({
                                        ...prevErrors,
                                        'travelDates.endDate': '',
                                    }));
                                }}
                                selectsEnd
                                startDate={formData.travelDates.startDate}
                                endDate={formData.travelDates.endDate}
                                minDate={formData.travelDates.startDate || new Date()}
                                placeholderText="Seleccione la fecha de fin"
                                className={errors['travelDates.endDate'] ? 'input-error' : ''}
                                dateFormat="yyyy-MM-dd"
                                locale="es"
                                disabled={!formData.travelDates.startDate}
                                autoComplete="off"
                                name="endDate"
                            />
                            {errors['travelDates.endDate'] && (
                                <span className="error-text">{errors['travelDates.endDate']}</span>
                            )}
                        </div>
                    </div>
                </section>

                <section className="form-section" hidden={step !== 1}>
                    <h3>Destino *</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faGlobe} className="input-icon" />
                                País de Destino
                            </label>
                            <Select
                                name="destinationPreferences.country"
                                options={countryOptions}
                                isClearable
                                value={
                                    countryOptions.find(
                                        option =>
                                            option.value === formData.destinationPreferences.country
                                    ) || null
                                }
                                onChange={(selectedOption) => {
                                    setFormData({
                                        ...formData,
                                        destinationPreferences: {
                                            ...formData.destinationPreferences,
                                            country: selectedOption ? selectedOption.value : '',
                                            countryName: selectedOption ? selectedOption.label : '',
                                        },
                                    });
                                    setErrors(prevErrors => ({
                                        ...prevErrors,
                                        'destinationPreferences.country': '',
                                        'destinationPreferences.countryName': '',
                                    }));
                                }}
                                className={`react-select-container ${
                                    errors['destinationPreferences.country'] ? 'select-error' : ''
                                }`}
                                classNamePrefix="react-select"
                                placeholder="Seleccione un país de destino"
                            />
                            {errors['destinationPreferences.country'] && (
                                <span className="error-text">
                                    {errors['destinationPreferences.country']}
                                </span>
                            )}
                            {errors['destinationPreferences.countryName'] && (
                                <span className="error-text">
                                    {errors['destinationPreferences.countryName']}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faCity} className="input-icon" />
                                Tipo de Destino
                            </label>
                            <Select
                                name="destinationPreferences.type"
                                options={destinationTypeOptions}
                                isClearable
                                value={
                                    destinationTypeOptions.find(
                                        option =>
                                            option.value === formData.destinationPreferences.type
                                    ) || null
                                }
                                onChange={(selectedOption) => {
                                    setFormData({
                                        ...formData,
                                        destinationPreferences: {
                                            ...formData.destinationPreferences,
                                            type: selectedOption ? selectedOption.value : '',
                                        },
                                    });
                                    setErrors(prevErrors => ({
                                        ...prevErrors,
                                        'destinationPreferences.type': '',
                                    }));
                                }}
                                className={`react-select-container ${
                                    errors['destinationPreferences.type'] ? 'select-error' : ''
                                }`}
                                classNamePrefix="react-select"
                                placeholder="Seleccione un tipo de destino"
                            />
                            {errors['destinationPreferences.type'] && (
                                <span className="error-text">
                                    {errors['destinationPreferences.type']}
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                <section className="form-section" hidden={step !== 2}>
                    <h3>Presupuesto y Logística *</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faDollarSign} className="input-icon" />
                                Presupuesto Total (USD)
                            </label>
                            <input
                                type="number"
                                name="budget.total"
                                value={formData.budget.total}
                                onChange={onChange}
                                min="0"
                                placeholder="Ingrese el presupuesto total"
                                className={errors['budget.total'] ? 'input-error' : ''}
                                autoComplete="off"
                            />
                            {errors['budget.total'] && (
                                <span className="error-text">{errors['budget.total']}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                <FontAwesomeIcon icon={faCity} className="input-icon" />
                                Número de Ciudades
                            </label>
                            <input
                                type="number"
                                name="numberOfCities"
                                value={formData.numberOfCities}
                                onChange={onChange}
                                min="1"
                                placeholder="Ingrese el número de ciudades"
                                className={errors.numberOfCities ? 'input-error' : ''}
                                autoComplete="off"
                            />
                            {errors.numberOfCities && (
                                <span className="error-text">{errors.numberOfCities}</span>
                            )}
                        </div>
                    </div>
                </section>

                <section className="form-section" hidden={step !== 3}>
                    <h3>Preferencias *</h3>
                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faHeart} className="input-icon" />
                            Intereses
                        </label>
                        <Select
                            name="interests"
                            options={interestOptions}
                            isMulti
                            value={interestOptions.filter(option =>
                                formData.interests.includes(option.value)
                            )}
                            onChange={(selectedOptions) => {
                                const values = selectedOptions
                                    ? selectedOptions.map(option => option.value)
                                    : [];
                                setFormData({
                                    ...formData,
                                    interests: values,
                                });
                                setErrors(prevErrors => ({ ...prevErrors, interests: '' }));
                            }}
                            className={`react-select-container ${
                                errors.interests ? 'select-error' : ''
                            }`}
                            classNamePrefix="react-select"
                            placeholder="Seleccione sus intereses"
                        />
                        {errors.interests && (
                            <span className="error-text">{errors.interests}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faUtensils} className="input-icon" />
                            Preferencias de Comida
                        </label>
                        <Select
                            name="foodPreferences"
                            options={foodOptions}
                            isMulti
                            value={foodOptions.filter(option =>
                                formData.foodPreferences.includes(option.value)
                            )}
                            onChange={(selectedOptions) => {
                                const values = selectedOptions
                                    ? selectedOptions.map(option => option.value)
                                    : [];
                                setFormData({
                                    ...formData,
                                    foodPreferences: values,
                                });
                                setErrors(prevErrors => ({ ...prevErrors, foodPreferences: '' }));
                            }}
                            className={`react-select-container ${
                                errors.foodPreferences ? 'select-error' : ''
                            }`}
                            classNamePrefix="react-select"
                            placeholder="Seleccione sus preferencias de comida"
                        />
                        {errors.foodPreferences && (
                            <span className="error-text">{errors.foodPreferences}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faHotel} className="input-icon" />
                            Preferencia de Alojamiento
                        </label>
                        <Select
                            name="accommodationPreferences.type"
                            options={accommodationOptions}
                            isClearable
                            value={
                                accommodationOptions.find(
                                    option =>
                                        option.value ===
                                        formData.accommodationPreferences.type
                                ) || null
                            }
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    accommodationPreferences: {
                                        ...formData.accommodationPreferences,
                                        type: selectedOption ? selectedOption.value : '',
                                    },
                                });
                                setErrors(prevErrors => ({
                                    ...prevErrors,
                                    'accommodationPreferences.type': '',
                                }));
                            }}
                            className={`react-select-container ${
                                errors['accommodationPreferences.type'] ? 'select-error' : ''
                            }`}
                            classNamePrefix="react-select"
                            placeholder="Seleccione una opción"
                        />
                        {errors['accommodationPreferences.type'] && (
                            <span className="error-text">
                                {errors['accommodationPreferences.type']}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faCar} className="input-icon" />
                            Preferencia de Transporte
                        </label>
                        <Select
                            name="transportPreferences.preferredMode"
                            options={transportOptions}
                            isClearable
                            value={
                                transportOptions.find(
                                    option =>
                                        option.value ===
                                        formData.transportPreferences.preferredMode
                                ) || null
                            }
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    transportPreferences: {
                                        ...formData.transportPreferences,
                                        preferredMode: selectedOption ? selectedOption.value : '',
                                    },
                                });
                                setErrors(prevErrors => ({
                                    ...prevErrors,
                                    'transportPreferences.preferredMode': '',
                                }));
                            }}
                            className={`react-select-container ${
                                errors['transportPreferences.preferredMode'] ? 'select-error' : ''
                            }`}
                            classNamePrefix="react-select"
                            placeholder="Seleccione una opción"
                        />
                        {errors['transportPreferences.preferredMode'] && (
                            <span className="error-text">
                                {errors['transportPreferences.preferredMode']}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faUserFriends} className="input-icon" />
                            Compañero de Viaje
                        </label>
                        <Select
                            name="travelCompanion.type"
                            options={travelCompanionOptions}
                            isClearable
                            value={
                                travelCompanionOptions.find(
                                    option => option.value === formData.travelCompanion.type
                                ) || null
                            }
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    travelCompanion: {
                                        ...formData.travelCompanion,
                                        type: selectedOption ? selectedOption.value : '',
                                    },
                                });
                                setErrors(prevErrors => ({
                                    ...prevErrors,
                                    'travelCompanion.type': '',
                                }));
                            }}
                            className={`react-select-container ${
                                errors['travelCompanion.type'] ? 'select-error' : ''
                            }`}
                            classNamePrefix="react-select"
                            placeholder="Seleccione una opción"
                        />
                        {errors['travelCompanion.type'] && (
                            <span className="error-text">{errors['travelCompanion.type']}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faRunning} className="input-icon" />
                            Nivel de Actividad
                        </label>
                        <Select
                            name="activityLevel.pace"
                            options={activityLevelOptions}
                            isClearable
                            value={
                                activityLevelOptions.find(
                                    option => option.value === formData.activityLevel.pace
                                ) || null
                            }
                            onChange={(selectedOption) => {
                                setFormData({
                                    ...formData,
                                    activityLevel: {
                                        ...formData.activityLevel,
                                        pace: selectedOption ? selectedOption.value : '',
                                    },
                                });
                                setErrors(prevErrors => ({
                                    ...prevErrors,
                                    'activityLevel.pace': '',
                                }));
                            }}
                            className={`react-select-container ${
                                errors['activityLevel.pace'] ? 'select-error' : ''
                            }`}
                            classNamePrefix="react-select"
                            placeholder="Seleccione una opción"
                        />
                        {errors['activityLevel.pace'] && (
                            <span className="error-text">{errors['activityLevel.pace']}</span>
                        )}
                    </div>
                </section>

                <section className="form-section" hidden={step !== 4}>
                    <h3>
                        <FontAwesomeIcon icon={faPlusCircle} /> Preferencias Adicionales
                    </h3>
                    <div className="form-group">
                        <label>
                            <FontAwesomeIcon icon={faInfoCircle} className="input-icon" />
                            Preferencias Adicionales
                        </label>
                        <textarea
                            name="additionalPreferences"
                            value={formData.additionalPreferences}
                            onChange={onChange}
                            placeholder="Escribe cualquier preferencia adicional..."
                            className={errors.additionalPreferences ? 'input-error' : ''}
                            autoComplete="off"
                        ></textarea>
                    </div>
                </section>

                {isLastStep && (
                    <section className="form-section trip-summary">
                        <h3><FontAwesomeIcon icon={faCheck} /> Resumen</h3>
                        <dl>
                            <div><dt>Título</dt><dd>{formData.title || '—'}</dd></div>
                            <div><dt>Fechas</dt><dd>{formatDate(formData.travelDates.startDate)} - {formatDate(formData.travelDates.endDate)}</dd></div>
                            <div><dt>Destino</dt><dd>{formData.destinationPreferences.countryName || '—'} · {formData.destinationPreferences.type || '—'}</dd></div>
                            <div><dt>Presupuesto</dt><dd>{formData.budget.total || '—'} USD · {formData.numberOfCities || '—'} ciudad(es)</dd></div>
                            <div><dt>Intereses</dt><dd>{formData.interests.map((value) => labelOf(interestOptions, value)).join(', ') || '—'}</dd></div>
                            <div><dt>Comida</dt><dd>{formData.foodPreferences.map((value) => labelOf(foodOptions, value)).join(', ') || '—'}</dd></div>
                            <div><dt>Alojamiento</dt><dd>{labelOf(accommodationOptions, formData.accommodationPreferences.type)}</dd></div>
                            <div><dt>Transporte</dt><dd>{labelOf(transportOptions, formData.transportPreferences.preferredMode)}</dd></div>
                            <div><dt>Compañía</dt><dd>{labelOf(travelCompanionOptions, formData.travelCompanion.type)}</dd></div>
                            <div><dt>Ritmo</dt><dd>{labelOf(activityLevelOptions, formData.activityLevel.pace)}</dd></div>
                        </dl>
                    </section>
                )}

                <div className="wizard-nav">
                    {step > 0 ? (
                        <button type="button" className="btn-secondary" onClick={prevStep} disabled={loading}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Atrás
                        </button>
                    ) : <span />}
                    <span className="wizard-count">Paso {step + 1} de {STEPS.length}</span>
                    {isLastStep ? (
                        <button key="submit" type="submit" className="btn-primary" disabled={loading}>
                            <FontAwesomeIcon icon={faPlane} /> Crear Itinerario
                        </button>
                    ) : (
                        <button key="next" type="button" className="btn-primary" onClick={nextStep}>
                            Siguiente <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    )}
                </div>
            </form>

            {loading && (
                <div className="loading-overlay">
                    <div className="trip-loader" role="status">
                        <div className="trip-loader-orbit">
                            <FontAwesomeIcon icon={faPlane} className="trip-loader-plane" />
                        </div>
                        <h3>Preparando tu itinerario</h3>
                        <p>
                            La IA está eligiendo ciudades, actividades y alojamiento
                            <span className="trip-loader-dots"><span>.</span><span>.</span><span>.</span></span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTrip;