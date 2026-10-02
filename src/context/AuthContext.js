import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

export const AuthContext = createContext();

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
                    localStorage.removeItem('token');
                    setAuthState({
                        token: null,
                        user: null,
                        loading: false,
                    });
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

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setAuthState({
                token: response.data.token,
                user: jwtDecode(response.data.token),
                loading: false,
            });
            const profileResponse = await api.get('/users/profile');
            setAuthState({
                token: response.data.token,
                user: profileResponse.data.profile,
                loading: false,
            });
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Error al iniciar sesión';
            throw errorMessage;
        }
    };

    // Devuelve true si el backend inicia la sesión al registrarse (cuenta
    // verificada automáticamente) y false si hay que verificar el email antes.
    const register = async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', { username, email, password });
            const token = response.data.token;
            if (!token) {
                return false;
            }
            localStorage.setItem('token', token);
            setAuthState({
                token,
                user: jwtDecode(token),
                loading: false,
            });
            try {
                const profileResponse = await api.get('/users/profile');
                setAuthState({
                    token,
                    user: profileResponse.data.profile,
                    loading: false,
                });
            } catch (profileError) {
                console.error("Error al obtener el perfil del usuario después del registro:", profileError);
            }
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Error al registrarse';
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
        <AuthContext.Provider value={{ authState, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};