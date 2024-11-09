const User = require('../models/UserModel');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

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

const applyCoupon = async (req, res) => {
  const { userId } = req.user;
  const { couponCode } = req.body;
  const validCoupons = { 'SAVE10': 10, 'SAVE20': 20 };

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const discount = validCoupons[couponCode];
    if (!discount) return res.status(400).json({ message: 'Invalid coupon code' });

    cart.coupon = couponCode;
    cart.discount = discount;
    cart.totalPrice -= discount;
    await cart.save();

    res.status(200).json({ message: 'Coupon applied', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const checkoutForLoggedUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const finalShippingAddress = user.addresses.find(address => 
      address.recipientName && 
      address.street && 
      address.city && 
      address.postalCode && 
      address.phone
    );

    if (!finalShippingAddress) return res.status(400).json({ message: 'User has no valid address on record' });

    const newOrder = new Order({
      userId,
      items: cart.items,
      shippingAddress: finalShippingAddress,
      status: 'Pending',
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const guestCheckout = async (req, res) => {
  const { name, phone, addresses, items } = req.body;

  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ name, phone, addresses, role: 'customer' });
      await user.save();
    }

    const newOrder = new Order({
      userId: user._id,
      items,
      addresses,
      status: 'Pending',
    });
    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItemQuantity,
  removeFromCart,
  applyCoupon,
  checkoutForLoggedUser,
  guestCheckout,
};
