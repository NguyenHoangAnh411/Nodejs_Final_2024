const authService = require('../services/authService');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

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

        if(!user) {
            return res.status(400).json({ msg: "Old password is incorrect" });

        }

        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if(!isMatch) {
            return res.status.json({ msg: "Old password is incorrect"});
        }

        const hashNewPassword = await bcrypt.hash(newpassword, 10);

        user.password = hashNewPassword;
        await user.save();

        res.status(200).json({ msg: "Password change successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error"});
    }
}

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
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
    const { userId, avatar } = req.body;

    if (!userId || !avatar) {
        return res.status(400).json({ message: 'userId and avatar are required.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: avatar },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Avatar URL updated successfully.', user });
    } catch (error) {
        console.error('Error updating avatar URL:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    register,
    login,
    changepassword,
    profile,
    avatarUpload
}