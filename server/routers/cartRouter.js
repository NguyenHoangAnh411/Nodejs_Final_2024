const express = require('express');
const cors = require('cors');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');

router.get('/:cartId/total', cartController.getCartTotal);
router.post('/add', authenticate, cartController.addToCart);

module.exports = router;
