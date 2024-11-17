import React, { useState, useEffect, useContext } from 'react';
import { getCartByUserId, updateCartItemQuantity, removeFromCart } from '../hooks/cartApi';
import '../css/Cart.css';
import CheckoutModal from '../modals/CheckOutModal';
import Sidebar from '../components/Sidebar';
import useUserProfile from '../hooks/userinfomation';
import CouponForm from '../modals/CouponModal';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';

function Cart() {
  const { userData } = useUserProfile();
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    discount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [voucherName, setVoucherName] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [error, setError] = useState(null);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isVoucherModalOpen, setVoucherModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState({
    address: '',
    paymentMethod: '',
  });
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartResponse = await getCartByUserId();
        const totals = calculateTotal(cartResponse.items, cartResponse.items.map(item => item._id));
        setCart({ ...cartResponse, ...totals });
        setSelectedItems(cartResponse.items.map(item => item._id));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Unable to fetch cart');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items, selectedItemIds = [], voucher = null) => {
    let totalPrice = 0;
    let taxes = 0;
    const shippingFee = 5;
    let discount = 0;

    const filteredItems = items.filter(item => selectedItemIds.includes(item._id));

    filteredItems.forEach(item => {
      totalPrice += item.productId.price * item.quantity;
    });

    taxes = totalPrice * 0.1;

    if (voucher) {
      discount = totalPrice * (voucher.discount / 100);
    }

    return {
      totalPrice,
      taxes,
      shippingFee,
      discount,
      totalPayment: totalPrice + taxes + shippingFee - discount,
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

        const totals = calculateTotal(updatedItems, selectedItems);

        return {
          ...prevCart,
          items: updatedItems,
          ...totals,
        };
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Unable to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter(item => item._id !== cartItemId);
        const totals = calculateTotal(updatedItems, selectedItems);

        return {
          ...prevCart,
          items: updatedItems,
          ...totals,
        };
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Unable to remove item');
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];

      setCart((prevCart) => ({
        ...prevCart,
        ...calculateTotal(prevCart.items, newSelected),
      }));

      return newSelected;
    });
  };

  const handleOpenCheckoutModal = () => {
    const selectedCartItems = cart.items.filter(item => selectedItems.includes(item._id));
    const orderDetails = {
      userId: userData._id,
      items: selectedCartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      shippingAddress: checkoutInfo.address,
      paymentMethod: checkoutInfo.paymentMethod,
      totalAmount: cart.totalPayment,
    };

    setOrderDetails(orderDetails);
    setCheckoutModalOpen(true);
};

  

  const handleCloseCheckoutModal = () => {
    setCheckoutModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleVoucherButtonClick = () => {
    setVoucherModalOpen(true);
  };

  const handleCloseVoucherModal = () => {
    setVoucherModalOpen(false);
  };

  const handleApplyVoucher = (voucher) => {
    setVoucherName(voucher.name);
    setVoucherCode(voucher.code);

    setCart((prevCart) => ({
      ...prevCart,
      ...calculateTotal(prevCart.items, selectedItems, voucher),
    }));
  };

  const handleCheckout = async () => {
    try {
      setCart(null);
      setCheckoutModalOpen(false);
    } catch (error) {
      setError('Checkout failed');
    }
  };
  
  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <Sidebar />
      <div className="cart-page">
        <h2>Shopping Cart</h2>

        {cart && cart.items.length > 0 ? (
          <div className="cart-items">
            <ul>
              {cart.items.map(item => (
                <CartItem
                  key={item._id}
                  item={item}
                  selected={selectedItems.includes(item._id)}
                  onSelect={() => toggleSelectItem(item._id)}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </ul>

            <div className="voucher-section">
              <button onClick={handleVoucherButtonClick} className="apply-voucher-button">
                Add Voucher
              </button>
              {voucherName && (
                <div className="applied-voucher">
                  <p>Applied Voucher: <strong>{voucherName}</strong></p>
                  <p>Code: <strong>{voucherCode}</strong></p>
                </div>
              )}
            </div>

            <CartSummary
              totalPrice={cart.totalPrice}
              taxes={cart.taxes}
              shippingFee={cart.shippingFee}
              discount={cart.discount}
              totalPayment={cart.totalPayment}
              onCheckout={handleOpenCheckoutModal}
            />
          </div>
        ) : (
          <div className="empty-cart-message">
            <p>Your cart is empty!</p>
          </div>
        )}

        {userData && userData.addresses && (
          <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={handleCloseCheckoutModal}
            onConfirm={handleCheckout}
            checkoutInfo={checkoutInfo}
            onChange={handleInputChange}
            addresses={userData.addresses}
            orderDetails={orderDetails}
          />
        )}

        {isVoucherModalOpen && (
          <CouponForm
            updateCart={handleApplyVoucher}
            onClose={handleCloseVoucherModal}
          />
        )}
      </div>
    </div>
  );
}

export default Cart;
