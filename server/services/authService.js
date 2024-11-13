const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
require('dotenv').config();

const authService = {
  async register(userData) {
    const { name, phone, password } = userData;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
        throw new Error('Phone number already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        phone,
        password: hashedPassword
    });

    await newUser.save();

    return { message: 'User registered successfully' };
  },

  async login(userData) {
    const { phone, password } = userData;

    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error('Invalid phone or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid phone or password');
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user: { id: user._id, name: user.name, phone: user.phone } };
  },

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

module.exports = authService;
