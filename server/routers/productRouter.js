const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:productId', controller.getProductById);
router.post('/', authenticate, upload.array('images', 5), controller.addProduct);
router.put('/:productId', authenticate, upload.array('images', 5), controller.updateProduct);
router.delete('/:productId', authenticate, controller.deleteProduct);
router.get('/', controller.getProducts);
router.post('/:productId/comments', authenticate, controller.addComment);

router.get('/:productId/comments', controller.getComments);

router.delete('/:productId/comments/:commentId', authenticate, controller.deleteComment);
module.exports = router;
