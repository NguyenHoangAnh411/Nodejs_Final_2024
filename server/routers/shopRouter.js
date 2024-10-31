const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controller = require('../controllers/shopController');
const authenticate = require('../middlewares/authenticate');
const shopApp = express();
shopApp.use(cors());
shopApp.use(bodyParser.json());
shopApp.use(bodyParser.urlencoded({ extended: false }));

shopApp.post('/api/shop/create', authenticate, controller.createShop);