import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../css/Profile.css';
import { useNavigate } from 'react-router-dom';
import UpdateProfileModal from '../modals/UpdateProfileModal';
import Sidebar from '../components/Sidebar';

function Profile() {
    const { isAuthenticated } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const token = localStorage.getItem('token');
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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/change-password',
                { oldpassword: oldPassword, newpassword: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPasswordChangeMessage(response.data.msg);
        } catch (error) {
            setPasswordChangeMessage(error.response?.data?.msg || 'Error changing password');
        }
    };

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

    const toggleMenu = () => setMenuVisible(!menuVisible);
    const togglePasswordForm = () => setShowPasswordForm(!showPasswordForm);

    const handleCreateShop = () => navigate('/create-shop');
    const handleViewShops = () => navigate('/my-shops');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleProfileUpdated = (updatedData) => {
        setUserData(updatedData);
    };

    const handleViewTransactionHistory = () => {
        navigate('/order-history');
    };
    
    if (loading) return <p>Loading...</p>;

    if (!isAuthenticated) return <p>You are not logged in. Please log in to view your profile.</p>;

    return (
        <div className="profile">
            <Sidebar />
            <div className="main-content">
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

                    <div className="detail-information">
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone}</p>
                        <h3>Addresses:</h3>
                        <ul>
                            {userData.addresses && userData.addresses.map((address, index) => (
                                <li key={index}>
                                    {address.recipientName}, {address.street}, {address.city}, {address.postalCode}, {address.phone}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <input
                        type="file"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />

                    {showPasswordForm && (
                        <form onSubmit={handlePasswordChange} className="change-password-form">
                            <h3>Change Password</h3>
                            <label>
                                Old Password:
                                <input 
                                    type="password" 
                                    value={oldPassword} 
                                    onChange={(e) => setOldPassword(e.target.value)} 
                                    required 
                                />
                            </label>
                            <label>
                                New Password:
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required 
                                />
                            </label>
                            <button type="submit">Change Password</button>
                            {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
                        </form>
                    )}

                    <div className="shop-actions">
                        <button onClick={togglePasswordForm}>Change Password</button>
                        <button onClick={handleCreateShop}>Create Shop</button>
                        <button onClick={handleViewShops}>View My Shops</button>
                        <button onClick={openModal}>Update Profile</button>
                        <button onClick={handleViewTransactionHistory}>
                            View Transaction History
                        </button>
                    </div>

                    <UpdateProfileModal 
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        userData={userData}
                        token={token}
                        onProfileUpdated={handleProfileUpdated}
                    />
                </div>
            ) : (
                <p>No user data found.</p>
            )}
            </div>
        </div>
    );
}

export default Profile;
