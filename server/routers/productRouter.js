const express = require('express');
const cors = require('cors');
const router = express.Router();
const controller = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', controller.getProducts);
router.get('/:productId', controller.getProductById);
router.post('/add', authenticate, controller.addProduct);
router.post('/:shopId/add-product', authenticate, upload.array('images'), controller.addProductToShop);

module.exports = router;
