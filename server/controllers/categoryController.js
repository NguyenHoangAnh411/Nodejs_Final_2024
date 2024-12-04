const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
        res.status(500).json({ message: 'Server error when fetching category', error: error.message });
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

        const categoryProducts = await Promise.all(
            categories.map(async (category) => {
                const products = await Product.find({ category: category._id }).lean();
                return {
                    category: category.name.toLowerCase(),
                    products: products.map((product) => ({
                        ...product,
                        shop: {},
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

module.exports = { getCategories, getCategoryById, createCategory, getHomePageProducts };
