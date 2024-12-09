import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/Sidebar.css';
import useUserProfile from '../hooks/userinfomation';

function Sidebar() {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const { userData } = useUserProfile(isAuthenticated, token);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'}
      </button>

      {/* Sidebar Content */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          {userData?.role === 'Admin' && (
            <li>
              <Link to="/admin-page">Admin Dashboard</Link>
            </li>
          )}
          <li>
            <button className="close-sidebar-btn" onClick={toggleSidebar}>
              {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
