const mongoose = require('mongoose');

// Định nghĩa schema cho category
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { collection: 'categories', timestamps: true }
);

// Tạo chỉ mục cho tên category để tối ưu tìm kiếm
categorySchema.index({ name: 'text' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
