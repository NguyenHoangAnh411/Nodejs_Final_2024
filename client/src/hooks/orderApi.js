import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

export const checkoutOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/checkout`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Checkout error response:', error.response.data);
      throw new Error(error.response.data.message || 'Error creating order');
    } else {
      console.error('Checkout error message:', error.message);
      throw new Error('Error creating order');
    }
  }
};

export const getOrdersByUserId = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/update-status`, 
      { orderId, status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
