import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/navbar';

function Profile() {
    const { isAuthenticated } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    const response = await axios.get('http://localhost:5001/api/users/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserData(response.data);
                    console.log(response.data)
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
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone:</strong> {userData.phone}</p>

                </div>
            ) : (
                <p>No user data found.</p>
            )}
        </div>
    );
}

export default Profile;
