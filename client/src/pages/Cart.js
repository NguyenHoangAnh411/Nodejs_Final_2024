import React, { useState, useEffect } from 'react';
import { getCartByUserId, updateCartItemQuantity, removeFromCart, checkout } from '../hooks/cartApi';
import Navbar from '../components/Navbar';
import '../css/Cart.css';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCartByUserId();
        setCart(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Không thể lấy giỏ hàng');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    let totalPrice = 0;
    let taxes = 0;
    let shippingFee = 0;
    let discount = 0;

    items.forEach(item => {
      totalPrice += item.productId.price * item.quantity;
    });

    taxes = totalPrice * 0.1;
    shippingFee = 5;
    discount = totalPrice * 0.05;

    return {
      totalPrice,
      taxes,
      shippingFee,
      discount,
    };
  };

  const handleQuantityChange = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      const updatedCart = await updateCartItemQuantity(cartItemId, quantity);

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map(item =>
          item._id === cartItemId
            ? { ...item, quantity }
            : item
        );

        const { totalPrice, taxes, shippingFee, discount } = calculateTotal(updatedItems);

        return {
          ...prevCart,
          items: updatedItems,
          totalPrice,
          taxes,
          shippingFee,
          discount,
        };
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const updatedCart = await removeFromCart(cartItemId);

      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter(item => item._id !== cartItemId);

        const { totalPrice, taxes, shippingFee, discount } = calculateTotal(updatedItems);

        return {
          ...prevCart,
          items: updatedItems,
          totalPrice,
          taxes,
          shippingFee,
          discount,
        };
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Không thể xóa sản phẩm');
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await checkout(cart.items, cart.addresses);
      alert(response.message || 'Checkout successful!');
      setCart(null);
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Checkout failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="cart-page">
      <Navbar />
      <h2>Your Cart</h2>

      {cart && cart.items.length > 0 ? (
        <div className="cart-items">
          <ul>
            {cart.items.map((item, index) => (
              <li key={index} className="cart-item">
                <img
                  src={item.productId.images && item.productId.images.length > 0 ? item.productId.images[0].url : 'default-image.jpg'}
                  alt={item.productId.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3>{item.productId.name}</h3>
                  <p>Price: ${item.productId.price}</p>
                  <p>Quantity:
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                      min="1"
                    />
                  </p>
                  <p>Total: ${(item.productId.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemoveItem(item._id)} className="remove-item-button">Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <p><strong>Total Price:</strong> ${cart.totalPrice.toFixed(2)}</p>
            <p><strong>Taxes:</strong> ${cart.taxes.toFixed(2)}</p>
            <p><strong>Shipping Fee:</strong> ${cart.shippingFee}</p>
            <p><strong>Discount:</strong> ${cart.discount}</p>
            <p><strong>Final Total:</strong> ${(cart.totalPrice + cart.taxes + cart.shippingFee - cart.discount).toFixed(2)}</p>
            <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
          </div>
        </div>
      ) : (
        <div className="empty-cart-message">
          <p>No products yet, start shopping!</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
