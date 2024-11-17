const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');

router.post('/checkout', controller.checkout);
router.get('/orders', authenticate, controller.getOrdersByUserId);
module.exports = router;
