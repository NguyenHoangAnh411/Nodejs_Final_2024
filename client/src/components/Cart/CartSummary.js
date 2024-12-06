import React from 'react';

function CartSummary({ totalPrice, taxes, shippingFee, discount, onCheckout }) {
  const validTotalPrice = totalPrice || 0;
  const validTaxes = taxes || 0;
  const validShippingFee = shippingFee || 0;
  const validDiscount = discount || 0;

  // Calculate total dynamically
  const totalPayment =
    validTotalPrice * 25000 +
    validTaxes * 25000 +
    validShippingFee * 25000 -
    validDiscount * 25000;

  const formatNumber = (num) => (typeof num === 'number' ? num.toLocaleString('vi-VN') : '0');

  return (
    <div>
      <h3>Order Summary</h3>
      <p>Subtotal: {`${formatNumber(validTotalPrice * 25000)} VND`}</p>
      <p>Taxes: {`${formatNumber(validTaxes * 25000)} VND`}</p>
      <p>Shipping Fee: {`${formatNumber(validShippingFee * 25000)} VND`}</p>
      <p>Discount: {`${formatNumber(validDiscount * 25000)} VND`}</p>
      <h4>Total: {`${formatNumber(totalPayment)} VND`}</h4>
      <button onClick={onCheckout}>Checkout</button>
    </div>
  );
}

export default CartSummary;
