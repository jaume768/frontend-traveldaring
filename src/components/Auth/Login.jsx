import React, { useState, useContext } from 'react';
import { AuthContext, DEMO_MAX_TRIPS } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import DemoButton from './DemoButton';
import './css/Auth.css';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (errMsg) {
            setError(errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <aside className="auth-visual" style={{ backgroundImage: 'url(/images/fondo.jpg)' }}>
                    <div className="auth-visual-content">
                        <h2>Planifica tu próximo viaje con IA</h2>
                        <ul>
                            <li><FaCheckCircle /> Itinerarios día a día en segundos</li>
                            <li><FaCheckCircle /> Actividades reales en cada ciudad</li>
                            <li><FaCheckCircle /> Edita, comparte y descarga en PDF</li>
                        </ul>
                    </div>
                </aside>

                <section className="auth-form-container">
                    <h1 className="auth-title">Iniciar Sesión</h1>
                    <p className="auth-subtitle">Entra con tu cuenta o prueba la aplicación con el usuario demo.</p>

                    {error && <div className="error-message">{error}</div>}

                    <div className="demo-box">
                        <div>
                            <strong>Usuario demo</strong>
                            <span>Sin registro · hasta {DEMO_MAX_TRIPS} viajes</span>
                        </div>
                        <DemoButton className="btn-primary" onError={setError}>Probar la demo</DemoButton>
                    </div>

                    <div className="auth-divider"><span>o entra con tu cuenta</span></div>

                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-with-icon">
                                <FaEnvelope aria-hidden="true" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    placeholder="Ingresa tu email"
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input-with-icon">
                                <FaLock aria-hidden="true" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-secondary btn-block auth-button" disabled={submitting}>
                            {submitting ? 'Entrando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Login;
