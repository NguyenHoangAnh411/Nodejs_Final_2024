import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useUserProfile from '../hooks/userinfomation';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const { userData, loading } = useUserProfile(isAuthenticated, token);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (token) {
      try {
        if (!userData || userData.role !== 'admin') {
          navigate(`/`);
        }
      } catch (error) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [token, navigate, userData, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}

export default ProtectedRoute;
