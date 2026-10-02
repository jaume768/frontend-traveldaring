import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

export const AuthContext = createContext();

// Máximo de viajes de la cuenta demo (lo impone el backend).
export const DEMO_MAX_TRIPS = 10;

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        user: null,
        loading: true,
    });

    useEffect(() => {
        const loadUser = async () => {
            if (authState.token) {
                try {
                    const response = await api.get('/users/profile');
                    setAuthState((prevState) => ({
                        ...prevState,
                        user: response.data.profile,
                        loading: false,
                    }));
                } catch (error) {
                    console.error(error);
                    // Solo se cierra la sesión si el servidor rechaza el token; un fallo
                    // de red o una petición cancelada no debe expulsar al usuario.
                    if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                        setAuthState({
                            token: null,
                            user: null,
                            loading: false,
                        });
                    } else {
                        setAuthState((prevState) => ({ ...prevState, loading: false }));
                    }
                }
            } else {
                setAuthState({
                    token: null,
                    user: null,
                    loading: false,
                });
            }
        };

        loadUser();
    }, [authState.token]);

    // Guarda el token y carga el perfil del usuario autenticado.
    const startSession = async (token) => {
        localStorage.setItem('token', token);
        setAuthState({
            token,
            user: jwtDecode(token),
            loading: false,
        });
        const profileResponse = await api.get('/users/profile');
        setAuthState({
            token,
            user: profileResponse.data.profile,
            loading: false,
        });
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            await startSession(response.data.token);
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Error al iniciar sesión';
            throw errorMessage;
        }
    };

    // Entra con la cuenta de demostración compartida (sin credenciales).
    const loginDemo = async () => {
        try {
            const response = await api.post('/auth/demo');
            await startSession(response.data.token);
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'No se pudo iniciar la demo';
            throw errorMessage;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({
            token: null,
            user: null,
            loading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, loginDemo, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
