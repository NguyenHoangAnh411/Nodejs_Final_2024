const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    size: { type: String },
    color: { type: String },
    stock: { type: Number, required: true, min: 0 },
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    variants: { type: [variantSchema], default: [] },
    tags: { type: [String], default: [] },
    images: { type: Array, default: [] },
    color: { type: String, default: '' },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
