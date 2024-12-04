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


router.post('/register', AuthValidator.registerValidator, controller.register);
router.get('/', authenticate, controller.getUsers);
router.post('/login', AuthValidator.loginValidator, controller.login);
router.put('/profile', authenticate, controller.updateUserProfile);
router.post('/change-password', AuthValidator.changePasswordValidator, authenticate, controller.changepassword);
router.get('/profile', authenticate, controller.profile);
router.put('/profile/avatar', authenticate, upload.single('avatar'), controller.avatarUpload);
router.get('/:userId', controller.getUserById);
router.delete('/:id', authenticate, controller.deleteUserById);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.put('/:id', authenticate, controller.updateUserById);
router.patch('/:id/ban', authenticate, controller.banUserById);
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

module.exports = router;
