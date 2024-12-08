import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserData, changePassword, uploadAvatar } from '../hooks/userApi';
import '../css/Profile.css';
import Sidebar from '../components/Sidebar';
import UpdateProfileModal from '../modals/UpdateProfileModal';

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
            try {
                const data = await getUserData();
                setUserData(data);
                setAvatarUrl(data.avatar);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const response = await changePassword(oldPassword, newPassword);
            setPasswordChangeMessage(response.msg);
        } catch (error) {
            setPasswordChangeMessage(error.response?.data?.msg || 'Error changing password');
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && userData) {
            uploadAvatar(file, userData._id)
                .then(response => {
                    setAvatarUrl(response.avatar);
                    alert('Avatar uploaded successfully!');
                })
                .catch(error => {
                    console.error('Error uploading avatar:', error);
                    alert('Error uploading avatar.');
                });
        }
    };

    const toggleMenu = () => setMenuVisible(!menuVisible);
    const togglePasswordForm = () => setShowPasswordForm(!showPasswordForm);
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

                        {menuVisible && (
                            <div className="avatar-menu">
                                <input
                                    type="file"
                                    onChange={handleAvatarChange}
                                    style={{ display: 'block' }}
                                    accept="image/*"
                                />
                                <button onClick={() => setMenuVisible(false)}>Close Menu</button>
                            </div>
                        )}

                        <div className="detail-information">
                            <p><strong>Name:</strong> {userData.name}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p><strong>Phone:</strong> {userData.phone}</p>
                            <p><strong>Loyalty Points:</strong> {userData.loyaltyPoints}</p>
                            <h3>Addresses:</h3>
                            <ul>
                                {userData.addresses && userData.addresses.map((address, index) => (
                                    <li key={index}>
                                        {address.recipientName}, {address.street}, {address.city}, {address.postalCode}, {address.phone}
                                    </li>
                                ))}
                            </ul>
                        </div>

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
