import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const { register } = useContext(AuthContext);
    const history = useHistory();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const { username, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            history.push('/dashboard');
        } catch (errMsg) {
            setError(errMsg);
        }
    };

    return (
        <div className="auth-form">
            <h2>Registrarse</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;