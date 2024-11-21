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
                    const decoded = jwtDecode(authState.token);
                    const response = await api.get('/users/profile');
                    setAuthState({
                        ...authState,
                        user: response.data.profile,
                        loading: false,
                    });
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
    }, []);

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
            throw error.response.data.msg || 'Error al iniciar sesión';
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', { username, email, password });
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
            throw error.response.data.msg || 'Error al registrarse';
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
