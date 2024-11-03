const Product = require('../models/ProductModel');
const Shop = require('../models/ShopModel');
const { storage } = require('../../client/src/components/firebaseService');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm', error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock } = req.body; // Bỏ hình ảnh ra khỏi đây

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
            images: [], // Khởi tạo hình ảnh như một mảng rỗng
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm', error: error.message });
    }
}

const addProductToShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { name, description, price, category, brand, stock } = req.body;

        const images = req.files;
        if (!images || images.length === 0) {
            return res.status(400).json({ message: 'Vui lòng cung cấp hình ảnh cho sản phẩm' });
        }

        if (!name || !description || !price || !category || !brand || stock === undefined) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm' });
        }

        const numericPrice = parseFloat(price);
        const numericStock = parseInt(stock);

        const uploadedImages = [];
        for (const image of images) {
            const imageRef = ref(storage, `products/${shopId}/${Date.now()}_${image.originalname}`);
            await uploadBytes(imageRef, image.buffer);
            const downloadURL = await getDownloadURL(imageRef);
            uploadedImages.push({ url: downloadURL, alt: image.originalname });
        }

        const newProduct = new Product({
            name,
            description,
            price: numericPrice,
            category,
            brand,
            stock: numericStock,
            images: uploadedImages,
        });

        const savedProduct = await newProduct.save();

        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { $push: { products: savedProduct._id } },
            { new: true, runValidators: true }
        );

        if (!updatedShop) {
            return res.status(404).json({ message: 'Shop không tìm thấy' });
        }

        res.status(201).json({ message: 'Sản phẩm đã được thêm vào shop và hình ảnh đã được cập nhật.', product: savedProduct });
    } catch (error) {
        console.error('Error adding product to shop:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm vào shop', error: error.message });
    }
};


module.exports = { getProducts, addProduct, addProductToShop, getProductById };
