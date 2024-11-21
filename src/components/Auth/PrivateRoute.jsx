import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { authState } = useContext(AuthContext);

    if (authState.loading) {
        return <div>Loading...</div>;
    }

    return authState.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;