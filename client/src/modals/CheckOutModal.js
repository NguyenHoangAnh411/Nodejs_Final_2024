import React, { useState, useEffect } from 'react';
import '../css/CheckOutModal.css';
import { checkoutOrder, checkoutOrderForNotLoggedUser } from '../hooks/orderApi';

const CheckoutModal = ({ isOpen, onClose, onConfirm, checkoutInfo, onChange, addresses, orderDetails }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);
  const [totalAmount, setTotalAmount] = useState(orderDetails ? orderDetails.totalAmount : 0);

  useEffect(() => {
    if (orderDetails) {
      setLoyaltyPoints(orderDetails.loyaltyPoints || 0);
      setTotalAmount(orderDetails.totalAmount);
    }
  }, [orderDetails]);

  if (!isOpen) return null;

  const handleAddressChange = (e) => {
    const selectedAddress = e.target.value;
    onChange({ ...checkoutInfo, address: selectedAddress });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleLoyaltyPointsChange = (e) => {
    let pointsUsed = parseInt(e.target.value, 10) || 0;
    const maxPoints = loyaltyPoints >= 1000 ? Math.floor(loyaltyPoints / 1000) : loyaltyPoints;
    const maxAmount = Math.floor(orderDetails.totalAmount / 1000);

    pointsUsed = pointsUsed > maxPoints ? maxPoints : pointsUsed;
    pointsUsed = pointsUsed > maxAmount ? maxAmount : pointsUsed;

    setLoyaltyPointsUsed(pointsUsed);
    setTotalAmount(orderDetails.totalAmount - pointsUsed * 1000);
};

  const handleCheckout = async () => {
    setLoading(true);
    const orderData = {
      userId: orderDetails.userId,
      items: orderDetails.items,
      shippingAddress: orderDetails.shippingAddress[0],
      paymentMethod,
      totalAmount,
      loyaltyPointsUsed,
    };

    try {
      const response = await checkoutOrder(orderData);
      setLoading(false);
      
      if (response && response.message) {
        setLoyaltyPoints(response.loyaltyPoints);
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

        <div>
          <h3>Loyalty Points</h3>
          <p>You have {loyaltyPoints} points.</p>
          <label htmlFor="loyaltyPoints">Use Points: </label>
          <input
            type="number"
            id="loyaltyPoints"
            value={loyaltyPointsUsed}
            onChange={handleLoyaltyPointsChange}
            max={Math.floor(loyaltyPoints / 1000)}
            min={0}
            step={1}
          />
          <p>Applied: {`${(loyaltyPointsUsed * 1000).toLocaleString('vi-VN')} VND`}</p>
        </div>

        {error && <p className="error">{error}</p>}

        <div>
          <h3>Total Amount: {`${totalAmount.toLocaleString('vi-VN')} VND`}</h3>
        </div>

        <button onClick={handleCheckout} disabled={loading || !paymentMethod}> 
          {loading ? 'Processing...' : 'Confirm'}
        </button>

        {loyaltyPoints > 0 && (
          <div>
            <p>You have earned {loyaltyPoints} loyalty points!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
