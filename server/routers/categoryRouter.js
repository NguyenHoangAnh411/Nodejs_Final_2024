const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/authenticate');

router.get('/getcategories', categoryController.getCategories);
router.get('/getcategories/:categoryId', categoryController.getCategoryById);

router.post('/categories', authenticate, categoryController.createCategory);

module.exports = router;
