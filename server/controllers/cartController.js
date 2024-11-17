const User = require('../models/UserModel');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const Coupon = require('../models/CouponModel');
const addToCart = async (req, res) => {
  const { productId } = req.params; 
  const { userId } = req.user;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    } else {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCartByUserId = async (req, res) => {
  const { userId } = req.user;

  try {
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
      return res.status(200).json(cart);
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateCartItemQuantity = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item._id.toString() === cartItemId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    }

    return res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const removeFromCart = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItemQuantity,
  removeFromCart,
};
