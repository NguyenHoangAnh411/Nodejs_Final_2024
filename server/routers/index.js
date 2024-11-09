const express = require('express');
const router = express.Router();
const { guestCheckout, checkoutForLoggedUser, getHomePageProducts } = require('../controllers/cartController');
const { authorize } = require('../middleware/authorize');

router.get('/home-products', getHomePageProducts);
router.post('/guest-checkout', guestCheckout);
router.post('/checkout', checkoutForLoggedUser);

module.exports = router;
