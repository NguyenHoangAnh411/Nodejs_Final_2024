const mongoose = require('mongoose');

// Định nghĩa schema cho các biến thể của sản phẩm (size, color, stock)
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
      shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    },
    { timestamps: true }
  );

productSchema.index({ name: 'text', category: 1, tags: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
