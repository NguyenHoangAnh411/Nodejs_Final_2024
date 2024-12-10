import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coupons';


export const createCoupon = async (couponData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(API_URL, couponData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to create coupon');
  }
};


export const getAllCoupons = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch coupons');
  }
};

export const getUsedCoupons = async () => {
  try {
    const response = await axios.get(`${API_URL}/used`);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch coupons');
  }
};


export const getCouponById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch coupon');
  }
};

export const updateCouponById = async (id, couponData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, couponData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to update coupon');
  }
};


export const deleteCoupon = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to delete coupon');
  }
};

export const updateCouponStatus = async (couponId, data) => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`${API_URL}/${couponId}/status`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Error updating coupon status');
  }
};