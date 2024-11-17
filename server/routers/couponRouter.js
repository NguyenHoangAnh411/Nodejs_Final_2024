const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, couponController.addCoupon);
router.get('/', couponController.getallCoupons);
router.get('/:id', couponController.getCouponById);
router.put('/:id', authenticate, couponController.updateCouponById);
router.delete('/:id', authenticate, couponController.deleteCouponById);

module.exports = router;