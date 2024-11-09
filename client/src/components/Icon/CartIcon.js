import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/CartIcon.css';
const CartIcon = ({ itemCount }) => {
    const navigate = useNavigate();

    return (
        <div className="cart-icon" onClick={() => navigate('/cart')}>
            <FaShoppingCart size={24} />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </div>
    );
};

export default CartIcon;
