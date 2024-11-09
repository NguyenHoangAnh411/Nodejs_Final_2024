import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import useUserProfile from '../hooks/userinfomation';
import CartIcon from './Icon/CartIcon';
import axios from 'axios';

function Navbar() {
    const token = localStorage.getItem('token');
    const { logout, isAuthenticated } = useContext(AuthContext);
    const { userData, loading } = useUserProfile(isAuthenticated, token);
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const menuRef = useRef(null);
    
    const [cartItemCount, setCartItemCount] = useState(0);

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        const fetchCartData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/${localStorage.getItem('userId')}`);
                setCartItemCount(response.data.items.length);
            } catch (error) {
                console.error('Lỗi khi lấy giỏ hàng:', error);
            }
        };

        if (isAuthenticated) {
            fetchCartData();
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAuthenticated]);

    return (
        <nav className="navbar">
            <a href='/'>KA</a>
            <div className="nav-links">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                <CartIcon itemCount={cartItemCount} />

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

            {isAuthenticated ? (
                <>
                <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <button onClick={goToLogin}>Login</button>
            )}

            </div>
        </nav>
    );
}

export default Navbar;
