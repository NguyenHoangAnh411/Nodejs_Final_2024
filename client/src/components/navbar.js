import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import useUserProfile from '../hooks/userinfomation';
import CartIcon from './Icon/CartIcon';
import SearchBar from './SearchBar';
import { getCartByUserId } from '../hooks/cartApi';

function Navbar({ isSidebarOpen }) { // Nhận trạng thái Sidebar
  const { logout, isAuthenticated } = useContext(AuthContext);
  const { userData, loading } = useUserProfile();
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (isAuthenticated) {
          const cartResponse = await getCartByUserId();
          setCartItemCount(cartResponse.items.length);
        } else {
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          setCartItemCount(cart.length);
        }
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      }
    };

    fetchCartData();
  }, [isAuthenticated]);

  return (
    <nav className={`navbar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="nav-links">
        <div className="SearchandCart">
          <SearchBar />
          <CartIcon itemCount={cartItemCount} />
        </div>

        <div className="nav-Info">
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
      </div>
    </nav>
  );
}

export default Navbar;
