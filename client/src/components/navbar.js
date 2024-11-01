import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import useUserProfile from '../hooks/userinfomation';

function Navbar() {
    const token = localStorage.getItem('token');
    const { logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const { userData, loading } = useUserProfile(isAuthenticated, token);
    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const goToProfile = () => {
        navigate('/profile');
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const goToLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <a href='/'>KA</a>
            <div className="nav-links">
                {isAuthenticated && userData && !loading ? (
                    <>
                        <img 
                            src={userData.avatar} 
                            alt="Avatar" 
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
                        />
                        <span className="user-name">{userData.name}</span>
                    </>
                    
                ) : null}
                <div className="menu" ref={menuRef}>
                    <button onClick={toggleMenu} className="menu-button">
                        &#9660;
                    </button>
                    {menuVisible && (
                        <div className="dropdown-menu">
                            {isAuthenticated ? (
                                <>
                                    <button onClick={goToProfile}>Profile</button>
                                    <button onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <button onClick={goToLogin}>Login</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
