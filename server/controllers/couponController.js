const Coupon = require('../models/CouponModel');
const Cart = require('../models/CartModel');

const addCoupon = async (req, res) => {
  const { code, name, description, discount, expiryDate } = req.body;

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      return res.status(400).json({ message: 'Invalid expiry date' });
    }

    const newCoupon = new Coupon({
      code,
      name,
      description,
      discount,
      expiryDate,
    });

    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create coupon', error: error.message });
  }
};

const getallCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find();
      res.status(200).json(coupons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch coupons' });
    }
};

const getUsedCoupons = async (req, res) => {
  try {
    // Truy vấn các coupon đã được sử dụng
    const coupons = await Coupon.find({ used: true });
    
    if (coupons.length === 0) {
      return res.status(404).json({ message: 'No used coupons found' });
    }

    res.status(200).json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};


const getCouponById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      res.status(200).json(coupon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch coupon' });
    }
};

const updateCouponById = async (req, res) => {
    const { id } = req.params;
    const { code, name, description, discount, expiryDate, isActive } = req.body;
  
    try {
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      coupon.code = code || coupon.code;
      coupon.name = name || coupon.name;
      coupon.description = description || coupon.description;
      coupon.discount = discount || coupon.discount;
      coupon.expiryDate = expiryDate || coupon.expiryDate;
      coupon.isActive = isActive ?? coupon.isActive;
  
      await coupon.save();
      res.status(200).json({ message: 'Coupon updated successfully', coupon });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update coupon' });
    }
};

const deleteCouponById = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete coupon' });
  }
};

const updateCouponStatus = async (req, res) => {
  const { id } = req.params;
  const { used } = req.body;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    coupon.used = used;
    await coupon.save();

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update coupon status' });
  }
}

module.exports = { 
    addCoupon,
    getCouponById,
    getallCoupons,
    updateCouponById,
    deleteCouponById,
    updateCouponStatus,
    getUsedCoupons
 };
