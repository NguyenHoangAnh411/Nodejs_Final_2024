
const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = {
  CartItem,
  cartItemSchema
};
