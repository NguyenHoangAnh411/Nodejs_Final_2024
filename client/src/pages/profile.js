import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/navbar';
import { storage } from '../components/firebaseService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useUserProfile from '../hooks/userinfomation'; 
import '../css/Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { isAuthenticated } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const { userData, loading } = useUserProfile(isAuthenticated, token);
    const [avatar, setAvatar] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            setAvatarUrl(userData.avatarUrl);
        }
    }, [userData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuVisible]);

    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setAvatar(e.target.files[0]);
            uploadAvatar(e.target.files[0]);
        }
    };

    const uploadAvatar = async (file) => {
        if (!file || !userData) return;

        const avatarRef = ref(storage, `avatars/${userData._id}`);
        try {
            await uploadBytes(avatarRef, file);
            const downloadUrl = await getDownloadURL(avatarRef);
            setAvatarUrl(downloadUrl);

            await axios.put(
                'http://localhost:5000/api/users/profile/avatar',
                { userId: userData._id, avatarUrl: downloadUrl },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('Avatar uploaded successfully!');
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar.');
        }
    };

    const viewProfileImage = () => {
        window.open(avatarUrl || userData.avatar, '_blank'); 
        setMenuVisible(false);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleChoosePicture = () => {
        document.querySelector('input[type=file]').click();
    };

    const handleCreateShop = () => {
        navigate('/create-shop'); // Điều hướng đến trang tạo shop
    };

    const handleViewShops = () => {
        navigate('/my-shops'); // Điều hướng đến trang danh sách shop
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <p>You are not logged in. Please log in to view your profile.</p>;
    }

    return (
        <div className="profile">
            <Navbar />
            <h1>User Profile</h1>
            {userData ? (
                <div>
                    <label style={{ cursor: 'pointer' }} onClick={toggleMenu}>
                        <img 
                            src={avatarUrl || userData.avatar} 
                            alt="Avatar" 
                            style={{ width: '200px', height: '200px', borderRadius: '50%' }} 
                        />
                    </label>

                    {menuVisible && (
                        <div 
                            ref={menuRef}
                            style={{ display: 'flex', flexDirection: 'column', position: 'absolute',
                            border: '1px solid #ccc', marginLeft: '5%', backgroundColor: '#fff',
                            borderRadius: '5px', padding: '10px', marginTop: '10px', zIndex: 1000 }}>
                            <button className="menu-item" onClick={viewProfileImage}>View Profile Image</button>
                            <button className="menu-item" onClick={handleChoosePicture}>Choose Profile Picture</button>
                        </div>
                    )}

                    <div className="detail-information">
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone}</p>
                        <p><strong>Transaction History:</strong> </p>
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
