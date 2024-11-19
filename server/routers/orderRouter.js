const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');

router.post('/checkout', controller.checkout);
router.get('/', authenticate, controller.getOrdersByUserId);
router.put('/update-status', authenticate, controller.updateOrderStatus);
module.exports = router;
