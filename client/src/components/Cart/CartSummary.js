import React from 'react';

function CartSummary({ totalPrice, taxes, shippingFee, discount, totalPayment, onCheckout }) {
  const formatNumber = (num) => (typeof num === 'number' ? num.toFixed(2) : '0.00');
  return (
    <div>
      <h3>Order Summary</h3>
      <p>Subtotal: {`${(totalPrice * 25000).toLocaleString('vi-VN')} VND`}</p>
      <p>Taxes: {`${(taxes * 25000).toLocaleString('vi-VN')} VND`}</p>
      <p>Shipping Fee: {`${(shippingFee * 25000).toLocaleString('vi-VN')} VND`}</p>
      <p>Discount: {`${(discount * 25000).toLocaleString('vi-VN')} VND`}</p>
      <h4>Total: {`${(totalPayment * 25000).toLocaleString('vi-VN')} VND`}</h4>
      <button onClick={onCheckout}>Checkout</button>
    </div>
  );
}

export default CartSummary;
