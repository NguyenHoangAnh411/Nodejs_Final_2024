import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/products';
const token = localStorage.getItem('token');

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
    const response = await axios.put(`${BASE_URL}/${productId}`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
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

// Thêm bình luận cho sản phẩm
export const addCommentToProduct = async (productId, commentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/${productId}/comments`, commentData, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Kiểm tra token
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
    const response = await fetch(`/api/products/${productId}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
    return await response.json();  // Trả về dữ liệu phản hồi từ server nếu cần
  } catch (error) {
    throw new Error(error.message);
  }
};
