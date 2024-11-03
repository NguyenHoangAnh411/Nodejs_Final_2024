const authService = require('../services/authService');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { storage } = require('../../client/src/components/firebaseService');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

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
    const userId = req.user.userId; // Lấy userId từ req.user
    const file = req.file;

    if (!userId || !file) {
        return res.status(400).json({ message: 'User ID and file are required.' });
    }

    try {
        const avatarRef = ref(storage, `avatars/${userId}`);
        await uploadBytes(avatarRef, file.buffer); // Dùng file.buffer
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
    changepassword,
    profile,
    avatarUpload
};
