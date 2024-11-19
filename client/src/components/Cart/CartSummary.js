import React from 'react';

function CartSummary({ totalPrice, taxes, shippingFee, discount, totalPayment, onCheckout }) {
  
  return (
    <div>
      <h3>Order Summary</h3>
      <p>Subtotal: ${totalPrice.toFixed(2)}</p>
      <p>Taxes: ${taxes.toFixed(2)}</p>
      <p>Shipping Fee: ${shippingFee.toFixed(2)}</p>
      <p>Discount: ${discount.toFixed(2)}</p>
      <h4>Total: ${totalPayment.toFixed(2)}</h4>
      <button onClick={onCheckout}>Checkout</button>
    </div>
  );
}

export default CartSummary;
