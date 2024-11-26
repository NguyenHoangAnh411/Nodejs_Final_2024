import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/Sidebar.css';
import useUserProfile from '../hooks/userinfomation';

function Sidebar({ selectedPriceRange, handlePriceRangeChange }) {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const { userData } = useUserProfile(isAuthenticated, token);

  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>

        {userData?.role === 'admin' && (
          <>
            <li><Link to="/admin-page">Admin Dashboard</Link></li>
          </>
        )}
      </ul>

      {/* Uncomment and adjust this section if you want to include filtering */}
      {/* <Filter 
        selectedPriceRange={selectedPriceRange} 
        handlePriceRangeChange={handlePriceRangeChange}
      /> */}
    </div>
  );
}

export default Sidebar;
