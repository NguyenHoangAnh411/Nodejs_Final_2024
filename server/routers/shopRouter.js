const express = require('express');
const router = express.Router();
const controller = require('../controllers/shopController');
const authenticate = require('../middlewares/authenticate');

router.post('/create', authenticate, controller.createShop);

module.exports = router;
