const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const authService = {

  async register(userData) {
    const { name, email, password, phone } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        verificationToken
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your account',
        text: `Click the following link to verify your account: ${process.env.CLIENT_URL}/verify/${verificationToken}`
    };

    await transporter.sendMail(mailOptions);

    return { message: 'User registered successfully, please check your email to verify your account' };
},


  async login(userData) {
    const { email, password } = userData;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user: { id: user._id, name: user.name, email: user.email } };
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