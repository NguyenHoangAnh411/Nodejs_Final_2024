const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    recipientName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    addresses: { type: [addressSchema], default: [] },
    role: { type: String, default: "Customer", enum: ["Customer", "Admin"] },
    avatar: { type: String, default: 'https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2021/07/lol-t1-1.jpg' },
    isVerified: { type: Boolean, default: false },
    googleId: { type: String },
    facebookId: { type: String }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
