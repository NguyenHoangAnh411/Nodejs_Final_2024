import React, { useState, useEffect } from 'react';
import { getCartByUserId, updateCartItemQuantity, removeFromCart } from '../hooks/cartApi';
import '../css/Cart.css';
import CheckoutModal from '../modals/CheckOutModal';
import Sidebar from '../components/Sidebar';
import useUserProfile from '../hooks/userinfomation';
import CouponForm from '../modals/CouponModal';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import CreateAccountModal from '../modals/CreateAccountModal';

function Cart() {
  const { userData } = useUserProfile();
  const [userCreatedData, setUserCreatedData] = useState(null);

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    discount: 0,
    shippingFee: 0,
  });
  const [loading, setLoading] = useState(true);
  const [voucherName, setVoucherName] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [error, setError] = useState(null);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isVoucherModalOpen, setVoucherModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({
    address: '',
    paymentMethod: '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingCost, setShippingCost] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (userData) {
          const cartResponse = await getCartByUserId();
  
          if (!cartResponse || !cartResponse.items) {
            throw new Error('Invalid cart response');
          }
          const validItems = cartResponse.items.filter(item => item.productId !== null);
          const totals = calculateTotal(validItems, validItems.map(item => item._id));
          setCart({ ...cartResponse, items: validItems, ...totals });
          setSelectedItems(validItems.map(item => item._id));
        } else {
          const cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
  
          if (!cart || !cart.items) {
            setError('Cart is empty');
            return;
          }
  
          const validItems = cart.items.filter(item => item.productId !== null);
          const totals = calculateTotal(validItems, validItems.map(item => item._id));
  
          setCart({ ...cart, items: validItems, ...totals });
          setSelectedItems(validItems.map(item => item._id));
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCart();
  }, [userData]);
  
  
  const handleShippingMethodChange = (fee) => {
    console.log("Changing shipping fee to: ", fee);
    setCart((prevCart) => {
      const updatedTotals = calculateTotal(prevCart.items, selectedItems, null);
      console.log("Updated totals: ", updatedTotals);
      return {
        ...prevCart,
        shippingFee: fee,
        ...updatedTotals,
      };
    });
  };

  const handleShippingChange = (e) => {
    const method = e.target.value;
    setShippingMethod(method);

    let cost = 0;
    if (method === 'standard') {
      cost = 50000;
    } else if (method === 'fast') {
      cost = 100000;
    }

    setShippingCost(cost);
    handleShippingMethodChange(cost);
  };
  
  const calculateTotal = (items, selectedItemIds = [], voucher = null) => {
    let totalPrice = 0;
    let taxes = 0;
    const shippingFee = shippingCost;
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

        const updatedCartData = {
          ...prevCart,
          items: updatedItems,
          ...totals,
        };

        localStorage.setItem('cart', JSON.stringify(updatedCartData));
  
        return updatedCartData;
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
  
        console.log("Updated cart items:", updatedItems);
        console.log("Updated totals:", totals);
  
        const updatedCartData = {
          ...prevCart,
          items: updatedItems,
          ...totals,
        };

        localStorage.setItem('cart', JSON.stringify(updatedCartData));
  
        return updatedCartData;
      });
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      setError('Không thể xóa sản phẩm');
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
    if (!userData) {

      setIsCreateAccountModalOpen(true);
    } else {

      const selectedCartItems = cart.items.filter(item => selectedItems.includes(item._id));
  
      if (selectedCartItems.length === 0) {
        setError('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
        return;
      }
  
      const orderDetails = {
        userId: userData ? userData._id : null,
        userEmail: userData ? userData.email : 'guest@domain.com',
        items: selectedCartItems.map(item => ({
          productId: item.productId._id,
          productName: item.productId.name,
          price: item.productId.price,
          cost: item.productId.cost,
          quantity: item.quantity,
        })),
        shippingAddress: userData ? userData.addresses : [],
        paymentMethod: checkoutInfo.paymentMethod,
        totalAmount: cart.totalPayment,
        loyaltyPoints: userData ? userData.loyaltyPoints : 0,
      };

      setOrderDetails(orderDetails);
      setCheckoutModalOpen(true);
    }
  };

  const handleCreateAccountSubmit = (userId, userData) => {
    setIsCreateAccountModalOpen(false);
    setUserCreatedData(userData);
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
      setSuccessMessage('Payment successful! Your order is confirmed.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
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

            <div>
              <h3>Shipping Method</h3>
              <select value={shippingMethod} onChange={handleShippingChange}>
                <option value="standard">Standard</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <CartSummary
              totalPrice={cart.totalPrice}
              taxes={cart.taxes}
              shippingFee={shippingCost}
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
          onChange={(updatedInfo) => setCheckoutInfo(updatedInfo)} // Đảm bảo cập nhật trạng thái đúng
          addresses={userData?.addresses || []}
          orderDetails={orderDetails}
      />
      
        )}
        {showSuccess && <div className="success">{successMessage}</div>}
        {isVoucherModalOpen && (
          <CouponForm 
            onClose={handleCloseVoucherModal} 
            onApplyVoucher={handleApplyVoucher} 
            updateCart={handleApplyVoucher}
          />
        )}
        {isCreateAccountModalOpen && (
          <CreateAccountModal
            isOpen={isCreateAccountModalOpen}
            onClose={() => setIsCreateAccountModalOpen(false)}
            onCreate={handleCreateAccountSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default Cart;