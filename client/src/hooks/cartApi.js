import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart'; 

export const addToCart = async (productId) => {
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    `${API_URL}/add/${productId}`,
    {}, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getCartByUserId = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCartItems = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const removeFromCart = async (cartItemId) => {
  const token = localStorage.getItem('token');

  const response = await axios.delete(
    `${API_URL}/remove/${cartItemId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const token = localStorage.getItem('token');

  const response = await axios.put(
    `${API_URL}/update/${cartItemId}`,
    { quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const applyCoupon = async (couponCode) => {
  try {
    const response = await axios.post(`${API_URL}/cart/coupon`, { couponCode });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi áp dụng voucher:', error);
    throw error;
  }
};
