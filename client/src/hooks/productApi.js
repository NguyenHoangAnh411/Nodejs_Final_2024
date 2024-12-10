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

export const getAllProduct = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả sản phẩm:', error.message);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(BASE_URL, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error.message);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}/${productId}`, productData, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.message);
    throw error;
  }
};


export const getCommentsForProduct = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    throw error;
  }
};

export const addCommentToProduct = async (productId, commentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/${productId}/comments`, commentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error.message);
    throw error;
  }
};


export const deleteCommentFromProduct = async (productId, commentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${productId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error(error.message);
  }
};

export const fetchProductsFromApi = async (queryParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, { params: queryParams });
    return response.data.products;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Error fetching products');
  }
};

export const searchProducts = async (queryParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, { params: queryParams });
    return response.data.products;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Error fetching products');
  }
};