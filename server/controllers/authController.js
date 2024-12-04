const authService = require('../services/authService');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { storage } = require('../../client/src/components/firebaseService');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const mongoose = require('mongoose');

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
}

const changepassword = async (req, res) => {
    const { oldpassword, newpassword } = req.body;
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Old password is incorrect" });
        }
        const hashNewPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashNewPassword;
        await user.save();
        res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}

const getUserById = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const profile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

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
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  const getUsers = async (req, res) => {
    try {
      const { search } = req.query;
      let filter = {};
      
      if (search) {
        filter = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        };
      }
  
      const users = await User.find(filter);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

const deleteUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete User' });
    }
  };

const banUserById = async (req, res) => {
  const { id } = req.params;
  const { banned } = req.body;

  try {
      const user = await User.findByIdAndUpdate(
          id,
          { banned },
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const status = banned ? 'banned' : 'unbanned';
      res.status(200).json({ message: `User ${status} successfully`, user });
  } catch (error) {
      console.error('Error banning/unbanning user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params; 
  const { name, email, phone, addresses } = req.body;

  try {
      const updatedUser = await User.findByIdAndUpdate(
          id,
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
          message: 'User updated successfully',
          user: updatedUser
      });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, phone, addresses, email } = req.body;

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name,
        phone,
        addresses,
        email
      });
      await user.save();
    }

    res.status(201).json({ message: 'User created or found successfully', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
    register,
    login,
    getUserById,
    changepassword,
    profile,
    avatarUpload,
    updateUserProfile,
    getUsers,
    deleteUserById,
    banUserById,
    updateUserById,
    createUser
};
