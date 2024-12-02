const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  size: { type: String, trim: true },
  color: { type: String, trim: true },
  stock: { type: Number, required: true, min: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    variants: { type: [variantSchema], default: [] },
    tags: { type: [String], default: [] },
    images: { type: Array, default: [] },
    color: { type: String, default: '' },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', category: 1, tags: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
