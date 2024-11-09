const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 },
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
  totalPrice: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  coupon: { type: String, default: '' },
  discount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Cart', CartSchema);
