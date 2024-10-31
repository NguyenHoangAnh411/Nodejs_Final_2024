
const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "Customer",
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
