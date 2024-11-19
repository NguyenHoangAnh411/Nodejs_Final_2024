const express = require('express');
const cors = require('cors');
const controller = require('../controllers/authController');
const AuthValidator = require('../validators/AuthValidator');
const authenticate = require('../middlewares/authenticate');
const multer = require('multer');
const passport = require('../config/passportConfig');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.use(cors());

// Regular Auth Routes
router.post('/register', AuthValidator.registerValidator, controller.register);
router.post('/login', AuthValidator.loginValidator, controller.login);
router.put('/profile', authenticate, controller.updateUserProfile);
router.post('/change-password', AuthValidator.changePasswordValidator, authenticate, controller.changepassword);
router.get('/profile', authenticate, controller.profile);
router.put('/profile/avatar', authenticate, upload.single('avatar'), controller.avatarUpload);
router.get('/:userId', controller.getUserById);

// Google Auth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Send token after successful Google authentication
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Generate a JWT token here (assuming you are using JWT for user session)
    const token = req.user.token;  // Attach token from Passport user
    res.json({ message: 'Google Authentication Successful', token });  // Send token to frontend
  }
);

// Facebook Auth Routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Send token after successful Facebook authentication
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Generate a JWT token here (assuming you are using JWT for user session)
    const token = req.user.token;  // Attach token from Passport user
    res.json({ message: 'Facebook Authentication Successful', token });  // Send token to frontend
  }
);

module.exports = router;
