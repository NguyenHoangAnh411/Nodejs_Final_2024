const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const controller = require('../controllers/authController');
const AuthValidator = require('../validators/AuthValidator');
const authenticate = require('../middlewares/authenticate');
const authApp = express();
authApp.use(cors());
authApp.use(bodyParser.json());
authApp.use(bodyParser.urlencoded({ extended: false }));
authApp.post('/api/register',AuthValidator.registerValidator, controller.register)

authApp.post('/api/login', AuthValidator.loginValidator, controller.login)

authApp.post('/api/change-password', AuthValidator.changePasswordValidator, authenticate, controller.changepassword);
module.exports = authApp;