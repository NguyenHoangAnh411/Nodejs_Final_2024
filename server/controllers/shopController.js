const Shop = require('../models/ShopModel');
const Product = require('../models/ProductModel');


const getShopsByOwnerId = async (req, res) => {
    const ownerId = req.user.userId;

    try {
        const shops = await Shop.find({ 'owner.ownerId': ownerId }).populate('owner.ownerId', 'name email');
        console.log(ownerId)
        if (!shops.length) {
            return res.status(404).json({ message: 'No shops found for this owner' });
        }

        res.status(200).json({ shops });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve shops' });
    }
};

const createShop = async (req, res) => {
    try {
        const { name, type } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const ownerId = req.user.userId;
        const ownerName = req.user.name;
        const newShop = new Shop({
            name,
            type: type || 'standard',
            owner: {
                ownerId: ownerId,
                ownerName: ownerName || 'Unknown',
                rating: 0
            },
            products: [],
            ratings: 0,
            followers: 0,
            isVerified: false
        });

        await newShop.save();

        res.status(201).json({ message: 'Shop created successfully', shop: newShop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create shop' });
    }
};

const getShopDetail = async (req, res) => {
    const { shopId } = req.params;

    try {
        const shop = await Shop.findById(shopId).populate('products');

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.status(200).json({ shop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve shop details' });
    }
};

const editShop = async (req, res) => {
    const { shopId } = req.params;
    const updates = req.body;

    try {
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        if (shop.owner.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this shop' });
        }

        Object.assign(shop, updates);

        await shop.save();

        res.status(200).json({ message: 'Shop updated successfully', shop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update shop' });
    }
};

const deleteShop = async (req, res) => {
    const { shopId } = req.params;

    try {
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        if (shop.owner.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this shop' });
        }

        await Shop.findByIdAndDelete(shopId);

        res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete shop' });
    }
};

const getShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

module.exports = { createShop, getShopsByOwnerId, getShopDetail, editShop, deleteShop, getShops }