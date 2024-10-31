const Shop = require('../models/ShopModel');
const Product = require('../models/ProductModel');

const createShop = async (req, res) => {
    try {
        const { name, type } = req.body; // Không cần ownerId, lấy từ req.userId

        // Kiểm tra xem dữ liệu yêu cầu có đủ hay không
        if (!name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Tạo một shop mới
        const newShop = new Shop({
            name,
            type: type || 'standard',  // Mặc định là 'standard' nếu không có
            owner: {
                ownerId: req.userId, // Lấy ID từ middleware
                ownerName: req.body.ownerName || 'Unknown', // Có thể lấy từ request hoặc để mặc định
                rating: 0
            },
            products: [],
            ratings: 0,
            followers: 0,
            isVerified: false
        });

        // Lưu shop vào cơ sở dữ liệu
        await newShop.save();

        res.status(201).json({ message: 'Shop created successfully', shop: newShop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create shop' });
    }
};

module.exports = { createShop }