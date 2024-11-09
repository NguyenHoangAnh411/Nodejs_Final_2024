const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');

router.post('/add/:productId', authenticate, cartController.addToCart);

router.get('/', authenticate, cartController.getCartByUserId);

router.put('/update/:cartItemId', authenticate, cartController.updateCartItemQuantity);

router.delete('/remove/:cartItemId', authenticate, cartController.removeFromCart);

router.post('/apply-coupon', cartController.applyCoupon);
router.post('/checkout', authenticate, cartController.checkoutForLoggedUser);
router.post('/guest-checkout', cartController.guestCheckout);

module.exports = router;
