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
    owner: {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
        require: false
    }
}, {
    timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
