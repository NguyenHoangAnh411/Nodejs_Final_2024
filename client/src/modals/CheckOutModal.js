import React, { useState } from 'react';
import '../css/CheckOutModal.css';
import { checkoutOrder } from '../hooks/orderApi';

function CheckoutModal({ isOpen, onClose, onConfirm, checkoutInfo, onChange, addresses, orderDetails }) {
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 
  if (!isOpen) return null;

  const handleAddressChange = (e) => {
    const selectedAddress = e.target.value;
    if (selectedAddress === 'new') {
      setIsNewAddress(true);
      onChange({ target: { name: 'address', value: '' } });
    } else {
      setIsNewAddress(false);
      onChange({ target: { name: 'address', value: selectedAddress } });
    }
  };
  

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');
  
      const orderData = {
        userId: orderDetails.userId,
        items: orderDetails.items,
        shippingAddress: checkoutInfo.address,
        paymentMethod: checkoutInfo.paymentMethod,
        totalAmount: orderDetails.totalAmount,
      };

      console.log(orderData)
      const response = await checkoutOrder(orderData);
  
      if (response && response.message) {
        onConfirm(response);
      }
    } catch (err) {
      setError('Error creating order');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="checkout-modal">
      <div className="modal-content">
        <h3>Payment Information</h3>
        
        {error && <p className="error-message">{error}</p>}

        <label>
          Address:
          <select name="address" value={checkoutInfo.address} onChange={handleAddressChange}>
            <option value="">Select an address</option>
            {addresses.map((address, index) => (
              <option key={index} value={address.street}>
                {address.recipientName}, {address.street}, {address.city} {address.postalCode}
              </option>
            ))}
            <option value="new">Enter a new address</option>
          </select>

        </label>

        {isNewAddress && (
          <label>
            Enter new address:
            <input
              type="text"
              name="address"
              value={checkoutInfo.address}
              onChange={onChange}
              placeholder="Enter delivery address"
            />
          </label>
        )}

        <label>
          Payment Method:
          <select name="paymentMethod" value={checkoutInfo.paymentMethod} onChange={onChange}>
            <option value="">Select payment method</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </label>

        <div className="modal-actions">
          <button onClick={handleCheckout} className="confirm-button" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm'}
          </button>
          <button onClick={onClose} className="cancel-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
