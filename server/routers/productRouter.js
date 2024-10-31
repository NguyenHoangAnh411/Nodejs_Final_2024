const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controller = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const productsApp = express();
productsApp.use(cors());
productsApp.use(bodyParser.json());
productsApp.use(bodyParser.urlencoded({ extended: false }));

productsApp.get('/api/products/', controller.getProducts);
productsApp.post('/api/products/add', authenticate, controller.addProduct);
module.exports = productsApp;