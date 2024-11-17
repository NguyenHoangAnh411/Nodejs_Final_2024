import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

export const checkoutOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/checkout`, orderData);
    return response.data;
  } catch (error) {
    console.error('Checkout error response:', error.response || error.message);
    throw new Error(error.response ? error.response.data : 'Error creating order');
  }
};
