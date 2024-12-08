const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const { storage } = require('../../client/src/components/firebaseService');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name description');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

const addProduct = async (req, res) => {
  try {
      const { name, description, cost, price, category, brand, stock, color } = req.body;
      
      if (!category) {
          return res.status(400).json({ message: 'Vui lòng cung cấp tên danh mục' });
      }

      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
          return res.status(400).json({ message: 'Danh mục không tồn tại' });
      }

      if (!name || !description || !price || !brand || stock === undefined) {
          return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
      }

      const numericPrice = parseFloat(price)
      const numericCost = parseFloat(cost);
      const numericStock = parseInt(stock);

      if (isNaN(numericPrice) || isNaN(numericCost) ||isNaN(numericStock)) {
          return res.status(400).json({ message: 'Giá và số lượng phải là số hợp lệ' });
      }

      const images = req.files;
      if (!images || images.length === 0) {
          return res.status(400).json({ message: 'Vui lòng cung cấp hình ảnh sản phẩm' });
      }

      const uploadedImages = [];
      for (const image of images) {
          const imageRef = ref(storage, `products/${Date.now()}_${image.originalname}`);
          await uploadBytes(imageRef, image.buffer);
          const downloadURL = await getDownloadURL(imageRef);
          uploadedImages.push({ url: downloadURL, alt: image.originalname });
      }

      const newProduct = new Product({
          name,
          description,
          cost: numericCost,
          price: numericPrice,
          category: foundCategory._id,
          brand,
          stock: numericStock,
          images: uploadedImages,
          color,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json({ message: 'Sản phẩm đã được thêm thành công', product: savedProduct });
  } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ khi thêm sản phẩm', error: error.message });
  }
};

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        if (updates.images) {
            delete updates.images;
        }

        Object.assign(product, updates);
        await product.save();

        res.status(200).json({ message: 'Sản phẩm đã được cập nhật', product });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật sản phẩm', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ message: 'Sản phẩm đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa sản phẩm', error: error.message });
    }
};

const addComment = async (req, res) => {
    try {
      const { productId } = req.params;
      const { content, rating } = req.body;
      const { userId } = req.user;

      if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ message: 'Nội dung bình luận không hợp lệ' });
      }
  
      if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Xếp hạng phải là số trong khoảng từ 1 đến 5' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }

      if (!product.comments) {
        product.comments = [];
      }

      const newComment = {
        user: userId,
        content: content,
        rating: rating,
      };

      product.comments.push(newComment);
  
      await product.save();
  
      res.status(200).json({ message: 'Bình luận đã được thêm thành công', product });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Lỗi máy chủ khi thêm bình luận', error: error.message });
    }
  };
  

  const getComments = async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await Product.findById(productId).populate('comments.user', 'name');
      if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
  
      res.status(200).json({ comments: product.comments });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy bình luận', error: error.message });
    }
  };

  const deleteComment = async (req, res) => {
    try {
      const { productId, commentId } = req.params;
      const userId = req.user.id;
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }

      const commentIndex = product.comments.findIndex(
        (comment) => comment._id.toString() === commentId && comment.user.toString() === userId
      );
  
      if (commentIndex === -1) {
        return res.status(404).json({ message: 'Bình luận không tồn tại hoặc bạn không có quyền xóa' });
      }

      product.comments.splice(commentIndex, 1);
      await product.save();
  
      res.status(200).json({ message: 'Bình luận đã được xóa thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ khi xóa bình luận', error: error.message });
    }
  };

  const searchProducts = async (req, res) => {
    const { query = '', page = 1, limit = 20, priceRange } = req.query;

    // Khởi tạo bộ lọc
    const filters = {};

    // Xử lý tham số tìm kiếm (query)
    if (query) {
        filters.name = new RegExp(query, 'i'); // Tìm kiếm theo tên sản phẩm (không phân biệt chữ hoa/thường)
    }

    // Xử lý tham số priceRange (khoảng giá)
    if (priceRange) {
        const [min, max] = priceRange.split(',').map(Number); // Chuyển đổi priceRange thành mảng số
        filters.price = { $gte: min * 25000, $lte: max * 25000 }; // Convert to VND before filtering // Tạo bộ lọc giá
    }

    try {
        // Đếm tổng số sản phẩm phù hợp với bộ lọc
        const totalProducts = await Product.countDocuments(filters);

        // Lấy danh sách sản phẩm dựa trên bộ lọc, phân trang
        const products = await Product.find(filters)
            .skip((page - 1) * limit) // Bỏ qua các sản phẩm trước đó
            .limit(parseInt(limit)); // Giới hạn số sản phẩm trả về

        // Trả về kết quả
        res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit), // Tổng số trang
        });
    } catch (error) {
        // Log lỗi và trả về lỗi
        console.error('Detailed error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { 
    getProducts,
    getProductById,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addComment,
    getComments,
    deleteComment,
    searchProducts
};
