const Product = require('../models/ProductModel');

const getProducts = async (req, res) => {
    try {
        const products = await Product.Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock, images } = req.body;

        if (!name || !description || !price || !category || !brand || stock === undefined) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm' });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            brand,
            stock,
            images,
        });

        // Lưu sản phẩm vào cơ sở dữ liệu
        const savedProduct = await newProduct.save();

        // Trả về phản hồi thành công với sản phẩm vừa thêm
        res.status(201).json(savedProduct);
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi
        res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm', error: error.message });
    }
}
module.exports = { getProducts, addProduct };
