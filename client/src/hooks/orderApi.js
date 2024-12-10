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

export const checkoutOrderForNotLoggedUser = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/create-order`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Failed to place order');
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

export const getOrders = async ({ filter = '', timeFilter = '', startDate = '', endDate = '' }) => {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (timeFilter) params.append('timeFilter', timeFilter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axios.get(`${API_URL}/getAllOrders?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch orders');
  }
};

export const deleteOrderById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to delete Order');
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/getOrderDetails/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch order details');
  }
};

export const getDailyRevenue = async (year, month) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/revenue/daily?year=${year}&month=${month}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo ngày:', error);
    throw error;
  }
};

export const getMonthlyRevenue = async (year) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/revenue/monthly?year=${year}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo tháng:', error);
    throw error;
  }
};

export const getRevenueByRange = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/revenue/range?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo khoảng thời gian:', error);
    throw error;
  }
};

