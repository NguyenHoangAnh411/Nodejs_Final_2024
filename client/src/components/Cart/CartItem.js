import React from 'react';

function CartItem({ item, onQuantityChange, onRemove, selected, onSelect }) {
  return (
    <li className="cart-item">
      <input type="checkbox" checked={selected} onChange={onSelect} />
      <img src={item.productId.images?.[0]?.url || 'default.jpg'} alt={item.productId.name} />
      <div className="cart-item-detail">
        <h3>{item.productId.name}</h3>
        <p>{`${(item.productId.price).toLocaleString('vi-VN')} VND`}</p>
        <p>
          <button
            type="button"
            onClick={() => onQuantityChange(item._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="quantity-button"
          >
            -
          </button>
          <span className="quantity-value">   {item.quantity}   </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item._id, item.quantity + 1)}
            className="quantity-button"
          >
            +
          </button>
        </p>

        <p>
          Total: 
          {`${(item.productId.price * item.quantity).toLocaleString('vi-VN')} VND`}
        </p>
        <button className="remove-item-button" onClick={() => onRemove(item._id)}>Remove</button>
      </div>
    </li>
  );
}

export default CartItem;
