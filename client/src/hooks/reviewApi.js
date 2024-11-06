import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/products';

export const getReviewsByProductId = async (productId) => {
  const response = await axios.get(`${BASE_URL}/${productId}/reviews`);
  return response.data;
};

export const submitReview = async (productId, review) => {
  await axios.post(`${BASE_URL}/${productId}/reviews`, review);
};
