import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/NavBar.css'

function Navbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);

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

    return (
        <nav className="navbar">
            <a href='/'>KA</a>
            <div className="nav-links">
                <div className="menu">
                    <button onClick={toggleMenu} className="menu-button">
                    </button>
                    {menuVisible && (
                        <div className="dropdown-menu">
                            <button onClick={goToProfile}>Profile</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
