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

    const { username, email, bio, profilePicture } = formData;

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
        <div className="edit-profile">
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
                    <label>Biografía</label>
                    <textarea
                        name="bio"
                        value={bio}
                        onChange={onChange}
                        placeholder="Cuéntanos sobre ti..."
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Foto de Perfil</label>
                    <input
                        type="text"
                        name="profilePicture"
                        value={profilePicture}
                        onChange={onChange}
                        placeholder="URL de la imagen"
                    />
                </div>


                <button type="submit" className="btn-primary">
                    Actualizar Perfil
                </button>
            </form>
        </div>
    );
};

export default EditProfile;