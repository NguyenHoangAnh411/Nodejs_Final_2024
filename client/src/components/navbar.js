import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import useUserProfile from '../hooks/userinfomation';
import CartIcon from './Icon/CartIcon';
import axios from 'axios';
import SearchBar from './SearchBar';
function Navbar() {
    const { logout, isAuthenticated } = useContext(AuthContext);
    const { userData, loading } = useUserProfile();
    const navigate = useNavigate();
    const [cartItemCount, setCartItemCount] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
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
    }, [isAuthenticated]);

    return (
        <nav className="navbar">
            <div className="nav-links">
            <SearchBar />
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
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <button onClick={goToLogin}>Login</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
