import React, { useState } from 'react';
import api from '../../utils/api';
import './css/EditProfile.css';

const EditProfile = ({ profile, refreshProfile }) => {
    const [formData, setFormData] = useState({
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        profilePicture: profile.profilePicture || '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { username, bio } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', formData);
            setSuccess(response.data.msg);
            setError('');
            refreshProfile();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response.data.msg || 'Error al actualizar el perfil');
            setSuccess('');
        }
    };

    return (
        <div className="card edit-profile">
            <h3>Editar Perfil</h3>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
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
                    <label>Biografía</label>
                    <textarea
                        name="bio"
                        value={bio}
                        onChange={onChange}
                        placeholder="Cuéntanos sobre ti..."
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary">
                    Actualizar Perfil
                </button>
            </form>
        </div>
    );
};

export default EditProfile;