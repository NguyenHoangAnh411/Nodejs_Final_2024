const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');

router.post('/add', authenticate, cartController.addToCart);

router.get('/user/:userId', authenticate, cartController.getCartByUserId);

router.put('/update/:cartItemId', authenticate, cartController.updateCartItem);

router.delete('/remove/:cartItemId', authenticate, cartController.removeCartItem);

module.exports = router;
