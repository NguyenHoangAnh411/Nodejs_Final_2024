const nodemailer = require('nodemailer');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const User = require('../models/UserModel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'facebookmangxahoi22@gmail.com',
    pass: 'qtnp mtzy ukvq mklr',
  },
});

// Helper function to calculate total price
const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Guest Checkout: Create order without login, auto-create user if necessary
const guestCheckout = async (req, res) => {
  const { name, phone, address, cartItems, paymentMethod } = req.body;

  if (!name || !phone || !address || !cartItems || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user exists, if not, create new user
  let user = await User.findOne({ $or: [{ name }, { phone }] });
  if (!user) {
    user = new User({
      name,
      phone,
      address,
      role: 'customer',
    });
    await user.save();
  }

  const totalAmount = calculateTotal(cartItems);

  const newOrder = new Order({
    userId: user._id,
    items: cartItems,
    shippingAddress: address,
    paymentMethod,
    totalAmount,
    paymentStatus: 'Pending',
    status: 'Pending',
  });

  await newOrder.save();

  // Remove purchased items from the cart
  const productIdsToRemove = cartItems.map(item => item.productId);
  await Cart.updateOne(
    { userId: user._id },
    { $pull: { items: { productId: { $in: productIdsToRemove } } } }
  );

  // Send confirmation email
  const mailOptions = {
    from: 'facebookmangxahoi22@gmail.com',
    to: user.email,
    subject: 'Order Confirmation',
    text: `Thank you for your order! Here are your order details:\n\n
           Order ID: ${newOrder._id}\n
           Items: ${newOrder.items.map(item => `${item.productName} (x${item.quantity})`).join(', ')}\n
           Total Amount: ${newOrder.totalAmount}$\n
           Shipping Address: ${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city}\n
           Payment Method: ${newOrder.paymentMethod}`,
  };

  await transporter.sendMail(mailOptions);

  res.json({ message: 'Order created successfully and confirmation email sent', order: newOrder });
};

// Logged-In Checkout: Pre-fill address for logged-in users
const loggedInCheckout = async (req, res) => {
  const { cartItems, newShippingAddress, paymentMethod } = req.body;
  const userId = req.user.userId;
  const user = await User.findById(userId);

  const shippingAddress = newShippingAddress || user.address;
  const totalAmount = calculateTotal(cartItems);

  const newOrder = new Order({
    userId,
    items: cartItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    paymentStatus: 'Pending',
    status: 'Pending',
  });

  await newOrder.save();

  // Remove purchased items from the cart
  const productIdsToRemove = cartItems.map(item => item.productId);
  await Cart.updateOne(
    { userId },
    { $pull: { items: { productId: { $in: productIdsToRemove } } } }
  );

  res.json({ message: 'Order created successfully', order: newOrder });
};

// Update Order Status (Cancel, Delivered, etc.)
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Handle order status transitions
  if (status === 'Cancelled') {
    order.status = 'Cancelled';
    await order.save();
    return res.status(200).json({ message: 'Order status updated to Cancelled', order });
  }

  if (status === 'Shipped' && order.status === 'Pending') {
    order.status = 'Shipped';
    await order.save();
    return res.status(200).json({ message: 'Order status updated to Shipped', order });
  }

  if (status === 'Delivered' && order.status === 'Shipped') {
    order.status = 'Delivered';
    await order.save();
    return res.status(200).json({ message: 'Order status updated to Delivered', order });
  }

  return res.status(400).json({ error: 'Invalid status transition' });
};

module.exports = {
  guestCheckout,
  loggedInCheckout,
  updateOrderStatus,
};
