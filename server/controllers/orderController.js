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

const checkout = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!userId || !items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { recipientName, street, city, postalCode, phone } = shippingAddress;
    if (!recipientName || !street || !city || !postalCode || !phone) {
      return res.status(400).json({ error: 'Incomplete shipping address details' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newOrder = new Order({
      userId,
      items,
      shippingAddress: {
        recipientName,
        street,
        city,
        postalCode,
        phone,
      },
      paymentMethod,
      totalAmount,
      paymentStatus: 'Pending',
      status: 'Pending',
    });

    await newOrder.save();

    const productIdsToRemove = items.map(item => item.productId);
    await Cart.updateOne(
      { userId },
      { $pull: { items: { productId: { $in: productIdsToRemove } } } }
    );

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
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'Cancelled') {
      order.status = 'Cancelled';
      await order.save();
      return res.status(200).json({ message: 'Order status updated to Cancelled', order });
    }

    if (status === 'Delivered' && order.status === 'Shipped') {
      order.status = 'Delivered';
      await order.save();
      return res.status(200).json({ message: 'Order status updated to Delivered', order });
    }

    return res.status(400).json({ error: 'Invalid status transition' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  checkout,
  getOrdersByUserId,
  updateOrderStatus
};
