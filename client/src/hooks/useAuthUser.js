import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuthUser = (isAuthenticated, token) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserData(response.data);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching user data:', err);
                    setError('Lỗi khi tải thông tin người dùng');
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isAuthenticated, token]);

    return { userData, loading, error };
};

export default useAuthUser;
