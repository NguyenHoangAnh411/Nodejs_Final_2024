import React from 'react';

function CartSummary({ totalPrice, taxes, shippingFee, discount, onCheckout }) {
  const validTotalPrice = totalPrice || 0;
  const validTaxes = taxes || 0;
  const validShippingFee = shippingFee || 0;
  const validDiscount = discount || 0;

  // Calculate total dynamically
  const totalPayment =
    validTotalPrice  +
    validTaxes  +
    validShippingFee  -
    validDiscount ;

  const formatNumber = (num) => (typeof num === 'number' ? num.toLocaleString('vi-VN') : '0');

  return (
    <div>
      <h3>Order Summary</h3>
      <p>Subtotal: {`${formatNumber(validTotalPrice)} VND`}</p>
      <p>Taxes: {`${formatNumber(validTaxes)} VND`}</p>
      <p>Shipping Fee: {`${formatNumber(validShippingFee)} VND`}</p>
      <p>Discount: {`${formatNumber(validDiscount)} VND`}</p>
      <h4>Total: {`${formatNumber(totalPayment)} VND`}</h4>
      <button onClick={onCheckout}>Checkout</button>
    </div>
  );
}

export default CartSummary;
