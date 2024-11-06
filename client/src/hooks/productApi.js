import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/products';

export const getProductById = async (productId) => {
  const response = await axios.get(`${BASE_URL}/${productId}`);
  return response.data;
};

export const getRelatedProducts = async (category) => {
  const response = await axios.get(`${BASE_URL}?category=${category}`);
  return response.data;
};
