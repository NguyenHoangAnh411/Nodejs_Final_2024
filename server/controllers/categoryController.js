const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const Shop = require('../models/ShopModel');
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tìm category', error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        const newCategory = new Category({
            name,
            description,
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error when creating category', error: error.message });
    }
};

const getHomePageProducts = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        const shops = await Shop.find().populate('products');

        const categoryProducts = categories.reduce((acc, category) => {
            const products = shops.flatMap(shop => 
                shop.products
                    .filter(product => product.category.toString() === category._id.toString())
                    .map(product => ({
                        ...product.toObject(), 
                        shop: {
                            _id: shop._id,
                            name: shop.name,
                            type: shop.type,
                            ratings: shop.ratings,
                            followers: shop.followers,
                            isVerified: shop.isVerified,
                            description: shop.description,
                        },
                    }))
            );
            acc[category.name.toLowerCase()] = products;
            return acc;
        }, {});

        res.json({
            ...categoryProducts,
        });

    } catch (error) {
        console.error('Server error when fetching products', error);
        res.status(500).json({ message: 'Server error when fetching products', error: error.message });
    }
};


module.exports = { getCategories, getCategoryById, createCategory, getHomePageProducts };
