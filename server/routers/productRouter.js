const express = require('express');
const cors = require('cors');
const router = express.Router();
const controller = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');

router.get('/', controller.getProducts);
router.post('/add', authenticate, controller.addProduct);

module.exports = router;
