const authService = require('../services/authService');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { storage } = require('../../client/src/components/firebaseService');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const mongoose = require('mongoose');
const firebaseAdmin = require('firebase-admin');

// Initialize Firebase Admin
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const googleAuth = async (req, res) => {
  const token = req.body.token;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = new User({
        name: decodedToken.name,
        email: decodedToken.email,
        firebaseUid: decodedToken.uid,
        role: 'customer',
      });
      await user.save();
    }

    res.status(200).json({ message: 'User logged in successfully', user: decodedToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Facebook Authentication (similar to Google)
const facebookAuth = async (req, res) => {
  const accessToken = req.body.accessToken;

  try {
    const response = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`);
    const userData = response.data;

    let user = await User.findOne({ facebookId: userData.id });

    if (!user) {
      user = new User({
        name: userData.name,
        facebookId: userData.id,
        email: userData.email,
        role: 'customer',
      });
      await user.save();
    }

    res.status(200).json({ message: 'User logged in successfully', user: userData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const { userId } = req.user;
  const { name, email, phone, addresses } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(addresses && { addresses }),
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Avatar Upload
const avatarUpload = async (req, res) => {
  const userId = req.user.userId;
  const file = req.file;

  if (!userId || !file) {
    return res.status(400).json({ message: 'User ID and file are required.' });
  }

  try {
    const avatarRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(avatarRef, file.buffer);
    const downloadUrl = await getDownloadURL(avatarRef);

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: downloadUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Avatar uploaded successfully.', avatar: downloadUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  facebookAuth,
  updateUserProfile,
  avatarUpload,
};
