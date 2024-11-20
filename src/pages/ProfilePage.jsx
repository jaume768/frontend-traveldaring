import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import FriendsList from '../components/Profile/FriendsList';
import FriendRequests from '../components/Profile/FriendRequests';
import Favorites from '../components/Profile/Favorites';
import CustomLists from '../components/Profile/CustomLists';
import EditProfile from '../components/Profile/EditProfile';
import './ProfilePage.css';

const ProfilePage = () => {
    const { authState } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setProfile(response.data.profile);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar el perfil');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <p>Cargando perfil...</p>;

    return (
        <div className="profile-page">
            <h2>Mi Perfil</h2>
            {profile && (
                <>
                    <EditProfile profile={profile} refreshProfile={fetchProfile} />
                    <Favorites />
                    <CustomLists />
                    <FriendsList />
                    <FriendRequests />
                </>
            )}
        </div>
    );
};

export default ProfilePage;