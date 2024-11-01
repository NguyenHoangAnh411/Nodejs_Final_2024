const express = require('express');
const cors = require('cors');
const controller = require('../controllers/authController');
const AuthValidator = require('../validators/AuthValidator');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.use(cors());

router.post('/register', AuthValidator.registerValidator, controller.register);
router.post('/login', AuthValidator.loginValidator, controller.login);
router.post('/change-password', AuthValidator.changePasswordValidator, authenticate, controller.changepassword);
router.get('/profile', authenticate, controller.profile);

module.exports = router;
