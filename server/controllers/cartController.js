const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const getCartTotal = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const total = cart.getTotalPrice();
    return res.status(200).json({ totalPrice: total });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
  
    try {
      // Tìm giỏ hàng của người dùng
      let cart = await Cart.findOne({ userId: req.userId });
  
      // Tìm sản phẩm theo productId
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Nếu chưa có giỏ hàng thì tạo mới
      if (!cart) {
        cart = new Cart({
          userId: req.userId,
          items: [],
        });
      }
  
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = cart.items.findIndex(item => item.productId.equals(productId));
      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có, cập nhật số lượng
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
        cart.items.push({
          productId: product._id,
          productName: product.name,
          quantity,
          price: product.price,
        });
      }
  
      // Lưu giỏ hàng đã cập nhật
      await cart.save();
  
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    getCartTotal,
    addToCart
}