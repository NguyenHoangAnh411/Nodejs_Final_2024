import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
const useUserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const { isAuthenticated } = useContext(AuthContext);
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (isAuthenticated === true) {
          try {
            const response = await axios.get('http://localhost:5000/api/users/profile', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUserData(response.data);
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
  
    return { userData, loading };
  };
  

export default useUserProfile;
