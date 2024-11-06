const mongoose = require('mongoose');
const { productSchema } = require('./ProductModel');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: [
            'Clothing',
            'Electronics',
            'Food',
            'Books',
            'Beauty',
            'Home Goods',
            'standard',
            'mall'
        ],
        default: 'standard',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
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
    description: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;

