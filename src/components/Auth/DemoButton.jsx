import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlaneDeparture } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

// Entra con la cuenta demo (o va directo a "Mis viajes" si ya hay sesión).
const DemoButton = ({ className = 'btn-primary', children = 'Probar la demo', onError }) => {
    const { authState, loginDemo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (authState.token) {
            navigate('/dashboard');
            return;
        }
        setLoading(true);
        try {
            await loginDemo();
            navigate('/dashboard');
        } catch (errMsg) {
            if (onError) {
                onError(typeof errMsg === 'string' ? errMsg : 'No se pudo iniciar la demo');
            } else {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button type="button" className={className} onClick={handleClick} disabled={loading}>
            <FaPlaneDeparture aria-hidden="true" />
            {loading ? 'Entrando...' : children}
        </button>
    );
};

export default DemoButton;
