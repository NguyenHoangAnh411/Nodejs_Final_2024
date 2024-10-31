
const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const cartItemSchema = require('./CartItemModel')
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [cartItemSchema.cartItemSchema],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

cartSchema.methods.getTotalPrice = function() {
    return this.items.reduce((total, item)=> total + (item.quantity * item.price))
}

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
