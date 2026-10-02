import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

const VerifyEmailPage = () => {
    const [message, setMessage] = useState('Verificando...');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');

        if (token && email) {
            verifyEmail(token, email);
        } else {
            setMessage('Faltan parámetros de verificación.');
        }
    }, [location.search]);

    const verifyEmail = async (token, email) => {
        try {
            const response = await api.get(`/auth/verify?token=${token}&email=${email}`);
            setMessage(response.data.msg || 'Cuenta verificada exitosamente. Ya puedes iniciar sesión.');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Error al verificar la cuenta. Por favor, inténtalo de nuevo.');
        }
    }

    return (
        <div className="page page--narrow" style={{ textAlign: 'center' }}>
            <h1>{message}</h1>
        </div>
    );
};

export default VerifyEmailPage;