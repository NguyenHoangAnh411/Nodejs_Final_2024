const mongoose = require('mongoose');

// Định nghĩa schema cho bình luận
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người dùng bình luận
    content: { type: String, required: true, trim: true }, // Nội dung bình luận
    rating: { type: Number, required: true, min: 1, max: 5 }, // Xếp hạng từ 1 đến 5
    createdAt: { type: Date, default: Date.now }, // Thời gian tạo bình luận
  },
  { timestamps: true } // Tự động thêm các trường createdAt và updatedAt
);

// Định nghĩa schema cho các biến thể của sản phẩm (size, color, stock)
const variantSchema = new mongoose.Schema({
  size: { type: String, trim: true },
  color: { type: String, trim: true },
  stock: { type: Number, required: true, min: 0 },
});

// Định nghĩa schema cho sản phẩm
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
    comments: { type: [commentSchema], default: [] }, // Thêm mảng bình luận
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', category: 1, tags: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
