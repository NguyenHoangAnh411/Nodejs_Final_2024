const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');

const checkout = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!userId || !items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: 'Pending',
      status: 'Pending',
    });

    await newOrder.save();

    // Xóa sản phẩm khỏi giỏ hàng
    const productIdsToRemove = items.map(item => item.productId); // Lấy tất cả productId
    await Cart.updateOne(
      { userId },
      { $pull: { items: { productId: { $in: productIdsToRemove } } } }
    );

    res.json({ message: 'Order created successfully', order: newOrder });
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
  
module.exports = {
  checkout,
  getOrdersByUserId
};
