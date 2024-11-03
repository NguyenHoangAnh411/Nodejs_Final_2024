import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/navbar';
import '../css/Profile.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { isAuthenticated } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const token = localStorage.getItem('token');
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    const response = await axios.get('http://localhost:5000/api/users/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserData(response.data);
                    setAvatarUrl(response.data.avatar);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [isAuthenticated, token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuVisible]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadAvatar(file);
        }
    };

    const uploadAvatar = async (file) => {
        if (!file || !userData || !userData._id) {
            console.error('File or userData is undefined:', { file, userData });
            return;
        }
    
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('userId', userData._id);

        try {
            const response = await axios.put('http://localhost:5000/api/users/profile/avatar', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAvatarUrl(response.data.avatar);
            alert('Avatar uploaded successfully!');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar.');
        }
    };

    const viewProfileImage = () => {
        window.open(avatarUrl, '_blank');
        setMenuVisible(false);
    };

    const toggleMenu = () => setMenuVisible(!menuVisible);

    const handleChoosePicture = () => {
        document.querySelector('input[type=file]').click();
    };

    const handleCreateShop = () => navigate('/create-shop');
    const handleViewShops = () => navigate('/my-shops');

    if (loading) return <p>Loading...</p>;

    if (!isAuthenticated) return <p>You are not logged in. Please log in to view your profile.</p>;

    return (
        <div className="profile">
            <Navbar />
            <h1>User Profile</h1>
            {userData ? (
                <div>
                    <label style={{ cursor: 'pointer' }} onClick={toggleMenu} className="avatar-container">
                        <img
                            src={avatarUrl || userData.avatar}
                            alt="Avatar"
                            className="avatar-image"
                        />
                    </label>


                    {menuVisible && (
                        <div
                            ref={menuRef}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'absolute',
                                border: '1px solid #ccc',
                                marginLeft: '5%',
                                backgroundColor: '#fff',
                                borderRadius: '5px',
                                padding: '10px',
                                marginTop: '10px',
                                zIndex: 1000
                            }}
                        >
                            <button className="menu-item" onClick={viewProfileImage}>View Profile Image</button>
                            <button className="menu-item" onClick={handleChoosePicture}>Choose Profile Picture</button>
                        </div>
                    )}

                    <div className="detail-information">
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone}</p>
                    </div>

                    <input
                        type="file"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />

                    <div className="shop-actions">
                        <button onClick={handleCreateShop}>Create Shop</button>
                        <button onClick={handleViewShops}>View My Shops</button>
                    </div>
                </div>
            ) : (
                <p>No user data found.</p>
            )}
        </div>
    );
}

export default Profile;
