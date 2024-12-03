const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');

router.get('/getAllOrders', authenticate, controller.getOrders);
router.post('/checkout', controller.checkout);
router.get('/', authenticate, controller.getOrdersByUserId);
router.put('/update-status', authenticate, controller.updateOrderStatus);
router.delete('/:id', authenticate, controller.deleteOrderById);
router.get('/revenue/daily', authenticate, controller.getDailyRevenueForMonth);
router.get('/revenue/monthly', authenticate, controller.getMonthlyRevenueForYear);
router.get('/getOrderDetails/:orderId', authenticate, controller.getOrderById);
router.get('/revenue/range', authenticate, controller.getRevenueByDateRange);
module.exports = router;
