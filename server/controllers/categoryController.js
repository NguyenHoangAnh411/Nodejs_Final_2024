const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');

// Fetch all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch a category by ID
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error when fetching category', error: error.message });
    }
};

// Create a new category
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

// Fetch products for the homepage grouped by category
const getHomePageProducts = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        const categoryProducts = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category: category._id }).lean();
                return {
                    category: category.name.toLowerCase(),
                    products: products.map((product) => ({
                        ...product,
                        shop: {}, // Add an empty shop object if frontend expects it
                    })),
                };
            })
        );

        res.json(
            categoryProducts.reduce((acc, curr) => {
                acc[curr.category] = curr.products;
                return acc;
            }, {})
        );
    } catch (error) {
        console.error('Server error when fetching homepage products:', error);
        res.status(500).json({ message: 'Server error when fetching homepage products', error: error.message });
    }
};


// Search for products with filters
const searchProducts = async (req, res) => {
    const { query = '', page = 1, limit = 20, priceRange, category } = req.query;

    const filters = {};

    if (query) {
        filters.name = new RegExp(query, 'i');
    }

    if (priceRange) {
        const [min, max] = priceRange.split(',').map(Number);
        filters.price = { $gte: min, $lte: max };
    }

    if (category) {
        const categoryObj = await Category.findOne({ name: new RegExp(category, 'i') });
        if (categoryObj) {
            filters.category = categoryObj._id;
        }
    }

    try {
        const totalProducts = await Product.countDocuments(filters);
        const products = await Product.find(filters)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
        });
    } catch (error) {
        console.error('Detailed error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCategories, getCategoryById, createCategory, getHomePageProducts, searchProducts };
