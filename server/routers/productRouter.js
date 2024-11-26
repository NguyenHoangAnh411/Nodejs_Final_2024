const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get('/:productId', controller.getProductById);

router.put('/:productId', authenticate, controller.updateProduct);
router.delete('/:productId', authenticate, controller.deleteProduct);
router.get('/', controller.getProducts);
module.exports = router;
