const nodemailer = require('nodemailer');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
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

    const pointsEarned = Math.floor(totalAmount * 25000 * 0.05); // Convert to VND before calculating points
    user.loyaltyPoints += pointsEarned;
    await user.save();

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

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Not enough stock for product: ${product.name}` });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

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
             Total Amount: ${(newOrder.totalAmount * 25000).toLocaleString('vi-VN')} VND\n
             Shipping Address: ${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city}\n
             Payment Method: ${newOrder.paymentMethod}`,
    };


    await transporter.sendMail(mailOptions);

    res.json({
      message: 'Order created successfully and confirmation email sent',
      order: newOrder,
      loyaltyPoints: user.loyaltyPoints,
    });
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

const getOrders = async (req, res) => {
  try {
    const { filter, timeFilter, startDate, endDate } = req.query;
    let dateFilter = {};

    let statusFilter = {};
    if (filter) {
      statusFilter.status = filter;
    }

    if (timeFilter) {
      const now = new Date();
      if (timeFilter === 'today') {
        dateFilter.createdAt = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
      } else if (timeFilter === 'yesterday') {
        const yesterday = new Date(now.setDate(now.getDate() - 1));
        dateFilter.createdAt = { $gte: new Date(yesterday.setHours(0, 0, 0, 0)), $lt: new Date(yesterday.setHours(23, 59, 59, 999)) };
      } else if (timeFilter === 'thisWeek') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter.createdAt = { $gte: startOfWeek };
      } else if (timeFilter === 'thisMonth') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter.createdAt = { $gte: startOfMonth };
      } else if (timeFilter === 'custom') {
        if (startDate && endDate) {
          dateFilter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }
      }
    }

    const orders = await Order.find({
      ...statusFilter,
      ...dateFilter,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching orders');
  }
};

const deleteOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete Order' });
  }
};



const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const getDailyRevenueForMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: 'Vui lòng cung cấp năm và tháng hợp lệ!' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          totalRevenue: { $sum: { $multiply: ['$totalAmount', 25000] } }, // Convert to VND,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const result = dailyRevenue.map((item) => ({
      day: item._id,
      revenue: item.totalRevenue,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu:', error);
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

const getMonthlyRevenueForYear = async (req, res) => {
  try {
    const { year } = req.query;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRevenue: { $sum: { $multiply: ['$totalAmount', 25000] } } // Convert to VND,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const result = monthlyRevenue.map((item) => ({
      month: item._id,
      revenue: item.totalRevenue,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu:', error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

const getRevenueByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          totalRevenue: { $sum: { $multiply: ['$totalAmount', 25000] } } // Convert to VND,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const result = revenueData.map((item) => ({
      day: item._id,
      revenue: item.totalRevenue,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo khoảng thời gian:', error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { name, phone, addresses, items, paymentMethod, totalAmount, loyaltyPointsUsed } = req.body;

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name,
        phone,
        addresses,
      });
      await user.save();
    }

    const newOrder = new Order({
      userId: user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      loyaltyPointsUsed
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  checkout,
  getOrdersByUserId,
  updateOrderStatus,
  getOrders,
  deleteOrderById,
  getOrderById,
  getDailyRevenueForMonth,
  getMonthlyRevenueForYear,
  getRevenueByDateRange,
  createOrder
};
