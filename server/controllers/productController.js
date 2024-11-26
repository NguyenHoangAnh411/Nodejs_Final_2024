const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const { storage } = require('../../client/src/components/firebaseService');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Fetch all products
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sort, tags, page = 1, limit = 10 } = req.query;
        let query = {};

        if (category) query.category = category;
        if (minPrice) query.price = { $gte: minPrice };
        if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
        if (tags) query.tags = { $in: tags.split(',') };

        let products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('category', 'name description');

        if (sort) {
            products = products.sort((a, b) => {
                if (sort === 'price-asc') return a.price - b.price;
                if (sort === 'price-desc') return b.price - a.price;
                return 0;
            });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, brand, stock, color } = req.body;

        if (!category) {
            return res.status(400).json({ message: 'Please provide category name' });
        }

        const foundCategory = await Category.findOne({ name: category });
        if (!foundCategory) {
            return res.status(400).json({ message: 'Category not found' });
        }

        const images = req.files;
        if (!images || images.length === 0) {
            return res.status(400).json({ message: 'Please provide product images' });
        }

        if (!name || !description || !price || !brand || stock === undefined) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const numericPrice = parseFloat(price);
        const numericStock = parseInt(stock);

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
            price: numericPrice,
            category: foundCategory._id,
            brand,
            stock: numericStock,
            images: uploadedImages,
            color,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: savedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error when adding product', error: error.message });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        Object.assign(product, updates);
        await product.save();

        res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error when updating product', error: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error when deleting product', error: error.message });
    }
};

module.exports = { 
    getProducts,
    getProductById,
    addProduct, 
    updateProduct, 
    deleteProduct, 
};
