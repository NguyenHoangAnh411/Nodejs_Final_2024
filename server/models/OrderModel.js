const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: {
      type: [Object],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'Order must have at least one item.',
      },
    },    
    shippingAddress: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['credit-card', 'paypal', 'cod'], required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Order', OrderSchema);
