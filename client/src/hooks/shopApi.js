import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/shops';

export const getShopById = async (shopId) => {
  const response = await axios.get(`${BASE_URL}/${shopId}`);
  return response.data.shop;
};
