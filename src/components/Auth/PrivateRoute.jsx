import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { authState } = useContext(AuthContext);

    if (authState.loading) {
        return <p className="loading-text">Cargando...</p>;
    }

    return authState.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
