import React, { useState, useEffect } from 'react';
import '../css/CheckOutModal.css';
import { checkoutOrder } from '../hooks/orderApi';

function CheckoutModal({ isOpen, onClose, onConfirm, checkoutInfo, onChange, addresses, orderDetails }) {
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); 


  if (!isOpen) return null;

  const handleAddressChange = (e) => {
    const selectedAddress = e.target.value;
    onChange({ ...checkoutInfo, address: selectedAddress });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckout = async () => {
    setLoading(true);
    const orderData = {
      userId: orderDetails.userId,
      items: orderDetails.items,
      shippingAddress: orderDetails.shippingAddress[0],
      paymentMethod,
      totalAmount: orderDetails.totalAmount,
    };
    
    try {
      const response = await checkoutOrder(orderData);
      setLoading(false);
      
      if (response && response.message) {
        onConfirm(response);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
      setError('Error creating order');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <h3>Select Shipping Address</h3>
        <select value={checkoutInfo.address} onChange={handleAddressChange}>
          {addresses.map((address, index) => (
            <option key={address._id || index} value={address._id}>
              {address.street}, {address.city}, {address.postalCode}, {address.recipientName}, {address.phone}
            </option>
          ))}
        </select>

        <div>
          <h3>Payment Method</h3>
          <select
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange} 
          >
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={handleCheckout} disabled={loading || !paymentMethod}> 
          {loading ? 'Processing...' : 'Confirm'}
        </button>

      </div>
    </div>
  );
}

export default CheckoutModal;
