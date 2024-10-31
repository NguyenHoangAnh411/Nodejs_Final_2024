const mongoose = require('mongoose');
const { productSchema } = require('./Product');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['standard', 'mall'],
        default: 'standard',
    },
    owner: {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    products: [productSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    followers: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
