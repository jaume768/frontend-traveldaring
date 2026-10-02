import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import api, { uploadProfilePicture } from '../utils/api';
import FriendsList from '../components/Profile/FriendsList';
import FriendRequests from '../components/Profile/FriendRequests';
import EditProfile from '../components/Profile/EditProfile';
import { FaCamera, FaSignOutAlt, FaUserPlus, FaUserMinus, FaTimes } from 'react-icons/fa';
import './css/ProfilePage.css';

const ProfilePage = () => {
    const { authState, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFriend, setIsFriend] = useState(false);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [friendsUpdated, setFriendsUpdated] = useState(false);

    const isOwnProfile = !userId || userId === authState.user._id;

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            if (isOwnProfile) {
                const response = await api.get('/users/profile');
                setProfile(response.data.profile);
            } else {
                const response = await api.get(`/users/${userId}/public-profile`);
                const { profile, isFriend, hasSentRequest } = response.data;
                setProfile(profile);
                setIsFriend(isFriend);
                setFriendRequestSent(hasSentRequest);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar el perfil', err);
            setError('Error al cargar el perfil');
            setLoading(false);
        }
    }, [isOwnProfile, userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sendFriendRequest = async () => {
        try {
            await api.post('/users/add-friend', { friendId: userId });
            setFriendRequestSent(true);
            alert('Solicitud de amistad enviada');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error al enviar la solicitud de amistad');
        }
    };

    const cancelFriendRequest = async () => {
        try {
            await api.post('/users/cancel-friend-request', { friendId: userId });
            setFriendRequestSent(false);
            alert('Solicitud de amistad cancelada');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error al cancelar la solicitud de amistad');
        }
    };

    const updateFriends = () => {
        setFriendsUpdated((prev) => !prev);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setUploadError('Solo se permiten imágenes JPG, PNG y GIF.');
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setUploadError('La imagen excede el tamaño máximo de 5MB.');
                return;
            }

            setImageFile(file);
            setUploadError('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadImage = async () => {
        if (!imageFile) {
            setUploadError('Por favor, selecciona una imagen primero.');
            return;
        }

        setUploading(true);
        setUploadError('');

        try {
            const token = authState.token;
            const response = await uploadProfilePicture(imageFile, token);
            setProfile((prevProfile) => ({
                ...prevProfile,
                profilePicture: response.data.profilePicture,
            }));
            setImageFile(null);
            setPreviewImage(null);
            alert('Foto de perfil subida exitosamente');
        } catch (err) {
            console.error(err);
            setUploadError(err.response?.data?.msg || 'Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleUnfriend = async () => {
        alert('Función para eliminar amigos aún no implementada.');
    };

    if (loading) return <div className="page page--narrow"><p className="loading-text">Cargando perfil...</p></div>;
    if (error) return <div className="page page--narrow"><div className="error-message">{error}</div></div>;
    if (!profile) return <div className="page page--narrow"><div className="error-message">Perfil no encontrado.</div></div>;

    const isDemo = Boolean(profile.isDemo);
    const roleLabels = { free: 'Plan gratuito', premium: 'Premium', pro: 'Pro', vip: 'VIP', admin: 'Administrador' };

    return (
        <div className="page page--narrow profile-page">
            <header className="card profile-header">
                {previewImage || profile.profilePicture?.url ? (
                    <img
                        src={previewImage || profile.profilePicture.url}
                        alt={`${profile.username} Avatar`}
                        className="profile-picture"
                    />
                ) : (
                    <span className="profile-picture profile-picture--initials" aria-hidden="true">
                        {(profile.username || '?').slice(0, 2).toUpperCase()}
                    </span>
                )}
                <div className="profile-info">
                    <span className="page-eyebrow">{isOwnProfile ? 'Mi Perfil' : 'Perfil'}</span>
                    <h1 className="profile-title">{profile.username}</h1>
                    <div className="profile-badges">
                        {profile.role && <span className="badge">{roleLabels[profile.role] || profile.role}</span>}
                        {isDemo && <span className="badge badge--demo">Cuenta demo</span>}
                    </div>
                    {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                    {!isOwnProfile && (
                        <div className="profile-actions">
                            {!isFriend && !friendRequestSent && (
                                <button
                                    className="btn-primary add-friend-button"
                                    onClick={sendFriendRequest}
                                    aria-label="Agregar Amigo"
                                >
                                    <FaUserPlus /> Agregar Amigo
                                </button>
                            )}
                            {!isFriend && friendRequestSent && (
                                <button
                                    className="btn-secondary cancel-friend-request-button"
                                    onClick={cancelFriendRequest}
                                    aria-label="Cancelar Solicitud de Amistad"
                                >
                                    <FaTimes /> Cancelar Solicitud
                                </button>
                            )}
                            {isFriend && (
                                <button
                                    className="btn btn-danger unfriend-button"
                                    onClick={handleUnfriend}
                                    aria-label="Eliminar Amigo"
                                >
                                    <FaUserMinus /> Eliminar Amigo
                                </button>
                            )}
                        </div>
                    )}

                    {isOwnProfile && !isDemo && (
                        <div className="profile-upload-section">
                            {!imageFile && (
                                <button
                                    className="btn-secondary btn-upload-photo"
                                    onClick={() => document.getElementById('profileImageInput').click()}
                                >
                                    <FaCamera /> {profile.profilePicture?.url ? 'Cambiar Foto' : 'Añadir Foto'}
                                </button>
                            )}
                            <input
                                type="file"
                                id="profileImageInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            {imageFile && (
                                <div className="upload-controls">
                                    <button className="btn-primary btn-upload" onClick={handleUploadImage} disabled={uploading}>
                                        {uploading ? 'Subiendo...' : 'Subir Imagen'}
                                    </button>
                                    <button className="btn-secondary btn-cancel" onClick={() => { setImageFile(null); setPreviewImage(null); }} disabled={uploading}>
                                        Cancelar
                                    </button>
                                </div>
                            )}
                            {uploadError && <p className="error-message">{uploadError}</p>}
                        </div>
                    )}
                </div>
            </header>

            {isOwnProfile && (
                <>
                    {isDemo ? (
                        <div className="card demo-profile-note">
                            <h3>Estás usando la cuenta demo</h3>
                            <p>
                                Es una cuenta compartida para probar Traveldaring: puedes crear, editar y eliminar viajes,
                                pero el perfil no se puede modificar.
                            </p>
                        </div>
                    ) : (
                        <EditProfile profile={profile} refreshProfile={fetchProfile} />
                    )}
                    <FriendsList refreshTrigger={friendsUpdated} />
                    <FriendRequests onFriendAccepted={updateFriends} />
                    <div className="logout-section">
                        <button onClick={handleLogout} className="btn btn-danger logout-button">
                            <FaSignOutAlt /> Cerrar Sesión
                        </button>
                    </div>
                </>
            )}

            {!isOwnProfile && (
                <div className="card public-profile-details">
                    <h3>Sobre {profile.username}</h3>
                    <p className="muted">{profile.bio || 'Este viajero todavía no ha escrito su biografía.'}</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;