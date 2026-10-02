import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
});

export const uploadTripImage = (tripId, imageFile, token) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return api.post(`/trips/${tripId}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token,
        },
    });
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const uploadProfilePicture = (imageFile, token) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return api.post('/users/upload-profile-picture', formData, {
        headers: {
            'x-auth-token': token,
        },
    });
};

export default api;
