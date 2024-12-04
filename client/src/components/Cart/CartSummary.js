import React from 'react';

function CartSummary({ totalPrice, taxes, shippingFee, discount, totalPayment, onCheckout }) {
  const formatNumber = (num) => (typeof num === 'number' ? num.toFixed(2) : '0.00');
  return (
    <div>
      <h3>Order Summary</h3>
      <p>Subtotal: ${formatNumber(totalPrice ?? 0)}</p>
      <p>Taxes: ${formatNumber(taxes ?? 0)}</p>
      <p>Shipping Fee: ${formatNumber(shippingFee ?? 0)}</p>
      <p>Discount: ${formatNumber(discount ?? 0)}</p>
      <h4>Total: ${formatNumber(totalPayment ?? 0)}</h4>
      <button onClick={onCheckout}>Checkout</button>
    </div>
  );
}

export default CartSummary;
