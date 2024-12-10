import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/category';

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getcategories`);
    return response.data;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách danh mục: ' + error.message);
  }
};

export const createCategory = async (category) => {
  const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/categories`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };